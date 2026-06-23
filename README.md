# CRT Room — Portfolio

An animation-heavy, single-page, smooth-scrolling portfolio. The hero is a
photoreal room of six CRT TVs that power on with reels as you hover each screen;
on scroll the camera zooms through the center TV into the content sections.

## Stack

- Vite + React + TypeScript
- GSAP (ScrollTrigger + ScrollSmoother)
- CRT/visual FX via DOM + CSS/SVG (WebGL is an optional, isolated upgrade — see
  `src/gl/CenterScreenGL.tsx`)

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build to dist/
npm run preview
```

## Architecture

A single fixed **2560×1440 stage** (`src/components/Stage/Stage.tsx`) is
`transform: scale()`-d to COVER the viewport. Every layer shares this coordinate
space, so the background, the 6 SVG clip paths, the per-screen videos, and the
glass overlays stay pixel-perfect at any size, and the hero zoom is a single
transform on the stage.

Per screen (`src/components/Screen/Screen.tsx`), bottom → top:

1. Background AVIF (room, screens dark)
2. `<video>` / placeholder reel, positioned to the screen's bbox, clipped with
   `clip-path: url(#tv-screen-0N)` (userSpaceOnUse, from `src/components/crt/ClipDefs.tsx`)
3. CRT FX (scanlines, RGB-split, vignette, idle flicker)
4. Glass overlay PNG, stretched to the stage
5. Focusable hit/interaction surface

Each screen runs a finite state machine — `off → powering-on → on →
powering-off → off` (`useScreenMachine.ts`) — driven independently by hover,
keyboard focus, tap, or the scroll-forced center screen. Power-on = white flash +
scanline roll + brightness ramp + glow; power-off = the classic CRT collapse to a
line, then a fading dot.

The "through the TV" transition (`src/scroll/heroTransition.ts`) pins the hero,
forces `tv-screen-05` on, scales + rotates the stage toward the screen-05
centroid, then blurs and cross-dissolves into the sections.

Sections (`src/data/sections.ts` + `src/components/sections/`) are data-driven and
lazy-loaded with reveal-on-scroll.

## Performance & accessibility

- Videos only decode/play on hover **and** while the hero is in view; otherwise
  paused (`useInViewVideo.ts`). `preload="none"`, posters, muted/loop/playsinline.
- Animate transform/opacity/filter only; layers are `will-change`-promoted.
- Full `prefers-reduced-motion` path: no flicker, instant on/off, native scroll
  (ScrollSmoother disabled), reveals shown immediately.
- Screens are focusable buttons with visible focus; focus = power-on.
- Audio is muted by default; a global sound toggle (top-right) unmutes the
  videos on user gesture (`src/components/ui/SoundToggle.tsx`).
- Video failure falls back to the clipped poster frame.

## Dropping in real assets

- **Videos:** put per-screen encodes in `public/assets/videos/` and set `videoSrc`
  (and optional `videoSrcWebm`, `poster`) per screen in `src/data/screens.ts`.
  Until then each screen shows the in-code color-bars placeholder.
- **Mobile background:** set `BACKGROUND_MOBILE` in `src/data/screens.ts`.
- **Brand:** edit the CSS custom properties in `src/styles/global.css`
  (`--accent`, font vars, etc.).
- **Sections:** edit the `SECTIONS` array in `src/data/sections.ts` (count, order,
  copy, work items are all data).
- **Clip masks:** already inlined. If the source SVG masks change, run
  `npm run extract-clip` and paste the output into `ClipDefs.tsx`.

## Still needed from you (placeholders used meanwhile)

- Brand identity + copy: name/handle, logo, tone, type pairing, accent color(s).
- Sections 2…N: final content, count, and order.
- Videos: 6 per-screen encodes (aspect/length/loop) + which is the featured
  center reel; reel → screen mapping.
- Deployment target (Vercel/Netlify?) and whether a CMS is wanted for the work
  grid.
