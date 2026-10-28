"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { VISIBLE_WORK_PROJECTS, type WorkProject } from "@/lib/work-content";
import { useRestored } from "@/lib/mission-progress";
import { useLocale } from "@/components/site-header/locale-context";
import { useRevealChildren } from "./primitives";
import { MissionPreview, useTapPreview } from "./mission-preview";

const FILTERS = ["All", "Built by Me", "Brand & Identity", "Public", "Business", "Systems & Tools"] as const;
type Filter = (typeof FILTERS)[number];

const COPY = {
  restored: { ko: "복구 완료", en: "Restored" },
  infected: { ko: "감염됨", en: "Infected" },
  noSignal: { ko: "이미지 수신 대기", en: "Awaiting visual feed" },
  archive: { ko: "전체 미션 아카이브", en: "Full mission archive" },
};

export function missionNumber(project: WorkProject) {
  const i = VISIBLE_WORK_PROJECTS.findIndex((p) => p.index === project.index);
  return String(i + 1).padStart(2, "0");
}

export function MissionCover({ project, className }: { project: WorkProject; className?: string }) {
  const { locale } = useLocale();
  const cover = project.cover ?? project.image;
  if (!cover) {
    return (
      <div className={clsx("relative flex items-center justify-center overflow-hidden bg-[#070b14]", className)}>
        <div className="scanlines absolute inset-0 opacity-80" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,43,214,0.06)_0_2px,transparent_2px_7px)]" />
        <div className="relative text-center font-mono">
          <div className="flicker font-display text-3xl font-bold tracking-widest text-magenta text-glow-magenta md:text-5xl">
            {project.title.en}
          </div>
          <div className="ko-safe mt-3 text-[10px] uppercase tracking-[0.3em] text-white/40">{COPY.noSignal[locale]}</div>
        </div>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={cover}
      alt={project.title[locale]}
      className={clsx("object-cover", project.coverFit === "contain" && "!object-contain", className)}
      style={project.coverBg ? { background: project.coverBg } : undefined}
      loading="lazy"
    />
  );
}

function MissionRow({
  project,
  onHover,
  onTap,
}: {
  project: WorkProject;
  onHover: (p: WorkProject | null) => void;
  onTap: (e: React.MouseEvent) => void;
}) {
  const { locale } = useLocale();
  const restored = useRestored().includes(project.index);
  const num = missionNumber(project);

  return (
    <Link
      href={`/work/${project.index}`}
      data-reveal
      onClick={onTap}
      onMouseEnter={() => onHover(project)}
      onMouseLeave={() => onHover(null)}
      className="group relative grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-4 border-t border-white/10 py-5 transition-colors hover:bg-neon/[0.04] md:grid-cols-[90px_minmax(0,1.6fr)_minmax(0,1fr)_120px_48px] md:gap-6 md:py-7"
    >
      <div className="relative aspect-[4/3] overflow-hidden border border-white/10 md:hidden">
        <MissionCover project={project} className="h-full w-full" />
      </div>
      <span className="hidden font-display text-4xl font-bold leading-none text-white/15 transition-colors group-hover:text-neon md:block">
        {num}
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em]">
          <span className="text-neon">MSN-{num}</span>
          <span className={restored ? "text-neon/70" : "text-alert/80"}>● {restored ? COPY.restored[locale] : COPY.infected[locale]}</span>
          {project.isNew && <span className="text-acid">New</span>}
        </div>
        <h3 className="mt-1.5 truncate font-display text-xl font-semibold leading-tight text-paper transition-[color,transform] duration-300 group-hover:text-neon md:text-4xl md:group-hover:translate-x-2">
          {project.title[locale]}
        </h3>
        <p className="mt-1 truncate text-xs text-white/45 md:hidden">{project.category[locale]}</p>
      </div>
      <p className="hidden text-sm text-white/50 md:block">{project.category[locale]}</p>
      <span className="hidden font-mono text-xs text-white/40 md:block">{project.year ?? project.stage?.en ?? "Field op"}</span>
      <span className="flex h-9 w-9 items-center justify-center justify-self-end border border-white/15 font-mono text-xs text-white/50 transition-all group-hover:border-neon group-hover:bg-neon group-hover:text-ink">
        ▶
      </span>
    </Link>
  );
}

/** Cursor-following thumbnail for the archive list (mouse only). Position
 * is written straight to the element to avoid re-rendering on every move. */
function HoverThumb({ project }: { project: WorkProject | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<WorkProject | null>(null);
  if (project && project !== shown) setShown(project);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !ref.current) return;
      ref.current.style.transform = `translate3d(${e.clientX + 28}px, ${e.clientY - 120}px, 0)`;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block" aria-hidden>
      <div
        className={clsx(
          "brackets w-[340px] overflow-hidden border border-neon/50 bg-ink shadow-[0_20px_60px_-20px_rgba(0,240,255,0.5)] transition-[opacity,transform] duration-300",
          project ? "scale-100 opacity-100" : "scale-90 opacity-0"
        )}
      >
        {shown && (
          <div className="relative aspect-[16/10]">
            <MissionCover project={shown} className="h-full w-full" />
            <div className="scanlines absolute inset-0 opacity-60" />
            {shown.video && project && (
              <video src={shown.video} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Mission archive: filterable list. Mouse users get a floating thumbnail
 * on hover; touch users get a preview popup before navigating. */
export function MissionBrowser({ limit, showArchiveLink }: { limit?: number; showArchiveLink?: boolean }) {
  const { locale } = useLocale();
  const [filter, setFilter] = useState<Filter>("All");
  const ref = useRevealChildren<HTMLDivElement>();
  const [hover, setHover] = useState<WorkProject | null>(null);
  const { preview, intercept, close } = useTapPreview();

  const list = useMemo(() => {
    const all = filter === "All" ? VISIBLE_WORK_PROJECTS : VISIBLE_WORK_PROJECTS.filter((p) => (p.tags ?? []).includes(filter));
    return limit ? all.slice(0, limit) : all;
  }, [filter, limit]);

  return (
    <div ref={ref}>
      <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        {FILTERS.map((f) => {
          const count = f === "All" ? VISIBLE_WORK_PROJECTS.length : VISIBLE_WORK_PROJECTS.filter((p) => (p.tags ?? []).includes(f)).length;
          if (count === 0) return null;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "shrink-0 border px-3.5 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors",
                filter === f ? "border-neon bg-neon text-ink" : "border-white/15 text-white/55 hover:border-neon/60 hover:text-neon"
              )}
            >
              {f} <span className="opacity-60">[{count}]</span>
            </button>
          );
        })}
      </div>

      <div key={filter} className="border-b border-white/10">
        {list.map((p) => (
          <MissionRow key={p.index} project={p} onHover={setHover} onTap={intercept(p)} />
        ))}
      </div>
      <HoverThumb project={hover} />
      <MissionPreview project={preview} onClose={close} />

      {showArchiveLink && (
        <div className="mt-12 flex justify-center">
          <Link
            href="/work"
            className="ko-safe notch-sm inline-flex items-center gap-3 border border-neon/50 px-7 py-4 font-mono text-xs uppercase tracking-[0.25em] text-neon transition-colors hover:bg-neon hover:text-ink"
          >
            {COPY.archive[locale]} →
          </Link>
        </div>
      )}
    </div>
  );
}
