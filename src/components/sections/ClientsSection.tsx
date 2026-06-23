import type { ClientsSection as ClientsSectionData } from "@/data/sections";

export default function ClientsSection({
  section,
}: {
  section: ClientsSectionData;
}) {
  return (
    <>
      {section.eyebrow && <p className="section__eyebrow">{section.eyebrow}</p>}
      <h2 className="section__title">{section.title}</h2>
      <div className="clients__stats">
        {section.stats.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat__value">{s.value}</div>
            <div className="stat__label">{s.label}</div>
          </div>
        ))}
      </div>
    </>
  );
}
