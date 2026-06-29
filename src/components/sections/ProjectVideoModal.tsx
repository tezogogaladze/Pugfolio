import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import "./ProjectVideoModal.css";

interface ProjectVideoModalProps {
  title: string;
  embedUrl: string | null;
  onClose: () => void;
}

/**
 * Portaled to <body> — outside ScrollSmoother so fixed positioning and
 * focus trap never interfere with pin/scrub tweens.
 */
export default function ProjectVideoModal({
  title,
  embedUrl,
  onClose,
}: ProjectVideoModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="projectModal"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="projectModal__panel"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="projectModal__header">
          <h3 className="projectModal__title">{title}</h3>
          <button
            type="button"
            className="projectModal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>
        <div className="projectModal__frame">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <p className="projectModal__placeholder">
              Video embed coming soon.
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function useProjectModal() {
  const [active, setActive] = useState<{
    title: string;
    embedUrl: string | null;
  } | null>(null);

  const open = useCallback(
    (title: string, embedUrl: string | null) =>
      setActive({ title, embedUrl }),
    []
  );
  const close = useCallback(() => setActive(null), []);

  return { active, open, close };
}
