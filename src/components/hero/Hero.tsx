import { useRef, type RefObject } from "react";
import Stage from "@/components/Stage/Stage";
import ClipDefs from "@/components/crt/ClipDefs";
import Screen, { type ScreenHandle } from "@/components/Screen/Screen";
import {
  SCREENS,
  CENTER_SCREEN_ID,
  getBackgroundSrc,
  OVERLAY_SRC,
} from "@/data/screens";
import { useInView } from "@/hooks/useInViewVideo";
import "./Hero.css";

interface HeroProps {
  /** Inner 2560x1440 .stage element — GSAP drives its zoom transform. */
  stageRef: RefObject<HTMLDivElement>;
  /** Imperative handle for the center screen (force-on during transition). */
  centerRef: RefObject<ScreenHandle>;
  /** Overlay element faded in by the "through the glass" timeline. */
  throughGlassRef: RefObject<HTMLDivElement>;
  reducedMotion: boolean;
  /** Global sound state — when true, screen videos are unmuted. */
  soundOn: boolean;
}

export default function Hero({
  stageRef,
  centerRef,
  throughGlassRef,
  reducedMotion,
  soundOn,
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const heroInView = useInView(heroRef, "200px");

  return (
    <section className="hero" ref={heroRef} aria-label="The CRT Room">
      <ClipDefs />
      <Stage ref={stageRef}>
        <img
          className="stage__layer stage__bg"
          src={getBackgroundSrc()}
          alt="A dim, overgrown room with six dead CRT televisions."
          draggable={false}
        />
        {SCREENS.map((config, index) => (
          <Screen
            key={config.id}
            ref={config.id === CENTER_SCREEN_ID ? centerRef : undefined}
            config={config}
            heroInView={heroInView}
            reducedMotion={reducedMotion}
            soundOn={soundOn}
            index={index}
          />
        ))}

        {/* Single full-frame glass/glare/grime overlay, 1:1 over the stage and
            on top of every screen, so it scales with the room during the zoom.
            Transparent screen interiors let the videos show through. */}
        <img
          className="stage__overlay"
          src={OVERLAY_SRC}
          alt=""
          aria-hidden="true"
          draggable={false}
        />
      </Stage>

      <div className="hero__ambience" />
      <div className="hero__throughGlass" ref={throughGlassRef} />
      <p className="hero__hint">Hover the screens — scroll to enter</p>
    </section>
  );
}
