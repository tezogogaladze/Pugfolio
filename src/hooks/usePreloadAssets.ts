import { useEffect, useState } from "react";

/**
 * Preloads the heavy hero assets (the reels + background + glass overlay) so the
 * first hover plays instantly. Videos resolve on `canplaythrough` (enough
 * buffered to play start-to-finish); images on load. A safety timeout prevents
 * the loader from trapping the user if a request stalls.
 */
export function usePreloadAssets(
  videoUrls: string[],
  imageUrls: string[],
  timeoutMs = 12000
): { progress: number; done: boolean } {
  const [loaded, setLoaded] = useState(0);
  const [done, setDone] = useState(false);
  const total = videoUrls.length + imageUrls.length;

  useEffect(() => {
    if (total === 0) {
      setDone(true);
      return;
    }

    let cancelled = false;
    let count = 0;
    const cleanups: Array<() => void> = [];

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

    videoUrls.forEach((url) => {
      const v = document.createElement("video");
      v.preload = "auto";
      v.muted = true;
      let fired = false;
      const onReady = () => {
        if (fired) return;
        fired = true;
        cleanup();
        bump();
      };
      const cleanup = () => {
        v.removeEventListener("canplaythrough", onReady);
        v.removeEventListener("error", onReady);
        v.removeAttribute("src");
        v.load();
      };
      v.addEventListener("canplaythrough", onReady);
      v.addEventListener("error", onReady);
      v.src = url;
      v.load();
      cleanups.push(cleanup);
    });

    const timeout = window.setTimeout(() => {
      if (!cancelled) setDone(true);
    }, timeoutMs);

    return () => {
      cancelled = true;
      cleanups.forEach((c) => c());
      window.clearTimeout(timeout);
    };
  }, [total, timeoutMs]);

  const progress = total === 0 ? 1 : loaded / total;
  return { progress, done };
}
