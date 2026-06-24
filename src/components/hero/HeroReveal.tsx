import { type RefObject } from "react";
import { CLIP_PATHS } from "@/components/crt/ClipDefs";
import { CENTER_SCREEN_ID } from "@/data/screens";
import { SECTIONS } from "@/data/sections";
import AboutSection from "@/components/sections/AboutSection";
import "@/components/sections/sections.css";
import "./HeroReveal.css";

interface HeroRevealProps {
  /** Clipped container — opacity crossfade from the live tube. */
  rootRef: RefObject<HTMLDivElement>;
  /** Scaled + rotated from screen-size to full viewport. */
  contentRef: RefObject<HTMLDivElement>;
  /** Inner scroller — translated upward (the parallel Section 2 scroll). */
  scrollRef: RefObject<HTMLDivElement>;
  /** Exact screen-05 clip path — transformed each frame to grow the hole. */
  pathRef: RefObject<SVGPathElement>;
}

const CENTER_PATH = CLIP_PATHS.find((c) => c.id === CENTER_SCREEN_ID)!;
export const HERO_REVEAL_CLIP_ID = "hero-reveal-clip";

/**
 * The REAL Section 2, revealed through the exact CRT outline. The clip stays
 * the true screen-05 shape and scales outward until it clears the viewport, so
 * the shape is never approximated. The inner scroller translates during the
 * dive so Section 2 scrolls in parallel (not frozen).
 */
export default function HeroReveal({
  rootRef,
  contentRef,
  scrollRef,
  pathRef,
}: HeroRevealProps) {
  const section = SECTIONS[0];

  return (
    <>
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <defs>
          <clipPath id={HERO_REVEAL_CLIP_ID} clipPathUnits="userSpaceOnUse">
            <path ref={pathRef} d={CENTER_PATH.d} />
          </clipPath>
        </defs>
      </svg>

      <div
        ref={rootRef}
        className="heroReveal"
        style={{ clipPath: `url(#${HERO_REVEAL_CLIP_ID})` }}
        aria-hidden="true"
      >
        <div ref={contentRef} className="heroReveal__content">
          <div ref={scrollRef} className="heroReveal__scroll">
            <div className="section heroReveal__section">
              {section.type === "about" && <AboutSection section={section} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
