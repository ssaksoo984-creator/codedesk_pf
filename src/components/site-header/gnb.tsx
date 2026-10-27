"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Logo } from "@/components/logo";
import { GAME_URL, NAV_ITEMS, resolveNavHref } from "@/lib/nav-items";
import { useLocale } from "./locale-context";

function useClock() {
  const [now, setNow] = useState<string>("--:--:--");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-GB", { hour12: false, timeZone: "Asia/Seoul" });
    const id = setInterval(() => setNow(fmt()), 1000);
    setTimeout(() => setNow(fmt()), 0);
    return () => clearInterval(id);
  }, []);
  return now;
}

function LocaleSwitch({ className }: { className?: string }) {
  const { locale, toggleLocale } = useLocale();
  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={locale === "ko" ? "Switch to English" : "한국어로 전환"}
      className={clsx(
        "flex h-9 items-center border border-white/15 font-mono text-[11px] tracking-widest transition-colors hover:border-neon",
        className
      )}
    >
      <span className={clsx("px-2.5", locale === "ko" ? "bg-neon text-ink" : "text-white/50")}>KO</span>
      <span className={clsx("px-2.5", locale === "en" ? "bg-neon text-ink" : "text-white/50")}>EN</span>
    </button>
  );
}

function GameLink({ className, onClick }: { className?: string; onClick?: () => void }) {
  return (
    <a
      href={GAME_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={clsx(
        "group relative inline-flex h-9 items-center gap-2 border border-alert/60 px-3 font-mono text-[11px] tracking-widest text-alert transition-colors hover:bg-alert hover:text-ink",
        className
      )}
    >
      <span className="relative flex h-2 w-2">
        <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-alert" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-alert group-hover:bg-ink" />
      </span>
      PLAY GAME
    </a>
  );
}

/** Top HUD bar: logo · numbered nav · Seoul clock · language · game link.
 * Collapses to a menu panel below md. */
export function Gnb() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const clock = useClock();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={clsx(
          "border-b transition-colors duration-300",
          scrolled || open ? "border-neon/20 bg-ink/80 backdrop-blur-md" : "border-transparent bg-transparent"
        )}
      >
        <div className="wrap flex h-16 items-center justify-between gap-4 md:h-[72px]">
          <Logo size="small" />

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_ITEMS.map((item, i) => (
              <a
                key={item.href}
                href={resolveNavHref(item.href, pathname)}
                className="group flex items-baseline gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-neon"
              >
                <span className="text-[10px] text-neon/60">0{i + 1}</span>
                <span className="relative">
                  {item.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-neon transition-all duration-300 group-hover:w-full" />
                </span>
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <span className="hidden font-mono text-[11px] tracking-widest text-white/40 xl:inline">
              SEL {clock}
            </span>
            <LocaleSwitch />
            <GameLink />
          </div>

          <button
            type="button"
            aria-expanded={open}
            aria-label={locale === "ko" ? (open ? "메뉴 닫기" : "메뉴 열기") : open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 items-center gap-2 border border-neon/40 px-3 font-mono text-[11px] tracking-widest text-neon lg:hidden"
          >
            {open ? "CLOSE" : "MENU"}
            <span className="flex flex-col gap-[3px]">
              <span className={clsx("h-px w-4 bg-neon transition-transform", open && "translate-y-[2px] rotate-45")} />
              <span className={clsx("h-px w-4 bg-neon transition-transform", open && "-translate-y-[2px] -rotate-45")} />
            </span>
          </button>
        </div>
      </div>

      <div
        ref={panelRef}
        className={clsx(
          "absolute inset-x-0 top-16 border-b border-neon/20 bg-ink/95 backdrop-blur-md transition-[clip-path] duration-300 md:top-[72px] lg:hidden",
          open ? "pointer-events-auto [clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]"
        )}
      >
        <nav className="wrap flex flex-col py-4">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.href}
              href={resolveNavHref(item.href, pathname)}
              onClick={() => setOpen(false)}
              className="flex items-baseline gap-3 border-b border-white/10 py-4 font-display text-3xl uppercase tracking-wide text-paper"
            >
              <span className="font-mono text-xs text-neon">0{i + 1}</span>
              {item.label}
            </a>
          ))}
          <div className="mt-5 flex items-center justify-between gap-3">
            <LocaleSwitch />
            <GameLink onClick={() => setOpen(false)} />
          </div>
        </nav>
      </div>
    </header>
  );
}
