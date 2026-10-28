"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/site-header/locale-context";

const LINES = {
  ko: [
    "> RECOVERY_PROTOCOL v2.6 부팅 중...",
    "> 신경망 연결 ............ OK",
    "> 디지털 세계 스캔 ....... 감염 섹터 다수 발견",
    "> 오퍼레이터 인증 ........ SOOMIN PARK",
    "> 복구 도구 로드 ......... UI · UX · FRONTEND",
  ],
  en: [
    "> RECOVERY_PROTOCOL v2.6 booting...",
    "> neural link ............ OK",
    "> scanning digital world . multiple infected sectors",
    "> operator auth .......... SOOMIN PARK",
    "> loading repair kit ..... UI · UX · FRONTEND",
  ],
};

const LINE_MS = 260;
const HOLD_MS = 650;
const KEY = "rp-booted";

/** First-visit-per-session boot log. Server-renders as a full cover so there
 * is no flash of the page underneath; the inline script below hides it
 * before paint for anyone who has already booted this session (or prefers
 * reduced motion). Any click or key skips straight through. */
export function BootScreen() {
  const { locale } = useLocale();
  const [shown, setShown] = useState(0);
  const [done, setDone] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (document.documentElement.dataset.booted) {
      const t = setTimeout(() => setGone(true), 0);
      return () => clearTimeout(t);
    }
    const lines = LINES.ko.length;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= lines; i++) {
      timers.push(setTimeout(() => setShown(i), i * LINE_MS));
    }
    const finish = () => {
      setDone(true);
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {}
      timers.push(setTimeout(() => setGone(true), 550));
    };
    timers.push(setTimeout(finish, lines * LINE_MS + HOLD_MS));

    const skip = () => {
      timers.forEach(clearTimeout);
      finish();
    };
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    document.body.style.overflow = "hidden";
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  if (gone) return null;

  const pct = Math.round((shown / LINES.ko.length) * 100);

  return (
    <>
      <div
        role="status"
        aria-label="Loading"
        className="boot fixed inset-0 z-[90] flex items-center justify-center bg-ink transition-[opacity,clip-path] duration-500 [html[data-booted]_&]:hidden"
        style={{
          opacity: done ? 0 : 1,
          clipPath: done ? "inset(50% 0 50% 0)" : "inset(0 0 0 0)",
        }}
      >
        <div className="scanlines pointer-events-none absolute inset-0" />
        <div className="w-[min(92vw,620px)] font-mono text-[12px] leading-relaxed text-neon md:text-sm">
          <div className="mb-6 flex items-center justify-between text-[10px] tracking-[0.3em] text-neon/50">
            <span>{"{CODE}·DESK"} {"//"} SYS</span>
            <span className="flicker">● LIVE</span>
          </div>
          {LINES[locale].slice(0, shown).map((l, i) => (
            <p key={i} className={i === 2 ? "text-alert" : undefined}>
              {l}
            </p>
          ))}
          <p className="mt-1">
            <span className="caret">█</span>
          </p>
          <div className="mt-6 h-1.5 w-full bg-neon/10">
            <div
              className="h-full bg-neon shadow-[0_0_12px_var(--neon)] transition-[width] duration-200"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] tracking-widest text-neon/50">
            <span>{done ? "ACCESS GRANTED" : "INITIALIZING"}</span>
            <span>{pct}%</span>
          </div>
          <p className="mt-10 text-center text-[10px] tracking-[0.3em] text-white/30">
            CLICK / ANY KEY TO SKIP
          </p>
        </div>
      </div>
    </>
  );
}
