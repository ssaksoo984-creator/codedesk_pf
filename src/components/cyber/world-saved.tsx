"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/site-header/locale-context";
import { VISIBLE_WORK_PROJECTS } from "@/lib/work-content";
import { useRestored } from "@/lib/mission-progress";

const KEY = "rp-saved-celebrated";
export const REPLAY_EVENT = "rp-celebrate";

const COPY = {
  kicker: { ko: "미션 완료", en: "Mission complete" },
  title: { ko: "세계 복구 완료", en: "World restored" },
  lead: {
    ko: "모든 섹터를 끝까지 둘러봐 주셔서 고맙습니다. 디지털 세계는 다시 안전해졌어요. 이제 다음 미션을 함께 만들 차례입니다.",
    en: "Thank you for exploring every sector — the digital world is safe again. Now let's build the next mission together.",
  },
  log: {
    ko: ["모든 섹터 온라인", "위협 수준: 0", "도시 전력 정상화", "보상 잠금 해제: 오퍼레이터와의 통신 채널"],
    en: ["all sectors online", "threat level: 0", "city grid back to normal", "reward unlocked: direct channel to the operator"],
  },
  contact: { ko: "오퍼레이터에게 연락하기", en: "Contact the operator" },
  resume: { ko: "이력서 받기", en: "Get the résumé" },
  close: { ko: "닫기", en: "Close" },
  sectors: { ko: "복구한 섹터", en: "Sectors restored" },
};

const COLORS = ["0,240,255", "255,43,214", "232,255,58", "255,255,255"];

/** The 100% payoff. Fires once when the last sector is restored (and can be
 * replayed): a firework burst over a healed, cyan globe, a typed system log,
 * and the "reward" — a direct line to the designer. */
export function WorldSaved() {
  const { locale } = useLocale();
  const restored = useRestored();
  const total = VISIBLE_WORK_PROJECTS.length;
  const count = VISIBLE_WORK_PROJECTS.filter((p) => restored.includes(p.index)).length;
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const show = useCallback(() => {
    setLines(0);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (count !== total) return;
    let seen = false;
    try {
      seen = localStorage.getItem(KEY) === "1";
      localStorage.setItem(KEY, "1");
    } catch {}
    if (!seen) {
      const t = setTimeout(show, 3600); // let the mission page's own "restored" readout finish first
      return () => clearTimeout(t);
    }
  }, [count, total, show]);

  useEffect(() => {
    window.addEventListener(REPLAY_EVENT, show);
    return () => window.removeEventListener(REPLAY_EVENT, show);
  }, [show]);

  useEffect(() => {
    if (!open) return;
    const timers = COPY.log.en.map((_, i) => setTimeout(() => setLines(i + 1), 900 + i * 450));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      timers.forEach(clearTimeout);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Fireworks
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    type P = { x: number; y: number; vx: number; vy: number; life: number; c: string; s: number };
    const parts: P[] = [];
    const rings: { x: number; y: number; r: number; a: number; c: string }[] = [];
    const burst = (x: number, y: number) => {
      const c = COLORS[(Math.random() * COLORS.length) | 0];
      const n = 70;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const sp = 2 + Math.random() * 5;
        parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, c, s: 1.5 + Math.random() * 2.5 });
      }
      rings.push({ x, y, r: 4, a: 1, c });
    };
    let raf = 0;
    let t = 0;
    const tick = () => {
      t++;
      if (t < 260 && t % 22 === 1) burst(innerWidth * (0.15 + Math.random() * 0.7), innerHeight * (0.15 + Math.random() * 0.45));
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      for (const r of rings) {
        r.r += 6;
        r.a *= 0.93;
        ctx.strokeStyle = `rgba(${r.c},${r.a})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
      }
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.life -= 0.012;
        ctx.fillStyle = `rgba(${p.c},${Math.max(0, p.life)})`;
        ctx.fillRect(p.x, p.y, p.s, p.s);
      }
      for (let i = parts.length - 1; i >= 0; i--) if (parts[i].life <= 0) parts.splice(i, 1);
      for (let i = rings.length - 1; i >= 0; i--) if (rings[i].a < 0.02) rings.splice(i, 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label={COPY.title[locale]} className="fixed inset-0 z-[95] flex items-center justify-center overflow-y-auto bg-ink/90 p-4 backdrop-blur-md">
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 h-full w-full" />
      <div className="scanlines pointer-events-none fixed inset-0" />
      <div className="saved-flash pointer-events-none fixed inset-0 bg-neon" />

      <div className="saved-in relative w-full max-w-3xl text-center">
        <div className="relative mx-auto h-44 w-44 md:h-56 md:w-56">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/media/fx/globe.webp"
            alt=""
            className="globe-bob h-full w-full object-contain"
            style={{ filter: "hue-rotate(185deg) saturate(1.3) drop-shadow(0 0 40px rgba(0,240,255,0.6))" }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/fx/bot.webp" alt="" className="bot-float absolute -bottom-2 -right-10 h-24 w-24 object-contain drop-shadow-[0_0_18px_rgba(0,240,255,0.6)] md:h-28 md:w-28" />
        </div>

        <p className="ko-safe mt-6 font-mono text-xs uppercase tracking-[0.4em] text-acid">▲ {COPY.kicker[locale]} ▲</p>
        <h2 className="mt-3 font-display text-[clamp(2.6rem,9vw,6.5rem)] font-bold uppercase leading-[0.9] tracking-tight">
          <span className="glitch block text-neon text-glow" data-text={COPY.title[locale]}>
            {COPY.title[locale]}
          </span>
        </h2>
        <div className="mt-3 font-mono text-2xl text-paper md:text-3xl">
          100<span className="text-neon">%</span>
          <span className="ml-3 align-middle text-xs uppercase tracking-[0.3em] text-white/45">
            {COPY.sectors[locale]} {count}/{total}
          </span>
        </div>

        <ul className="ko-safe mx-auto mt-6 max-w-md text-left font-mono text-xs leading-relaxed text-neon/80 md:text-sm">
          {COPY.log[locale].slice(0, lines).map((l, i) => (
            <li key={i} className="animate-step-in">
              &gt; {l} <span className="text-acid">✓</span>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-white/70">{COPY.lead[locale]}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="ko-safe notch-sm inline-flex items-center gap-2 bg-neon px-7 py-4 font-mono text-sm uppercase tracking-[0.2em] text-ink shadow-[0_0_30px_rgba(0,240,255,0.45)] transition-colors hover:bg-paper"
          >
            ✉ {COPY.contact[locale]}
          </Link>
          <a
            href={locale === "ko" ? "/media/Soomin_Park_Resume_KO.pdf" : "/media/Soomin_Park_Resume.pdf"}
            download
            className="ko-safe notch-sm inline-flex items-center gap-2 border border-acid/60 px-6 py-4 font-mono text-sm uppercase tracking-[0.2em] text-acid transition-colors hover:bg-acid hover:text-ink"
          >
            ↓ {COPY.resume[locale]}
          </a>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="ko-safe px-4 py-4 font-mono text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white"
          >
            {COPY.close[locale]} ✕
          </button>
        </div>
      </div>
    </div>
  );
}
