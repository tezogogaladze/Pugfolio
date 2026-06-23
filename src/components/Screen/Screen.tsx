import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import gsap from "gsap";
import type { ScreenConfig } from "@/data/screens";
import { measureScreen } from "@/components/crt/geometry";
import CrtFx from "@/components/crt/CrtFx";
import ColorBars from "@/components/crt/ColorBars";
import { useScreenMachine } from "./useScreenMachine";
import "./Screen.css";

export interface ScreenHandle {
  requestOn: () => void;
  requestOff: () => void;
}

interface ScreenProps {
  config: ScreenConfig;
  /** Hero visible in viewport — videos only ever play when true. */
  heroInView: boolean;
  reducedMotion: boolean;
  /** Global sound state — when true, this screen's video is unmuted. */
  soundOn: boolean;
  /** Render order, used to stagger video warm-up so loads don't all collide. */
  index: number;
  /** Disabled on mobile/touch — falls back to the cheap color-bars reel. */
  enableVideo: boolean;
}

const Screen = forwardRef<ScreenHandle, ScreenProps>(function Screen(
  { config, heroInView, reducedMotion, soundOn, index, enableVideo },
  ref
) {
  const { state, requestOn, requestOff, animDone } = useScreenMachine("off");

  const [box] = useState(() => measureScreen(config.id));

  const screenRef = useRef<HTMLDivElement>(null);
  const tubeRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useImperativeHandle(ref, () => ({ requestOn, requestOff }), [
    requestOn,
    requestOff,
  ]);

  const applyGlow = (strength: number) => {
    const el = screenRef.current;
    if (!el) return;
    el.style.filter =
      strength <= 0
        ? "none"
        : `drop-shadow(0 0 ${28 * strength}px ${config.tint}) drop-shadow(0 0 ${
            64 * strength
          }px ${config.tint})`;
  };

  // Drive GSAP timelines off machine state transitions.
  useEffect(() => {
    const tube = tubeRef.current;
    const flash = flashRef.current;
    const dot = dotRef.current;
    if (!tube || !flash || !dot) return;

    gsap.killTweensOf([tube, flash, dot]);

    if (state === "powering-on") {
      if (reducedMotion) {
        gsap.set(tube, {
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          filter: "none",
        });
        gsap.set(flash, { opacity: 0 });
        applyGlow(0.45);
        animDone();
        return;
      }
      const glow = { v: 0 };
      const tl = gsap.timeline({ onComplete: animDone });
      gsap.set(tube, {
        scaleX: 1,
        scaleY: 1,
        opacity: 1,
        transformOrigin: `${box.cx}px ${box.cy}px`,
      });
      tl.fromTo(
        flash,
        { opacity: 0 },
        { opacity: 0.9, duration: 0.06, ease: "power2.out" }
      )
        .to(flash, { opacity: 0, duration: 0.5, ease: "power2.in" }, ">-0.02")
        .fromTo(
          tube,
          {
            scaleY: 0.008,
            filter: "brightness(2.6) contrast(0.4) saturate(0.5)",
          },
          {
            scaleY: 1,
            filter: "brightness(1) contrast(1) saturate(1)",
            duration: 0.42,
            ease: "power3.out",
          },
          0
        )
        .to(
          glow,
          {
            v: 0.45,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => applyGlow(glow.v),
          },
          0
        );
    } else if (state === "powering-off") {
      const resetVideo = () => {
        const v = videoRef.current;
        if (v) {
          v.pause();
          try {
            v.currentTime = 0;
          } catch {
            /* ignore */
          }
        }
      };
      if (reducedMotion) {
        gsap.set(tube, { opacity: 0 });
        applyGlow(0);
        resetVideo();
        animDone();
        return;
      }
      const glow = { v: 0.45 };
      const tl = gsap.timeline({
        onComplete: () => {
          resetVideo();
          animDone();
        },
      });
      gsap.set(tube, { transformOrigin: `${box.cx}px ${box.cy}px` });
      gsap.set(dot, { left: box.cx - 2, top: box.cy - 2, scale: 1 });
      tl.to(tube, {
        filter: "brightness(3) contrast(1.5) saturate(0.6)",
        duration: 0.08,
      })
        .to(
          tube,
          { scaleY: 0.004, duration: 0.18, ease: "power3.in" },
          "<0.01"
        )
        .to(dot, { opacity: 1, duration: 0.06 }, ">-0.04")
        .to(tube, { scaleX: 0.001, duration: 0.2, ease: "power3.in" }, "<")
        .to(
          glow,
          {
            v: 0,
            duration: 0.3,
            onUpdate: () => applyGlow(glow.v),
          },
          0
        )
        .to(tube, { opacity: 0, duration: 0.08 }, ">-0.02")
        .to(
          dot,
          { opacity: 0, scale: 0.2, duration: 0.35, ease: "power2.in" },
          ">-0.04"
        );
    }
  }, [state, reducedMotion, box.cx, box.cy, animDone]);

  const hasVideo = enableVideo && Boolean(config.videoSrc) && !videoFailed;

  // Warm-up: while the hero is in view, fetch + decode each reel's first frame
  // so hover plays instantly with no black flash. We DON'T play here — only the
  // hovered screen plays — so we never decode/play all six at once. Staggered by
  // render order (featured center first) to avoid a load stampede on page load.
  const warmedRef = useRef(false);
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !hasVideo || warmedRef.current || !heroInView) return;
    warmedRef.current = true;
    const delay = config.featured ? 0 : (index + 1) * 180;
    const id = window.setTimeout(() => {
      v.preload = "auto";
      // Only kick a load if nothing has started yet — if the user already
      // hovered, play() is loading it and we must not reset mid-playback.
      if (v.readyState === 0) {
        try {
          v.load();
        } catch {
          /* ignore */
        }
      }
    }, delay);
    return () => window.clearTimeout(id);
  }, [heroInView, hasVideo, config.featured, index]);

  // Video play gating: only when active AND hero in view.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !config.videoSrc) return;
    const active =
      (state === "on" || state === "powering-on") && heroInView;
    if (active) {
      v.play().catch(() => {
        /* autoplay rejection — poster stays */
      });
    } else {
      v.pause();
    }
  }, [state, heroInView, config.videoSrc]);

  // Mute follows the global sound toggle. Set via the property (not just the
  // attribute, which React doesn't reliably reflect onto the media element).
  useEffect(() => {
    const v = videoRef.current;
    if (v) v.muted = !soundOn;
  }, [soundOn, hasVideo]);

  const reelStyle: CSSProperties = {
    left: box.x,
    top: box.y,
    width: box.width,
    height: box.height,
  };

  // Tap path for touch/no-hover devices: toggles power. (Sound is controlled
  // globally by the SoundToggle.) Hover/focus remain independent triggers.
  const handleActivate = () => {
    const isOn = state === "on" || state === "powering-on";
    if (isOn) requestOff();
    else requestOn();
  };

  return (
    <div className="screenRoot" data-screen={config.id} data-state={state}>
      {/* Clipped tube: the video + CRT FX collapse within the screen path.
          The shaped outer glow (drop-shadow on this element) follows the clip. */}
      <div
        className="screen"
        ref={screenRef}
        style={{ clipPath: `url(#${config.id})` }}
      >
        <div className="screen__tube" ref={tubeRef} style={{ opacity: 0 }}>
          <div className="screen__reel" style={reelStyle}>
            {hasVideo ? (
              <video
                ref={videoRef}
                muted
                loop
                playsInline
                preload="none"
                poster={config.poster ?? undefined}
                onError={() => setVideoFailed(true)}
                onContextMenu={(e) => e.preventDefault()}
              >
                <source src={config.videoSrc!} type="video/mp4" />
              </video>
            ) : config.poster ? (
              <img
                className="screen__poster"
                src={config.poster}
                alt=""
                aria-hidden="true"
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : (
              <ColorBars label={config.featured ? "FEATURED" : "REEL"} />
            )}
          </div>
          <CrtFx flicker={!reducedMotion} />
          <div className="screen__flash" ref={flashRef} />
        </div>

        <div className="screen__dot" ref={dotRef} />
      </div>

      <button
        type="button"
        className="screen__hit"
        style={{
          left: 0,
          top: 0,
          width: 2560,
          height: 1440,
          clipPath: `url(#${config.id})`,
        }}
        aria-label={`Power on screen ${config.position}${
          config.featured ? " (featured reel)" : ""
        }`}
        aria-pressed={state === "on" || state === "powering-on"}
        onPointerEnter={requestOn}
        onPointerLeave={requestOff}
        onFocus={requestOn}
        onBlur={requestOff}
        onClick={handleActivate}
      />
    </div>
  );
});

export default Screen;
