/**
 * In-code placeholder reel: SMPTE-style color bars with a slow broadcast
 * sweep. Used wherever a ScreenConfig.videoSrc is null so the screens feel
 * "alive" with zero committed binaries. Swap for real <video> by setting
 * videoSrc in src/data/screens.ts.
 */
interface ColorBarsProps {
  label?: string;
}

const TOP_BARS = [
  "#bfbfbf",
  "#bfbf00",
  "#00bfbf",
  "#00bf00",
  "#bf00bf",
  "#bf0000",
  "#0000bf",
];

const LOWER_BARS = [
  "#0000bf",
  "#131313",
  "#bf00bf",
  "#131313",
  "#00bfbf",
  "#131313",
  "#bfbfbf",
];

export default function ColorBars({ label = "REEL" }: ColorBarsProps) {
  return (
    <div className="colorBars" aria-hidden="true">
      <div className="colorBars__bars">
        {TOP_BARS.map((c, i) => (
          <span key={i} style={{ background: c }} />
        ))}
      </div>
      <div className="colorBars__lower">
        {LOWER_BARS.map((c, i) => (
          <span key={i} style={{ background: c }} />
        ))}
      </div>
      <div className="colorBars__sweep" />
      <div className="colorBars__label">{label}</div>
    </div>
  );
}
