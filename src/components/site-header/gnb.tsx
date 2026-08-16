"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Logo } from "@/components/logo";
import { NAV_ITEMS, resolveNavHref } from "@/lib/nav-items";
import { useGnbTheme } from "./gnb-theme";
import { useLocale } from "./locale-context";
import { SchemeToggle } from "./scheme-toggle";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative flex h-3.5 w-4.5 flex-col justify-between">
      <span
        className={clsx(
          "h-[1.5px] w-full origin-center bg-current transition-transform duration-300",
          open && "translate-y-[6px] rotate-45"
        )}
      />
      <span
        className={clsx(
          "h-[1.5px] w-full bg-current transition-opacity duration-200",
          open && "opacity-0"
        )}
      />
      <span
        className={clsx(
          "h-[1.5px] w-full origin-center bg-current transition-transform duration-300",
          open && "-translate-y-[6px] -rotate-45"
        )}
      />
    </span>
  );
}

export function Gnb() {
  const { theme } = useGnbTheme();
  const { locale } = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const isLight = theme === "light";

  useEffect(() => {
    if (!open) return;

    function onClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-4">
      <div
        className={clsx(
          "pointer-events-auto flex w-full items-center justify-between rounded-2xl px-4 shadow-lg transition-colors duration-500 md:w-[800px] md:px-6",
          "h-16 md:h-20",
          isLight ? "bg-charcoal text-paper" : "bg-paper text-charcoal"
        )}
      >
        <Logo tone={isLight ? "paper" : "ink"} size="small" />

        <div className="flex items-center gap-1">
          <SchemeToggle
            className={isLight ? "hover:bg-white/10" : "hover:bg-black/5"}
          />

          <button
            ref={triggerRef}
            type="button"
            aria-expanded={open}
            aria-label={
              locale === "ko"
                ? open
                  ? "메뉴 닫기"
                  : "메뉴 열기"
                : open
                  ? "Close menu"
                  : "Open menu"
            }
            onClick={() => setOpen((v) => !v)}
            className={clsx(
              "flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-300 md:h-11 md:w-11",
              isLight ? "hover:bg-white/10" : "hover:bg-black/5"
            )}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      <div
        ref={panelRef}
        className={clsx(
          "absolute right-3 top-[4.75rem] w-[min(90vw,320px)] origin-top-right overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 md:right-[calc(50%-400px+1.5rem)] md:top-24",
          isLight ? "bg-charcoal text-paper" : "bg-paper text-charcoal",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0"
        )}
      >
        <nav className="flex flex-col py-2">
          {NAV_ITEMS.map((item, i) => (
            <a
              key={item.href}
              href={resolveNavHref(item.href, pathname)}
              onClick={() => setOpen(false)}
              className={clsx(
                "px-6 py-3.5 font-display text-xl italic tracking-tight transition-colors",
                isLight ? "hover:bg-white/10" : "hover:bg-black/5",
                i !== 0 && (isLight ? "border-t border-white/10" : "border-t border-black/10")
              )}
            >
              {item.label}
            </a>
          ))}
          <a
            href="https://recoveryprotocel.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className={clsx(
              "flex items-center gap-2.5 px-6 py-3.5 font-display text-xl italic tracking-tight text-red-500 transition-colors",
              isLight ? "hover:bg-red-500/10 border-t border-white/10" : "hover:bg-red-500/10 border-t border-black/10"
            )}
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            {locale === "ko" ? "게임 플레이하기" : "Play the Game"}
          </a>
        </nav>
      </div>
    </header>
  );
}
