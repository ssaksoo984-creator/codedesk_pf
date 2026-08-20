import { WorkBrowser } from "./work-browser";

/** Homepage teaser: a capped preview of Work that links out to the
 * dedicated /work page instead of expanding in place. Lives in normal page
 * flow (not a pinned/overflow-hidden viewport), so it grows naturally. */
export function WorkListPanel() {
  return <WorkBrowser limit={3} moreHref="/work" constrained={false} />;
}
