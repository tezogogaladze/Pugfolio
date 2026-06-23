import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { ScreenConfig } from "@/data/screens";
import { measureScreen } from "@/components/crt/geometry";
import CrtFx from "@/components/crt/CrtFx";
import ColorBars from "@/components/crt/ColorBars";
import { useScreenMachine } from "./useScreenMachine";
import { playTvPowerSfx } from "@/audio/tvPowerSfx";
import "./Screen.css";

export interface ScreenHandle {
  requestOn: () => void;
  requestOff: () => void;
}

interface ScreenProps {
  config: ScreenConfig;
  reducedMotion: boolean;
  /** Global sound state — when true, reel + TV click SFX are audible. */
  soundOn: boolean;
  /** Disabled on mobile/touch — falls back to the cheap color-bars reel. */
  enableVideo: boolean;
}

const Screen = forwardRef<ScreenHandle, ScreenProps>(function Screen(
  { config, reducedMotion, soundOn, enableVideo },
  ref
) {
  const { state, requestOn, requestOff } = useScreenMachine("off");

  const [box] = useState(() => measureScreen(config.id));

  const tubeRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const prevState = useRef(state);

  useImperativeHandle(ref, () => ({ requestOn, requestOff }), [
    requestOn,
    requestOff,
  ]);

  const hasVideo = enableVideo && Boolean(config.videoSrc) && !videoFailed;
  const isOn = state === "on";

  // TV power clicks — only when global sound is on.
  useEffect(() => {
    if (!enableVideo || !soundOn || prevState.current === state) return;
    if (state === "on") playTvPowerSfx("on");
    if (state === "off" && prevState.current === "on") playTvPowerSfx("off");
    prevState.current = state;
  }, [state, soundOn, enableVideo]);

  // Instant reel playback — no power-on/off animation delay.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !config.videoSrc) return;

    if (isOn) {
      v.preload = "auto";
      if (v.readyState === 0) {
        try {
          v.load();
        } catch {
          /* ignore */
        }
      }
      v.play().catch(() => {
        /* autoplay rejection — poster stays */
      });
    } else {
      v.pause();
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
  }, [isOn, config.videoSrc]);

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

  const handleActivate = () => {
    if (isOn) requestOff();
    else requestOn();
  };

  return (
    <div className="screenRoot" data-screen={config.id} data-state={state}>
      <div
        className="screen"
        style={{ clipPath: `url(#${config.id})` }}
      >
        <div className="screen__tube" ref={tubeRef}>
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
        </div>
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
        aria-pressed={isOn}
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
