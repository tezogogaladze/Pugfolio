import type { AboutSection as AboutSectionData } from "@/data/sections";

export default function AboutSection({
  section,
}: {
  section: AboutSectionData;
}) {
  return (
    <>
      {section.eyebrow && <p className="section__eyebrow">{section.eyebrow}</p>}
      <h2 className="section__title">{section.title}</h2>
      <div className="section__body">
        {section.body.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </>
  );
}
