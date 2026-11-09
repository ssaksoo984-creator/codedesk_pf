"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

/** A small dot that follows the pointer and grows into a label ("View",
 * "Play") over anything marked data-cursor="…". Mouse only; the loop sleeps
 * once the dot has caught up. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const pos = { x: -100, y: -100 };
    const cur = { x: -100, y: -100 };
    let raf = 0;
    const tick = () => {
      cur.x += (pos.x - cur.x) * 0.22;
      cur.y += (pos.y - cur.y) * 0.22;
      if (ref.current) ref.current.style.transform = `translate3d(${cur.x}px, ${cur.y}px, 0)`;
      raf = Math.abs(pos.x - cur.x) + Math.abs(pos.y - cur.y) > 0.2 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pos.x = e.clientX;
      pos.y = e.clientY;
      const t = (e.target as Element | null)?.closest<HTMLElement>("[data-cursor]");
      setLabel(t ? t.dataset.cursor || "" : null);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onLeave = () => setLabel(null);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] hidden [@media(pointer:fine)]:block">
      <div
        className={clsx(
          "flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-[13px] font-semibold text-white transition-[width,height,opacity] duration-300 [transition-timing-function:var(--ease)]",
          label !== null ? "h-24 w-24 opacity-100" : "h-0 w-0 opacity-0"
        )}
      >
        <span className={clsx("transition-opacity duration-200", label ? "opacity-100" : "opacity-0")}>{label}</span>
      </div>
    </div>
  );
}
