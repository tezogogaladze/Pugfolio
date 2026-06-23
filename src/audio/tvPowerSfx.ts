export const TV_ON_SRC = "/assets/sfx/tv-on.mp3";
export const TV_OFF_SRC = "/assets/sfx/tv-off.mp3";

export type TvPowerKind = "on" | "off";

const pool: Record<TvPowerKind, HTMLAudioElement> = {
  on: new Audio(TV_ON_SRC),
  off: new Audio(TV_OFF_SRC),
};

/** Warm both clips so the first hover doesn't wait on decode. */
export function preloadTvPowerSfx(): void {
  (Object.keys(pool) as TvPowerKind[]).forEach((kind) => {
    const a = pool[kind];
    a.preload = "auto";
    a.load();
  });
}

/** Play a TV power click. Restarts if re-triggered mid-clip (fast hover hops). */
export function playTvPowerSfx(kind: TvPowerKind): void {
  const audio = pool[kind];
  audio.pause();
  try {
    audio.currentTime = 0;
  } catch {
    /* ignore */
  }
  audio.play().catch(() => {
    /* autoplay policy or missing file */
  });
}
