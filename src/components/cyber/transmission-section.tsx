"use client";

import Link from "next/link";
import { useLocale } from "@/components/site-header/locale-context";
import { ContactActions } from "@/components/work/contact-actions";
import { VISIBLE_WORK_PROJECTS } from "@/lib/work-content";
import { resetRestored, useRestored } from "@/lib/mission-progress";
import { SectionHeader, useRevealChildren } from "./primitives";
import { REPLAY_EVENT } from "./world-saved";

const COPY = {
  lead: {
    ko: "새로운 섹터에서 구조 요청이 오면 언제든 출동합니다. 첫 스케치부터 마지막 픽셀까지 함께 걷겠습니다.",
    en: "When a new sector calls for help, I deploy. From the first sketch to the last pixel — let's walk it together.",
  },
  remaining: (n: number) => ({
    ko: `아직 ${n}개 섹터가 감염 상태입니다. 미션을 계속하세요.`,
    en: `${n} sector${n === 1 ? "" : "s"} still infected. Continue the mission.`,
  }),
  complete: {
    ko: "모든 섹터 복구 완료 — 세계를 구해줘서 고마워요. 이제 연락만 남았습니다.",
    en: "All sectors restored — thanks for saving the world. Only one thing left: say hi.",
  },
  continue: { ko: "다음 미션으로", en: "Next mission" },
  replay: { ko: "처음부터 다시", en: "Start over" },
  celebrate: { ko: "축하 다시 보기", en: "Replay finale" },
};

export function TransmissionSection() {
  const { locale } = useLocale();
  const ref = useRevealChildren<HTMLElement>();
  const restored = useRestored();
  const remaining = VISIBLE_WORK_PROJECTS.filter((p) => !restored.includes(p.index));
  const next = remaining[0];

  return (
    <section ref={ref} id="contact" className="relative scroll-mt-20 py-24 md:py-28">
      <div className="wrap">
        <SectionHeader
          index="03"
          label="Transmission"
          title={
            <>
              Open a <span className="text-magenta text-glow-magenta">channel</span>
            </>
          }
        />

        <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-20">
          <div data-reveal className="min-w-0">
            <p className="mb-10 max-w-xl text-[15px] leading-relaxed text-white/60 md:text-lg">{COPY.lead[locale]}</p>
            <ContactActions />
          </div>

          <div data-reveal className="ko-safe brackets notch border border-neon/25 bg-ink/70 p-6 font-mono text-xs backdrop-blur-md">
            <div className="flex justify-between text-[10px] uppercase tracking-[0.25em] text-white/40">
              <span>Mission log</span>
              <span className={remaining.length ? "text-alert" : "text-acid"}>
                {VISIBLE_WORK_PROJECTS.length - remaining.length}/{VISIBLE_WORK_PROJECTS.length}
              </span>
            </div>
            <p className="mt-5 leading-relaxed text-white/70">
              &gt; {remaining.length ? COPY.remaining(remaining.length)[locale] : COPY.complete[locale]}
            </p>
            <ul className="mt-5 max-h-56 space-y-1.5 overflow-y-auto pr-1 text-[11px]">
              {VISIBLE_WORK_PROJECTS.map((p) => {
                const ok = restored.includes(p.index);
                return (
                  <li key={p.index} className="flex items-center justify-between gap-3">
                    <Link href={`/work/${p.index}`} className="truncate text-white/55 hover:text-neon">
                      {p.title[locale]}
                    </Link>
                    <span className={ok ? "text-neon" : "text-alert/80"}>{ok ? "OK" : "ERR"}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 flex gap-2">
              {next ? (
                <Link
                  href={`/work/${next.index}`}
                  className="flex-1 bg-neon px-4 py-3 text-center uppercase tracking-[0.2em] text-ink transition-colors hover:bg-paper"
                >
                  {COPY.continue[locale]} ▶
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new Event(REPLAY_EVENT))}
                    className="flex-1 bg-acid px-4 py-3 uppercase tracking-[0.2em] text-ink transition-colors hover:bg-paper"
                  >
                    ✦ {COPY.celebrate[locale]}
                  </button>
                  <button
                    type="button"
                    onClick={resetRestored}
                    className="border border-acid/60 px-4 py-3 uppercase tracking-[0.2em] text-acid transition-colors hover:bg-acid hover:text-ink"
                  >
                    ↺ {COPY.replay[locale]}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
