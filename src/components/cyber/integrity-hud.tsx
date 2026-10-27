"use client";

import Link from "next/link";
import clsx from "clsx";
import { VISIBLE_WORK_PROJECTS } from "@/lib/work-content";
import { useRestored } from "@/lib/mission-progress";
import { useLocale } from "@/components/site-header/locale-context";
import { usePastHero } from "@/lib/use-past-hero";

const COPY = {
  label: { ko: "세계 복구율", en: "World integrity" },
  sectors: { ko: "섹터 복구", en: "sectors restored" },
  saved: { ko: "세계 구출 완료", en: "World saved" },
};

/** Persistent game meter, bottom-left. Each project page opened restores
 * one sector — the meter is the visitor's progress through the portfolio. */
export function IntegrityHud() {
  const { locale } = useLocale();
  const restored = useRestored();
  const total = VISIBLE_WORK_PROJECTS.length;
  const count = VISIBLE_WORK_PROJECTS.filter((p) => restored.includes(p.index)).length;
  const pct = Math.round((count / total) * 100);
  const saved = count === total;
  const show = usePastHero();

  return (
    <Link
      href="/#missions"
      aria-label={`${COPY.label[locale]} ${pct}%`}
      className={clsx(
        "ko-safe notch-sm group fixed bottom-4 left-4 z-40 w-[150px] border bg-ink/80 px-3 py-2.5 font-mono backdrop-blur-md transition-colors md:bottom-8 md:left-8 md:w-[200px]",
        saved ? "border-acid/60" : "border-neon/30 hover:border-neon",
        show ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-white/50 md:text-[10px]">
        <span>{saved ? COPY.saved[locale] : COPY.label[locale]}</span>
        <span className={saved ? "text-acid" : "text-neon"}>{pct}%</span>
      </div>
      <div className="mt-2 flex gap-[2px]">
        {VISIBLE_WORK_PROJECTS.map((p) => (
          <span
            key={p.index}
            className={clsx(
              "h-2 flex-1 transition-colors duration-500",
              restored.includes(p.index)
                ? saved
                  ? "bg-acid shadow-[0_0_6px_var(--acid)]"
                  : "bg-neon shadow-[0_0_6px_var(--neon)]"
                : "bg-alert/35"
            )}
          />
        ))}
      </div>
      <div className="mt-1.5 hidden text-[9px] tracking-wider text-white/35 md:block">
        {count}/{total} {COPY.sectors[locale]}
      </div>
    </Link>
  );
}
