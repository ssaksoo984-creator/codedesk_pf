"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useLocale } from "@/components/site-header/locale-context";
import { VISIBLE_WORK_PROJECTS } from "@/lib/work-content";
import { useRestored } from "@/lib/mission-progress";
import { usePastHero } from "@/lib/use-past-hero";

type Mood = "error" | "fixing" | "ok";

interface Line {
  mood: Mood;
  ko: string;
  en: string;
}

// Joke error log, each followed by a repair — the bot narrates the
// "world is broken, we're fixing it" fiction while the visitor browses.
const SCRIPT: Line[][] = [
  [
    { mood: "error", ko: "ERR 404: 사용자가 메뉴 3단계 안에서 길을 잃음", en: "ERR 404: user lost three menus deep" },
    { mood: "fixing", ko: "정보 구조 재배치 중...", en: "Rebuilding information architecture..." },
    { mood: "ok", ko: "경로 복구 완료. 이제 두 번 클릭이면 도착!", en: "Path restored. Two clicks to anywhere!" },
  ],
  [
    { mood: "error", ko: "WARN: 버튼 17개가 동시에 '나를 눌러' 외치는 중", en: "WARN: 17 buttons screaming 'click me' at once" },
    { mood: "fixing", ko: "시각 위계 정리 중...", en: "Sorting visual hierarchy..." },
    { mood: "ok", ko: "주요 행동 1개만 남김. 조용해졌다.", en: "One primary action left. Peace restored." },
  ],
  [
    { mood: "error", ko: "CRITICAL: 글자 크기 11px, 어르신 접근 불가", en: "CRITICAL: 11px body text, readers locked out" },
    { mood: "fixing", ko: "타이포 스케일 패치 배포 중...", en: "Deploying type-scale patch..." },
    { mood: "ok", ko: "가독성 정상. 모두 읽을 수 있음.", en: "Legibility nominal. Everyone can read." },
  ],
  [
    { mood: "error", ko: "ERR: 로딩 스피너가 47초째 돌고 있음", en: "ERR: spinner has been spinning for 47s" },
    { mood: "fixing", ko: "대기 화면에 이야기 주입 중...", en: "Injecting story into the wait..." },
    { mood: "ok", ko: "기다림도 경험이 됐다.", en: "The wait is part of the experience now." },
  ],
];

const COPY = {
  hello: { ko: "SYS-BOT 온라인. 함께 세계를 복구해요!", en: "SYS-BOT online. Let's restore the world!" },
  progress: (n: number, t: number) => ({
    ko: `세계 복구율 ${Math.round((n / t) * 100)}% — 남은 섹터 ${t - n}개`,
    en: `World integrity ${Math.round((n / t) * 100)}% — ${t - n} sectors left`,
  }),
  saved: { ko: "모든 섹터 복구! 당신은 영웅이에요 ✦", en: "All sectors restored! You're a hero ✦" },
  hide: { ko: "봇 숨기기", en: "Hide bot" },
  show: { ko: "SYS-BOT 호출", en: "Call SYS-BOT" },
};

const STEP_MS = 2600;
const small = () => typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
const PAUSE_MS = 7000;

/** Floating repair-robot companion. Loops through little "error → fixing →
 * fixed" incidents, reports world-integrity progress between them, and can
 * be clicked to skip ahead or tucked away (remembered per browser). */
export function SysBot() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const restored = useRestored();
  const [hidden, setHidden] = useState(false);
  const pastHero = usePastHero();
  const [text, setText] = useState<{ mood: Mood; msg: string; progress?: number } | null>(null);
  const [glitch, setGlitch] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scene = useRef({ i: 0, step: -1 });
  const advanceRef = useRef<(() => void) | null>(null);

  const total = VISIBLE_WORK_PROJECTS.length;
  const count = VISIBLE_WORK_PROJECTS.filter((p) => restored.includes(p.index)).length;
  const stateRef = useRef({ locale, count, total });
  useEffect(() => {
    stateRef.current = { locale, count, total };
  }, [locale, count, total]);

  useEffect(() => {
    try {
      if (localStorage.getItem("rp-bot-hidden") === "1") setTimeout(() => setHidden(true), 0);
    } catch {}
  }, []);

  useEffect(() => {
    if (hidden) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function advance() {
      const { locale: l, count: c, total: t } = stateRef.current;
      const s = scene.current;
      s.step += 1;
      const lines = SCRIPT[s.i % SCRIPT.length];

      if (s.step < lines.length) {
        const line = lines[s.step];
        setText({ mood: line.mood, msg: line[l], progress: line.mood === "fixing" ? 0 : undefined });
        if (line.mood === "error") {
          setGlitch(true);
          setTimeout(() => setGlitch(false), 600);
        }
        timer.current = setTimeout(advance, STEP_MS);
      } else {
        // Between incidents: report the visitor's own progress.
        const p = c === t ? COPY.saved[l] : COPY.progress(c, t)[l];
        setText({ mood: "ok", msg: p });
        s.i += 1;
        s.step = -1;
        timer.current = setTimeout(() => {
          setText(null);
          // On phones the bot only talks when tapped — no endless bubbles over the content.
          if (!small()) timer.current = setTimeout(advance, PAUSE_MS);
        }, STEP_MS + 600);
      }
    }

    advanceRef.current = advance;
    if (small()) return;
    setTimeout(() => setText({ mood: "ok", msg: COPY.hello[stateRef.current.locale] }), 0);
    timer.current = setTimeout(advance, reduce ? STEP_MS * 2 : 3200);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [hidden, pathname]);

  // Animate the "fixing" progress bar.
  useEffect(() => {
    if (text?.mood !== "fixing") return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (STEP_MS - 300));
      setText((cur) => (cur && cur.mood === "fixing" ? { ...cur, progress: p } : cur));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text?.mood, text?.msg]);

  function skip() {
    if (timer.current) clearTimeout(timer.current);
    const sc = scene.current;
    if (sc.step >= 0) sc.i += 1;
    sc.step = -1;
    advanceRef.current?.();
  }

  function toggleHidden(next: boolean) {
    setHidden(next);
    try {
      localStorage.setItem("rp-bot-hidden", next ? "1" : "0");
    } catch {}
    if (next) setText(null);
  }

  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => toggleHidden(false)}
        aria-label={COPY.show[locale]}
        className="fixed bottom-16 right-3 z-40 flex h-11 w-11 items-center justify-center border border-neon/40 bg-ink/80 backdrop-blur-md transition-colors hover:border-neon md:bottom-[104px] md:right-8 md:h-14 md:w-14"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/fx/bot.webp" alt="" className="h-9 w-9 object-contain" />
      </button>
    );
  }

  const tone =
    text?.mood === "error" ? "border-alert text-alert" : text?.mood === "fixing" ? "border-acid text-acid" : "border-neon text-neon";

  return (
    <div
      className={clsx(
        "pointer-events-none fixed bottom-16 right-1 z-40 flex items-end gap-1 transition-all duration-500 md:bottom-[100px] md:right-6",
        pastHero ? "opacity-100" : "translate-y-6 opacity-0 [&_*]:!pointer-events-none"
      )}
    >
      <div
        aria-live="polite"
        className={clsx(
          "ko-safe pointer-events-auto relative mb-8 w-[min(60vw,250px)] border bg-ink/90 p-3 font-mono text-[11px] leading-relaxed shadow-[0_0_24px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300",
          tone,
          text ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        )}
      >
        <div className="mb-1 flex items-center justify-between text-[9px] uppercase tracking-[0.25em] opacity-70">
          <span>{text?.mood === "error" ? "▲ Alert" : text?.mood === "fixing" ? "◐ Repairing" : "● SYS-BOT"}</span>
          <button
            type="button"
            onClick={() => toggleHidden(true)}
            aria-label={COPY.hide[locale]}
            className="pointer-events-auto px-1 text-white/40 hover:text-white"
          >
            ✕
          </button>
        </div>
        <p className="text-paper">{text?.msg}</p>
        {text?.mood === "fixing" && (
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1 flex-1 bg-acid/15">
              <div className="h-full bg-acid shadow-[0_0_8px_var(--acid)]" style={{ width: `${(text.progress ?? 0) * 100}%` }} />
            </div>
            <span className="text-[10px] tabular-nums">{Math.round((text.progress ?? 0) * 100)}%</span>
          </div>
        )}
        <span className={clsx("absolute -right-[7px] bottom-4 h-3 w-3 rotate-45 border-r border-t bg-ink", tone)} />
      </div>

      <button
        type="button"
        onClick={skip}
        aria-label="SYS-BOT"
        className={clsx("bot-float pointer-events-auto relative h-12 w-12 shrink-0 md:h-24 md:w-24", glitch && "bot-glitch")}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/media/fx/bot.webp"
          alt=""
          className={clsx(
            "h-full w-full object-contain drop-shadow-[0_0_14px_rgba(0,240,255,0.45)] transition-[filter] duration-300",
            text?.mood === "error" && "[filter:hue-rotate(160deg)_saturate(2.2)_drop-shadow(0_0_14px_rgba(255,51,85,0.7))]"
          )}
        />
      </button>
    </div>
  );
}
