"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useLocale } from "@/components/site-header/locale-context";

const LINKS = [
  { href: "/work", label: { ko: "작업", en: "Work" } },
  { href: "/#about", label: { ko: "소개", en: "About" } },
  { href: "/#contact", label: { ko: "연락", en: "Contact" } },
];

const COPY = {
  talk: { ko: "같이 일해요", en: "Let’s talk" },
  menu: { ko: "메뉴", en: "Menu" },
  close: { ko: "닫기", en: "Close" },
};

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={clsx("inline-flex items-baseline font-bold tracking-[-0.03em]", className)}>
      <span className="text-accent">{"{"}</span>Code<span className="text-accent">{"}"}</span>
      <span className="mx-1 text-stone">·</span>Desk
    </span>
  );
}

/** Two floating pills (logo + links, language + CTA), Butter-style. Hides on
 * scroll down, comes back on scroll up. */
export function Nav() {
  const { locale, toggleLocale } = useLocale();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 160 && y > last + 4 ? true : y < last - 4 ? false : (h) => h);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const pill = "rounded-full bg-[#ebe9e2]/95 text-ink shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_30px_-12px_rgba(0,0,0,0.25)]";

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 transition-transform duration-500 [transition-timing-function:var(--ease)]",
        hidden && !open ? "-translate-y-[120%]" : "translate-y-0"
      )}
    >
      <div className="wrap flex items-center justify-between gap-3 pt-4 md:pt-5">
        <div className={clsx(pill, "flex items-center gap-1 py-1.5 pl-5 pr-1.5")}>
          <Link href="/" className="mr-3 text-[17px]" aria-label="{Code} · Desk — home">
            <Wordmark />
          </Link>
          <nav className="hidden items-center md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  "rounded-full px-4 py-2 text-[15px] transition-colors hover:bg-black/[0.06]",
                  pathname.startsWith("/work") && l.href === "/work" && "bg-black/[0.07]"
                )}
              >
                {l.label[locale]}
              </Link>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="rounded-full px-4 py-2 text-[15px] md:hidden"
          >
            {open ? COPY.close[locale] : COPY.menu[locale]}
          </button>
        </div>

        <div className={clsx(pill, "flex items-center gap-1 p-1.5")}>
          <button
            type="button"
            onClick={toggleLocale}
            aria-label={locale === "en" ? "한국어로 보기" : "View in English"}
            className="rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors hover:bg-black/[0.06]"
          >
            <span className={locale === "en" ? "" : "text-stone"}>EN</span>
            <span className="mx-1.5 text-stone/60">/</span>
            <span className={locale === "ko" ? "" : "text-stone"}>KO</span>
          </button>
          <Link
            href="/#contact"
            className="hidden rounded-full bg-ink px-5 py-2 text-[15px] text-paper transition-colors hover:bg-accent sm:block"
          >
            {COPY.talk[locale]}
          </Link>
        </div>
      </div>

      {/* phone menu */}
      <div
        className={clsx(
          "wrap mt-2 transition-[opacity,transform] duration-300 md:hidden",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <nav className="flex flex-col rounded-3xl bg-[#ebe9e2] p-3 text-ink shadow-xl">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-4 text-2xl font-semibold tracking-tight">
              {l.label[locale]}
            </Link>
          ))}
          <Link href="/#contact" onClick={() => setOpen(false)} className="mt-1 rounded-2xl bg-ink px-4 py-4 text-center text-lg text-paper">
            {COPY.talk[locale]}
          </Link>
        </nav>
      </div>
    </header>
  );
}
