"use client";

import Link from "next/link";
import { VISIBLE_WORK_PROJECTS } from "@/lib/work-content";
import { PROJECT_MOTION } from "@/lib/project-media";
import { useLocale } from "@/components/site-header/locale-context";
import { MotionVideo } from "./motion-video";
import { useReveal } from "./reveal";

const FEATURED = ["09", "11", "10", "04", "06", "02"];

const COPY = {
  eyebrow: { ko: "선택한 작업", en: "Selected work" },
  title: { ko: "실제로 만들고, 실제로 쓰이는 것들.", en: "Things that shipped, and things people use." },
  all: { ko: "전체 작업 보기", en: "All projects" },
  view: { ko: "케이스 보기", en: "View case" },
};

/** Featured projects as stacked sticky cards — each one slides over the
 * last as you scroll, its clip playing only while visible. */
export function WorkStack() {
  const { locale } = useLocale();
  const ref = useReveal<HTMLElement>();
  const items = FEATURED.map((id) => VISIBLE_WORK_PROJECTS.find((p) => p.index === id)!).filter(Boolean);

  return (
    <section ref={ref} id="work" className="scroll-mt-24 bg-paper pb-24 pt-16 text-ink md:pb-36 md:pt-24">
      <div className="wrap">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 md:mb-20">
          <div>
            <p data-reveal className="font-mono text-[12px] text-stone">
              ({String(items.length).padStart(2, "0")}) {COPY.eyebrow[locale]}
            </p>
            <h2 data-reveal className="display mt-4 max-w-4xl text-[clamp(2.4rem,6vw,5.5rem)]">
              {COPY.title[locale]}
            </h2>
          </div>
          <Link data-reveal href="/work" className="rounded-full border border-ink/15 px-6 py-3 text-[15px] transition-colors hover:border-ink">
            {COPY.all[locale]} ({VISIBLE_WORK_PROJECTS.length}) →
          </Link>
        </div>

        <div className="flex flex-col gap-[6vh]">
          {items.map((p, i) => {
            const m = PROJECT_MOTION[p.index];
            return (
              <Link
                key={p.index}
                href={`/work/${p.index}`}
                data-cursor={COPY.view[locale]}
                className="group sticky grid min-h-[72vh] gap-6 overflow-hidden rounded-[28px] bg-ink p-4 text-paper shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.35)] md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)] md:gap-10 md:p-6"
                style={{ top: `calc(92px + ${i * 14}px)` }}
              >
                <div className="flex flex-col justify-between p-2 md:p-4">
                  <div>
                    <div className="flex items-center gap-3 font-mono text-[12px] text-paper/45">
                      <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                      <span>{p.year ?? p.stage?.[locale] ?? ""}</span>
                    </div>
                    <h3 className="display mt-5 text-[clamp(2rem,4.2vw,4rem)] transition-colors group-hover:text-accent">
                      {p.title[locale]}
                    </h3>
                    <p className="mt-3 text-[15px] text-paper/55">{p.category[locale]}</p>
                  </div>
                  <div>
                    {p.description && (
                      <p className="mt-8 line-clamp-4 max-w-md text-[15px] leading-relaxed text-paper/70">{p.description[locale]}</p>
                    )}
                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {(p.tags ?? []).map((t) => (
                        <span key={t} className="rounded-full border border-paper/15 px-3 py-1 text-[12px] text-paper/60">
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-paper px-5 py-3 text-[14px] font-medium text-ink transition-colors group-hover:bg-accent group-hover:text-white">
                      {COPY.view[locale]} →
                    </span>
                  </div>
                </div>
                <div className="relative min-h-[260px] overflow-hidden rounded-[20px] bg-ink-2">
                  {m && (
                    <MotionVideo
                      src={m.video}
                      poster={m.poster}
                      className="transition-transform duration-[1.2s] [transition-timing-function:var(--ease)] group-hover:scale-[1.03]"
                    />
                  )}
                  {m && (
                    <span className="absolute bottom-4 left-4 rounded-full bg-black/45 px-3 py-1.5 font-mono text-[11px] text-white/85">
                      ● {m.kind[locale]}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
