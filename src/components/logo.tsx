import Link from "next/link";
import clsx from "clsx";

interface LogoProps {
  className?: string;
  tone?: "ink" | "paper";
  size?: "default" | "small";
}

export function Logo({ className, tone = "ink", size = "default" }: LogoProps) {
  const color = tone === "ink" ? "text-ink" : "text-paper";
  const fontSize = size === "small" ? "text-lg" : "text-xl md:text-2xl";

  return (
    <Link
      href="/"
      aria-label="{Code} · Desk 홈으로 이동"
      className={clsx(
        "inline-flex items-baseline gap-[0.05em] font-semibold tracking-tight select-none",
        fontSize,
        color,
        className
      )}
    >
      <span className="font-display font-normal">{"{"}</span>
      <span className="font-sans font-semibold">Code</span>
      <span className="font-display font-normal">{"}"}</span>
      <span className="font-sans font-semibold px-[0.15em]">·</span>
      <span className="font-display italic font-medium">Desk</span>
    </Link>
  );
}
