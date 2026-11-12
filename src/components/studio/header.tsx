import Link from "next/link";

const NAV = [
  { href: "/#work", label: "Work" },
  { href: "/#studio", label: "Studio" },
  { href: "/#contact", label: "Contact" },
];

/** Sits on top of the page rather than fixed, so the first screen and the
 * case pages scroll freely underneath nothing. */
export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="wrap flex items-baseline justify-between gap-6 pt-5 text-[16px] md:pt-7">
        <Link href="/" className="font-medium tracking-[-0.02em]">
          CodeDesk Studio
        </Link>
        <nav aria-label="Main">
          <ul className="flex gap-5 md:gap-8">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link no-underline hover:underline">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
