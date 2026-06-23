import { forwardRef, type ReactNode } from "react";
import { useStageScale } from "@/hooks/useStageScale";
import "./Stage.css";

interface StageProps {
  children: ReactNode;
}

/**
 * The single fixed 2560x1440 stage. The cover transform (scale to fill the
 * viewport, centered) is applied to an outer wrapper that React controls on
 * resize. The forwarded ref points at the inner `.stage` element, whose
 * transform is left untouched so GSAP can drive the hero zoom on it without
 * fighting React re-renders.
 */
const Stage = forwardRef<HTMLDivElement, StageProps>(function Stage(
  { children },
  ref
) {
  const { scale, offsetX, offsetY } = useStageScale();

  return (
    <div className="stageViewport">
      <div
        className="stageCover"
        style={{
          transform: `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`,
        }}
      >
        <div className="stage" ref={ref}>
          {children}
        </div>
      </div>
    </div>
  );
});

export default Stage;
