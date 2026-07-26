"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { useLocale } from "./locale-context";

type Scheme = "sun" | "moon";

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2.5M12 19v2.5M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2.5 12H5M19 12h2.5M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z" />
    </svg>
  );
}

export function SchemeToggle({ className }: { className?: string }) {
  const { locale } = useLocale();
  // The blocking script in <head> already applies data-scheme before
  // hydration, so read it back here instead of setting state in an effect.
  const [scheme, setScheme] = useState<Scheme>(() =>
    typeof document !== "undefined" && document.documentElement.dataset.scheme === "moon"
      ? "moon"
      : "sun"
  );

  useEffect(() => {
    document.documentElement.dataset.scheme = scheme;
    window.localStorage.setItem("scheme", scheme);
  }, [scheme]);

  const label =
    scheme === "sun"
      ? locale === "ko"
        ? "다크 모드로 전환"
        : "Switch to dark mode"
      : locale === "ko"
        ? "라이트 모드로 전환"
        : "Switch to light mode";

  return (
    <button
      type="button"
      onClick={() => setScheme((s) => (s === "sun" ? "moon" : "sun"))}
      aria-label={label}
      suppressHydrationWarning
      className={clsx(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 md:h-11 md:w-11",
        className
      )}
    >
      {scheme === "sun" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
