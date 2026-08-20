"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

interface LogoProps {
  className?: string;
  tone?: "ink" | "paper";
  size?: "default" | "small";
}

export function Logo({ className, tone = "ink", size = "default" }: LogoProps) {
  const pathname = usePathname();
  const color = tone === "ink" ? "text-ink" : "text-paper";
  const fontSize = size === "small" ? "text-lg" : "text-xl md:text-2xl";
  const classes = clsx(
    "inline-flex items-baseline gap-[0.05em] font-semibold tracking-tight select-none",
    fontSize,
    color,
    className
  );

  const mark = (
    <>
      <span className="font-display font-normal">{"{"}</span>
      <span className="font-sans font-semibold">Code</span>
      <span className="font-display font-normal">{"}"}</span>
      <span className="font-sans font-semibold px-[0.15em]">·</span>
      <span className="font-display italic font-medium">Desk</span>
    </>
  );

  // On the home page itself there's nowhere to "navigate" to — scroll back
  // up to the hero instead. Anywhere else (e.g. /work), it's still a real
  // link back home, since there's no local top to return to.
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
