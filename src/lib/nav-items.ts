export interface NavItem {
  label: string;
  href: string;
}

// Labels stay English in every locale — they read as HUD readouts.
export const NAV_ITEMS: NavItem[] = [
  { label: "Operator", href: "#operator" },
  { label: "Missions", href: "/work" },
  { label: "Contact", href: "#contact" },
];

export const GAME_URL = "https://recoveryprotocel.vercel.app/";

/** Section anchors ("#operator") only resolve on the homepage — from any
 * other route they need to point back at "/" first. */
export function resolveNavHref(href: string, pathname: string): string {
  if (!href.startsWith("#")) return href;
  return pathname === "/" ? href : `/${href}`;
}
