"use client";

import Link from "next/link";
import { useLocale } from "@/components/site-header/locale-context";
import { ContactActions } from "@/components/work/contact-actions";
import { VISIBLE_WORK_PROJECTS } from "@/lib/work-content";
import { resetRestored, useRestored } from "@/lib/mission-progress";
import { SectionHeader, useRevealChildren } from "./primitives";
import { REPLAY_EVENT } from "./world-saved";
import { RestoredWorldCanvas } from "./restored-world-canvas";

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
  status: { ko: "출동 대기 중", en: "on call" },
};

/** The operator's "personal code": an ID card written as a config object,
 * with the visitor's live rescue progress folded into it. */
function OperatorCode({ restoredCount, next }: { restoredCount: number; next?: string }) {
  const { locale } = useLocale();
  const total = VISIBLE_WORK_PROJECTS.length;
  const pct = Math.round((restoredCount / total) * 100);
  const str = (v: string) => <span className="text-acid">&apos;{v}&apos;</span>;
  const lines: { k: string; v: React.ReactNode }[] = [
    { k: "name", v: str("Soomin Park") },
    { k: "class", v: str("UI·UX Designer / FE") },
    { k: "base", v: str("Seoul ⇄ Vancouver") },
    { k: "stack", v: <>[{str("Figma")}, {str("React")}, {str("AI")}]</> },
    { k: "sectors", v: <span className="text-magenta">{total}</span> },
    { k: "restored", v: <span className={pct === 100 ? "text-acid" : "text-alert"}>{`${restoredCount}/${total}`}</span> },
    { k: "status", v: str(COPY.status[locale]) },
  ];

  return (
    <div data-reveal className="ko-safe brackets notch relative overflow-hidden border border-neon/30 bg-ink/80 font-mono text-xs backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 text-[10px] uppercase tracking-[0.25em] text-white/40">
        <span className="flex items-center gap-2">
          <span className="flex gap-1">
            <i className="h-2 w-2 rounded-full bg-alert/80" />
            <i className="h-2 w-2 rounded-full bg-acid/80" />
            <i className="h-2 w-2 rounded-full bg-neon/80" />
          </span>
          operator.id.ts
        </span>
        <span className="text-neon">● Verified</span>
      </div>

      <div className="flex gap-4 px-5 pt-5">
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center border border-neon/40 bg-neon/[0.06] font-display text-xl font-bold text-neon">
          SP
          <span className="scan-sweep pointer-events-none absolute inset-x-0 top-0 h-px bg-neon/80" />
        </div>
        <div className="min-w-0 self-center">
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/40">ID-0984 {"//"} Class A</div>
          <div className="mt-1 truncate font-display text-lg font-semibold text-paper">SOOMIN PARK</div>
        </div>
      </div>

      <pre className="no-scrollbar overflow-x-auto px-5 py-5 text-[11.5px] leading-[1.9] text-white/70">
        <span className="text-magenta">export const</span> <span className="text-neon">operator</span> = {"{"}
        {lines.map(({ k, v }) => (
          <span key={k} className="block pl-4">
            <span className="text-[#9fb7ff]">{k}</span>: {v},
          </span>
        ))}
        {"}"};
      </pre>

      <div className="px-5">
        <div className="flex justify-between text-[10px] uppercase tracking-[0.25em] text-white/40">
          <span>World integrity</span>
          <span className={pct === 100 ? "text-acid" : "text-neon"}>{pct}%</span>
        </div>
        <div className="mt-2 h-1.5 bg-white/10">
          <div className="h-full bg-gradient-to-r from-magenta via-neon to-acid transition-[width] duration-700" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-4 flex h-7 items-end gap-[2px]" aria-hidden>
          {Array.from({ length: 34 }).map((_, i) => (
            <span key={i} className="w-full bg-white/50" style={{ height: `${30 + ((i * 37) % 70)}%`, opacity: (i * 13) % 3 ? 0.7 : 0.25 }} />
          ))}
        </div>
      </div>

      <div className="flex gap-2 p-5">
        {next ? (
          <Link prefetch={false}
            href={`/work/${next}`}
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
  );
}

export function TransmissionSection() {
  const { locale } = useLocale();
  const ref = useRevealChildren<HTMLElement>();
  const restored = useRestored();
  const remaining = VISIBLE_WORK_PROJECTS.filter((p) => !restored.includes(p.index));
  const next = remaining[0];

  return (
    <section ref={ref} id="contact" className="relative scroll-mt-20 overflow-hidden pb-[500px] pt-24 md:pb-[560px] md:pt-28">
      {/* The restored world — the city from the hero, after the rescue. */}
      <div className="absolute inset-0" aria-hidden>
        <RestoredWorldCanvas className="absolute inset-0 h-full w-full" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-ink/70 to-transparent lg:block" />
      </div>
      <div className="wrap relative">
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

          <OperatorCode restoredCount={VISIBLE_WORK_PROJECTS.length - remaining.length} next={next?.index} />
        </div>

      </div>
    </section>
  );
}
