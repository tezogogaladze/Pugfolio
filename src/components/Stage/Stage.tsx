import { forwardRef, type ReactNode, type RefObject } from "react";
import { useStageScale } from "@/hooks/useStageScale";
import "./Stage.css";

interface StageProps {
  children: ReactNode;
  /** GSAP rotates this layer (the room roll). React never writes to it. */
  tiltRef?: RefObject<HTMLDivElement>;
}

/**
 * React owns `.stageCover` (translate + cover-fit scale). GSAP owns two nested
 * layers with distinct properties so transforms never overwrite each other:
 *   `.stageTilt` — rotation (room roll)
 *   `.stageZoom` — scale (the dive), forwarded ref
 * Both are stage-sized (2560x1440) with the same centroid origin.
 */
const Stage = forwardRef<HTMLDivElement, StageProps>(function Stage(
  { children, tiltRef },
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
        <div className="stageTilt" ref={tiltRef}>
          <div className="stageZoom" ref={ref}>
            <div className="stage">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Stage;
