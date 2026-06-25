/**
 * Data-driven section framework. Count, order and copy are all configurable
 * until the editor's real content + branding are supplied. The Hero (section 1)
 * is rendered separately because it owns the pinned CRT stage; everything here
 * is "inside the TV" and below the fold.
 */

export type SectionType =
  | "about"
  | "process"
  | "showreel"
  | "clients"
  | "contact";

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
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

export interface ProcessSection extends BaseSection {
  type: "process";
  steps: ProcessStep[];
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
  backgroundSrc?: string;
}

export interface ContactSection extends BaseSection {
  type: "contact";
  email: string;
  socials: { label: string; href: string }[];
}

export type Section =
  | AboutSection
  | ProcessSection
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
    id: "process",
    type: "process",
    eyebrow: "How I work",
    title: "My Process",
    reveal: "none",
    steps: [
      {
        id: "brief",
        title: "Brief & Goals",
        description:
          "I review the client's brief, brand style, target audience, platform, and goal — so the edit lands the right tone: energetic, clean, cinematic, promotional, or natural UGC.",
      },
      {
        id: "footage",
        title: "Footage Selection",
        description:
          "I go through all provided footage and pick the strongest shots — clear expressions, product visibility, movement, and clean audio — building from the best material available.",
      },
      {
        id: "structure",
        title: "Structure & Story",
        description:
          "Hook, core message, value, proof, and call to action. Even short-form needs a tight arc so viewers grasp the message fast and stay engaged.",
      },
      {
        id: "rough-cut",
        title: "Rough Cut & Rhythm",
        description:
          "First assembly: cut the selects, trim dead air, and lock pacing and storytelling. Then I add movement, zooms, speed ramps, and transitions that feel dynamic without looking over-edited.",
      },
      {
        id: "captions-sound",
        title: "Captions & Sound",
        description:
          "Clean captions and subtitles for silent viewing, plus music, SFX, whooshes, and subtle audio details so transitions and key moments hit harder.",
      },
      {
        id: "delivery",
        title: "Polish & Delivery",
        description:
          "Color consistency, motion graphics when needed, client revisions, then platform-optimized export for TikTok, Reels, Shorts, ads, or web.",
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
    backgroundSrc: "/assets/images/clients-bg.png",
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
