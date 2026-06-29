/**
 * Data-driven section framework. Count, order and copy are all configurable
 * until the editor's real content + branding are supplied. The Hero (section 1)
 * is rendered separately because it owns the pinned CRT stage; everything here
 * is "inside the TV" and below the fold.
 */

export type SectionType = "about" | "process" | "clients" | "contact";

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

export interface FeaturedProject {
  id: string;
  title: string;
  /** YouTube / Vimeo embed URL — null until supplied. */
  embedUrl: string | null;
}

export interface ClientsSection extends BaseSection {
  type: "clients";
  projects: FeaturedProject[];
  backgroundSrc?: string;
}

export interface ContactSection extends BaseSection {
  type: "contact";
  stats: { label: string; value: string }[];
  email: string;
  socials: { label: string; href: string }[];
  credit: { name: string; href: string };
}

export type Section =
  | AboutSection
  | ProcessSection
  | ClientsSection
  | ContactSection;

/** Jump-menu targets — maps 1:1 to the five site sections. */
export type SectionNavId = "hero" | "about" | "process" | "clients" | "contact";

export interface NavItem {
  id: SectionNavId;
  label: string;
}

export const SITE_NAV: NavItem[] = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "process", label: "My Process" },
  { id: "clients", label: "Projects" },
  { id: "contact", label: "Contact" },
];

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
      "I am a Video Editor. For five years I've been creating content in Premiere Pro, After Effects, and CapCut — YouTube, TikTok, Instagram, podcasts, UGC, and brand campaigns. I focus on pacing, storytelling, and edits that look professional and hold attention on social media.",
      "I've worked with brands and creative projects across different styles — multicam, color correction, sound cleanup, short-form optimization, and polished delivery on deadline. I work remotely, follow briefs closely, and communicate clearly throughout the process. If you're looking for someone to help your videos perform and grow online, I'd love to connect.",
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
    id: "clients",
    type: "clients",
    title: "Clients",
    reveal: "fade",
    backgroundSrc: "/assets/images/clients-bg.jpeg",
    projects: [
      {
        id: "battle",
        title: "Battle ?",
        embedUrl: "https://www.youtube.com/embed/v1Q1PsOQCuk",
      },
      {
        id: "taha-bxnny",
        title: "TAHA x BXNNY ❘ ROUND 3 vs JJ x MARLO (SEASON 1)",
        embedUrl: "https://www.youtube.com/embed/qiQVE0DnWXc",
      },
      {
        id: "kami-moska",
        title: "KAMI x MOSKA ❘ ROUND 3 vs TOLO x ANGELEYE (SEASON 1)",
        embedUrl: "https://www.youtube.com/embed/nR7zIgzczxk",
      },
      {
        id: "qa-kami",
        title: "Q&A ✦ KAMI / MOSKA / YOUNG MIC / GROTASK / TYRO / MVYKL",
        embedUrl: "https://www.youtube.com/embed/RvNzXzZIYfg",
      },
      {
        id: "pvpflow-teaser",
        title: "PVPFLOW SKYRESS vs KAMI (FINAL TEASER)",
        embedUrl: "https://www.youtube.com/embed/rQ_OLBHIE5s",
      },
      {
        id: "beauty-product",
        title: "30 Seconds - Beauty Product",
        embedUrl: "https://streamable.com/e/kzw6x4",
      },
      {
        id: "mushroom-coffee",
        title: "Mushroom Coffee UGC",
        embedUrl: "https://streamable.com/e/ej684a",
      },
      {
        id: "music-show-trailer",
        title: "Music Show Trailer",
        embedUrl: "https://streamable.com/e/od9y1v",
      },
      {
        id: "hip-hop-trailer",
        title: "Hip-Hop Competition Trailer",
        embedUrl: "https://streamable.com/e/6zzkpl",
      },
      {
        id: "tiktok-content",
        title: "Tiktok Content",
        embedUrl: "https://streamable.com/e/kf1byz",
      },
      {
        id: "wemby-motion",
        title: "Wemby Motion Graphic",
        embedUrl: "https://streamable.com/e/mpe629",
      },
    ],
  },
  {
    id: "contact",
    type: "contact",
    eyebrow: "Say hello",
    title: "Let's make something",
    reveal: "rise",
    stats: [
      { value: "120+", label: "Projects delivered" },
      { value: "5+", label: "Years in the edit" },
      { value: "40+", label: "Clients & brands" },
    ],
    email: "svansky2@gmail.com",
    socials: [
      {
        label: "linkedin.com/in/nkvts",
        href: "https://www.linkedin.com/in/nkvts",
      },
    ],
    credit: {
      name: "Tezo Gogaladze",
      href: "https://www.tezogogaladze.com/",
    },
  },
];
