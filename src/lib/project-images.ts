import type { WorkProject } from "./work-content";

/** Every screenshot a project's case data mentions, in reading order, with
 * its caption — used to lay out the plain project page. */
export function projectImages(p: WorkProject): { src: string; caption?: string }[] {
  const out: { src: string; caption?: string }[] = [];
  const push = (src?: string, caption?: { en: string }) => {
    if (src && !out.some((o) => o.src === src)) out.push({ src, caption: caption?.en });
  };
  const main = p.imageShowcase?.main.desktop?.light;
  if (main) push(main, p.imageShowcase?.main.title);
  for (const panel of p.designGuide?.panels ?? []) {
    for (const im of panel.images ?? []) if (!im.video) push(im.src, im.caption);
    if (panel.responsive) push(panel.responsive.desktop.src, panel.responsive.desktop.caption);
    if (panel.compare) {
      push(panel.compare.left.src, panel.compare.left.caption);
      push(panel.compare.right.src, panel.compare.right.caption);
    }
  }
  for (const b of p.story ?? []) for (const im of b.images ?? []) push(im.src, im.caption);
  for (const g of p.imageShowcase?.groups ?? []) for (const c of g.cards) push(c.desktop?.light ?? c.mobile.light, c.title);
  return out;
}
