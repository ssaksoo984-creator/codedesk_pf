"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { BinaryCityScroll } from "@/components/hero/binary-city-scroll";
import { useLocale } from "@/components/site-header/locale-context";
import { MeteorField } from "./meteor-field";

const GAME_URL = "https://recoveryprotocel.vercel.app/";

type Phase = "idle" | "meteor" | "impact" | "alert" | "cta";

const PHASE_MS: Record<Phase, number> = {
  idle: 5000,
  meteor: 700,
  impact: 500,
  alert: 1400,
  cta: 4000,
};

const NEXT_PHASE: Record<Phase, Phase> = {
  idle: "meteor",
  meteor: "impact",
  impact: "alert",
  alert: "cta",
  cta: "idle",
};

const COPY = {
  alert: { ko: "경보 · 경보", en: "ALERT · ALERT" },
  breach: { ko: "AI 감염 신호 감지됨", en: "Infected signal detected" },
  cta: { ko: "PLAY THE GAME", en: "PLAY THE GAME" },
};

/** Loops the binary-city cell through a tiny fiction: a meteor shower falls,
 * the city glitches out under a red alert, then a link to the actual game
 * (recoveryprotocel.vercel.app) surfaces as the payoff — reusing the city
 * itself as the teaser rather than bolting on a separate promo banner. */
export function HeroCityTeaser() {
  const { locale } = useLocale();
  const [phase, setPhase] = useState<Phase>("idle");
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (reducedMotion) return;
    const t = setTimeout(() => setPhase((p) => NEXT_PHASE[p]), PHASE_MS[phase]);
    return () => clearTimeout(t);
  }, [phase, reducedMotion]);

  const showImpactFx = !reducedMotion && (phase === "impact" || phase === "alert");
  const showCta = reducedMotion || phase === "cta";

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <BinaryCityScroll
        className={clsx(phase === "impact" && !reducedMotion && "animate-teaser-shake")}
      />

      {!reducedMotion && phase === "meteor" && <MeteorField count={4} />}

      {showImpactFx && (
        <div
          className="pointer-events-none absolute inset-0 animate-teaser-flash bg-red-600/25"
          aria-hidden
        />
      )}

      {!reducedMotion && phase === "alert" && (
        <div
          className="animate-teaser-alert-blink pointer-events-none absolute inset-x-3 bottom-3 rounded-xl border border-red-500/70 bg-black/85 px-3 py-2 font-mono text-[10px] text-red-400 shadow-[0_0_20px_rgba(220,38,38,0.5)] md:inset-x-4 md:bottom-4 md:text-xs"
          aria-hidden
        >
          <div className="tracking-widest">{COPY.alert[locale]}</div>
          <div className="mt-0.5 text-red-300/80">{COPY.breach[locale]}</div>
        </div>
      )}

      {showCta && (
        <a
          href={GAME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(
            "absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px]",
            !reducedMotion && "animate-teaser-cta-in"
          )}
        >
          <span className="rounded-full border border-red-500/70 bg-black/70 px-5 py-2.5 font-display text-base italic text-paper shadow-[0_0_30px_rgba(220,38,38,0.45)] md:text-lg">
            ▶ {COPY.cta[locale]}
          </span>
        </a>
      )}
    </div>
  );
}
