"use client";

import clsx from "clsx";
import Link from "next/link";
import { VISIBLE_WORK_PROJECTS } from "@/lib/work-content";
import { useLocale } from "@/components/site-header/locale-context";
import { useMemo, useState } from "react";
import { WorkArrowIcon } from "./work-arrow-icon";

const FILTERS = ["All", "Built by Me", "Public", "Business", "Systems & Tools"] as const;
type FilterTag = (typeof FILTERS)[number];

// Buttons stay bilingual — unlike section headers, these are interactive
// controls the visitor reads directly, not brand-level labels.
const COPY = {
  list: { ko: "리스트", en: "List" },
  grid: { ko: "그리드", en: "Grid" },
  more: { ko: "더보기", en: "View more" },
};

interface WorkBrowserProps {
  /** Caps visible items and swaps the trailing control for a link to
   * `moreHref` — used for the homepage teaser. Omit to show everything with
   * no trailing link, as on the dedicated /work page. */
  limit?: number;
  moreHref?: string;
  /** Set when the caller lives inside a fixed-height, overflow-hidden
   * viewport and needs its own internal scroll region instead of growing
   * with the page. Defaults to `Boolean(limit)` for backward compatibility,
   * but a capped list living in normal page flow should pass `false`. */
  constrained?: boolean;
}

export function WorkBrowser({ limit, moreHref, constrained }: WorkBrowserProps) {
  const { locale } = useLocale();
  const [filter, setFilter] = useState<FilterTag>("All");
  const [view, setView] = useState<"list" | "grid">("list");

  const filtered = useMemo(() => {
    if (filter === "All") return VISIBLE_WORK_PROJECTS;
    return VISIBLE_WORK_PROJECTS.filter((p) => (p.tags ?? []).includes(filter));
  }, [filter]);

  const visible = limit ? filtered.slice(0, limit) : filtered;
  const showMore = Boolean(limit && moreHref);
  const isConstrained = constrained ?? Boolean(limit);

  return (
    <div className={clsx("flex flex-col", isConstrained && "min-h-0 flex-1")}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 md:mb-8">
        <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "rounded-full px-3.5 py-1.5 text-xs transition-colors duration-200 md:px-4 md:text-sm",
                filter === f
                  ? "bg-paper text-ink"
                  : "text-white/45 hover:text-paper"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 rounded-full border border-white/15 p-1">
          <button
            onClick={() => setView("list")}
            className={clsx(
              "rounded-full px-3 py-1 text-[11px] transition-colors duration-200 md:text-xs",
              view === "list" ? "bg-paper text-ink" : "text-white/45 hover:text-paper"
            )}
          >
            {COPY.list[locale]}
          </button>
          <button
            onClick={() => setView("grid")}
            className={clsx(
              "rounded-full px-3 py-1 text-[11px] transition-colors duration-200 md:text-xs",
              view === "grid" ? "bg-paper text-ink" : "text-white/45 hover:text-paper"
            )}
          >
            {COPY.grid[locale]}
          </button>
        </div>
      </div>

      <div className={clsx(isConstrained && "no-scrollbar min-h-0 flex-1 overflow-y-auto")}>
        {view === "list" ? (
          <div className="flex flex-col border-b border-white/15">
            {visible.map((project) => (
              <a
                key={project.index}
                href={`/work/${project.index}`}
                className="group flex items-center justify-between gap-4 border-t border-white/15 py-4 md:py-6"
              >
                <div className="flex min-w-0 items-baseline gap-3 md:gap-6">
                  <span className="shrink-0 font-display text-xs italic text-white/30 md:text-sm">
                    {project.index}
                  </span>
                  <div className="min-w-0">
                    {/* pr-2 keeps the hard `truncate` clip line clear of the
                        glyph — an italic-slant fallback for Korean text
                        overhangs its layout box, and without this buffer the
                        last character gets its edge cut off. */}
                    <div className="truncate pr-2 font-point text-xl italic text-paper transition-transform duration-300 ease-out group-hover:translate-x-1.5 md:text-3xl">
                      {project.title[locale]}
                    </div>
                    <div className="mt-0.5 truncate text-[11px] text-white/40 md:text-sm">
                      {project.category[locale]}
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3 md:gap-5">
                  <span className="hidden text-[11px] text-white/35 sm:inline">
                    {(project.tags ?? []).join(" · ")}
                  </span>
                  <WorkArrowIcon className="h-3.5 w-3.5 text-white/35 transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper md:h-4 md:w-4" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 md:gap-x-6 md:gap-y-10">
            {visible.map((project) => (
              <a key={project.index} href={`/work/${project.index}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white/5">
                  {project.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.image}
                      alt={project.title[locale]}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                    />
                  ) : null}
                </div>
                <div className="mt-2.5 flex items-start justify-between gap-2 md:mt-3.5">
                  <div className="min-w-0">
                    <div className="truncate pr-2 font-point text-sm italic text-paper md:text-lg">
                      {project.title[locale]}
                    </div>
                    <div className="truncate text-[10px] text-white/40 md:text-xs">
                      {project.category[locale]}
                    </div>
                  </div>
                  <span className="shrink-0 font-display text-[10px] italic text-white/30 md:text-xs">
                    {project.index}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {showMore && (
        <div className="mt-6 flex justify-center md:mt-8">
          <Link
            href={moreHref!}
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-xs text-paper transition-colors duration-200 hover:bg-paper hover:text-ink md:text-sm"
          >
            {COPY.more[locale]}
            <WorkArrowIcon className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
