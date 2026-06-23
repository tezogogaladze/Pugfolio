/** Enough buffered data to paint the first frame. */
export function isVideoBuffered(v: HTMLVideoElement): boolean {
  return v.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
}

/** Start loading and resolve once the reel can play without stalling. */
export function bufferVideo(
  v: HTMLVideoElement,
  signal?: AbortSignal
): Promise<void> {
  if (v.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      v.removeEventListener("canplaythrough", finish);
      v.removeEventListener("error", finish);
      resolve();
    };

    if (signal?.aborted) {
      finish();
      return;
    }
    signal?.addEventListener("abort", finish, { once: true });

    v.preload = "auto";
    v.addEventListener("canplaythrough", finish);
    v.addEventListener("error", finish);
    try {
      v.load();
    } catch {
      finish();
    }
  });
}

/** Play immediately, or after the first decodable frame is available. */
export function playVideoWhenReady(v: HTMLVideoElement): () => void {
  let cancelled = false;

  const play = () => {
    if (cancelled) return;
    v.play().catch(() => {
      /* autoplay rejection — poster stays */
    });
  };

  if (isVideoBuffered(v)) {
    play();
    return () => {
      cancelled = true;
    };
  }

  const onReady = () => {
    v.removeEventListener("canplay", onReady);
    play();
  };
  v.addEventListener("canplay", onReady);

  return () => {
    cancelled = true;
    v.removeEventListener("canplay", onReady);
  };
}
