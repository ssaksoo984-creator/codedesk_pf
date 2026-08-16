import { WorkBrowser } from "./work-browser";

/** Homepage teaser: a capped preview of Work that links out to the
 * dedicated /work page instead of expanding in place — the pinned/scrubbed
 * section it lives in is `overflow-hidden`, so it can't safely grow. */
export function WorkListPanel() {
  return <WorkBrowser limit={3} moreHref="/work" />;
}
