import { useLayoutEffect, useState } from "react";
import { STAGE_WIDTH, STAGE_HEIGHT } from "@/data/screens";

export interface StageTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

/**
 * Computes the transform that makes the fixed 2560x1440 stage COVER the
 * viewport (object-fit: cover behavior), centered. Recomputed on resize via
 * ResizeObserver + window resize. The returned values are applied as a single
 * transform on the stage element so the whole composition scales as one unit.
 */
export function useStageScale(): StageTransform {
  const [t, setT] = useState<StageTransform>(() => compute());

  useLayoutEffect(() => {
    const update = () => setT(compute());
    update();

    const ro = new ResizeObserver(update);
    ro.observe(document.documentElement);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return t;
}

function compute(): StageTransform {
  if (typeof window === "undefined") {
    return { scale: 1, offsetX: 0, offsetY: 0 };
  }
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const scale = Math.max(vw / STAGE_WIDTH, vh / STAGE_HEIGHT);
  const scaledW = STAGE_WIDTH * scale;
  const scaledH = STAGE_HEIGHT * scale;
  const offsetX = (vw - scaledW) / 2;
  const offsetY = (vh - scaledH) / 2;
  return { scale, offsetX, offsetY };
}
