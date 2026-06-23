import { type RefObject, useLayoutEffect } from "react";
import { ScrollSmoother } from "@/scroll/gsapConfig";
import {
  setupHeroTransition,
  type HeroTransitionArgs,
} from "@/scroll/heroTransition";
import {
  destroySmoother,
  ensureSmoother,
  refreshScroll,
  scrollDebugState,
} from "@/scroll/smootherSingleton";

export interface ScrollSystemRefs {
  heroRef: RefObject<HTMLElement>;
  tiltRef: RefObject<HTMLDivElement>;
  zoomRef: RefObject<HTMLDivElement>;
  glassTiltRef: RefObject<HTMLDivElement>;
  glassZoomRef: RefObject<HTMLDivElement>;
  glassRootRef: RefObject<HTMLDivElement>;
  revealRootRef: RefObject<HTMLDivElement>;
  revealContentRef: RefObject<HTMLDivElement>;
  revealScrollRef: RefObject<HTMLDivElement>;
  revealPathRef: RefObject<SVGPathElement>;
}

interface UseScrollSystemOptions {
  enabled: boolean;
  smooth: boolean;
  reducedMotion: boolean;
  centerScreenId: string;
  refs: ScrollSystemRefs;
  scrollReady: boolean;
}

function collectHeroArgs(
  refs: ScrollSystemRefs,
  centerScreenId: string,
  reducedMotion: boolean
): HeroTransitionArgs | null {
  const heroEl = refs.heroRef.current;
  const tiltEl = refs.tiltRef.current;
  const zoomEl = refs.zoomRef.current;
  const glassTiltEl = refs.glassTiltRef.current;
  const glassZoomEl = refs.glassZoomRef.current;
  const glassRootEl = refs.glassRootRef.current;
  const revealRootEl = refs.revealRootRef.current;
  const revealContentEl = refs.revealContentRef.current;
  const revealScrollEl = refs.revealScrollRef.current;
  const revealPathEl = refs.revealPathRef.current;

  if (
    !heroEl ||
    !tiltEl ||
    !zoomEl ||
    !glassTiltEl ||
    !glassZoomEl ||
    !glassRootEl ||
    !revealRootEl ||
    !revealContentEl ||
    !revealScrollEl ||
    !revealPathEl
  ) {
    return null;
  }

  const hintEl = heroEl.querySelector(".hero__hint") as HTMLElement | null;
  const centerTubeEl = heroEl.querySelector(
    `[data-screen="${centerScreenId}"] .screen__tube`
  ) as HTMLElement | null;

  return {
    heroEl,
    tiltEl,
    zoomEl,
    glassTiltEl,
    glassZoomEl,
    glassRootEl,
    revealRootEl,
    revealContentEl,
    revealScrollEl,
    revealPathEl,
    centerTubeEl,
    hintEl,
    reducedMotion,
  };
}

const MAX_SMOOTHER_WAIT = 90;

export function useScrollSystem({
  enabled,
  smooth,
  reducedMotion,
  centerScreenId,
  refs,
  scrollReady,
}: UseScrollSystemOptions): void {
  const active = enabled && scrollReady;

  useLayoutEffect(() => {
    document.documentElement.dataset.smoothScroll = smooth ? "on" : "off";

    if (!active) return;

    if (!smooth) {
      destroySmoother();
      return;
    }

    ensureSmoother();
    refreshScroll();
    const raf = requestAnimationFrame(refreshScroll);
    const t = window.setTimeout(refreshScroll, 150);

    if (import.meta.env.DEV) {
      console.info("[scroll] debug:", scrollDebugState());
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [active, smooth]);

  useLayoutEffect(() => {
    if (!active) return;

    let cancelled = false;
    let raf = 0;
    let cleanupHero: (() => void) | undefined;
    let smootherWait = 0;

    const mount = () => {
      if (cancelled) return;

      if (smooth) {
        ensureSmoother();
        if (!ScrollSmoother.get()) {
          smootherWait += 1;
          if (smootherWait > MAX_SMOOTHER_WAIT) {
            if (import.meta.env.DEV) {
              console.warn(
                "[scroll] ScrollSmoother never appeared — hero uses native scroll"
              );
            }
          } else {
            raf = requestAnimationFrame(mount);
            return;
          }
        }
      }

      const args = collectHeroArgs(refs, centerScreenId, reducedMotion);
      if (!args) {
        raf = requestAnimationFrame(mount);
        return;
      }

      const useSmoother = smooth && Boolean(ScrollSmoother.get());

      cleanupHero = setupHeroTransition(
        useSmoother
          ? { ...args, scroller: "#smooth-wrapper", useSmoother: true }
          : { ...args, useSmoother: false }
      );

      refreshScroll();
    };

    raf = requestAnimationFrame(mount);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cleanupHero?.();
    };
  }, [active, smooth, reducedMotion, centerScreenId]);
}

export { refreshScroll };
