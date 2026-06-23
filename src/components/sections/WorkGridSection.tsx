import type { WorkGridSection as WorkGridSectionData } from "@/data/sections";

export default function WorkGridSection({
  section,
}: {
  section: WorkGridSectionData;
}) {
  return (
    <>
      {section.eyebrow && <p className="section__eyebrow">{section.eyebrow}</p>}
      <h2 className="section__title">{section.title}</h2>
      <div className="workGrid">
        {section.items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="workCard"
            aria-label={`${item.title} — ${item.role}`}
          >
            {item.thumb && (
              <img
                src={item.thumb}
                alt=""
                aria-hidden="true"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}
            <span className="workCard__meta">
              <span className="workCard__title">{item.title}</span>
              <span className="workCard__role">{item.role}</span>
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
