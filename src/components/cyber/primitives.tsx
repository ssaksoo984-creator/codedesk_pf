"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

/** Adds data-reveal="in" to every [data-reveal] descendant as it scrolls
 * into view — one observer per subtree instead of one per element. */
export function useRevealChildren<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.reveal = "in";
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal='in'])").forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
  return ref;
}

/** "[02] // MISSIONS" style section heading with a trailing rule. */
export function SectionHeader({
  index,
  label,
  title,
  className,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("mb-10 md:mb-16", className)}>
      <div data-reveal className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-neon">
        <span>[{index}]</span>
        <span className="text-white/40">{"//"}</span>
        <span>{label}</span>
        <span className="h-px flex-1 bg-gradient-to-r from-neon/40 to-transparent" />
      </div>
      <h2
        data-reveal
        className="mt-5 font-display text-4xl font-semibold uppercase leading-[0.95] tracking-tight text-paper md:text-7xl"
      >
        {title}
      </h2>
    </div>
  );
}

/** Small mono pill used for tags/status readouts. */
export function Chip({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "neon" | "magenta" | "alert" | "acid";
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "ko-safe inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[10px] uppercase leading-none tracking-widest",
        tone === "neutral" && "border-white/15 text-white/55",
        tone === "neon" && "border-neon/50 text-neon",
        tone === "magenta" && "border-magenta/50 text-magenta",
        tone === "alert" && "border-alert/50 text-alert",
        tone === "acid" && "border-acid/50 text-acid",
        className
      )}
    >
      {children}
    </span>
  );
}
