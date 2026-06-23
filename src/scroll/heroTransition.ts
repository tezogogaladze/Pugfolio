import gsap from "gsap";
import { ScrollTrigger } from "@/scroll/gsapConfig";
import { measureScreen } from "@/components/crt/geometry";
import { computeStageTransform } from "@/hooks/useStageScale";
import { CENTER_SCREEN_ID, STAGE_WIDTH, STAGE_HEIGHT } from "@/data/screens";

export interface HeroTransitionArgs {
  heroEl: HTMLElement;
  tiltEl: HTMLElement;
  zoomEl: HTMLElement;
  glassTiltEl: HTMLElement;
  glassZoomEl: HTMLElement;
  glassRootEl: HTMLElement;
  revealRootEl: HTMLElement;
  revealContentEl: HTMLElement;
  revealScrollEl: HTMLElement;
  revealPathEl: SVGPathElement;
  centerTubeEl: HTMLElement | null;
  hintEl: HTMLElement | null;
  reducedMotion: boolean;
  /** ScrollSmoother wrapper — omit for native scroll. */
  scroller?: gsap.DOMTarget;
  /** When true, pin uses smoother's transform pipeline (no pinType: fixed). */
  useSmoother?: boolean;
}

/** Scroll share spent in phase 1 (room zoom + tilt, screen still live). */
const PHASE1 = 0.4;
/** Fraction of the total room zoom reached by the end of phase 1. */
const PHASE1_ZOOM_SHARE = 0.14;
/** Peak roll (deg) and how far into the scroll the tilt has settled back to 0. */
const TILT_DEG = 5;
const TILT_SPAN = 0.7;
/** Phase-2 progress at which the tube→section crossfade completes. */
const CROSSFADE = 0.08;
/** Progress window over which the glass top layer fades out (end of the dive). */
const GLASS_FADE_FROM = 0.86;

const easeZoom1 = gsap.parseEase("power2.in");
const easeZoom2 = gsap.parseEase("power1.in");
const easeGrow = gsap.parseEase("power2.in");
const easeScroll = gsap.parseEase("power1.inOut");
const easeDiveLayout = gsap.parseEase("power2.out");

function centerZoom(): number {
  const box = measureScreen(CENTER_SCREEN_ID);
  return Math.max(STAGE_WIDTH / box.width, STAGE_HEIGHT / box.height) * 1.08;
}

interface Layout {
  coverScale: number;
  box: ReturnType<typeof measureScreen>;
  vpcx: number;
  vpcy: number;
  vh: number;
  zoomFull: number;
  zoomPhase1: number;
  growthEnd: number;
  scrollStart: number;
  scrollEnd: number;
}

function measureRevealTravel(
  _revealScrollEl: HTMLElement,
  vh: number
): { scrollStart: number; scrollEnd: number } {
  // The reveal section is a single viewport-centred screen. It starts pushed
  // DOWN (text enters from below the CRT window) and rises to perfectly centred
  // as the dive completes — so Section 2 reads as scrolling up, and lands
  // centred in the viewport (never "too low").
  const scrollStart = vh * 0.3;
  const scrollEnd = 0;
  return { scrollStart, scrollEnd };
}

function computeLayout(revealScrollEl: HTMLElement): Layout {
  const cover = computeStageTransform();
  const box = measureScreen(CENTER_SCREEN_ID);
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const vpcx = cover.offsetX + cover.scale * box.cx;
  const vpcy = cover.offsetY + cover.scale * box.cy;

  const zoomFull = centerZoom();
  const zoomPhase1 = 1 + (zoomFull - 1) * PHASE1_ZOOM_SHARE;

  const diag = Math.hypot(vw, vh);
  const revealScaleEnd = (2.6 * diag) / Math.min(box.width, box.height);
  const growthEnd = revealScaleEnd / (cover.scale * zoomFull);

  const { scrollStart, scrollEnd } = measureRevealTravel(revealScrollEl, vh);

  return {
    coverScale: cover.scale,
    box,
    vpcx,
    vpcy,
    vh,
    zoomFull,
    zoomPhase1,
    growthEnd,
    scrollStart,
    scrollEnd,
  };
}

function tiltAt(progress: number, reducedMotion: boolean): number {
  if (reducedMotion || progress >= TILT_SPAN) return 0;
  return TILT_DEG * Math.sin(Math.PI * (progress / TILT_SPAN));
}

function isCenterScreenActive(tubeEl: HTMLElement | null): boolean {
  const root = tubeEl?.closest(".screenRoot") as HTMLElement | null;
  const st = root?.dataset.state;
  return st === "on";
}

/** Progress below this = hero at rest; center tube returns to Screen FSM. */
const HERO_REST = 0.035;

function releaseCenterTube(
  args: HeroTransitionArgs,
  dive: { videoStarted: boolean }
): void {
  dive.videoStarted = false;
  if (args.centerTubeEl) {
    gsap.set(args.centerTubeEl, { clearProps: "opacity" });
  }
}

function render(
  progress: number,
  L: Layout,
  args: HeroTransitionArgs,
  dive: { videoStarted: boolean }
): void {
  const { reducedMotion } = args;
  const origin = `${L.box.cx}px ${L.box.cy}px`;
  const tilt = tiltAt(progress, reducedMotion);

  let zoom: number;
  let growth: number;
  let revealOpacity: number;
  let tubeOpacity: number;
  let scrollY = L.scrollStart;
  let diveP = 0;

  if (progress <= PHASE1) {
    // Phase 1 — subtle room zoom; tilt visible over the textured room.
    const p = progress / PHASE1;
    zoom = 1 + (L.zoomPhase1 - 1) * easeZoom1(p);
    growth = 1;
    revealOpacity = 0;
    tubeOpacity = 1;
  } else {
    // Phase 2 — clip opens, Section 2 appears inside the CRT and scrolls upward
    // from the bottom in parallel with the dive (no frozen hold).
    const p2 = (progress - PHASE1) / (1 - PHASE1);
    zoom = L.zoomPhase1 + (L.zoomFull - L.zoomPhase1) * easeZoom2(p2);
    growth = 1 + (L.growthEnd - 3.3) * easeGrow(p2);

    const cross = Math.min(1, p2 / CROSSFADE);
    revealOpacity = cross;
    tubeOpacity = 1 - cross;

    const scrollT = easeScroll(p2);
    scrollY = L.scrollStart + (L.scrollEnd - L.scrollStart) * scrollT;
    diveP = easeDiveLayout(p2);
  }

  gsap.set(args.tiltEl, { rotation: tilt, transformOrigin: origin });
  gsap.set(args.zoomEl, { scale: zoom, transformOrigin: origin, force3D: true });

  // Glass top layer tracks the reveal exactly: zoom * growth (same as the clip).
  gsap.set(args.glassTiltEl, { rotation: tilt, transformOrigin: origin });
  gsap.set(args.glassZoomEl, {
    scale: zoom * growth,
    transformOrigin: origin,
    force3D: true,
  });
  const glassOpacity =
    progress < GLASS_FADE_FROM
      ? 1
      : Math.max(0, 1 - (progress - GLASS_FADE_FROM) / (1 - GLASS_FADE_FROM));
  args.glassRootEl.style.opacity = String(glassOpacity);

  // Exact screen path scaled out from the centroid, mapped to viewport px.
  const clipScale = L.coverScale * zoom * growth;
  args.revealPathEl.setAttribute(
    "transform",
    `translate(${L.vpcx} ${L.vpcy}) rotate(${tilt}) scale(${clipScale}) translate(${-L.box.cx} ${-L.box.cy})`
  );

  // Content stays at 1:1 — the CRT clip is the window. Only tilt applies here.
  args.revealContentEl.style.transformOrigin = `${L.vpcx}px ${L.vpcy}px`;
  args.revealContentEl.style.transform = `rotate(${tilt}deg)`;
  args.revealScrollEl.style.transform = `translate3d(0, ${scrollY}px, 0)`;
  args.revealScrollEl.style.setProperty("--dive-p", String(diveP));
  args.revealRootEl.style.opacity = String(revealOpacity);

  const atRest = progress <= HERO_REST || progress >= 0.995;
  args.heroEl.dataset.dive = atRest ? "false" : "true";

  // Release center tube to the Screen FSM at rest. ScrollSmoother often settles
  // above progress 0.001, so a wider rest band + live hover state (not a one-time
  // snapshot) prevents a no-hover scroll from permanently blocking screen-05.
  if (atRest) {
    releaseCenterTube(args, dive);
  } else {
    const showCenterTube = isCenterScreenActive(args.centerTubeEl);

    if (args.centerTubeEl) {
      gsap.set(args.centerTubeEl, {
        opacity: showCenterTube ? tubeOpacity : 0,
      });
    }

    if (showCenterTube && tubeOpacity > 0.05) {
      if (!dive.videoStarted) {
        const v = args.centerTubeEl?.querySelector(
          "video"
        ) as HTMLVideoElement | null;
        if (v) {
          v.play().catch(() => {
            /* autoplay policy */
          });
        }
        dive.videoStarted = true;
      }
    } else {
      dive.videoStarted = false;
    }
  }

  if (args.hintEl) {
    args.hintEl.style.opacity = String(Math.max(0, 1 - progress / 0.08));
  }
}

/**
 * Scroll-scrubbed, pinned hero dive: zoom through the exact screen-05 outline
 * and reveal the REAL Section 2 (no replica, removed from normal flow), which
 * scrolls upward from the bottom during the dive. Glass top layer persists
 * until the dive completes. Tilt lives in phase 1 over the visible room.
 */
export function setupHeroTransition(args: HeroTransitionArgs): () => void {
  let layout = computeLayout(args.revealScrollEl);
  const dive = { videoStarted: false };

  const draw = (progress: number) => {
    render(progress, layout, args, dive);
  };
  draw(0);

  const st = ScrollTrigger.create({
    trigger: args.heroEl,
    scroller: args.scroller,
    start: "top top",
    end: () => `+=${Math.round(window.innerHeight * 2.6)}`,
    pin: true,
    ...(args.useSmoother ? {} : { pinType: "fixed" as const }),
    pinSpacing: true,
    scrub: args.reducedMotion ? 0.3 : args.useSmoother ? true : 0.85,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => draw(self.progress),
    onScrubComplete: (self) => {
      draw(self.progress);
    },
    onLeaveBack: (self) => {
      releaseCenterTube(args, dive);
      draw(self.progress);
    },
    onRefresh: (self) => {
      layout = computeLayout(args.revealScrollEl);
      draw(self.progress);
    },
  });

  const refresh = () => ScrollTrigger.refresh();
  requestAnimationFrame(refresh);
  window.addEventListener("load", refresh);
  document.fonts?.ready.then(refresh);

  // Re-measure after layout/fonts settle so scroll travel is non-zero.
  const remeasure = () => {
    layout = computeLayout(args.revealScrollEl);
    draw(st.progress);
  };
  requestAnimationFrame(remeasure);
  const remeasureTimer = window.setTimeout(remeasure, 120);

  return () => {
    window.removeEventListener("load", refresh);
    window.clearTimeout(remeasureTimer);
    args.heroEl.dataset.dive = "false";
    st.kill();
    gsap.set(args.tiltEl, { clearProps: "transform,transformOrigin" });
    gsap.set(args.zoomEl, { clearProps: "transform,transformOrigin" });
    gsap.set(args.glassTiltEl, { clearProps: "transform,transformOrigin" });
    gsap.set(args.glassZoomEl, { clearProps: "transform,transformOrigin" });
    args.glassRootEl.style.opacity = "";
    args.revealPathEl.removeAttribute("transform");
    args.revealContentEl.style.cssText = "";
    args.revealScrollEl.style.transform = "";
    args.revealScrollEl.style.removeProperty("--dive-p");
    args.revealRootEl.style.opacity = "";
    if (args.centerTubeEl) gsap.set(args.centerTubeEl, { clearProps: "opacity" });
    if (args.hintEl) args.hintEl.style.opacity = "";
  };
}
