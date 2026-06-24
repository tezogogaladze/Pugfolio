/**
 * Data-driven section framework. Count, order and copy are all configurable
 * until the editor's real content + branding are supplied. The Hero (section 1)
 * is rendered separately because it owns the pinned CRT stage; everything here
 * is "inside the TV" and below the fold.
 */

export type SectionType =
  | "about"
  | "work-grid"
  | "showreel"
  | "clients"
  | "contact";

export interface WorkItem {
  id: string;
  title: string;
  role: string;
  thumb?: string | null;
  videoSrc?: string | null;
}

export interface BaseSection {
  id: string;
  type: SectionType;
  eyebrow?: string;
  title: string;
  /** Reveal-on-enter intensity hook for the IntersectionObserver. */
  reveal?: "fade" | "rise" | "none";
}

export interface AboutSection extends BaseSection {
  type: "about";
  body: string[];
}

export interface WorkGridSection extends BaseSection {
  type: "work-grid";
  items: WorkItem[];
}

export interface ShowreelSection extends BaseSection {
  type: "showreel";
  videoSrc?: string | null;
  poster?: string | null;
}

export interface ClientsSection extends BaseSection {
  type: "clients";
  logos: string[];
  stats: { label: string; value: string }[];
}

export interface ContactSection extends BaseSection {
  type: "contact";
  email: string;
  socials: { label: string; href: string }[];
}

export type Section =
  | AboutSection
  | WorkGridSection
  | ShowreelSection
  | ClientsSection
  | ContactSection;

/** PLACEHOLDER content — swap wholesale when brand + copy arrive. */
export const SECTIONS: Section[] = [
  {
    id: "about",
    type: "about",
    eyebrow: "",
    title: "",
    reveal: "rise",
    body: [
      "Hi! I am Nika.",
      "I am a Video Editor. For five years I've been creating content in Premiere Pro, After Effects, and CapCut — YouTube, TikTok, Instagram, podcasts, UGC, and brand campaigns. I focus on pacing, storytelling, and edits that look professional and hold attention on social.",
      "I've worked with brands and creative projects across different styles — multicam, color correction, sound cleanup, short-form optimization, and polished delivery on deadline. I work remotely, follow briefs closely, and communicate clearly throughout. If you're looking for someone to help your videos perform and grow online, I'd love to connect.",
    ],
  },
  {
    id: "work",
    type: "work-grid",
    eyebrow: "Selected work",
    title: "Reels",
    reveal: "rise",
    items: [
      {
        id: "work-1",
        title: "Reel 01",
        role: "Edit",
        thumb: null,
        videoSrc: "/assets/videos/tv-1.mp4",
      },
      {
        id: "work-2",
        title: "Reel 02",
        role: "Edit / Color",
        thumb: null,
        videoSrc: "/assets/videos/tv-2.mp4",
      },
      {
        id: "work-3",
        title: "Reel 03",
        role: "Edit",
        thumb: null,
        videoSrc: "/assets/videos/tv-3.mp4",
      },
      {
        id: "work-4",
        title: "Reel 04",
        role: "Motion",
        thumb: null,
        videoSrc: "/assets/videos/tv-4.mp4",
      },
      {
        id: "work-5",
        title: "Reel 05",
        role: "Edit",
        thumb: null,
        videoSrc: "/assets/videos/tv-5.mp4",
      },
      {
        id: "work-6",
        title: "Reel 06",
        role: "Edit / Sound",
        thumb: null,
        videoSrc: "/assets/videos/tv-6.mp4",
      },
    ],
  },
  {
    id: "showreel",
    type: "showreel",
    eyebrow: "Featured",
    title: "2026 Showreel",
    reveal: "fade",
    videoSrc: "/assets/videos/tv-5.mp4",
    poster: null,
  },
  {
    id: "clients",
    type: "clients",
    eyebrow: "Trusted by",
    title: "Clients",
    reveal: "fade",
    logos: [],
    stats: [
      { label: "Projects", value: "120+" },
      { label: "Years", value: "8" },
      { label: "Awards", value: "5" },
    ],
  },
  {
    id: "contact",
    type: "contact",
    eyebrow: "Say hello",
    title: "Let's make something",
    reveal: "rise",
    email: "hello@example.com",
    socials: [
      { label: "Instagram", href: "#" },
      { label: "Vimeo", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
];
