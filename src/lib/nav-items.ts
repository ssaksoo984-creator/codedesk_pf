export interface NavItem {
  label: string;
  href: string;
}

// Section labels stay English in every locale — same convention as the
// "About"/"Work"/"Service"/"Contact" section headers themselves.
export const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Service", href: "#service" },
  { label: "Thought", href: "/thought" },
  { label: "Contact", href: "#contact" },
];
