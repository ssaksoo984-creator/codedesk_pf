import { VISIBLE_WORK_PROJECTS, type WorkProject } from "@/lib/work-content";

/** The portfolio as databases: each stack holds one kind of work, each disc
 * in it is a project. */
export interface Stack {
  id: string;
  name: string;
  color: string;
  projects: WorkProject[];
}

const pick = (ids: string[]) =>
  ids.map((id) => VISIBLE_WORK_PROJECTS.find((p) => p.index === id)).filter((p): p is WorkProject => Boolean(p));

export const STACKS: Stack[] = [
  { id: "systems", name: "Systems & tools", color: "#8B6CFF", projects: pick(["09", "02", "04"]) },
  { id: "public", name: "Public & culture", color: "#3E9BE0", projects: pick(["06", "03"]) },
  { id: "brand", name: "Brand & identity", color: "#F2A33A", projects: pick(["10", "11"]) },
  { id: "business", name: "Business websites", color: "#E8606F", projects: pick(["01", "05", "07"]) },
];

export const ALL_PROJECTS = STACKS.flatMap((s) => s.projects.map((p) => ({ project: p, stack: s })));

export const yearOf = (p: WorkProject) => p.year ?? p.stage?.en ?? "";
