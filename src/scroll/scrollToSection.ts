import { ScrollSmoother, ScrollTrigger } from "@/scroll/gsapConfig";
import { refreshScroll } from "@/scroll/smootherSingleton";
import type { SectionNavId } from "@/data/sections";

/**
 * Instant jump to a site section without animating through pinned zones.
 * Uses ScrollSmoother when live so ScrollTrigger pin states stay in sync.
 */
export function scrollToSection(id: SectionNavId): void {
  const smoother = ScrollSmoother.get();
  const wrapper = document.getElementById("smooth-wrapper");

  const jump = (target: number | Element | string) => {
    if (smoother) {
      smoother.scrollTo(target, false);
      return;
    }

    if (typeof target === "number") {
      if (wrapper) wrapper.scrollTop = target;
      else window.scrollTo(0, target);
      return;
    }

    const el =
      typeof target === "string" ? document.querySelector(target) : target;
    if (!el || !(el instanceof HTMLElement)) return;

    if (wrapper) {
      const top =
        el.getBoundingClientRect().top +
        wrapper.scrollTop -
        wrapper.getBoundingClientRect().top;
      wrapper.scrollTop = top;
    } else {
      el.scrollIntoView();
    }
  };

  switch (id) {
    case "hero":
      jump(0);
      break;
    case "about": {
      const hero = document.querySelector(".hero");
      if (!hero) break;
      const heroST = ScrollTrigger.getAll().find((st) => st.trigger === hero);
      jump(heroST ? heroST.end : hero);
      break;
    }
    default: {
      const el = document.getElementById(id);
      if (el) jump(el);
      break;
    }
  }

  requestAnimationFrame(() => {
    ScrollTrigger.update();
    refreshScroll();
  });
}
