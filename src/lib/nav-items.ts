export interface NavItem {
  label: string;
  href: string;
}

// Section labels stay English in every locale — same convention as the
// "About"/"Work"/"Service"/"Contact" section headers themselves.
export const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Work", href: "/work" },
  { label: "Service", href: "#service" },
  // Thought removed for portfolio — keep navigation concise
  { label: "Contact", href: "#contact" },
];

/** Section anchors ("#about") only resolve on the homepage — from any other
 * route they need to point back at "/" first, or the browser just appends
 * the hash to the current path and never scrolls anywhere. */
export function resolveNavHref(href: string, pathname: string): string {
  if (!href.startsWith("#")) return href;
  return pathname === "/" ? href : `/${href}`;
}
