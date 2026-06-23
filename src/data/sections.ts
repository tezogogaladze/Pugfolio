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
    eyebrow: "Inside the tube",
    title: "Editor / Colourist",
    reveal: "rise",
    body: [
      "I cut films that feel like they were always meant to move that way.",
      "Documentary, commercial, music — rhythm first, then the picture.",
    ],
  },
  {
    id: "work",
    type: "work-grid",
    eyebrow: "Selected work",
    title: "Reels",
    reveal: "rise",
    items: Array.from({ length: 6 }).map((_, i) => ({
      id: `work-${i + 1}`,
      title: `Project ${String(i + 1).padStart(2, "0")}`,
      role: ["Edit", "Color", "Edit / Color", "Motion", "Edit", "Sound"][i],
      thumb: null,
      videoSrc: null,
    })),
  },
  {
    id: "showreel",
    type: "showreel",
    eyebrow: "Featured",
    title: "2026 Showreel",
    reveal: "fade",
    videoSrc: null,
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
