"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "@/components/site-header/locale-context";
import { SHOWREEL } from "@/lib/project-media";
import { MotionVideo } from "./motion-video";

const COPY = {
  label: { ko: "쇼릴 · 실제 화면 녹화", en: "Showreel · real recordings, no mockups" },
  names: "Tale Studio — 1AM VAPE — National Museum — K-ARTS — Bloom Soft — NAIL — ARTE — Lookback — MOFA — Reeve — ",
};

/** Full-bleed reel that grows from an inset rounded card to the full width
 * as it scrolls into place. */
export function Showreel() {
  const { locale } = useLocale();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // 0 when the card's top enters the bottom of the screen → 1 when it reaches 15% from the top
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.85)));
      el.style.setProperty("--p", p.toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="bg-paper pb-10 text-ink md:pb-16">
      <div ref={ref} className="[--p:1]">
        <div
          className="relative mx-auto aspect-[16/10] w-full overflow-hidden bg-ink md:aspect-[16/9]"
          style={{
            transform: "scale(calc(0.86 + 0.14 * var(--p)))",
            borderRadius: "calc(40px - 28px * var(--p))",
          }}
        >
          <MotionVideo src={SHOWREEL.video} poster={SHOWREEL.poster} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/55 to-transparent p-5 md:p-8">
            <span className="rounded-full bg-black/40 px-3 py-1.5 font-mono text-[11px] text-white/90">● {COPY.label[locale]}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 overflow-hidden md:mt-14" aria-hidden>
        <div className="marquee flex w-max whitespace-nowrap text-[clamp(1.6rem,4vw,3.5rem)] font-bold tracking-[-0.03em] text-ink/15">
          <span>{COPY.names}</span>
          <span>{COPY.names}</span>
        </div>
      </div>
    </section>
  );
}
