import type { ShowreelSection as ShowreelSectionData } from "@/data/sections";
import ColorBars from "@/components/crt/ColorBars";

export default function ShowreelSection({
  section,
}: {
  section: ShowreelSectionData;
}) {
  return (
    <>
      {section.eyebrow && <p className="section__eyebrow">{section.eyebrow}</p>}
      <h2 className="section__title">{section.title}</h2>
      <div className="showreel__frame">
        {section.videoSrc ? (
          <video
            muted
            loop
            playsInline
            preload="none"
            controls
            poster={section.poster ?? undefined}
          >
            <source src={section.videoSrc} type="video/mp4" />
          </video>
        ) : (
          <ColorBars label="SHOWREEL" />
        )}
      </div>
    </>
  );
}
