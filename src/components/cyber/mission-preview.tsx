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
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true">
      <button type="button" aria-label={COPY.close[locale]} onClick={onClose} className="absolute inset-0 bg-ink/80 backdrop-blur-sm" />
      <div className="preview-in brackets relative max-h-[88svh] w-full max-w-lg overflow-y-auto border border-neon/40 bg-[#070b14] sm:mx-4">
        <div className="relative aspect-[16/10] overflow-hidden">
          <MissionCover project={project} className="h-full w-full" />
          <div className="absolute left-3 top-3 flex gap-2">
            <Chip tone={ok ? "neon" : "alert"} className="bg-ink/80">
              ● {ok ? COPY.restored[locale] : COPY.infected[locale]}
            </Chip>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={COPY.close[locale]}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center border border-white/20 bg-ink/80 font-mono text-white/70"
          >
            ✕
          </button>
        </div>
        <div className="p-5">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon">
            MSN-{num} <span className="text-white/40">{"//"} {project.year ?? project.stage?.en ?? "Field op"}</span>
          </div>
          <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-paper">{project.title[locale]}</h3>
          <p className="mt-1 text-sm text-white/50">{project.category[locale]}</p>
          {project.description && (
            <p className="mt-4 line-clamp-5 text-[14px] leading-relaxed text-white/65">{project.description[locale]}</p>
          )}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {(project.tags ?? []).map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
          <Link prefetch={false}
            href={`/work/${project.index}`}
            className="ko-safe mt-6 flex items-center justify-center gap-3 bg-neon px-5 py-4 font-mono text-xs uppercase tracking-[0.25em] text-ink"
          >
            {COPY.go[locale]} ▶
          </Link>
        </div>
      </div>
    </div>,
    document.body
  );
}
