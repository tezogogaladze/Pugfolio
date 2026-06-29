import { useEffect, useState } from "react";

/** Viewport wide enough for the pinned horizontal process strip. */
const MIN_WIDTH = 640;

/**
 * Whether section 3 should run the horizontal scroll layout.
 * Intentionally separate from useIsMobile — that hook degrades the hero for
 * touch phones and must not disable desktop/tablet horizontal scroll on Windows
 * (touch laptops, coarse pointer, or non-maxed browser windows).
 */
export function useHorizontalScroll(): boolean {
  const query = `(min-width: ${MIN_WIDTH}px)`;

  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return true;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia(query);
    const onChange = () => setEnabled(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);

  return enabled;
}
