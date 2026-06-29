import { useEffect, useRef, useState, useCallback } from "react";
import Hero from "@/components/hero/Hero";
import Sections from "@/components/sections/Sections";
import SiteControls from "@/components/ui/SiteControls";
import Loader from "@/components/ui/Loader";
import ScrollRoot from "@/components/ScrollRoot";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePreloadAssets } from "@/hooks/usePreloadAssets";
import { refreshScroll, useScrollSystem } from "@/scroll/useScrollSystem";
import { preloadTvPowerSfx } from "@/audio/tvPowerSfx";
import { CENTER_SCREEN_ID, SCREENS, OVERLAY_SRC, getBackgroundSrc } from "@/data/screens";

const IMAGE_URLS = [getBackgroundSrc(), OVERLAY_SRC];
const HERO_VIDEO_COUNT = SCREENS.filter((s) => Boolean(s.videoSrc)).length;
const LOADER_ASSET_COUNT = IMAGE_URLS.length + HERO_VIDEO_COUNT;

/** Lives inside the body-portaled smooth-content so ScrollSmoother can find its wrapper. */
function ScrollContent({
  interactive,
  smooth,
  liteMotion,
  soundOn,
  scrollReady,
  onScreenVideoBuffered,
}: {
  interactive: boolean;
  smooth: boolean;
  liteMotion: boolean;
  soundOn: boolean;
  scrollReady: boolean;
  onScreenVideoBuffered?: () => void;
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
        onScreenVideoBuffered={onScreenVideoBuffered}
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
  const [videosBuffered, setVideosBuffered] = useState(0);
  const [forceShow, setForceShow] = useState(false);

  const handleScreenVideoBuffered = useCallback(() => {
    setVideosBuffered((n) => n + 1);
  }, []);

  const {
    loaded: imagesLoaded,
    done: imagesDone,
  } = usePreloadAssets(IMAGE_URLS);

  const videosReady =
    !interactive || videosBuffered >= HERO_VIDEO_COUNT;
  const assetsReady = imagesDone && videosReady;
  const readyToShow = assetsReady || forceShow;
  const loadedAssets =
    imagesLoaded + (interactive ? videosBuffered : 0);
  const progress =
    LOADER_ASSET_COUNT === 0 ? 1 : loadedAssets / LOADER_ASSET_COUNT;

  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!readyToShow) return;
    const t = window.setTimeout(() => setShowLoader(false), 650);
    return () => window.clearTimeout(t);
  }, [readyToShow]);

  useEffect(() => {
    const t = window.setTimeout(() => setForceShow(true), 20000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("rm", reducedMotion);
  }, [reducedMotion]);

  useEffect(() => {
    if (interactive) preloadTvPowerSfx();
  }, [interactive]);

  // Page height changes after assets decode — smoother must recalculate body height.
  useEffect(() => {
    if (!smoothScroll || !readyToShow) return;
    requestAnimationFrame(refreshScroll);
    const t1 = window.setTimeout(refreshScroll, 100);
    const t2 = window.setTimeout(refreshScroll, 400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [smoothScroll, readyToShow]);

  return (
    <>
      <ScrollRoot>
        <ScrollContent
          interactive={interactive}
          smooth={smoothScroll}
          liteMotion={liteMotion}
          soundOn={soundOn}
          scrollReady={readyToShow}
          onScreenVideoBuffered={
            interactive ? handleScreenVideoBuffered : undefined
          }
        />
      </ScrollRoot>
      {interactive && (
        <SiteControls
          soundOn={soundOn}
          onSoundToggle={() => setSoundOn((v) => !v)}
        />
      )}
      {showLoader && <Loader progress={progress} hiding={readyToShow} />}
    </>
  );
}
