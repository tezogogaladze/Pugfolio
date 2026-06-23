import { ScrollSmoother, ScrollTrigger } from "@/scroll/gsapConfig";

/**
 * ScrollSmoother is a process-wide singleton. It must NOT be created/killed
 * inside React effect cleanup — StrictMode double-mount destroys the internal
 * scrub tween and leaves a broken instance (smooth scroll never works).
 */
export function ensureSmoother(): ScrollSmoother | null {
  const live = ScrollSmoother.get();
  if (live) return live;

  const wrapper = document.querySelector("#smooth-wrapper");
  const content = document.querySelector("#smooth-content");
  if (!wrapper || !content) {
    if (import.meta.env.DEV) {
      console.warn(
        "[scroll] ScrollSmoother skipped — #smooth-wrapper / #smooth-content not found"
      );
    }
    return null;
  }

  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.6,
    smoothTouch: 0.12,
    effects: false,
    normalizeScroll: false,
    ignoreMobileResize: true,
  });

  if (import.meta.env.DEV) {
    console.info("[scroll] ScrollSmoother created", smoother);
  }

  return smoother;
}

export function destroySmoother(): void {
  ScrollSmoother.get()?.kill();
}

export function refreshScroll(): void {
  if (ScrollSmoother.get()) {
    ScrollSmoother.refresh();
  } else {
    ScrollTrigger.refresh();
  }
}

export function scrollDebugState(): {
  smoother: boolean;
  bodyHeight: string;
} {
  return {
    smoother: Boolean(ScrollSmoother.get()),
    bodyHeight: document.body.style.height,
  };
}
