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
  // About is owned by the hero — revealed in the CRT dive on desktop and
  // overlaid on the static room image on mobile; never duplicated here.
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
