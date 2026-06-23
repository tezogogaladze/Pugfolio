import type { ContactSection as ContactSectionData } from "@/data/sections";

export default function ContactSection({
  section,
}: {
  section: ContactSectionData;
}) {
  return (
    <>
      {section.eyebrow && <p className="section__eyebrow">{section.eyebrow}</p>}
      <h2 className="section__title">{section.title}</h2>
      <a className="contact__email" href={`mailto:${section.email}`}>
        {section.email}
      </a>
      <div className="contact__socials">
        {section.socials.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
            {s.label}
          </a>
        ))}
      </div>
    </>
  );
}
