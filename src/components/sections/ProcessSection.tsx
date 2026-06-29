import { useLayoutEffect, useRef, useState } from "react";
import type { ProcessSection as ProcessSectionData } from "@/data/sections";
import { ScrollSmoother } from "@/scroll/gsapConfig";
import { setupProcessScroll } from "@/scroll/processScroll";
import { refreshScroll } from "@/scroll/smootherSingleton";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useHorizontalScroll } from "@/hooks/useHorizontalScroll";

const MAX_MOUNT_ATTEMPTS = 120;
const SMOOTHER_WAIT = 90;

export default function ProcessSection({
  section,
}: {
  section: ProcessSectionData;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const horizontal = useHorizontalScroll();
  const [activeStep, setActiveStep] = useState(0);

  useLayoutEffect(() => {
    if (!horizontal) return;

    const sectionEl = sectionRef.current;
    const viewportEl = viewportRef.current;
    const trackEl = trackRef.current;
    if (!sectionEl || !viewportEl || !trackEl) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let raf = 0;
    let resizeObserver: ResizeObserver | undefined;
    let mountAttempts = 0;
    let smootherWait = 0;

    const mount = () => {
      if (cancelled) return;

      const smoother = ScrollSmoother.get();
      const smootherExpected = Boolean(document.getElementById("smooth-wrapper"));
      if (smootherExpected && !smoother) {
        smootherWait += 1;
        if (smootherWait <= SMOOTHER_WAIT) {
          raf = requestAnimationFrame(mount);
          return;
        }
      }

      const useSmoother = Boolean(smoother);
      const distance = trackEl.scrollWidth - viewportEl.clientWidth;
      if (distance <= 0 && mountAttempts < MAX_MOUNT_ATTEMPTS) {
        mountAttempts += 1;
        raf = requestAnimationFrame(mount);
        return;
      }

      cleanup?.();
      cleanup = setupProcessScroll({
        sectionEl,
        viewportEl,
        trackEl,
        progressEl: progressRef.current,
        stepCount: section.steps.length,
        onStepChange: setActiveStep,
        reducedMotion,
        scroller: useSmoother ? "#smooth-wrapper" : undefined,
        useSmoother,
      });

      refreshScroll();
    };

    raf = requestAnimationFrame(() => {
      requestAnimationFrame(mount);
    });

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => refreshScroll());
      resizeObserver.observe(trackEl);
      resizeObserver.observe(viewportEl);
    }

    document.fonts?.ready.then(() => {
      if (!cancelled) {
        refreshScroll();
        mountAttempts = 0;
        raf = requestAnimationFrame(mount);
      }
    });

    const onLoad = () => {
      if (!cancelled) refreshScroll();
    };
    window.addEventListener("load", onLoad);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
      resizeObserver?.disconnect();
      cleanup?.();
    };
  }, [horizontal, reducedMotion, section.steps.length]);

  const pad = String(section.steps.length).length;

  return (
    <section
      ref={sectionRef}
      id={section.id}
      className={`section section--process${horizontal ? " section--process-h" : ""}`}
      aria-label={section.title}
      data-horizontal={horizontal ? "true" : "false"}
    >
      <div className="process">
        <header className="process__header">
          <div className="process__intro">
            {section.eyebrow && (
              <p className="process__eyebrow">{section.eyebrow}</p>
            )}
            <h2 className="process__title">{section.title}</h2>
          </div>
          {horizontal && (
            <div className="process__meta" aria-live="polite">
              <span className="process__counter">
                {String(activeStep + 1).padStart(pad, "0")}
                <span className="process__counterSep">/</span>
                {String(section.steps.length).padStart(pad, "0")}
              </span>
              <div className="process__progress" aria-hidden="true">
                <span ref={progressRef} className="process__progressBar" />
              </div>
            </div>
          )}
        </header>

        <div ref={viewportRef} className="process__viewport">
          <div
            ref={trackRef}
            className="process__track"
            role="list"
            aria-label="Editing process steps"
          >
            {section.steps.map((step, index) => (
              <article
                key={step.id}
                className="process__step"
                role="listitem"
                data-active={horizontal && index === activeStep ? "true" : undefined}
              >
                <span className="process__stepNum" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="process__stepTitle">{step.title}</h3>
                <p className="process__stepBody">{step.description}</p>
              </article>
            ))}
          </div>
        </div>

        {horizontal && (
          <p className="process__hint" aria-hidden="true">
            Scroll to explore
          </p>
        )}
      </div>
    </section>
  );
}
