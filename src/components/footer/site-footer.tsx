"use client";

import { Logo } from "@/components/logo";
import { NAV_ITEMS } from "@/lib/nav-items";
import { useLocale } from "@/components/site-header/locale-context";

const TAGLINE = {
  ko: "아이디어를 실제로 작동하는 제품으로. 디자인과 코드를 함께 만듭니다.",
  en: "Turning ideas into products that actually work. We build design and code together.",
};

export function SiteFooter() {
  const { locale } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="snap-section border-t border-ink/10 bg-paper">
      <div className="wrap flex flex-col gap-10 py-14 md:flex-row md:items-end md:justify-between md:py-16">
        <div>
          <Logo tone="ink" className="mb-4" />
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            {TAGLINE[locale]}
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-display text-lg italic text-ink transition-colors hover:text-muted"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="mailto:hello@codedesk.dev"
          className="text-sm text-muted transition-colors hover:text-ink"
        >
          hello@codedesk.dev
        </a>
      </div>

      <div className="wrap flex flex-col gap-2 border-t border-ink/10 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
        <span>© {year} {"{Code} · Desk"}. All rights reserved.</span>
        <span>Seoul, South Korea</span>
      </div>
    </footer>
  );
}
