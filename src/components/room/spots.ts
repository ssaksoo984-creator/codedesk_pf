/** Room render size (both day and night renders share the exact framing). */
export const ROOM = { w: 2752, h: 1536 };

export type SpotId = "library" | "resume" | "portfolio" | "blog";

/** Rectangles are fractions of the render: [left, top, width, height].
 * `rect` is the clickable object; `focus` is what the camera frames. */
export const SPOTS: {
  id: SpotId;
  label: string;
  object: string;
  rect: [number, number, number, number];
  focus: [number, number, number, number];
}[] = [
  { id: "library", label: "Library", object: "Bookshelf", rect: [0.095, 0.02, 0.155, 0.93], focus: [0.0, 0.02, 0.27, 0.96] },
  { id: "resume", label: "Résumé", object: "Idea board", rect: [0.302, 0.246, 0.408, 0.338], focus: [0.29, 0.22, 0.43, 0.4] },
  { id: "portfolio", label: "Portfolio", object: "Computer", rect: [0.44, 0.462, 0.12, 0.128], focus: [0.44, 0.462, 0.12, 0.128] },
  { id: "blog", label: "Blog", object: "Flower", rect: [0.806, 0.58, 0.064, 0.13], focus: [0.75, 0.47, 0.18, 0.3] },
];

/** The point kept in the middle of the screen when the room is cropped
 * (phones): the computer. */
export const FOCAL = { x: 0.5, y: 0.52 };
