"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { useLocale } from "@/components/site-header/locale-context";

type Phase = "idle" | "fall" | "impact" | "repair" | "done";

const COPY = {
  breach: { ko: "운석 충돌 감지 — 섹터 붕괴", en: "Meteor impact — sector breach" },
  code: { ko: "복구 프로토콜 가동", en: "Recovery protocol engaged" },
  repair: { ko: "피해 섹터 복구 중", en: "Repairing damaged sector" },
  done: { ko: "복구 완료 — 위협 잔여물 제거 필요", en: "Restored — purge the leftover threats" },
};

const FIRST_MS = 4500;
const LOOP_MS = 16000;

/** A corrupted meteor periodically slams into the hero skyline: flash,
 * shockwave, screen shake, a breach alert, then a repair readout. The
 * impact also drops fresh virus signals into the canvas via `onImpact`. */
export function MeteorStrike({
  onImpact,
  onShake,
}: {
  onImpact?: (xPct: number, yPct: number) => void;
  onShake?: () => void;
}) {
  const { locale } = useLocale();
  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState({ x: 62, y: 52 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let raf = 0;

    function strike() {
      const t = { x: 35 + Math.random() * 45, y: 46 + Math.random() * 14 };
      setTarget(t);
      setProgress(0);
      setPhase("fall");
      timers.push(
        setTimeout(() => {
          setPhase("impact");
          onImpact?.(t.x, t.y);
          onShake?.();
        }, 1400)
      );
      timers.push(
        setTimeout(() => {
          setPhase("repair");
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / 2200);
            setProgress(p);
            if (p < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }, 3000)
      );
      timers.push(setTimeout(() => setPhase("done"), 5400));
      timers.push(setTimeout(() => setPhase("idle"), 7600));
      timers.push(setTimeout(strike, LOOP_MS));
    }

    timers.push(setTimeout(strike, FIRST_MS));
    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(raf);
    };
  }, [onImpact, onShake]);

  const alertTone = phase === "impact" ? "border-alert text-alert" : phase === "repair" ? "border-acid text-acid" : "border-neon text-neon";

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {/* Preload so the first strike isn't an empty frame while the art downloads. */}
      <link rel="preload" as="image" href="/media/fx/meteor.webp" />
      {phase === "fall" && (
        <div className="absolute" style={{ left: `${target.x}%`, top: `${target.y}%` }}>
          {/* The art's burning head sits near its lower-left — shift it onto the target. */}
          <div className="absolute h-[220px] w-[220px] -translate-x-[25%] -translate-y-[75%] md:h-[300px] md:w-[300px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/fx/meteor.webp"
              alt=""
              className="meteor-fall h-full w-full max-w-none"
              style={{ "--mx0": "38vw", "--my0": "-48vh" } as React.CSSProperties}
            />
          </div>
        </div>
      )}

      {phase === "impact" && (
        <>
          <div
            className="impact-flash absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${target.x}% ${target.y}%, rgba(255,180,220,0.9), rgba(255,43,214,0.35) 25%, transparent 60%)`,
            }}
          />
          <div
            className="shockwave absolute h-[70vmin] w-[70vmin] rounded-full border-2 border-magenta shadow-[0_0_40px_var(--magenta)]"
            style={{ left: `${target.x}%`, top: `${target.y}%` }}
          />
          <div
            className="shockwave absolute h-[40vmin] w-[40vmin] rounded-full border border-neon [animation-delay:120ms]"
            style={{ left: `${target.x}%`, top: `${target.y}%` }}
          />
        </>
      )}

      {phase !== "idle" && phase !== "fall" && (
        <div
          className={clsx(
            "ko-safe absolute left-1/2 top-[22%] w-[min(88vw,380px)] -translate-x-1/2 border bg-ink/85 p-4 font-mono text-xs backdrop-blur-md transition-colors md:left-auto md:right-[6%] md:top-[30%] md:translate-x-0",
            alertTone,
            phase === "impact" && "flicker shadow-[0_0_30px_rgba(255,51,85,0.45)]"
          )}
        >
          <div className="text-[10px] uppercase tracking-[0.3em] opacity-70">
            {phase === "impact" ? "▲ Alert · code 0xF4LL" : phase === "repair" ? "◐ Recovery" : "● Status"}
          </div>
          <div className="mt-2 text-sm text-paper">
            {phase === "impact" ? COPY.breach[locale] : phase === "repair" ? COPY.repair[locale] : COPY.done[locale]}
          </div>
          {phase === "impact" && <div className="mt-1 opacity-80">&gt; {COPY.code[locale]}...</div>}
          {phase === "repair" && (
            <div className="mt-3 flex items-center gap-3">
              <div className="flex h-2 flex-1 gap-[2px]">
                {Array.from({ length: 20 }).map((_, i) => (
                  <span key={i} className={clsx("flex-1", i / 20 < progress ? "bg-acid shadow-[0_0_6px_var(--acid)]" : "bg-acid/15")} />
                ))}
              </div>
              <span className="tabular-nums">{Math.round(progress * 100)}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
