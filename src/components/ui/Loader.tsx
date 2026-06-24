import { useReducedMotion } from "@/hooks/useReducedMotion";
import "./Loader.css";

interface LoaderProps {
  progress: number;
  /** Begin the fade-out (assets are ready). */
  hiding: boolean;
}

const BLOCKS = 24;

function blockBar(progress: number): string {
  const filled = Math.round(progress * BLOCKS);
  return `${"█".repeat(filled)}${"░".repeat(BLOCKS - filled)}`;
}

/** Full-screen Vault-Tec style boot loader with subtle CSS CRT treatment. */
export default function Loader({ progress, hiding }: LoaderProps) {
  const reducedMotion = useReducedMotion();
  const pct = Math.round(progress * 100);
  const status =
    pct < 25
      ? "POWERING CRT ARRAY"
      : pct < 75
        ? "BUFFERING VIDEO FEEDS"
        : "CALIBRATING DISPLAY";

  return (
    <div
      className={`loader${hiding ? " is-hiding" : ""}${reducedMotion ? " loader--static" : ""}`}
      role="status"
      aria-live="polite"
      aria-label={`Loading ${pct} percent`}
    >
      <div className="loader__crt" aria-hidden="true" />
      <div className="loader__terminal">
        <p className="loader__header">PUG INDUSTRIES (TM) TERMLINK PROTOCOL</p>
        <p className="loader__line">
          <span className="loader__chevron">{">"}</span> {status}
          <span className="loader__cursor">_</span>
        </p>
        <div className="loader__count">{String(pct).padStart(3, "0")}</div>
        <div className="loader__blocks">[{blockBar(progress)}]</div>
        <p className="loader__label">Warming up the tubes</p>
      </div>
    </div>
  );
}
