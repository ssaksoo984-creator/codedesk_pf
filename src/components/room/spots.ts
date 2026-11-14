/** Room render size (both day and night renders share the exact framing). */
export const ROOM = { w: 2752, h: 1536 };

export type SpotId = "library" | "resume" | "portfolio" | "blog";

/** The monitor's screen, where the portfolio is shown inside the room. */
export const SCREEN: [number, number, number, number] = [0.3757, 0.451, 0.2467, 0.226];

/** Rectangles are fractions of the render: [left, top, width, height].
 * `rect` is the clickable object; `focus` is what the camera frames. */
export const SPOTS: {
  id: SpotId;
  label: string;
  object: string;
  rect: [number, number, number, number];
  focus: [number, number, number, number];
}[] = [
  { id: "library", label: "Library", object: "Bookshelf", rect: [0.0, 0.0, 0.235, 0.74], focus: [0.0, 0.0, 0.3, 0.78] },
  { id: "resume", label: "Résumé", object: "Idea board", rect: [0.297, 0.245, 0.405, 0.19], focus: [0.28, 0.2, 0.44, 0.3] },
  { id: "portfolio", label: "Portfolio", object: "Computer", rect: SCREEN, focus: SCREEN },
  { id: "blog", label: "Blog", object: "Flower", rect: [0.81, 0.56, 0.085, 0.13], focus: [0.74, 0.45, 0.2, 0.32] },
];

/** The point kept in the middle of the screen when the room is cropped
 * (phones): the computer. */
export const FOCAL = { x: 0.5, y: 0.56 };
