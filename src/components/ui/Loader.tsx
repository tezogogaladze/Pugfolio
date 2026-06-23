import "./Loader.css";

interface LoaderProps {
  progress: number;
  /** Begin the fade-out (assets are ready). */
  hiding: boolean;
}

/** Minimalist full-screen loader: a percentage and a thin progress line. */
export default function Loader({ progress, hiding }: LoaderProps) {
  const pct = Math.round(progress * 100);
  return (
    <div
      className={`loader${hiding ? " is-hiding" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${pct} percent`}
    >
      <div className="loader__inner">
        <div className="loader__count">{pct}</div>
        <div className="loader__bar">
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
        <div className="loader__label">Warming up the tubes</div>
      </div>
    </div>
  );
}
