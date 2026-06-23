import "./crt.css";

interface CrtFxProps {
  /** Show the faint idle flicker layer (disabled by reduced motion globally). */
  flicker?: boolean;
}

/**
 * CRT treatment layer: scanlines, RGB split, vignette/bloom and optional idle
 * flicker. Sits above the video and is clipped to the same screen path by its
 * parent. Purely decorative.
 */
export default function CrtFx({ flicker = true }: CrtFxProps) {
  return (
    <div className="crtFx">
      <div className="crtFx__rgb" />
      <div className="crtFx__scanlines" />
      <div className="crtFx__vignette" />
      {flicker && <div className="crtFx__flicker" />}
    </div>
  );
}
