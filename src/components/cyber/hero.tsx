"use client";

import { useCallback, useRef, useState } from "react";
import clsx from "clsx";
import { useLocale } from "@/components/site-header/locale-context";
import { VISIBLE_WORK_PROJECTS } from "@/lib/work-content";
import { GAME_URL } from "@/lib/nav-items";
import { HeroCanvas } from "./hero-canvas";
import { MeteorStrike } from "./meteor-strike";

const COPY = {
  briefing: { ko: "미션 브리핑", en: "Mission briefing" },
  status: { ko: "상태: 감염됨", en: "Status: compromised" },
  lead: {
    ko: "디지털 세계가 감염됐습니다. 복잡한 정보, 길을 잃은 사용자, 읽히지 않는 화면 — 각 섹터를 디자인과 코드로 복구하는 UI/UX 디자이너, 박수민입니다.",
    en: "The digital world is infected — tangled information, lost users, screens nobody can read. I'm Soomin Park, a UI/UX designer who restores each sector with design and code.",
  },
  start: { ko: "미션 시작", en: "Start mission" },
  game: { ko: "게임 플레이", en: "Play the game" },
  hint: { ko: "빨간 신호 위로 커서를 움직여 제거하세요", en: "Sweep your cursor over red signals to purge them" },
  hintTouch: { ko: "빨간 신호를 탭해서 제거하세요", en: "Tap red signals to purge them" },
  purged: { ko: "제거한 위협", en: "Threats purged" },
  operator: { ko: "오퍼레이터", en: "Operator" },
  klass: { ko: "클래스", en: "Class" },
  base: { ko: "거점", en: "Base" },
  sectors: { ko: "감염 섹터", en: "Infected sectors" },
  scroll: { ko: "스크롤", en: "Scroll" },
};

export function Hero() {
  const { locale } = useLocale();
  const [purged, setPurged] = useState(0);
  const [flash, setFlash] = useState(false);

  const [shake, setShake] = useState(false);
  const impactRef = useRef<((x: number, y: number) => void) | null>(null);
  const onImpact = useCallback((x: number, y: number) => impactRef.current?.(x, y), []);
  const onShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 460);
  }, []);

  const onPurge = useCallback(() => {
    setPurged((n) => n + 1);
    setFlash(true);
    setTimeout(() => setFlash(false), 180);
  }, []);

  return (
    <section id="top" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <div className={clsx("absolute inset-0", shake && "hero-shake")}>
        <HeroCanvas onPurge={onPurge} impactRef={impactRef} />
      </div>
      <MeteorStrike onImpact={onImpact} onShake={onShake} />

      {/* Readability scrim behind copy */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/30 to-transparent md:via-ink/20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />

      {/* HUD corners */}
      <div className="pointer-events-none absolute inset-x-0 top-20 md:top-24">
        <div className="wrap flex justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
          <div className="flex flex-col gap-1">
            <span>Sector 00 // Seoul-net</span>
            <span className="ko-safe flicker text-alert">● {COPY.status[locale]}</span>
          </div>
          <div className="hidden flex-col items-end gap-1 sm:flex">
            <span>LAT 37.5665 · LNG 126.9780</span>
            <span className={clsx("ko-safe transition-colors", flash ? "text-neon" : "text-white/45")}>
              {COPY.purged[locale]} {String(purged).padStart(3, "0")}
            </span>
          </div>
        </div>
      </div>

      <div className="pointer-events-none relative z-10 flex h-full items-center">
        <div className="wrap grid items-end gap-10 lg:grid-cols-[1fr_340px]">
          <div className="max-w-4xl">
            <p className="ko-safe font-mono text-xs uppercase tracking-[0.3em] text-neon">
              &gt; {COPY.briefing[locale]}
              <span className="caret ml-1">_</span>
            </p>
            <h1 className="mt-5 font-display text-[clamp(3rem,10vw,9.5rem)] font-bold uppercase leading-[0.86] tracking-tight">
              <span className="glitch block text-paper" data-text="Save the">
                Save the
              </span>
              <span className="glitch block text-neon text-glow" data-text="Digital">
                Digital
              </span>
              <span className="glitch block text-paper" data-text="World_">
                World<span className="text-magenta">_</span>
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-white/70 md:text-lg">
              {COPY.lead[locale]}
            </p>

            <div className="pointer-events-auto mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#missions"
                className="ko-safe notch-sm group relative inline-flex items-center gap-3 bg-neon px-7 py-4 font-mono text-sm font-medium uppercase tracking-[0.2em] text-ink shadow-[0_0_30px_rgba(0,240,255,0.35)] transition-all hover:bg-paper hover:shadow-[0_0_45px_rgba(0,240,255,0.6)]"
              >
                <span>▶</span> {COPY.start[locale]}
              </a>
              <a
                href={GAME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="ko-safe notch-sm inline-flex items-center gap-2 border border-magenta/60 px-6 py-4 font-mono text-sm uppercase tracking-[0.2em] text-magenta transition-colors hover:bg-magenta hover:text-ink"
              >
                {COPY.game[locale]} ↗
              </a>
            </div>
            <p className="ko-safe mt-5 font-mono text-[11px] tracking-wider text-white/40">
              <span className="text-alert">■</span>{" "}
              <span className="hidden [@media(pointer:fine)]:inline">{COPY.hint[locale]}</span>
              <span className="[@media(pointer:fine)]:hidden">{COPY.hintTouch[locale]}</span>
            </p>
          </div>

          {/* Operator ID card */}
          <aside className="brackets notch hidden self-center border border-neon/25 bg-ink/70 p-5 font-mono text-xs backdrop-blur-md lg:block">
            <div className="flex items-center justify-between text-[10px] tracking-[0.25em] text-white/40">
              <span>ID-CARD</span>
              <span className="text-neon">VERIFIED</span>
            </div>
            <dl className="mt-4 space-y-3">
              {[
                [COPY.operator[locale], "SOOMIN PARK"],
                [COPY.klass[locale], "UI·UX DESIGNER / FE"],
                [COPY.base[locale], "SEOUL ⇄ VANCOUVER"],
                [COPY.sectors[locale], String(VISIBLE_WORK_PROJECTS.length).padStart(2, "0")],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2">
                  <dt className="ko-safe uppercase tracking-widest text-white/40">{k}</dt>
                  <dd className="text-right text-paper">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex items-end gap-[3px]" aria-hidden>
              {Array.from({ length: 28 }).map((_, i) => (
                <span
                  key={i}
                  className="w-full bg-neon/70"
                  style={{ height: `${6 + ((i * 37) % 22)}px`, opacity: 0.3 + ((i * 13) % 10) / 14 }}
                />
              ))}
            </div>
          </aside>
        </div>
      </div>

      <a
        href="#operator"
        className="ko-safe absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-neon md:flex"
      >
        {COPY.scroll[locale]}
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <span className="drip absolute inset-x-0 top-0 h-3 bg-neon" />
        </span>
      </a>
    </section>
  );
}
