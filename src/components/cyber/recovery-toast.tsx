"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { useLocale } from "@/components/site-header/locale-context";

const LOG = {
  ko: ["손상된 레이아웃 스캔", "정보 구조 패치 적용", "UI 컴포넌트 재컴파일", "사용자 경로 동기화"],
  en: ["Scanning broken layout", "Applying IA patch", "Recompiling UI components", "Syncing user paths"],
};

const COPY = {
  repairing: { ko: "섹터 복구 중", en: "Restoring sector" },
  restored: { ko: "섹터 복구 완료", en: "Sector restored" },
  sub: { ko: "세계 복구율이 올라갔습니다", en: "World integrity increased" },
};

const REPAIR_MS = 1800;
const HOLD_MS = 1700;

/** First-visit celebration on a mission page: SYS-BOT runs a short repair
 * readout (progress + log), then flips to "restored". */
export function RecoveryToast({ run, onDone }: { run: boolean; onDone: () => void }) {
  const { locale } = useLocale();
  const [p, setP] = useState(0);

  useEffect(() => {
    if (!run) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const v = Math.min(1, (now - start) / REPAIR_MS);
      setP(v);
      if (v < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const t = setTimeout(onDone, REPAIR_MS + HOLD_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [run, onDone]);

  const done = p >= 1;
  const logIndex = Math.min(LOG.ko.length - 1, Math.floor(p * LOG.ko.length));

  return (
    <div
      aria-live="polite"
      className={clsx(
        "pointer-events-none fixed left-1/2 top-20 z-[60] w-[min(92vw,420px)] -translate-x-1/2 transition-all duration-500 md:top-24",
        run ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
      )}
    >
      {run && (
        <div
          className={clsx(
            "ko-safe notch flex items-center gap-4 border bg-ink/90 p-4 font-mono backdrop-blur-md transition-colors",
            done ? "border-neon shadow-[0_0_40px_rgba(0,240,255,0.35)]" : "border-acid/70 shadow-[0_0_30px_rgba(232,255,58,0.2)]"
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/fx/bot_alt.webp" alt="" className={clsx("h-16 w-16 shrink-0 object-contain", !done && "bot-glitch")} />
          <div className="min-w-0 flex-1">
            <div className={clsx("text-sm uppercase tracking-[0.2em]", done ? "text-neon text-glow" : "text-acid")}>
              {done ? `✓ ${COPY.restored[locale]}` : `◐ ${COPY.repairing[locale]}`}
            </div>
            {done ? (
              <div className="mt-1 text-[11px] text-white/55">{COPY.sub[locale]}</div>
            ) : (
              <>
                <div className="mt-1 truncate text-[11px] text-white/55">&gt; {LOG[locale][logIndex]}...</div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 bg-acid/15">
                    <div className="h-full bg-acid shadow-[0_0_8px_var(--acid)]" style={{ width: `${p * 100}%` }} />
                  </div>
                  <span className="text-[10px] tabular-nums text-acid">{Math.round(p * 100)}%</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
