import type { CSSProperties } from "react";
import type { ClientsSection as ClientsSectionData } from "@/data/sections";
import ProjectVideoModal, { useProjectModal } from "./ProjectVideoModal";

export default function ClientsSection({
  section,
}: {
  section: ClientsSectionData;
}) {
  const { active, open, close } = useProjectModal();

  const layoutStyle = {
    "--clients-count": section.projects.length,
  } as CSSProperties;

  return (
    <div className="clients" style={layoutStyle}>
      <div className="clients__bg" aria-hidden="true" />

      <div className="clients__frame">
        <h2 className="clients__featured">Featured Projects</h2>

        <ul className="clients__projects" role="list">
          {section.projects.map((project) => (
            <li
              key={project.id}
              className="clients__project-row"
              role="listitem"
            >
              <button
                type="button"
                className="clients__project"
                onClick={() => open(project.title, project.embedUrl)}
              >
                <span className="clients__veil" aria-hidden="true" />
                <span className="clients__project-title">{project.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

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
