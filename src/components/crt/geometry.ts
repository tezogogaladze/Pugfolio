/**
 * Runtime geometry for the screen masks. Centroids in screens.ts are good
 * approximations; this refines them by measuring the actual path bbox in the
 * browser (getBBox), which the hero zoom uses for an exact transform-origin.
 */
import { CLIP_PATHS } from "./ClipDefs";
import type { ScreenId } from "@/data/screens";

export interface BBox {
  x: number;
  y: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
}

const SVG_NS = "http://www.w3.org/2000/svg";
let scratchSvg: SVGSVGElement | null = null;

function getScratch(): SVGSVGElement {
  if (scratchSvg) return scratchSvg;
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 2560 1440");
  svg.style.cssText =
    "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;";
  document.body.appendChild(svg);
  scratchSvg = svg;
  return svg;
}

const cache = new Map<ScreenId, BBox>();

export function measureScreen(id: ScreenId): BBox {
  const cached = cache.get(id);
  if (cached) return cached;

  const def = CLIP_PATHS.find((c) => c.id === id);
  if (!def) throw new Error(`Unknown screen id: ${id}`);

  const svg = getScratch();
  const path = document.createElementNS(SVG_NS, "path");
  path.setAttribute("d", def.d);
  svg.appendChild(path);
  const b = path.getBBox();
  svg.removeChild(path);

  const box: BBox = {
    x: b.x,
    y: b.y,
    width: b.width,
    height: b.height,
    cx: b.x + b.width / 2,
    cy: b.y + b.height / 2,
  };
  cache.set(id, box);
  return box;
}
