"use client";

import { useCallback, useRef, useState } from "react";
import clsx from "clsx";
import { useLocale } from "@/components/site-header/locale-context";
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
  purged: { ko: "제거한 위협", en: "Threats purged" },
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

      {/* HUD row · content · bottom row — stacked in flow so nothing overlaps on short screens */}
      <div className="pointer-events-none relative z-10 flex h-full flex-col pb-10 pt-20 md:pt-24">
        <div className="wrap flex justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
          <span className="ko-safe flicker text-alert">● {COPY.status[locale]}</span>
          <span className={clsx("ko-safe hidden transition-colors sm:inline", flash ? "text-neon" : "text-white/45")}>
            {COPY.purged[locale]} {String(purged).padStart(3, "0")}
          </span>
        </div>

        <div className="wrap flex flex-1 items-center py-6">
          <div className="max-w-4xl">
            <p className="ko-safe font-mono text-xs uppercase tracking-[0.3em] text-neon">
              &gt; {COPY.briefing[locale]}
              <span className="caret ml-1">_</span>
            </p>
            <h1 className="mt-4 font-display text-[min(13vw,14svh)] font-bold uppercase leading-[0.86] tracking-tight lg:text-[min(10vw,15svh)]">
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
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/70 md:text-lg">
              {COPY.lead[locale]}
            </p>

            <div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-3">
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
            <p className="ko-safe mt-5 hidden font-mono text-[11px] tracking-wider text-white/40 [@media(pointer:fine)]:block">
              <span className="text-alert">■</span> {COPY.hint[locale]}
            </p>
          </div>
        </div>
      </div>

      <a
        href="#operator"
        className="ko-safe absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-neon lg:flex [@media(max-height:760px)]:!hidden"
      >
        {COPY.scroll[locale]}
        <span className="relative h-10 w-px overflow-hidden bg-white/15">
          <span className="drip absolute inset-x-0 top-0 h-3 bg-neon" />
        </span>
      </a>
    </section>
  );
}
