"use client";

import { WORK_PROJECTS } from "@/lib/work-content";
import { useLocale } from "@/components/site-header/locale-context";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

interface WorkListPanelProps {
  /** Fires whenever the active project changes — via scroll, click, or hover. */
  onActiveChange?: (index: number) => void;
}

/**
 * Self-contained project list + image panel. The whole area (list AND
 * image) is one scroll container so wheel/touch/drag works no matter where
 * the pointer is — the image column just stays sticky while the list
 * scrolls past it. The active item also changes on click or mouse-over,
 * not just scroll.
 */
export function WorkListPanel({ onActiveChange }: WorkListPanelProps) {
  const { locale } = useLocale();
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const dragState = useRef({ startY: 0, startScrollTop: 0, moved: false });

  useEffect(() => {
    onActiveChange?.(active);
  }, [active, onActiveChange]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const index = itemRefs.current.findIndex((el) => el === visible[0].target);
        if (index !== -1) setActive(index);
      },
      { root, rootMargin: "-42% 0px -42% 0px", threshold: [0, 0.5, 1] }
    );

    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    if (!el || e.pointerType === "touch") return;
    dragState.current = { startY: e.clientY, startScrollTop: el.scrollTop, moved: false };
    // Pointer capture on an ancestor breaks native <a> click activation in
    // some browsers — skip drag-tracking entirely when the gesture starts
    // on a link so clicking it always navigates. Wheel/touch scroll still
    // work everywhere; this only forgoes click-drag-to-scroll from on top
    // of a link itself.
    if (e.target instanceof HTMLElement && e.target.closest("a")) return;
    setDragging(true);
    el.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    if (!el || !dragging) return;
    const dy = e.clientY - dragState.current.startY;
    // A generous threshold — anything tighter misreads ordinary click jitter
    // (especially on trackpads) as a drag and silently swallows the link click.
    if (Math.abs(dy) > 8) dragState.current.moved = true;
    el.scrollTop = dragState.current.startScrollTop - dy;
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    const el = scrollerRef.current;
    setDragging(false);
    if (el && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  }

  function selectItem(i: number) {
    if (dragState.current.moved) return;
    setActive(i);
  }

  function handleItemClick(e: React.MouseEvent<HTMLAnchorElement>, i: number, url: string) {
    if (dragState.current.moved || url === "#") e.preventDefault();
    selectItem(i);
  }

  return (
    <div
      ref={scrollerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      className={clsx(
        "no-scrollbar grid h-[420px] grid-cols-1 items-start gap-10 overflow-y-auto select-none md:h-[520px] md:grid-cols-2 md:gap-16",
        dragging ? "cursor-grabbing" : "cursor-grab"
      )}
    >
      <div>
        {WORK_PROJECTS.map((project, i) => (
          <a
            key={project.index}
            href={project.url}
            target={project.url === "#" ? undefined : "_blank"}
            rel={project.url === "#" ? undefined : "noopener noreferrer"}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            onClick={(e) => handleItemClick(e, i, project.url)}
            onMouseEnter={() => selectItem(i)}
            className={clsx(
              "flex w-full items-center justify-between border-t border-white/15 py-5 text-left transition-opacity duration-300 md:py-6",
              active === i ? "opacity-100" : "opacity-40 hover:opacity-70"
            )}
          >
            <div className="flex items-baseline gap-4 md:gap-6">
              <span className="font-display text-sm italic text-white/40">{project.index}</span>
              <h3 className="font-display text-2xl italic text-paper md:text-4xl">
                {project.title[locale]}
              </h3>
            </div>
            <span className="hidden text-xs uppercase tracking-[0.15em] text-white/40 sm:inline">
              {project.category[locale]}
            </span>
          </a>
        ))}
        <div className="border-t border-white/15" />
      </div>

      <div className="relative hidden w-full overflow-hidden rounded-2xl bg-charcoal/40 md:sticky md:top-0 md:block md:h-[510px]">
        {WORK_PROJECTS.map((project, i) =>
          project.video ? (
            <div
              key={project.index}
              className={clsx(
                "absolute inset-0 bg-gradient-to-br from-sky-200 via-sky-400 to-sky-600 transition-opacity duration-500",
                active === i ? "opacity-100" : "opacity-0"
              )}
            >
              <video
                src={project.video}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={project.index}
              src={project.image}
              alt={project.title[locale]}
              loading="lazy"
              className={clsx(
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
                active === i ? "opacity-100" : "opacity-0"
              )}
            />
          )
        )}
      </div>
    </div>
  );
}
