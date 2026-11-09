"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { VISIBLE_WORK_PROJECTS, type WorkProject } from "@/lib/work-content";
import { PROJECT_MOTION } from "@/lib/project-media";
import { useLocale } from "@/components/site-header/locale-context";
import { useReveal } from "./reveal";

const FILTERS = ["All", "Built by Me", "Brand & Identity", "Public", "Business", "Systems & Tools"] as const;

const COPY = {
  eyebrow: { ko: "전체 작업", en: "Index" },
  title: { ko: "모든 프로젝트", en: "Every project" },
};

/** Floating preview that trails the pointer over the list (mouse only).
 * The video element is swapped by src, so only the hovered clip loads. */
function HoverPreview({ project }: { project: WorkProject | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<WorkProject | null>(null);
  if (project && project !== shown) setShown(project);

  useEffect(() => {
    const pos = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    const tick = () => {
      cur.x += (pos.x - cur.x) * 0.16;
      cur.y += (pos.y - cur.y) * 0.16;
      if (ref.current) ref.current.style.transform = `translate3d(${cur.x + 24}px, ${cur.y - 140}px, 0)`;
      raf = Math.abs(pos.x - cur.x) + Math.abs(pos.y - cur.y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  const m = shown ? PROJECT_MOTION[shown.index] : null;
  return (
    <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-40 hidden [@media(pointer:fine)]:block" aria-hidden>
      <div
        className={clsx(
          "aspect-[16/10] w-[400px] overflow-hidden rounded-[18px] bg-ink-2 shadow-2xl transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease)]",
          project ? "scale-100 opacity-100" : "scale-75 opacity-0"
        )}
      >
        {m && <video key={m.video} src={m.video} poster={m.poster} autoPlay muted loop playsInline className="h-full w-full object-cover" />}
      </div>
    </div>
  );
}

export function ProjectIndex({ withHeading = true }: { withHeading?: boolean }) {
  const { locale } = useLocale();
  const ref = useReveal<HTMLElement>();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [hover, setHover] = useState<WorkProject | null>(null);

  const list = useMemo(
    () => (filter === "All" ? VISIBLE_WORK_PROJECTS : VISIBLE_WORK_PROJECTS.filter((p) => (p.tags ?? []).includes(filter))),
    [filter]
  );

  return (
    <section ref={ref} className="bg-ink py-24 text-paper md:py-32">
      <div className="wrap">
        {withHeading && (
          <div className="mb-10 md:mb-14">
            <p data-reveal className="font-mono text-[12px] text-paper/45">
              ({String(VISIBLE_WORK_PROJECTS.length).padStart(2, "0")}) {COPY.eyebrow[locale]}
            </p>
            <h2 data-reveal className="display mt-4 text-[clamp(2.4rem,6vw,5.5rem)]">
              {COPY.title[locale]}
            </h2>
          </div>
        )}

        <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          {FILTERS.map((f) => {
            const n = f === "All" ? VISIBLE_WORK_PROJECTS.length : VISIBLE_WORK_PROJECTS.filter((p) => (p.tags ?? []).includes(f)).length;
            if (!n) return null;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={clsx(
                  "shrink-0 rounded-full border px-4 py-2 text-[13px] transition-colors",
                  filter === f ? "border-paper bg-paper text-ink" : "border-paper/15 text-paper/65 hover:border-paper/50"
                )}
              >
                {f} <span className="opacity-50">{n}</span>
              </button>
            );
          })}
        </div>

        <ul key={filter} className="border-b border-paper/10" onMouseLeave={() => setHover(null)}>
          {list.map((p) => {
            const m = PROJECT_MOTION[p.index];
            return (
              <li key={p.index} data-reveal>
                <Link
                  href={`/work/${p.index}`}
                  onMouseEnter={() => setHover(p)}
                  className="group grid grid-cols-[84px_minmax(0,1fr)_auto] items-center gap-4 border-t border-paper/10 py-4 md:grid-cols-[64px_minmax(0,1.3fr)_minmax(0,1fr)_140px_40px] md:gap-8 md:py-7"
                >
                  {/* phones: a small still in place of the hover preview */}
                  <span className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink-2 md:hidden">
                    {m && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.poster} alt="" loading="lazy" className="h-full w-full object-cover" />
                    )}
                  </span>
                  <span className="hidden font-mono text-[13px] text-paper/40 md:block">{p.index}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[clamp(1.25rem,2.6vw,2.6rem)] font-bold tracking-[-0.03em] transition-[color,transform] duration-500 [transition-timing-function:var(--ease)] group-hover:text-accent md:group-hover:translate-x-2">
                      {p.title[locale]}
                    </span>
                    <span className="mt-1 block truncate text-[13px] text-paper/50 md:hidden">{p.category[locale]}</span>
                  </span>
                  <span className="hidden text-[14px] text-paper/55 md:block">{p.category[locale]}</span>
                  <span className="hidden font-mono text-[12px] text-paper/40 md:block">{p.year ?? p.stage?.[locale] ?? ""}</span>
                  <span className="flex h-10 w-10 items-center justify-center justify-self-end rounded-full border border-paper/15 text-paper/60 transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                    →
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <HoverPreview project={hover} />
    </section>
  );
}
