/** One example project, laid out as a city: each stage of the product is a
 * district, each designed screen a building. Heights are visual only — they
 * follow how many steps a screen carries in its flow, not a metric. */

export interface Building {
  id: string;
  name: string;
  note: string;
  image: string;
  /** relative height, 1–5 */
  h: number;
  /** links to screens this one leads to in the flow */
  next?: string[];
}

export interface District {
  id: string;
  name: string;
  color: string;
  summary: string;
  buildings: Building[];
}

const F = "/media/home_work/talestudio/figma/";
const K = "/media/home_work/talestudio/keyposes/";

export const PROJECT = {
  title: "Tale Studio",
  path: "~/work/tale-studio",
  field: "AI video product · UX architecture & UI",
  intro:
    "An AI service that turns a one-line idea into a video. I re-split its tangled stages by the work each one does, designed every branch, error and rollback as flow charts, then designed the screens in Figma and built a clickable prototype.",
  prototype: "/proto/tale-studio/",
};

export const DISTRICTS: District[] = [
  {
    id: "producer",
    name: "Producer",
    color: "#F2A33A",
    summary: "Idea and terms — the story material and the settings that follow from it.",
    buildings: [
      { id: "E1", name: "E1 · Story material", note: "Start from an idea or a plot, typed or attached.", image: F + "p_e1.webp", h: 4, next: ["E2", "EB3"] },
      { id: "EB3", name: "EB3 · Plan B — by chat", note: "The same choices made by talking to Lumi instead of picking on screen.", image: F + "p_eb3.webp", h: 3 },
      { id: "E2", name: "E2 · Lumi reading", note: "The screen locks while the AI reads; Lumi shows the work with progress and a checklist.", image: F + "l_e2.webp", h: 2, next: ["W1"] },
      { id: "E5", name: "E5 · Preparing settings", note: "Loading state between the recommendation and the Writer stage.", image: F + "l_e5.webp", h: 1.5 },
    ],
  },
  {
    id: "writer",
    name: "Writer",
    color: "#E8606F",
    summary: "Prose only. Art and shots moved out to the stages that do that work.",
    buildings: [
      { id: "W1", name: "W1 · Prose workspace", note: "Write and revise the story; lock the prose to move on.", image: F + "w_w1.webp", h: 5, next: ["A5"] },
    ],
  },
  {
    id: "artist",
    name: "Artist",
    color: "#8B63E8",
    summary: "Cast and sets drawn from the locked prose, with versions.",
    buildings: [
      { id: "A5", name: "A5 · Cast & sets", note: "Every character and location, each with versions to compare.", image: F + "a_a5.webp", h: 4.5, next: ["A7", "S1"] },
      { id: "A7", name: "A7 · Detail popup", note: "Manual edits live in a popup; chat locks while it is open so the two never collide.", image: F + "a_a7.webp", h: 2.5 },
      { id: "A4", name: "A4 · Lumi drawing", note: "Loading state while the cast is generated.", image: F + "l_a4.webp", h: 1.5 },
    ],
  },
  {
    id: "storyboard",
    name: "Storyboard",
    color: "#5A6AE6",
    summary: "Shots and boards. The only stage that can go back and forth with Artist.",
    buildings: [
      { id: "S1", name: "S1 · Rough board", note: "The story broken into shots, ready to refine.", image: F + "s_s1.webp", h: 4, next: ["S2"] },
      { id: "S2", name: "S2 · Shot editing", note: "Framing, lighting and camera per shot.", image: F + "s_s2.webp", h: 3.5 },
      { id: "S0", name: "S0 · Lumi directing", note: "Loading state while boards are drawn.", image: F + "l_s0.webp", h: 1.5 },
    ],
  },
  {
    id: "system",
    name: "System",
    color: "#2DB39A",
    summary: "Components and the guide character shared by every stage.",
    buildings: [
      { id: "NAV", name: "Stage navigation", note: "Done · current · upcoming, and the screen/chat mode toggle.", image: F + "c_nav.webp", h: 3 },
      { id: "LUMI", name: "Lumi — idle", note: "The guide character; 17 states carry waits and moments.", image: K + "idle_0.webp", h: 2 },
      { id: "LUMI2", name: "Lumi — thinking", note: "Shown while a reply is on its way.", image: K + "thinking_0.75.webp", h: 1.5 },
    ],
  },
];

export const ALL = DISTRICTS.flatMap((d) => d.buildings.map((b) => ({ ...b, district: d })));
