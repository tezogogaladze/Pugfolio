import { useEffect, useState } from "react";

/**
 * Preloads static hero images (background + glass overlay). Hero reel videos are
 * buffered in-place by each Screen on mount — see Screen.tsx.
 */
export function usePreloadAssets(
  imageUrls: string[],
  timeoutMs = 12000
): { loaded: number; total: number; progress: number; done: boolean } {
  const [loaded, setLoaded] = useState(0);
  const [done, setDone] = useState(false);
  const total = imageUrls.length;

  useEffect(() => {
    if (total === 0) {
      setDone(true);
      return;
    }

    let cancelled = false;
    let count = 0;

    const bump = () => {
      if (cancelled) return;
      count += 1;
      setLoaded(count);
      if (count >= total) setDone(true);
    };

    imageUrls.forEach((url) => {
      const img = new Image();
      img.onload = bump;
      img.onerror = bump;
      img.src = url;
    });

    const timeout = window.setTimeout(() => {
      if (!cancelled) setDone(true);
    }, timeoutMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [total, timeoutMs]);

  const progress = total === 0 ? 1 : loaded / total;
  return { loaded, total, progress, done };
}
