import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Hero from "@/components/hero/Hero";
import Sections from "@/components/sections/Sections";
import SoundToggle from "@/components/ui/SoundToggle";
import Loader from "@/components/ui/Loader";
import type { ScreenHandle } from "@/components/Screen/Screen";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { usePreloadAssets } from "@/hooks/usePreloadAssets";
import { createSmoother } from "@/scroll/smoother";
import { setupHeroTransition } from "@/scroll/heroTransition";
import {
  SCREENS,
  OVERLAY_SRC,
  getBackgroundSrc,
} from "@/data/screens";

const VIDEO_URLS = SCREENS.map((s) => s.videoSrc).filter(
  (v): v is string => Boolean(v)
);
const IMAGE_URLS = [getBackgroundSrc(), OVERLAY_SRC];

export default function App() {
  const reducedMotion = useReducedMotion();
  const [soundOn, setSoundOn] = useState(false);

  const { progress, done } = usePreloadAssets(VIDEO_URLS, IMAGE_URLS);
  const [showLoader, setShowLoader] = useState(true);
  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => setShowLoader(false), 650);
    return () => window.clearTimeout(t);
  }, [done]);

  const stageRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<ScreenHandle>(null);
  const throughGlassRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);

  // Reflect reduced-motion on the root for CSS (.rm disables flicker etc).
  useEffect(() => {
    document.documentElement.classList.toggle("rm", reducedMotion);
  }, [reducedMotion]);

  useLayoutEffect(() => {
    const { cleanup: cleanupSmoother } = createSmoother(reducedMotion);

    const heroEl = heroSectionRef.current?.querySelector(
      ".hero"
    ) as HTMLElement | null;

    let cleanupTransition = () => {};
    if (heroEl && stageRef.current && throughGlassRef.current) {
      cleanupTransition = setupHeroTransition({
        heroEl,
        stageEl: stageRef.current,
        throughGlassEl: throughGlassRef.current,
        centerHandle: centerRef.current,
        reducedMotion,
      });
    }

    return () => {
      cleanupTransition();
      cleanupSmoother();
    };
  }, [reducedMotion]);

  return (
    <>
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div ref={heroSectionRef}>
            <Hero
              stageRef={stageRef}
              centerRef={centerRef}
              throughGlassRef={throughGlassRef}
              reducedMotion={reducedMotion}
              soundOn={soundOn}
            />
          </div>
          <main>
            <Sections />
          </main>
        </div>
      </div>
      <SoundToggle on={soundOn} onToggle={() => setSoundOn((v) => !v)} />
      {showLoader && <Loader progress={progress} hiding={done} />}
    </>
  );
}
