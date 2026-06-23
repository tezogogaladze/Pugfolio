/**
 * Documents/automates the clip extraction step.
 *
 * Background/Screens.svg ships as a single ~15MB line: a <g id="BACKGROUND">
 * holding a base64 PNG duplicate of the room (DISCARD), and a
 * <g id="CRT_Masks"> holding the 6 screen paths we actually want. This script
 * reads the SVG, drops the base64 group, and prints the clean <clipPath> set
 * (clipPathUnits="userSpaceOnUse") so it can be pasted into
 * src/components/crt/ClipDefs.tsx.
 *
 * The 6 paths are already inlined in ClipDefs.tsx, so this is only needed if
 * the source SVG masks change. Run: npm run extract-clip
 */
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const SRC = resolve(here, "../Background/Screens.svg");

const raw = await readFile(SRC, "utf8");

const masksMatch = raw.match(/<g id="CRT_Masks"[^>]*>([\s\S]*?)<\/g>/);
if (!masksMatch) {
  console.error("Could not find #CRT_Masks group in", SRC);
  process.exit(1);
}

const paths = [...masksMatch[1].matchAll(/<path id="(tv-screen-\d+)" d="([^"]+)"/g)];

const clipDefs = paths
  .sort((a, b) => a[1].localeCompare(b[1]))
  .map(
    ([, id, d]) =>
      `        <clipPath id="${id}" clipPathUnits="userSpaceOnUse">\n          <path d="${d}" />\n        </clipPath>`
  )
  .join("\n");

console.log(`<!-- Extracted ${paths.length} clip paths (base64 background discarded) -->`);
console.log("<svg width=\"0\" height=\"0\" viewBox=\"0 0 2560 1440\">\n  <defs>");
console.log(clipDefs);
console.log("  </defs>\n</svg>");
