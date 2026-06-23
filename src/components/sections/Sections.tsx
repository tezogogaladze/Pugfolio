import { lazy, Suspense } from "react";
import { SECTIONS, type Section } from "@/data/sections";
import Reveal from "./Reveal";
import "./sections.css";

const AboutSection = lazy(() => import("./AboutSection"));
const WorkGridSection = lazy(() => import("./WorkGridSection"));
const ShowreelSection = lazy(() => import("./ShowreelSection"));
const ClientsSection = lazy(() => import("./ClientsSection"));
const ContactSection = lazy(() => import("./ContactSection"));

function SectionContent({ section }: { section: Section }) {
  switch (section.type) {
    case "about":
      return <AboutSection section={section} />;
    case "work-grid":
      return <WorkGridSection section={section} />;
    case "showreel":
      return <ShowreelSection section={section} />;
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
      {flowSections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="section"
          aria-label={section.title}
        >
          <Reveal reveal={section.reveal}>
            <Suspense fallback={null}>
              <SectionContent section={section} />
            </Suspense>
          </Reveal>
        </section>
      ))}
    </>
  );
}
