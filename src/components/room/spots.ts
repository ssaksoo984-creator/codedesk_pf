/**
 * The room is built from two layers, like a stage set:
 *  - the back wall (bookcase, idea board, window) — far away, moves little
 *  - the desk with the monitor — close to the camera, moves more
 * Both are front-facing renders; the depth comes from their scale and the
 * difference in movement (parallax).
 */
export const WALL = { w: 3168, h: 1344 };
export const DESK = { w: 2752, h: 1536 };

export type SpotId = "library" | "resume" | "portfolio" | "blog";
export type LayerId = "wall" | "desk";
type Rect = [number, number, number, number];

/** The monitor's screen, as fractions of the desk layer. */
export const SCREEN: Rect = [0.3754, 0.4368, 0.2478, 0.2506];

/** Rectangles are fractions of their layer: [left, top, width, height]. */
export const SPOTS: { id: SpotId; label: string; object: string; layer: LayerId; rect: Rect; focus: Rect }[] = [
  { id: "library", label: "Library", object: "Bookshelf", layer: "wall", rect: [0.0, 0.0, 0.265, 0.95], focus: [0.0, 0.0, 0.3, 0.95] },
  { id: "resume", label: "Résumé", object: "Idea board", layer: "wall", rect: [0.31, 0.24, 0.38, 0.48], focus: [0.29, 0.2, 0.42, 0.56] },
  { id: "portfolio", label: "Portfolio", object: "Computer", layer: "desk", rect: SCREEN, focus: SCREEN },
  { id: "blog", label: "Blog", object: "Flower", layer: "wall", rect: [0.73, 0.62, 0.055, 0.12], focus: [0.68, 0.45, 0.16, 0.32] },
];

/** Stars in the window (fractions of the wall layer). */
export const STARS: [number, number][] = [
  [0.75, 0.1], [0.78, 0.17], [0.81, 0.08], [0.84, 0.2], [0.76, 0.26], [0.8, 0.3], [0.83, 0.13],
  [0.86, 0.27], [0.77, 0.36], [0.85, 0.09], [0.79, 0.22], [0.82, 0.35],
];

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Where the two layers sit for a viewport, before any panning.
 * Desktop: the desk spans the width and is anchored to the bottom; the wall
 * fills most of the height behind it, its sides falling off-screen.
 * Phones: the desk is scaled so the monitor fills most of the width; the wall
 * keeps the full height and can be dragged sideways. */
export function layout(vw: number, vh: number) {
  const portrait = vw < vh * 0.9;
  const deskW = portrait ? vw * 3.1 : Math.max(vw, (vh * 16) / 9);
  const deskH = (deskW * DESK.h) / DESK.w;
  const wallH = 0.86 * Math.max(vh, (deskW * 9) / 16);
  const wallW = (wallH * WALL.w) / WALL.h;
  const desk: Box = { x: (vw - deskW) / 2, y: vh - deskH, w: deskW, h: deskH };
  const wall: Box = { x: (vw - wallW) / 2, y: 0, w: wallW, h: wallH };
  // How far the wall can slide either way before an edge shows.
  const panRange = Math.max(0, (wallW - vw) / 2);
  return { desk, wall, panRange, portrait };
}

/** Near things move more than far things. */
export const PARALLAX = { wall: 1, desk: 1.45 };
