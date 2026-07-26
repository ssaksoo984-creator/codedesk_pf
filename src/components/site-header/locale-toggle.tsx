"use client";

import clsx from "clsx";
import { useGnbTheme } from "./gnb-theme";
import { useLocale } from "./locale-context";

function GlobeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.4 2.5 3.7 5.8 3.7 9s-1.3 6.5-3.7 9c-2.4-2.5-3.7-5.8-3.7-9S9.6 5.5 12 3Z" />
    </svg>
  );
}

/**
 * Fixed language toggle, stacked directly above BackToTop with the exact
 * same size/position/color logic so the two read as one button group.
 */
export function LocaleToggle() {
  const { theme } = useGnbTheme();
  const { locale, toggleLocale } = useLocale();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={locale === "ko" ? "Switch to English" : "한국어로 전환"}
      className={clsx(
        "fixed bottom-20 right-5 z-40 flex h-12 w-12 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] font-semibold tracking-wide shadow-lg transition-colors duration-500 md:bottom-[104px] md:right-8 md:h-14 md:w-14 md:text-[11px]",
        isLight ? "bg-charcoal text-paper" : "bg-paper text-charcoal"
      )}
    >
      <GlobeIcon />
      {locale === "ko" ? "EN" : "한글"}
    </button>
  );
}
