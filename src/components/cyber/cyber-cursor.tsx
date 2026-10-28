"use client";

import { useEffect, useRef } from "react";

/** Targeting-reticle cursor for fine pointers. The dot tracks the pointer
 * 1:1; the ring trails it with easing and locks wider over anything
 * clickable. Skipped entirely on touch and reduced-motion. */
export function CyberCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const root = document.documentElement;
    root.classList.add("has-cursor");

    const pos = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let hot = false;
    let raf = 0; // 0 = loop asleep; it only runs while the ring is catching up

    function onMove(e: PointerEvent) {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const t = e.target as Element | null;
      hot = Boolean(t?.closest("a, button, [role=button], input, textarea, select, label"));
      if (!raf) raf = requestAnimationFrame(tick);
    }

    function tick() {
      ring.x += (pos.x - ring.x) * 0.2;
      ring.y += (pos.y - ring.y) * 0.2;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      if (ringRef.current) {
        const s = hot ? 1.7 : 1;
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) scale(${s}) rotate(${hot ? 45 : 0}deg)`;
        ringRef.current.style.borderColor = hot ? "var(--magenta)" : "var(--neon)";
      }
      // Sleep once the ring has caught up, instead of restyling every frame forever.
      raf = Math.abs(pos.x - ring.x) + Math.abs(pos.y - ring.y) > 0.3 ? requestAnimationFrame(tick) : 0;
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      root.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100] hidden [@media(pointer:fine)]:block">
      <div
        ref={ringRef}
        className="absolute -left-4 -top-4 h-8 w-8 border border-neon transition-[border-color] duration-200"
        style={{ transform: "translate3d(-100px,-100px,0)" }}
      />
      <div
        ref={dotRef}
        className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 bg-neon shadow-[0_0_10px_var(--neon)] motion-reduce:hidden"
        style={{ transform: "translate3d(-100px,-100px,0)" }}
      />
    </div>
  );
}
