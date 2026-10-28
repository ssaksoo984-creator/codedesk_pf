"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/site-header/locale-context";

const COPY = {
  live: { ko: "실제로 눌러 보세요", en: "Live — click around" },
  open: { ko: "새 창으로 열기", en: "Open full screen" },
  load: { ko: "불러오는 중", en: "Loading" },
  tap: { ko: "눌러서 직접 써 보기", en: "Tap to interact" },
};

/** Frames one of the designer's own working prototypes inline so visitors
 * use the real thing instead of a screenshot. Loads only when scrolled near. */
export function LiveEmbed({ src, label, height = 760 }: { src: string; label: { ko: string; en: string }; height?: number }) {
  const { locale } = useLocale();
  const ref = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);
  // On touch screens an iframe swallows the swipe and the page stops
  // scrolling under your finger; it only takes touches after a tap.
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const full = src.replace(/([?&])embed=1&?/, "$1").replace(/[?&]$/, "");

  return (
    <div ref={ref} className="brackets border border-neon/25 bg-ink">
      <div className="flex items-center justify-between gap-3 border-b border-neon/15 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] md:px-4">
        <span className="ko-safe flex min-w-0 items-center gap-2 text-neon">
          <span className="pulse-ring-dot relative flex h-2 w-2 shrink-0">
            <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-neon" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
          </span>
          <span className="truncate">{label[locale]} · {COPY.live[locale]}</span>
        </span>
        <a href={full} target="_blank" rel="noopener noreferrer" className="ko-safe shrink-0 text-white/50 transition-colors hover:text-neon">
          {COPY.open[locale]} ↗
        </a>
      </div>
      <div className="relative w-full bg-white" style={{ height: `min(${height}px, 78svh)` }}>
        {near ? (
          <>
            <iframe
              src={src}
              title={label[locale]}
              loading="lazy"
              className={`absolute inset-0 h-full w-full border-0 ${active ? "" : "[@media(pointer:coarse)]:pointer-events-none"}`}
            />
            {!active && (
              <button
                type="button"
                onClick={() => setActive(true)}
                className="ko-safe absolute inset-0 hidden items-end justify-center bg-gradient-to-t from-ink/70 via-transparent to-transparent pb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-neon [@media(pointer:coarse)]:flex"
              >
                <span className="border border-neon/60 bg-ink/90 px-4 py-2.5">☝ {COPY.tap[locale]}</span>
              </button>
            )}
          </>
        ) : (
          <div className="ko-safe flex h-full items-center justify-center bg-ink font-mono text-xs text-white/40">{COPY.load[locale]}…</div>
        )}
      </div>
    </div>
  );
}
