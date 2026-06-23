import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export interface SmootherSetup {
  smoother: ScrollSmoother | null;
  cleanup: () => void;
}

/**
 * Creates the ScrollSmoother instance over the required #smooth-wrapper /
 * #smooth-content markup. Under reduced motion we skip smoothing entirely and
 * let the browser scroll natively.
 */
export function createSmoother(reducedMotion: boolean): SmootherSetup {
  if (reducedMotion) {
    return { smoother: null, cleanup: () => {} };
  }

  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.15,
    effects: true,
    normalizeScroll: true,
  });

  return {
    smoother,
    cleanup: () => {
      smoother.kill();
    },
  };
}

export { ScrollTrigger };
