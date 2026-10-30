"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocale } from "@/components/site-header/locale-context";

const COPY = {
  live: { ko: "실제로 눌러 보세요", en: "Live — click around" },
  expand: { ko: "전체 화면", en: "Full screen" },
  newTab: { ko: "새 탭", en: "New tab" },
  close: { ko: "닫기", en: "Close" },
  load: { ko: "불러오는 중", en: "Loading" },
  tap: { ko: "눌러서 전체 화면으로 써 보기", en: "Tap to open full screen" },
};

/** Frames one of the designer's own working prototypes inline so visitors
 * use the real thing instead of a screenshot. Loads only when scrolled near.
 *
 * Inline, the frame is sized to fit between the sticky header and the
 * floating HUD. "Full screen" opens it over the whole site (nothing on top
 * of it); on touch screens that's what a tap does, since an inline iframe
 * would also swallow the page's scroll. */
export function LiveEmbed({
  src: srcKo,
  srcEn,
  label,
  height = 760,
}: {
  src: string;
  /** English build of the same prototype, used when the site is in EN. */
  srcEn?: string;
  label: { ko: string; en: string };
  height?: number;
}) {
  const { locale } = useLocale();
  const src = locale === "en" && srcEn ? srcEn : srcKo;
  const ref = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!full) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFull(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [full]);

  const page = src.replace(/([?&])embed=1&?/, "$1").replace(/[?&]$/, "");
  const btn = "ko-safe shrink-0 text-white/55 transition-colors hover:text-neon";

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
        <span className="flex items-center gap-4">
          <button type="button" onClick={() => setFull(true)} className={btn}>
            ⤢ {COPY.expand[locale]}
          </button>
          <a href={page} target="_blank" rel="noopener noreferrer" className={`${btn} hidden sm:inline`}>
            {COPY.newTab[locale]} ↗
          </a>
        </span>
      </div>
      <div className="relative w-full bg-white" style={{ height: `min(${height}px, calc(100svh - 160px))` }}>
        {near && !full ? (
          <>
            <iframe
              src={src}
              title={label[locale]}
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0 [@media(pointer:coarse)]:pointer-events-none"
            />
            <button
              type="button"
              onClick={() => setFull(true)}
              className="ko-safe absolute inset-0 hidden items-end justify-center bg-gradient-to-t from-ink/70 via-transparent to-transparent pb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-neon [@media(pointer:coarse)]:flex"
            >
              <span className="border border-neon/60 bg-ink/90 px-4 py-2.5">⤢ {COPY.tap[locale]}</span>
            </button>
          </>
        ) : (
          <div className="ko-safe flex h-full items-center justify-center bg-ink font-mono text-xs text-white/40">
            {full ? "⤢" : `${COPY.load[locale]}…`}
          </div>
        )}
      </div>

      {full &&
        createPortal(
          // Above the header, HUD, SYS-BOT and back-to-top; below the cursor.
          <div className="fixed inset-0 z-[95] flex flex-col bg-ink" role="dialog" aria-modal="true" aria-label={label[locale]}>
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-neon/25 px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] md:px-5">
              <span className="ko-safe truncate text-neon">● {label[locale]}</span>
              <span className="flex items-center gap-4">
                <a href={page} target="_blank" rel="noopener noreferrer" className={btn}>
                  {COPY.newTab[locale]} ↗
                </a>
                <button
                  type="button"
                  onClick={() => setFull(false)}
                  className="ko-safe border border-neon/50 px-3 py-1.5 text-neon transition-colors hover:bg-neon hover:text-ink"
                >
                  ✕ {COPY.close[locale]}
                </button>
              </span>
            </div>
            <iframe src={src} title={label[locale]} className="w-full flex-1 border-0 bg-white" />
          </div>,
          document.body
        )}
    </div>
  );
}
