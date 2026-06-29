import { useEffect, useRef } from "react";
import type { ClientsSection as ClientsSectionData } from "@/data/sections";
import ProjectVideoModal, { useProjectModal } from "./ProjectVideoModal";

/** Matches the fixed art layer on .section--clients (full section height). */
function sectionBgHeight(sectionEl: HTMLElement): number {
  return sectionEl.clientHeight;
}

function syncProjectBackgrounds(sectionEl: HTMLElement) {
  const sectionRect = sectionEl.getBoundingClientRect();
  const bgH = sectionBgHeight(sectionEl);
  const rows = sectionEl.querySelectorAll<HTMLElement>(".clients__project");

  rows.forEach((row) => {
    const bg = row.querySelector<HTMLElement>(".clients__project-bg");
    if (!bg) return;
    const rowRect = row.getBoundingClientRect();
    const y = rowRect.top - sectionRect.top;
    bg.style.backgroundSize = `${sectionRect.width}px ${bgH}px`;
    bg.style.backgroundPosition = `center ${-y}px`;
  });
}

export default function ClientsSection({
  section,
}: {
  section: ClientsSectionData;
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const { active, open, close } = useProjectModal();

  useEffect(() => {
    const sectionEl = document.getElementById("clients");
    if (!sectionEl) return;

    const update = () => syncProjectBackgrounds(sectionEl);

    update();
    const wrapper = document.getElementById("smooth-wrapper");
    wrapper?.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(sectionEl);
      if (listRef.current) ro.observe(listRef.current);
    }

    const t = window.setTimeout(update, 400);

    return () => {
      wrapper?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro?.disconnect();
      window.clearTimeout(t);
    };
  }, [section.projects.length]);

  return (
    <div className="clients">
      <h2 className="clients__featured">Featured Projects</h2>

      <ul ref={listRef} className="clients__projects" role="list">
        {section.projects.map((project) => (
          <li key={project.id} className="clients__project-row" role="listitem">
            <button
              type="button"
              className="clients__project"
              onClick={() => open(project.title, project.embedUrl)}
            >
              <span className="clients__project-bg" aria-hidden="true" />
              <span className="clients__project-title">{project.title}</span>
            </button>
          </li>
        ))}
      </ul>

      {active && (
        <ProjectVideoModal
          title={active.title}
          embedUrl={active.embedUrl}
          onClose={close}
        />
      )}
    </div>
  );
}
