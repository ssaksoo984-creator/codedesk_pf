/** Room render size (both day and night renders share the exact framing). */
export const ROOM = { w: 2752, h: 1536 };

export type SpotId = "library" | "resume" | "portfolio" | "blog";

/** The monitor's screen, where the portfolio is shown inside the room. */
export const SCREEN: [number, number, number, number] = [0.401, 0.5195, 0.1962, 0.1732];

/** Rectangles are fractions of the render: [left, top, width, height].
 * `rect` is the clickable object; `focus` is what the camera frames. */
export const SPOTS: {
  id: SpotId;
  label: string;
  object: string;
  rect: [number, number, number, number];
  focus: [number, number, number, number];
}[] = [
  { id: "library", label: "Library", object: "Bookshelf", rect: [0.005, 0.0, 0.305, 0.95], focus: [0.0, 0.0, 0.34, 0.97] },
  { id: "resume", label: "Résumé", object: "Idea board", rect: [0.3685, 0.345, 0.258, 0.14], focus: [0.33, 0.28, 0.33, 0.26] },
  { id: "portfolio", label: "Portfolio", object: "Computer", rect: SCREEN, focus: SCREEN },
  { id: "blog", label: "Blog", object: "Flower", rect: [0.698, 0.6, 0.058, 0.128], focus: [0.64, 0.5, 0.17, 0.25] },
];

/** The point kept in the middle of the screen when the room is cropped
 * (phones): the computer. */
export const FOCAL = { x: 0.5, y: 0.6 };
