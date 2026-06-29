import type { ContactSection as ContactSectionData } from "@/data/sections";

export default function ContactSection({
  section,
}: {
  section: ContactSectionData;
}) {
  return (
    <div className="contact">
      <div className="contact__stats">
        {section.stats.map((s) => (
          <div className="contact__stat" key={s.label}>
            <div className="contact__stat-value">{s.value}</div>
            <div className="contact__stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="contact__main">
        {section.eyebrow && (
          <p className="section__eyebrow">{section.eyebrow}</p>
        )}
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
      </div>

      <p className="contact__credit">
        Designed &amp; developed by{" "}
        <a href={section.credit.href} target="_blank" rel="noreferrer">
          {section.credit.name}
        </a>
      </p>
    </div>
  );
}
