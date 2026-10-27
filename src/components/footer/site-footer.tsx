"use client";

import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { NAV_ITEMS, resolveNavHref } from "@/lib/nav-items";
import { useLocale } from "@/components/site-header/locale-context";
import { CONTACT_EMAIL } from "@/components/work/contact-actions";

const TAGLINE = {
  ko: "아이디어를 실제로 작동하는 제품으로. 디자인과 코드를 함께 만듭니다.",
  en: "Turning ideas into products that actually work — design and code, together.",
};

export function SiteFooter() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-neon/20 bg-ink/70 backdrop-blur-sm">
      <div className="overflow-hidden border-b border-white/5 py-3">
        <div className="marquee flex w-max gap-10 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.3em] text-neon/40">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex gap-10">
              <span>{"//"} Recovery protocol online</span>
              <span>Design × Code</span>
              <span>Seoul ⇄ Vancouver</span>
              <span>All sectors monitored</span>
              <span>Signal strong</span>
              <span>{"//"} End of transmission</span>
            </span>
          ))}
        </div>
      </div>

      <div className="wrap flex flex-col gap-10 py-14 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo className="mb-4" />
          <p className="max-w-xs text-sm leading-relaxed text-white/50">{TAGLINE[locale]}</p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-2">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={resolveNavHref(item.href, pathname)}
              className="font-mono text-xs uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-neon"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-mono text-sm text-white/60 transition-colors hover:text-neon"
        >
          {CONTACT_EMAIL}
        </a>
      </div>

      <div className="wrap flex flex-col gap-2 border-t border-white/5 py-6 pb-24 font-mono text-[10px] uppercase tracking-widest text-white/30 md:flex-row md:items-center md:justify-between md:pb-6">
        <span>© {year} {"{Code} · Desk"} — all rights reserved</span>
        <span>Seoul, South Korea · 37.5665° N 126.9780° E</span>
      </div>
    </footer>
  );
}
