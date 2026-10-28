"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface LogoProps {
  className?: string;
  size?: "default" | "small";
}

export function Logo({ className, size = "default" }: LogoProps) {
  const pathname = usePathname();
  const classes = clsx(
    "group inline-flex items-baseline font-display font-semibold uppercase tracking-wider text-paper select-none",
    size === "small" ? "text-base md:text-lg" : "text-xl md:text-2xl",
    className
  );

  const mark = (
    <>
      <span className="text-neon text-glow transition-colors group-hover:text-magenta">{"{"}</span>
      <span>Code</span>
      <span className="text-neon text-glow transition-colors group-hover:text-magenta">{"}"}</span>
      <span className="px-[0.2em] text-magenta">·</span>
      <span className="font-medium italic text-white/80">Desk</span>
    </>
  );

  // On the home page there's nowhere to navigate to — scroll to the top.
  if (pathname === "/") {
    return (
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="{Code} · Desk 맨 위로 이동"
        className={classes}
      >
        {mark}
      </button>
    );
  }

  return (
    <Link href="/" aria-label="{Code} · Desk 홈으로 이동" className={classes}>
      {mark}
    </Link>
  );
}
