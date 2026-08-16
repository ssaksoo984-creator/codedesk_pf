"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { useLocale } from "@/components/site-header/locale-context";

const GAME_URL = "https://recoveryprotocel.vercel.app/";

const COPY = {
  label: { ko: "AI 감염 경보", en: "AI breach alert" },
  tooltip: {
    ko: "세상을 구하고, 그 안에서 이력서와 Field Note를 확인하세요",
    en: "Save the world — and find the résumé & field note hidden inside",
  },
};

/** Desktop-only (lg+, clear of the centered GNB pill): surfaces once the
 * hero ("#top") scrolls out of view, so it never competes with the teaser
 * already playing inside the hero itself. `top-[34px]` centers the 44px
 * badge on the GNB pill's own vertical center at that breakpoint (16px
 * header padding + half of the pill's 80px height) — same row as the nav,
 * not just the same top offset, since the pill is taller than the badge.
 * The red ring pings once on arrival, then only again on hover — a
 * constant idle pulse read as distracting against the rest of the page.
 * Mobile gets its own nav-menu entry instead (see Gnb). */
export function GameAlertBadge() {
  const { locale } = useLocale();
  const [visible, setVisible] = useState(false);
  const [announce, setAnnounce] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    let pingTimeout: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const nowVisible = !entry.isIntersecting;
        setVisible(nowVisible);
        if (nowVisible) {
          setAnnounce(true);
          pingTimeout = setTimeout(() => setAnnounce(false), 1000);
        }
      },
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => {
      observer.disconnect();
      if (pingTimeout) clearTimeout(pingTimeout);
    };
  }, []);

  return (
    <a
      href={GAME_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={COPY.label[locale]}
      className={clsx(
        "group fixed right-6 top-[34px] z-40 hidden h-11 w-11 items-center justify-center rounded-full border border-red-500/60 bg-ink text-red-400 shadow-[0_0_18px_rgba(220,38,38,0.4)] transition-all duration-300 lg:flex",
        visible ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      )}
    >
      {announce && (
        <span
          className="absolute inset-0 -z-10 animate-ping-once rounded-full bg-red-500/30"
          aria-hidden
        />
      )}
      <span
        className="absolute inset-0 -z-10 scale-0 rounded-full bg-red-500/30 opacity-0 transition-transform duration-200 group-hover:scale-100 group-hover:animate-ping group-hover:opacity-100"
        aria-hidden
      />
      <span className="text-base leading-none">⚠</span>

      <span className="pointer-events-none absolute right-0 top-full mt-2 w-56 origin-top-right scale-95 rounded-xl border border-red-500/30 bg-ink px-3 py-2.5 text-xs leading-relaxed text-paper opacity-0 shadow-xl transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
        {COPY.tooltip[locale]}
      </span>
    </a>
  );
}
