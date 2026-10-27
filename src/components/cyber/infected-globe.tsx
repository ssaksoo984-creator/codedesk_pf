"use client";

import clsx from "clsx";
import { useLocale } from "@/components/site-header/locale-context";
import { VISIBLE_WORK_PROJECTS } from "@/lib/work-content";
import { useRestored } from "@/lib/mission-progress";

/** Hologram globe whose infection fades as sectors get restored: the red
 * art is progressively hue-shifted toward cyan, and a radar sweep plus a
 * live percentage sit over it. */
export function InfectedGlobe() {
  const { locale } = useLocale();
  const restored = useRestored();
  const total = VISIBLE_WORK_PROJECTS.length;
  const count = VISIBLE_WORK_PROJECTS.filter((p) => restored.includes(p.index)).length;
  const k = count / total;
  const saved = count === total;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[280px]">
      <div className="globe-bob absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/fx/globe.webp"
          alt=""
          className="h-full w-full object-contain transition-[filter] duration-700"
          style={{ filter: `hue-rotate(${k * 170}deg) saturate(${1 + k * 0.3}) drop-shadow(0 0 24px rgba(${saved ? "0,240,255" : "255,51,85"},0.35))` }}
        />
        <div className="radar pointer-events-none absolute inset-[12%] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_300deg,rgba(0,240,255,0.35)_360deg)] mix-blend-screen" />
      </div>
      <div className="ko-safe absolute inset-x-0 -bottom-2 text-center font-mono text-[10px] uppercase tracking-[0.3em]">
        <span className={clsx(saved ? "text-acid" : k > 0 ? "text-neon" : "text-alert")}>
          {saved ? (locale === "ko" ? "세계 구출 완료" : "World saved") : `${locale === "ko" ? "감염도" : "Infection"} ${Math.round((1 - k) * 100)}%`}
        </span>
      </div>
    </div>
  );
}
