import { useEffect, useRef, useState } from "react";
import Hero from "@/components/hero/Hero";
import Sections from "@/components/sections/Sections";
import SoundToggle from "@/components/ui/SoundToggle";
import Loader from "@/components/ui/Loader";
import ScrollRoot from "@/components/ScrollRoot";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePreloadAssets } from "@/hooks/usePreloadAssets";
import { refreshScroll, useScrollSystem } from "@/scroll/useScrollSystem";
import { preloadTvPowerSfx } from "@/audio/tvPowerSfx";
import { CENTER_SCREEN_ID, SCREENS, OVERLAY_SRC, getBackgroundSrc } from "@/data/screens";

const VIDEO_URLS = SCREENS.map((s) => s.videoSrc).filter(
  (v): v is string => Boolean(v)
);
const IMAGE_URLS = [getBackgroundSrc(), OVERLAY_SRC];

/** Lives inside the body-portaled smooth-content so ScrollSmoother can find its wrapper. */
function ScrollContent({
  interactive,
  smooth,
  liteMotion,
  soundOn,
  scrollReady,
}: {
  interactive: boolean;
  smooth: boolean;
  liteMotion: boolean;
  soundOn: boolean;
  scrollReady: boolean;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const glassTiltRef = useRef<HTMLDivElement>(null);
  const glassZoomRef = useRef<HTMLDivElement>(null);
  const glassRootRef = useRef<HTMLDivElement>(null);
  const revealRootRef = useRef<HTMLDivElement>(null);
  const revealContentRef = useRef<HTMLDivElement>(null);
  const revealScrollRef = useRef<HTMLDivElement>(null);
  const revealPathRef = useRef<SVGPathElement>(null);

  useScrollSystem({
    enabled: interactive,
    smooth,
    reducedMotion: liteMotion,
    centerScreenId: CENTER_SCREEN_ID,
    scrollReady,
    refs: {
      heroRef,
      tiltRef,
      zoomRef,
      glassTiltRef,
      glassZoomRef,
      glassRootRef,
      revealRootRef,
      revealContentRef,
      revealScrollRef,
      revealPathRef,
    },
  });

  return (
    <>
      <Hero
        sectionRef={heroRef}
        tiltRef={tiltRef}
        zoomRef={zoomRef}
        glassTiltRef={glassTiltRef}
        glassZoomRef={glassZoomRef}
        glassRootRef={glassRootRef}
        revealRootRef={revealRootRef}
        revealContentRef={revealContentRef}
        revealScrollRef={revealScrollRef}
        revealPathRef={revealPathRef}
        reducedMotion={liteMotion}
        soundOn={soundOn}
        interactive={interactive}
      />
      <main>
        <Sections />
      </main>
    </>
  );
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const interactive = !isMobile;
  const liteMotion = reducedMotion || isMobile;
  // Smooth scroll is independent of reduced-motion — that flag only eases animations.
  const smoothScroll = interactive && !isMobile;
  const [soundOn, setSoundOn] = useState(false);

  const { progress, done } = usePreloadAssets(
    interactive ? VIDEO_URLS : [],
    IMAGE_URLS
  );
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setShowLoader(false), 650);
    return () => window.clearTimeout(t);
  }, [done]);

  useEffect(() => {
    document.documentElement.classList.toggle("rm", reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    if (interactive) preloadTvPowerSfx();
  }, [interactive]);

  // Page height changes after assets decode — smoother must recalculate body height.
  useEffect(() => {
    if (!smoothScroll || !done) return;
    requestAnimationFrame(refreshScroll);
    const t1 = window.setTimeout(refreshScroll, 100);
    const t2 = window.setTimeout(refreshScroll, 400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [smoothScroll, done]);

  return (
    <>
      <ScrollRoot>
        <ScrollContent
          interactive={interactive}
          smooth={smoothScroll}
          liteMotion={liteMotion}
          soundOn={soundOn}
          scrollReady={done}
        />
      </ScrollRoot>
      {interactive && (
        <SoundToggle on={soundOn} onToggle={() => setSoundOn((v) => !v)} />
      )}
      {showLoader && <Loader progress={progress} hiding={done} />}
    </>
  );
}
