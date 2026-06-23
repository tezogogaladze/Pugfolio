import { useEffect, useState, type RefObject } from "react";

/**
 * IntersectionObserver gate: returns whether the given element is currently
 * in view. The Screen component combines this with hover/focus state so a
 * video only ever plays when BOTH the hero is on-screen AND the screen is
 * active — never decoding all six reels at once.
 */
export function useInView(
  ref: RefObject<Element | null>,
  rootMargin = "0px"
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin, threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
