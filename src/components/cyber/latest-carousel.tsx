"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { VISIBLE_WORK_PROJECTS, type WorkProject } from "@/lib/work-content";
import { useRestored } from "@/lib/mission-progress";
import { useLocale } from "@/components/site-header/locale-context";
import { Chip } from "./primitives";
import { MissionCover, missionNumber } from "./mission-browser";
import { MissionPreview, useTapPreview } from "./mission-preview";

const COPY = {
  latest: { ko: "최신 미션", en: "Latest missions" },
  more: { ko: "더보기", en: "View all missions" },
  restored: { ko: "복구 완료", en: "Restored" },
  infected: { ko: "감염됨", en: "Infected" },
  prev: { ko: "이전", en: "Previous" },
  next: { ko: "다음", en: "Next" },
};

/** Card that leans toward the pointer — a light 3D tilt with a moving
 * glare, driven by CSS variables so React never re-renders on move. */
function TiltCard({ project, onTap }: { project: WorkProject; onTap: (e: React.MouseEvent) => void }) {
  const { locale } = useLocale();
  const restored = useRestored().includes(project.index);
  const num = missionNumber(project);
  const ref = useRef<HTMLAnchorElement>(null);

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", `${(0.5 - y) * 12}deg`);
    el.style.setProperty("--ry", `${(x - 0.5) * 14}deg`);
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };
  const leave = () => {
    const el = ref.current!;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <Link
      ref={ref}
      href={`/work/${project.index}`}
      onClick={onTap}
      onPointerMove={move}
      onPointerLeave={leave}
      className="tilt-card group relative flex h-full flex-col border border-white/10 bg-ink/80 backdrop-blur-sm hover:border-neon/60"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <MissionCover project={project} className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent" />
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
        <span className="tilt-pop absolute bottom-3 right-4 font-display text-6xl font-bold leading-none text-white/15 group-hover:text-neon/50">
          {num}
        </span>
      </div>
      <div className="tilt-pop flex flex-1 flex-col p-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon">
          MSN-{num} <span className="text-white/40">{"//"} {project.year ?? project.stage?.en ?? "Field op"}</span>
        </div>
        <h3 className="mt-2 font-display text-xl font-semibold leading-tight text-paper transition-colors group-hover:text-neon md:text-2xl">
          {project.title[locale]}
        </h3>
        <p className="mt-1.5 text-sm text-white/50">{project.category[locale]}</p>
        <span className="mt-auto flex justify-end pt-5">
          <span className="flex h-9 w-9 items-center justify-center border border-white/15 font-mono text-xs text-white/50 transition-all group-hover:border-neon group-hover:bg-neon group-hover:text-ink">
            ▶
          </span>
        </span>
      </div>
      <span className="tilt-glare pointer-events-none absolute inset-0" aria-hidden />
    </Link>
  );
}

/** Home page shows only the three newest missions as a swipeable 3D card
 * carousel; the rest live in the /work archive behind "View all". */
export function LatestCarousel({ count = 3 }: { count?: number }) {
  const { locale } = useLocale();
  const list = VISIBLE_WORK_PROJECTS.slice(0, count);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { preview, intercept, close } = useTapPreview();

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => {
      const card = el.firstElementChild as HTMLElement | null;
      if (!card) return;
      setActive(Math.round(el.scrollLeft / (card.offsetWidth + 20)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const go = (i: number) => {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: "smooth" });
  };

  return (
    <div data-reveal>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="ko-safe font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">
          <span className="text-acid">●</span> {COPY.latest[locale]} <span className="text-white/25">[{list.length}]</span>
        </div>
        <div className="flex gap-2 lg:hidden">
          {(["prev", "next"] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-label={COPY[d][locale]}
              onClick={() => go(Math.max(0, Math.min(list.length - 1, active + (d === "next" ? 1 : -1))))}
              className="flex h-9 w-9 items-center justify-center border border-white/15 font-mono text-white/60 hover:border-neon hover:text-neon"
            >
              {d === "prev" ? "←" : "→"}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={track}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 py-4 [perspective:1200px] lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0"
      >
        {list.map((p) => (
          <div key={p.index} className="w-[82%] shrink-0 snap-start sm:w-[48%] lg:w-auto">
            <TiltCard project={p} onTap={intercept(p)} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2 lg:hidden">
        {list.map((p, i) => (
          <button
            key={p.index}
            type="button"
            aria-label={`${i + 1}`}
            onClick={() => go(i)}
            className={clsx("h-1.5 transition-all", i === active ? "w-8 bg-neon" : "w-3 bg-white/20")}
          />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/work"
          className="ko-safe notch-sm inline-flex items-center gap-3 border border-neon/50 px-8 py-4 font-mono text-xs uppercase tracking-[0.25em] text-neon transition-colors hover:bg-neon hover:text-ink"
        >
          + {COPY.more[locale]} <span className="text-white/40">[{VISIBLE_WORK_PROJECTS.length}]</span> →
        </Link>
      </div>

      <MissionPreview project={preview} onClose={close} />
    </div>
  );
}
