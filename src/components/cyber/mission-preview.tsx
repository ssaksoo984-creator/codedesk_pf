"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import type { WorkProject } from "@/lib/work-content";
import { useRestored } from "@/lib/mission-progress";
import { useLocale } from "@/components/site-header/locale-context";
import { Chip } from "./primitives";
import { MissionCover, missionNumber } from "./mission-browser";

const COPY = {
  go: { ko: "미션으로 이동하기", en: "Go to mission" },
  close: { ko: "닫기", en: "Close" },
  restored: { ko: "복구 완료", en: "Restored" },
  infected: { ko: "감염됨", en: "Infected" },
};

/** On touch screens a tap on a mission opens this preview first instead of
 * navigating straight away; the page is one more tap ("Go") away. Mouse
 * users keep the direct link. */
export function useTapPreview() {
  const [preview, setPreview] = useState<WorkProject | null>(null);
  const intercept = useCallback(
    (project: WorkProject) => (e: React.MouseEvent) => {
      if (!window.matchMedia("(hover: none)").matches) return;
      e.preventDefault();
      setPreview(project);
    },
    []
  );
  const close = useCallback(() => setPreview(null), []);
  return { preview, intercept, close };
}

export function MissionPreview({ project, onClose }: { project: WorkProject | null; onClose: () => void }) {
  const { locale } = useLocale();
  const restored = useRestored();

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  if (!project) return null;
  const ok = restored.includes(project.index);
  const num = missionNumber(project);

  // Portal to <body>: ancestors with transform/backdrop-filter would
  // otherwise turn `fixed` into "fixed to that box".
  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-stretch justify-center sm:items-center" role="dialog" aria-modal="true">
      <button type="button" aria-label={COPY.close[locale]} onClick={onClose} className="absolute inset-0 bg-ink/85" />
      {/* Phones: a full-screen sheet (content scrolls, "Go" stays pinned at
          the bottom). Larger screens: a centred card. */}
      <div className="preview-in brackets relative flex h-[100dvh] w-full flex-col border-neon/40 bg-[#070b14] sm:mx-4 sm:h-auto sm:max-h-[88svh] sm:max-w-lg sm:border">
        <div className="flex shrink-0 items-center justify-between border-b border-neon/20 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.25em]">
          <span className="text-neon">
            MSN-{num} <span className="text-white/40">{"//"} {project.year ?? project.stage?.en ?? "Field op"}</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={COPY.close[locale]}
            className="flex h-9 w-9 items-center justify-center border border-white/20 font-mono text-sm text-white/70 hover:border-neon hover:text-neon"
          >
            ✕
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="relative aspect-[16/10] overflow-hidden">
            <MissionCover project={project} className="h-full w-full" />
            <div className="absolute left-3 top-3 flex gap-2">
              <Chip tone={ok ? "neon" : "alert"} className="bg-ink/80">
                ● {ok ? COPY.restored[locale] : COPY.infected[locale]}
              </Chip>
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-display text-2xl font-semibold leading-tight text-paper">{project.title[locale]}</h3>
            <p className="mt-1 text-sm text-white/50">{project.category[locale]}</p>
            {project.description && (
              <p className="mt-4 text-[14px] leading-relaxed text-white/65">{project.description[locale]}</p>
            )}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {(project.tags ?? []).map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </div>
        </div>
        <div className="shrink-0 border-t border-neon/20 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Link
            prefetch={false}
            href={`/work/${project.index}`}
            className="ko-safe flex items-center justify-center gap-3 bg-neon px-5 py-4 font-mono text-xs uppercase tracking-[0.25em] text-ink"
          >
            {COPY.go[locale]} ▶
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
