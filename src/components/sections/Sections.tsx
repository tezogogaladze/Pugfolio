import { lazy, Suspense, type CSSProperties } from "react";
import { SECTIONS, type Section } from "@/data/sections";
import Reveal from "./Reveal";
import "./sections.css";

const ProcessSection = lazy(() => import("./ProcessSection"));
const ClientsSection = lazy(() => import("./ClientsSection"));
const ContactSection = lazy(() => import("./ContactSection"));

function SectionContent({ section }: { section: Section }) {
  switch (section.type) {
    case "clients":
      return <ClientsSection section={section} />;
    case "contact":
      return <ContactSection section={section} />;
    default:
      return null;
  }
}

export default function Sections() {
  // Section 1 (About) is owned by the hero dive — it is revealed and scrolled
  // through inside the CRT during the pinned transition, so it must NOT render
  // again here (that caused the duplicate Section 2 + the room-coloured gap).
  const flowSections = SECTIONS.slice(1);
  return (
    <>
      {flowSections.map((section) => {
        if (section.type === "process") {
          return (
            <Suspense key={section.id} fallback={null}>
              <ProcessSection section={section} />
            </Suspense>
          );
        }

        const sectionClass =
          section.type === "clients"
            ? "section section--clients"
            : section.type === "contact"
              ? "section section--contact"
              : "section";
        const sectionStyle =
          section.type === "clients" && section.backgroundSrc
            ? ({
                "--clients-bg": `url(${section.backgroundSrc})`,
              } as CSSProperties)
            : undefined;

        return (
          <section
            key={section.id}
            id={section.id}
            className={sectionClass}
            style={sectionStyle}
            aria-label={section.title}
          >
            <Reveal reveal={section.reveal}>
              <Suspense fallback={null}>
                <SectionContent section={section} />
              </Suspense>
            </Reveal>
          </section>
        );
      })}
    </>
  );
}
