"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import type { WorkProject } from "@/lib/work-content";
import { markRestored, useRestored } from "@/lib/mission-progress";
import { useLocale } from "@/components/site-header/locale-context";
import { Gnb } from "@/components/site-header/gnb";
import { SiteFooter } from "@/components/footer/site-footer";
import { WorkDesignGuide } from "@/components/work/work-design-guide";
import { ImageShowcase } from "@/components/work/image-showcase";
import { Chip, useRevealChildren } from "@/components/cyber/primitives";
import { MissionCover, missionNumber } from "@/components/cyber/mission-browser";
import { StoryBlockContent } from "@/components/cyber/story-block";
import { LiveEmbed } from "@/components/cyber/live-embed";
import { RecoveryToast } from "@/components/cyber/recovery-toast";

const COPY = {
  back: { ko: "미션 아카이브", en: "Mission archive" },
  file: { ko: "미션 파일", en: "Mission file" },
  visit: { ko: "라이브 사이트", en: "Live site" },
  client: { ko: "클라이언트", en: "Client" },
  role: { ko: "역할", en: "Role" },
  stage: { ko: "단계", en: "Stage" },
  tools: { ko: "스킬", en: "Skills" },
  notes: { ko: "작업 노트", en: "Field notes" },
  challenge: { ko: "문제 상황", en: "Challenge" },
  objective: { ko: "목표", en: "Objective" },
  process: { ko: "설계 과정", en: "Process" },
  screens: { ko: "화면", en: "Screens" },
  debrief: { ko: "회고", en: "Debrief" },
  next: { ko: "다음 미션", en: "Next mission" },
  prev: { ko: "이전 미션", en: "Previous" },
  shipped: { ko: "완료", en: "Shipped" },
};

/** Two-column case-study row: sticky numbered label left, content right. */
function Section({
  n,
  label,
  children,
  wide,
  after,
}: {
  n: number;
  label: string;
  children: React.ReactNode;
  wide?: boolean;
  /** Full-width row under the label + content columns (live embeds need the room). */
  after?: React.ReactNode;
}) {
  return (
    <section data-reveal className="grid gap-6 border-t border-white/10 py-14 md:py-20 lg:grid-cols-[minmax(220px,3fr)_9fr] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:h-fit">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-neon">
          {String(n).padStart(2, "0")} <span className="text-white/30">{"//"}</span>
        </div>
        <h2 className="ko-safe mt-2 font-display text-2xl font-semibold uppercase tracking-wide text-paper md:text-3xl">{label}</h2>
      </div>
      <div className={clsx("min-w-0", !wide && "max-w-4xl")}>{children}</div>
      {after && <div className="min-w-0 lg:col-span-2">{after}</div>}
    </section>
  );
}


interface WorkDetailClientProps {
  project: WorkProject;
  prev: WorkProject | null;
  next: WorkProject | null;
}

export function WorkDetailClient({ project, prev, next }: WorkDetailClientProps) {
  const { locale } = useLocale();
  const restored = useRestored();
  const [toast, setToast] = useState(false);
  const ref = useRevealChildren<HTMLElement>();
  const num = missionNumber(project);

  // Opening a mission file restores its sector — celebrate only the first time.
  useEffect(() => {
    const already = (() => {
      try {
        return JSON.parse(localStorage.getItem("rp-restored") ?? "[]").includes(project.index);
      } catch {
        return false;
      }
    })();
    markRestored(project.index);
    if (already) return;
    const show = setTimeout(() => setToast(true), 500);
    return () => clearTimeout(show);
  }, [project.index]);

  const hideToast = useCallback(() => setToast(false), []);
  const isRestored = restored.includes(project.index);

  let n = 0;
  const sections: React.ReactNode[] = [];
  if (project.process) {
    sections.push(
      <Section key="notes" n={++n} label={COPY.notes[locale]}>
        <p className="text-[15px] leading-[1.85] text-white/65 md:text-[17px]">{project.process[locale]}</p>
      </Section>
    );
  }
  if (project.situation) {
    sections.push(
      <Section key="challenge" n={++n} label={COPY.challenge[locale]}>
        <p className="font-display text-xl leading-relaxed text-white/80 md:text-2xl">{project.situation[locale]}</p>
      </Section>
    );
  }
  if (project.task) {
    sections.push(
      <Section key="objective" n={++n} label={COPY.objective[locale]}>
        <div className="brackets notch relative border border-neon/40 bg-neon/[0.05] p-7 md:p-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon">◎ Target</div>
          <p className="mt-4 text-xl font-semibold leading-snug text-paper md:text-3xl">{project.task[locale]}</p>
        </div>
      </Section>
    );
  }
  for (const block of project.story ?? []) {
    sections.push(
      <Section
        key={block.id}
        n={++n}
        label={block.label[locale]}
        wide={Boolean(block.images)}
        after={block.embed && <LiveEmbed {...block.embed} />}
      >
        <StoryBlockContent block={block} skipEmbed />
      </Section>
    );
  }
  if (project.designGuide) {
    sections.push(
      <Section key="process" n={++n} label={COPY.process[locale]} wide>
        <div className="case-content">
          <WorkDesignGuide guide={project.designGuide} embedded />
        </div>
      </Section>
    );
  }

  return (
    <>
      <Gnb />
      <RecoveryToast run={toast} onDone={hideToast} />
      <main ref={ref} className="min-h-screen pb-24 pt-28 md:pt-36">
        <div className="wrap">
          {/* ---- Hero ---- */}
          <div className="ko-safe flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.25em]">
            <Link href="/work" className="group inline-flex items-center gap-2 text-white/50 transition-colors hover:text-neon">
              <span className="transition-transform group-hover:-translate-x-1">←</span> {COPY.back[locale]}
            </Link>
            <span className="flex items-center gap-3 text-white/40">
              {COPY.file[locale]} MSN-{num}
              <Chip tone={isRestored ? "neon" : "alert"}>● {isRestored ? "Restored" : "Infected"}</Chip>
            </span>
          </div>

          <div data-reveal className="mt-10 md:mt-16">
            <p className="ko-safe font-mono text-xs uppercase tracking-[0.3em] text-magenta">&gt; {project.category[locale]}</p>
            <h1 className="mt-4 max-w-6xl font-display text-[clamp(2.6rem,8vw,7.5rem)] font-bold uppercase leading-[0.9] tracking-tight text-paper">
              {project.title[locale]}
            </h1>
            {project.description && (
              <p className="mt-8 max-w-3xl text-base leading-[1.8] text-white/65 md:text-xl">{project.description[locale]}</p>
            )}
          </div>

          {/* ---- Meta grid ---- */}
          <dl data-reveal className="mt-12 grid grid-cols-2 border-l border-t border-white/10 md:mt-16 lg:auto-cols-fr lg:grid-flow-col">
            {[
              { k: COPY.client[locale], v: project.client?.[locale] ?? "—" },
              {
                k: COPY.role[locale],
                v: project.roles?.length ? (
                  <ul className="space-y-1.5">
                    {project.roles.map((r, i) => (
                      <li key={i}>
                        <span className="text-paper">{r.label[locale]}</span>
                        <span className="block text-xs text-white/40">{r.value[locale]}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  "—"
                ),
              },
              { k: COPY.stage[locale], v: project.stage?.[locale] ?? (project.url ? COPY.shipped[locale] : "—") },
              {
                k: COPY.tools[locale],
                v: project.skills?.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {project.skills.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                ) : (
                  "—"
                ),
              },
            ]
              .filter(({ v }) => v !== "—")
              .map(({ k, v }) => (
              <div key={k} className="min-w-0 border-b border-r border-white/10 p-4 md:p-6">
                <dt className="ko-safe font-mono text-[10px] uppercase tracking-[0.3em] text-neon/70">{k}</dt>
                <dd className="mt-3 text-sm text-white/70">{v}</dd>
              </div>
            ))}
          </dl>

          {(project.url || project.links?.length) && (
            <div data-reveal className="ko-safe mt-8 flex flex-wrap gap-3">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="notch-sm inline-flex items-center gap-2 bg-neon px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-paper"
                >
                  {COPY.visit[locale]} ↗
                </a>
              )}
              {project.links?.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="notch-sm inline-flex items-center gap-2 border border-neon/50 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-neon transition-colors hover:bg-neon hover:text-ink"
                >
                  {l.label[locale]} ↗
                </a>
              ))}
            </div>
          )}

          {/* ---- Cover ---- */}
          <div
            data-reveal
            className={clsx("brackets mt-14 border border-white/10 md:mt-20", !project.coverBg && "stage-bg")}
            style={project.coverBg ? { background: project.coverBg } : undefined}
          >
            <div className="relative overflow-hidden">
              {project.video ? (
                <video src={project.video} autoPlay loop muted playsInline className="stage-img mx-auto block max-h-[72svh] w-full" />
              ) : (
                <MissionCover
                  project={project}
                  className={clsx("block w-full", (project.cover ?? project.image) ? "stage-img mx-auto max-h-[72svh] !bg-transparent" : "aspect-[16/7]")}
                />
              )}
              <div className="scanlines pointer-events-none absolute inset-0 opacity-30" />
            </div>
          </div>

          {/* ---- Sections ---- */}
          <div className="mt-16 md:mt-24">{sections}</div>
        </div>

        {project.imageShowcase && (
          <div className="wrap case-content" data-reveal>
            <div className="border-t border-white/10 pt-14 md:pt-20">
              <ImageShowcase showcase={project.imageShowcase} />
            </div>
          </div>
        )}

        {project.reflection && (
          <div className="wrap">
            <section data-reveal className="relative mt-16 overflow-hidden border border-magenta/30 bg-magenta/[0.04] px-6 py-16 text-center md:mt-24 md:px-16 md:py-24">
              <div className="scanlines pointer-events-none absolute inset-0" />
              <div className="relative font-mono text-[11px] uppercase tracking-[0.3em] text-magenta">
                {String(++n).padStart(2, "0")} {"//"} {COPY.debrief[locale]}
              </div>
              <p className="relative mx-auto mt-6 max-w-4xl font-display text-xl leading-relaxed text-paper md:text-3xl">
                “{project.reflection[locale]}”
              </p>
            </section>
          </div>
        )}

        {/* ---- Next mission ---- */}
        <div className="wrap mt-24 md:mt-32">
          {next && (
            <Link href={`/work/${next.index}`} className="group relative block overflow-hidden border border-white/10 transition-colors hover:border-neon/60">
              <div className="absolute inset-0 opacity-25 transition-opacity duration-500 group-hover:opacity-45" style={next.coverBg ? { background: next.coverBg } : undefined}>
                <MissionCover project={next} className="h-full w-full" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
              <div className="relative flex flex-col gap-6 p-8 md:flex-row md:items-end md:justify-between md:p-14">
                <div>
                  <div className="ko-safe font-mono text-[11px] uppercase tracking-[0.3em] text-neon">{COPY.next[locale]} — MSN-{missionNumber(next)}</div>
                  <div className="mt-4 font-display text-4xl font-bold uppercase leading-none text-paper transition-colors group-hover:text-neon md:text-7xl">
                    {next.title[locale]}
                  </div>
                  <div className="mt-3 text-sm text-white/50">{next.category[locale]}</div>
                </div>
                <span className="flex h-16 w-16 shrink-0 items-center justify-center border border-neon/50 text-2xl text-neon transition-all group-hover:bg-neon group-hover:text-ink">
                  ▶
                </span>
              </div>
            </Link>
          )}
          {prev && (
            <Link href={`/work/${prev.index}`} className="ko-safe mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-white/40 transition-colors hover:text-neon">
              ← {COPY.prev[locale]}: {prev.title[locale]}
            </Link>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
