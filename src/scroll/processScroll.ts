import gsap from "gsap";
import { ScrollTrigger } from "@/scroll/gsapConfig";

export interface ProcessScrollArgs {
  sectionEl: HTMLElement;
  viewportEl: HTMLElement;
  trackEl: HTMLElement;
  progressEl: HTMLElement | null;
  stepCount: number;
  onStepChange?: (index: number) => void;
  reducedMotion: boolean;
  scroller?: gsap.DOMTarget;
  useSmoother?: boolean;
}

function scrollDistance(viewportEl: HTMLElement, trackEl: HTMLElement): number {
  return Math.max(0, trackEl.scrollWidth - viewportEl.clientWidth);
}

/**
 * Pins the process section and scrubs the step track horizontally while the
 * user scrolls vertically — the site's only sideways scroll moment.
 */
export function setupProcessScroll(args: ProcessScrollArgs): () => void {
  if (args.reducedMotion) return () => {};

  let lastStep = -1;

  const tween = gsap.to(args.trackEl, {
    x: () => -scrollDistance(args.viewportEl, args.trackEl),
    ease: "none",
    scrollTrigger: {
      trigger: args.sectionEl,
      scroller: args.scroller,
      start: "top top",
      end: () => `+=${scrollDistance(args.viewportEl, args.trackEl)}`,
      pin: true,
      pinReparent: true,
      ...(args.useSmoother ? {} : { pinType: "fixed" as const }),
      pinSpacing: true,
      scrub: args.useSmoother ? true : 0.85,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (args.progressEl) {
          args.progressEl.style.transform = `scaleX(${self.progress})`;
        }
        const step = Math.min(
          args.stepCount - 1,
          Math.floor(self.progress * args.stepCount)
        );
        if (step !== lastStep) {
          lastStep = step;
          args.onStepChange?.(step);
        }
      },
    },
  });

  const refresh = () => ScrollTrigger.refresh();
  requestAnimationFrame(refresh);
  window.addEventListener("resize", refresh);

  return () => {
    window.removeEventListener("resize", refresh);
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set(args.trackEl, { clearProps: "transform" });
    if (args.progressEl) {
      args.progressEl.style.transform = "";
    }
  };
}
