"use client";

import Link from "next/link";
import clsx from "clsx";
import type { Stack } from "./db-data";
import type { WorkProject } from "@/lib/work-content";

/** Projects whose thumbnail moves — the top of their case page, recorded. */
const COVER_VIDEO: Record<string, { mp4: string; webm: string; poster: string }> = {
  "09": {
    mp4: "/media/tale/case/tale-thumb.mp4",
    webm: "/media/tale/case/tale-thumb.webm",
    poster: "/media/tale/case/tale-thumb.webp",
  },
};

/** Newest first: work in progress on top, then the most recently added. */
export function newestFirst(list: WorkProject[]) {
  const live = (p: WorkProject) => (p.stage?.en === "In progress" ? 1 : 0);
  return [...list].sort((a, b) => live(b) - live(a) || Number(b.index) - Number(a.index));
}

export function Thumb({ p, className }: { p: WorkProject; className?: string }) {
  const v = COVER_VIDEO[p.index];
  const src = p.cover ?? p.image;
  if (v)
    return (
      <video className={clsx("h-full w-full object-cover", className)} muted loop playsInline autoPlay poster={v.poster} aria-hidden>
        <source src={v.mp4} type="video/mp4" />
        <source src={v.webm} type="video/webm" />
      </video>
    );
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img src={src} alt="" className={clsx("h-full w-full object-cover", className)} loading="lazy" /> : null;
}

/**
 * A database, opened: its discs unfold into a list of image cards, newest
 * first. Same glass-and-glow language as the 3D view behind it.
 */
export function ProjectList({ stack, onClose }: { stack: Stack; onClose: () => void }) {
  const items = newestFirst(stack.projects);
  return (
    <section
      aria-label={`${stack.name} — projects`}
      className="pf-list absolute inset-x-0 bottom-0 top-[134px] z-10 md:hidden flex flex-col overflow-hidden md:bottom-3 md:left-[288px] md:right-3 md:top-3 md:rounded-2xl md:border md:border-white/10"
      style={{ ["--c" as string]: stack.color }}
    >
      <div className="absolute inset-0 bg-[rgba(8,7,16,0.86)] backdrop-blur-md" />
      <div className="pf-grid pointer-events-none absolute inset-0 opacity-50" />

      <header className="relative flex items-center gap-3 border-b border-white/10 px-4 py-3.5 md:px-5">
        <span className="h-3 w-3 rounded-full shadow-[0_0_12px_var(--c)]" style={{ background: stack.color }} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-[16px] font-medium">{stack.name}</p>
          <p className="mt-0.5 truncate text-[10.5px] leading-[1.5] text-white/45">
            SELECT * FROM {stack.id} ORDER BY updated DESC · {items.length} rows
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="h-9 shrink-0 rounded-xl border border-white/15 px-3 text-[11.5px] text-white/75 hover:border-white/40 hover:text-white"
        >
          ✕ close
        </button>
      </header>

      <ol key={stack.id} className="relative grid flex-1 auto-rows-min grid-cols-1 gap-4 overflow-y-auto p-4 sm:grid-cols-2 md:p-5 xl:grid-cols-3">
        {items.map((p, i) => (
          <li key={p.index} className="pf-unfold min-w-0" style={{ animationDelay: `${120 + i * 110}ms` }}>
            <Link
              href={`/work/${p.index}/`}
              className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-[#0d0c18] transition-[border-color,box-shadow] duration-300 hover:border-[var(--c)] hover:shadow-[0_0_0_1px_var(--c),0_0_40px_-8px_var(--c)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-black">
                <Thumb p={p} className="transition-transform duration-700 group-hover:scale-[1.04]" />
                <div className="pf-scan pointer-events-none absolute inset-0" />
                <span className="absolute left-2.5 top-2.5 rounded-md bg-black/65 px-2 py-0.5 text-[10.5px] text-white/85 backdrop-blur">
                  #{p.index}
                </span>
                {i === 0 && (
                  <span className="absolute right-2.5 top-2.5 rounded-md px-2 py-0.5 text-[10.5px] font-medium text-black" style={{ background: stack.color }}>
                    LATEST
                  </span>
                )}
              </div>
              <div className="flex items-start gap-3 px-4 py-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-sans text-[15px] font-medium leading-[1.4] text-white">{p.title.en}</p>
                  <p className="mt-1 truncate text-[11px] leading-[1.5] text-white/50">
                    {p.category.en}
                    {p.client ? ` · ${p.client.en}` : ""}
                  </p>
                </div>
                {p.stage && (
                  <span className="shrink-0 rounded-md border border-white/15 px-1.5 py-0.5 text-[10px] text-white/60">{p.stage.en}</span>
                )}
              </div>
              <span className="absolute bottom-3.5 right-3.5 hidden text-[11px] text-[var(--c)] group-hover:block">open →</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
