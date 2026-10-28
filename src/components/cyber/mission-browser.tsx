"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { VISIBLE_WORK_PROJECTS, type WorkProject } from "@/lib/work-content";
import { useRestored } from "@/lib/mission-progress";
import { useLocale } from "@/components/site-header/locale-context";
import { Chip, useRevealChildren } from "./primitives";
import { MissionPreview, useTapPreview } from "./mission-preview";

const FILTERS = ["All", "Built by Me", "Brand & Identity", "Public", "Business", "Systems & Tools"] as const;
type Filter = (typeof FILTERS)[number];

const COPY = {
  enter: { ko: "미션 진입", en: "Enter mission" },
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

function MissionCard({ project, featured, onTap }: { project: WorkProject; featured?: boolean; onTap?: (e: React.MouseEvent) => void }) {
  const { locale } = useLocale();
  const restored = useRestored().includes(project.index);
  const num = missionNumber(project);

  return (
    <Link
      href={`/work/${project.index}`}
      data-reveal
      onClick={onTap}
      className={clsx(
        "group relative flex flex-col border border-white/10 bg-ink/70 backdrop-blur-sm transition-colors duration-300 hover:border-neon/60",
        featured && "md:col-span-2 md:grid md:grid-cols-[1.25fr_1fr]"
      )}
    >
      <div className={clsx("relative overflow-hidden", featured ? "aspect-[16/10] md:aspect-auto md:h-full" : "aspect-[16/10]")}>
        <MissionCover
          project={project}
          className="rgb-hover h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {project.video && (
          <video
            src={project.video}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            ref={(el) => {
              const card = el?.closest("a");
              if (!el || !card || card.dataset.videoBound) return;
              card.dataset.videoBound = "1";
              card.addEventListener("mouseenter", () => el.play().catch(() => {}));
              card.addEventListener("mouseleave", () => el.pause());
            }}
          />
        )}
        {project.video && (
          <span className="ko-safe pointer-events-none absolute bottom-3 left-3 border border-white/20 bg-ink/70 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white/70 transition-opacity group-hover:opacity-0">
            ▶ Film
          </span>
        )}
        <div className="scanlines pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/60 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          <Chip tone={restored ? "neon" : "alert"} className="bg-ink/80">
            ● {restored ? COPY.restored[locale] : COPY.infected[locale]}
          </Chip>
          {project.isNew && (
            <Chip tone="acid" className="bg-ink/80">
              New
            </Chip>
          )}
        </div>
        <span className="absolute bottom-3 right-4 font-display text-6xl font-bold leading-none text-white/10 transition-colors group-hover:text-neon/30 md:text-7xl">
          {num}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-7">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
          <span className="text-neon">MSN-{num}</span>
          <span>{"//"}</span>
          <span className="truncate">{project.year ?? project.stage?.en ?? "Field op"}</span>
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-paper transition-colors group-hover:text-neon md:text-3xl">
          {project.title[locale]}
        </h3>
        <p className="mt-2 text-sm text-white/50">{project.category[locale]}</p>
        {featured && project.description && (
          <p className="mt-5 line-clamp-4 text-[15px] leading-relaxed text-white/60">{project.description[locale]}</p>
        )}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {(project.tags ?? []).map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
        <div className="ko-safe mt-auto flex items-center justify-between pt-6 font-mono text-xs uppercase tracking-[0.2em]">
          <span className="text-white/40 transition-colors group-hover:text-neon">{COPY.enter[locale]}</span>
          <span className="flex h-9 w-9 items-center justify-center border border-white/15 text-white/50 transition-all group-hover:border-neon group-hover:bg-neon group-hover:text-ink">
            ▶
          </span>
        </div>
      </div>
    </Link>
  );
}

/** Mission grid with category filters. The first card is promoted to a
 * wide "featured" slot when no filter is applied. */
export function MissionBrowser({ limit, showArchiveLink }: { limit?: number; showArchiveLink?: boolean }) {
  const { locale } = useLocale();
  const [filter, setFilter] = useState<Filter>("All");
  const ref = useRevealChildren<HTMLDivElement>();
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

      <div key={filter} className="grid gap-5 md:grid-cols-2 md:gap-6">
        {list.map((p, i) => (
          <MissionCard key={p.index} project={p} featured={filter === "All" && i === 0} onTap={intercept(p)} />
        ))}
      </div>

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
