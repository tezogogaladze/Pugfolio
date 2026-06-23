import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { measureScreen } from "@/components/crt/geometry";
import { CENTER_SCREEN_ID, STAGE_WIDTH, STAGE_HEIGHT } from "@/data/screens";
import type { ScreenHandle } from "@/components/Screen/Screen";

gsap.registerPlugin(ScrollTrigger);

interface TransitionArgs {
  heroEl: HTMLElement;
  stageEl: HTMLElement;
  throughGlassEl: HTMLElement;
  centerHandle: ScreenHandle | null;
  reducedMotion: boolean;
}

/**
 * Scroll-scrubbed, pinned "through the TV" transition:
 *   1. Force tv-screen-05 ON.
 *   2. Scale the whole stage toward the screen-05 centroid with a slow room
 *      rotation (transform-origin = centroid).
 *   3. As the screen fills the viewport, blur + cross-dissolve through the
 *      glass into the next section.
 *
 * Baseline is pure CSS 2.5D (scale + rotate + blur + dissolve). The WebGL
 * upgrade can swap in by replacing the body of this timeline.
 */
export function setupHeroTransition({
  heroEl,
  stageEl,
  throughGlassEl,
  centerHandle,
  reducedMotion,
}: TransitionArgs): () => void {
  if (reducedMotion) {
    // No scroll-jacking and no forced-on screens: hover/focus/tap control all.
    return () => {};
  }

  const box = measureScreen(CENTER_SCREEN_ID);

  // Zoom factor so the center screen roughly fills the stage (and therefore
  // the cover-scaled viewport) when scaled about its centroid.
  const zoom =
    Math.max(STAGE_WIDTH / box.width, STAGE_HEIGHT / box.height) * 1.08;

  gsap.set(stageEl, { transformOrigin: `${box.cx}px ${box.cy}px` });

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: heroEl,
      start: "top top",
      end: "+=160%",
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      // Only force the center screen on once the zoom actually begins, so at
      // rest all screens are off and hover controls them.
      onUpdate: (self) => {
        if (self.progress > 0.001) centerHandle?.requestOn();
      },
    },
  });

  tl.to(stageEl, { scale: zoom, rotation: -3.2 }, 0)
    .to(stageEl, { filter: "blur(7px) brightness(1.15)" }, 0.55)
    .to(throughGlassEl, { opacity: 0.85 }, 0.62)
    .to(throughGlassEl, { opacity: 1 }, 0.86)
    .to(heroEl, { autoAlpha: 0 }, 0.9);

  return () => {
    tl.scrollTrigger?.kill();
    tl.kill();
    gsap.set(stageEl, { clearProps: "transform,filter,transformOrigin" });
    gsap.set(heroEl, { clearProps: "opacity,visibility" });
  };
}
