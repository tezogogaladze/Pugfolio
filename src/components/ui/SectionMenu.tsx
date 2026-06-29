import { useEffect, useId, useRef, useState } from "react";
import { SITE_NAV, type SectionNavId } from "@/data/sections";
import { scrollToSection } from "@/scroll/scrollToSection";

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4 7h16v2H4V7zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"
      />
    </svg>
  );
}

export default function SectionMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const go = (id: SectionNavId) => {
    setOpen(false);
    requestAnimationFrame(() => scrollToSection(id));
  };

  return (
    <div ref={rootRef} className="sectionMenu">
      <button
        type="button"
        className="ctrlBtn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={panelId}
        aria-label={open ? "Close section menu" : "Open section menu"}
        title="Sections"
        data-open={open}
      >
        <MenuIcon />
      </button>

      <nav
        id={panelId}
        className="sectionMenu__panel"
        aria-label="Jump to section"
        data-open={open}
        hidden={!open}
      >
        <ul className="sectionMenu__list" role="menu">
          {SITE_NAV.map((item) => (
            <li key={item.id} role="none">
              <button
                type="button"
                className="sectionMenu__link"
                role="menuitem"
                onClick={() => go(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
