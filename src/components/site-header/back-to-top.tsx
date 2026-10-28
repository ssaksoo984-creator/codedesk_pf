"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { useLocale } from "./locale-context";

/** Fixed bottom-right "TOP" control, shown once the visitor is a screen in. */
export function BackToTop() {
  const { locale } = useLocale();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={locale === "ko" ? "맨 위로 이동" : "Back to top"}
      className={clsx(
        "notch-sm fixed bottom-3 right-3 z-40 flex h-11 w-11 flex-col items-center justify-center gap-0.5 border border-neon/40 bg-ink/80 font-mono text-[9px] tracking-widest text-neon backdrop-blur-md transition-all duration-300 hover:bg-neon hover:text-ink md:bottom-8 md:right-8 md:h-14 md:w-14",
        visible ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
      TOP
    </button>
  );
}
