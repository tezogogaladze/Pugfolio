import { type RefObject } from "react";
import Stage from "@/components/Stage/Stage";
import ClipDefs from "@/components/crt/ClipDefs";
import Screen from "@/components/Screen/Screen";
import HeroReveal from "@/components/hero/HeroReveal";
import { useStageScale } from "@/hooks/useStageScale";
import {
  SCREENS,
  getBackgroundSrc,
  OVERLAY_SRC,
} from "@/data/screens";
import "./Hero.css";

interface HeroProps {
  sectionRef: RefObject<HTMLElement>;
  tiltRef: RefObject<HTMLDivElement>;
  zoomRef: RefObject<HTMLDivElement>;
  glassTiltRef: RefObject<HTMLDivElement>;
  glassZoomRef: RefObject<HTMLDivElement>;
  glassRootRef: RefObject<HTMLDivElement>;
  revealRootRef: RefObject<HTMLDivElement>;
  revealContentRef: RefObject<HTMLDivElement>;
  revealScrollRef: RefObject<HTMLDivElement>;
  revealPathRef: RefObject<SVGPathElement>;
  reducedMotion: boolean;
  soundOn: boolean;
  interactive: boolean;
  onScreenVideoBuffered?: () => void;
}

export default function Hero({
  sectionRef,
  tiltRef,
  zoomRef,
  glassTiltRef,
  glassZoomRef,
  glassRootRef,
  revealRootRef,
  revealContentRef,
  revealScrollRef,
  revealPathRef,
  reducedMotion,
  soundOn,
  interactive,
  onScreenVideoBuffered,
}: HeroProps) {
  const { scale, offsetX, offsetY } = useStageScale();

  if (!interactive) {
    return (
      <section className="hero hero--static" aria-label="The CRT Room">
        <div
          className="hero__static-img"
          role="img"
          aria-label="A dim, overgrown room with six dead CRT televisions."
          style={{ backgroundImage: `url(${getBackgroundSrc()})` }}
        />
        <div
          className="hero__static-img hero__static-glass"
          aria-hidden="true"
          style={{ backgroundImage: `url(${OVERLAY_SRC})` }}
        />
        <div className="hero__ambience" />
      </section>
    );
  }

  const coverTransform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`;

  return (
    <section className="hero" ref={sectionRef} aria-label="The CRT Room">
      <ClipDefs />
      <Stage ref={zoomRef} tiltRef={tiltRef}>
        <div
          className="stage__layer stage__bg"
          role="img"
          aria-label="A dim, overgrown room with six dead CRT televisions."
          style={{ backgroundImage: `url(${getBackgroundSrc()})` }}
        />
        {SCREENS.map((config) => (
          <Screen
            key={config.id}
            config={config}
            reducedMotion={reducedMotion}
            soundOn={soundOn}
            enableVideo={interactive}
            onBuffered={onScreenVideoBuffered}
          />
        ))}
      </Stage>

      <HeroReveal
        rootRef={revealRootRef}
        contentRef={revealContentRef}
        scrollRef={revealScrollRef}
        pathRef={revealPathRef}
      />

      <div className="hero__glassTop" ref={glassRootRef} aria-hidden="true">
        <div className="stageCover" style={{ transform: coverTransform }}>
          <div className="stageTilt" ref={glassTiltRef}>
            <div className="stageZoom" ref={glassZoomRef}>
              <div className="stage">
                <div
                  className="stage__overlay"
                  style={{ backgroundImage: `url(${OVERLAY_SRC})` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__ambience" />
      <p className="hero__hint">Hover the screens — scroll to enter</p>
    </section>
  );
}
