/**
 * Per-screen configuration. Everything lives in the 2560x1440 stage
 * coordinate space so clip paths, videos and the background stay pixel-perfect
 * at any viewport size.
 *
 * The glass/glare/grime is a SINGLE full-frame 2560x1440 overlay (OVERLAY_SRC)
 * laid 1:1 over the whole stage — see Hero. Each screen maps to a placeholder
 * reel in public/assets/videos; a null videoSrc falls back to <ColorBars/>.
 */

export type ScreenId =
  | "tv-screen-01"
  | "tv-screen-02"
  | "tv-screen-03"
  | "tv-screen-04"
  | "tv-screen-05"
  | "tv-screen-06";

export interface ScreenConfig {
  id: ScreenId;
  /** Layout label per spec. */
  position:
    | "top-left"
    | "top-mid"
    | "top-right"
    | "bottom-left"
    | "center"
    | "bottom-right";
  /** Real reel encode; null => in-code placeholder color bars. */
  videoSrc: string | null;
  /** Optional WebM/AV1 source listed first for capable browsers. */
  videoSrcWebm?: string | null;
  /** Poster frame shown before play and on video failure. */
  poster?: string | null;
  /** The featured center reel gets click-to-unmute. */
  featured: boolean;
  /** Hue used for placeholder glow + color-bar tint until brand lands. */
  tint: string;
  /** Approximate centroid in stage coords (refined at runtime via getBBox). */
  centroid: { x: number; y: number };
}

export const STAGE_WIDTH = 2560;
export const STAGE_HEIGHT = 1440;

/**
 * Background asset selection. Mobile is intentionally a STUB: a dedicated
 * small-screen background will be supplied later. Until then both branches
 * use the desktop AVIF so the foundation works end-to-end. Swap the mobile
 * path here when the asset arrives — no other code changes needed.
 */
export const BACKGROUND_DESKTOP = "/assets/background/final.avif";
export const BACKGROUND_MOBILE = "/assets/background/final.avif"; // TODO: replace

/** Single full-frame glass/glare/grime overlay, stretched 1:1 over the stage. */
export const OVERLAY_SRC = "/assets/overlays/single-overlay.png";

export function getBackgroundSrc(): string {
  if (typeof window !== "undefined" && window.innerWidth < 768) {
    return BACKGROUND_MOBILE;
  }
  return BACKGROUND_DESKTOP;
}

export const SCREENS: ScreenConfig[] = [
  {
    id: "tv-screen-01",
    position: "top-left",
    videoSrc: "/assets/videos/screen-4.mp4",
    poster: null,
    featured: false,
    tint: "#ffb347",
    centroid: { x: 372, y: 300 },
  },
  {
    id: "tv-screen-02",
    position: "top-mid",
    videoSrc: "/assets/videos/screen-6.mp4",
    poster: null,
    featured: false,
    tint: "#4fd0e3",
    centroid: { x: 1374, y: 320 },
  },
  {
    id: "tv-screen-03",
    position: "top-right",
    videoSrc: "/assets/videos/screen-1.mp4",
    poster: null,
    featured: false,
    tint: "#ff7a9c",
    centroid: { x: 2050, y: 300 },
  },
  {
    id: "tv-screen-04",
    position: "bottom-left",
    videoSrc: "/assets/videos/screen-5.mp4",
    poster: null,
    featured: false,
    tint: "#9be870",
    centroid: { x: 366, y: 1095 },
  },
  {
    id: "tv-screen-05",
    position: "center",
    videoSrc: "/assets/videos/screen-3.mp4",
    poster: null,
    featured: true,
    tint: "#ffb347",
    centroid: { x: 1224, y: 810 },
  },
  {
    id: "tv-screen-06",
    position: "bottom-right",
    videoSrc: "/assets/videos/screen-2.mp4",
    poster: null,
    featured: false,
    tint: "#c79bff",
    centroid: { x: 2065, y: 1085 },
  },
];

/** The screen the hero transition zooms through. */
export const CENTER_SCREEN_ID: ScreenId = "tv-screen-05";

export const getScreen = (id: ScreenId): ScreenConfig =>
  SCREENS.find((s) => s.id === id)!;
