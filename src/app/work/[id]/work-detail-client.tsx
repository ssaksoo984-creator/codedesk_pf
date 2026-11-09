"use client";

import Link from "next/link";
import clsx from "clsx";
import type { WorkProject } from "@/lib/work-content";
import { PROJECT_MOTION } from "@/lib/project-media";
import { useLocale } from "@/components/site-header/locale-context";
import { WorkDesignGuide } from "@/components/work/work-design-guide";
import { ImageShowcase } from "@/components/work/image-showcase";
import { StoryBlockContent } from "@/components/cyber/story-block";
import { LiveEmbed } from "@/components/cyber/live-embed";
import { TaleWorkbench } from "@/components/tale/tale-workbench";
import { MotionVideo } from "@/components/site/motion-video";
import { useReveal } from "@/components/site/reveal";
import { Footer } from "@/components/site/contact";
import { TaleBrand } from "@/components/site/tale-brand";

const COPY = {
  back: { ko: "전체 작업", en: "All work" },
  visit: { ko: "라이브 사이트", en: "Live site" },
  client: { ko: "클라이언트", en: "Client" },
  role: { ko: "역할", en: "Role" },
  stage: { ko: "단계", en: "Stage" },
  tools: { ko: "스킬", en: "Skills" },
  notes: { ko: "작업 노트", en: "Notes" },
  challenge: { ko: "문제", en: "Challenge" },
  objective: { ko: "목표", en: "Goal" },
  process: { ko: "설계 과정", en: "Process" },
  debrief: { ko: "회고", en: "Reflection" },
  next: { ko: "다음 프로젝트", en: "Next project" },
  prev: { ko: "이전", en: "Previous" },
  shipped: { ko: "런칭", en: "Shipped" },
};

/** Two-column case-study row: sticky label left, content right. */
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
  after?: React.ReactNode;
}) {
  return (
    <section data-reveal className="grid gap-6 border-t border-paper/10 py-14 md:py-20 lg:grid-cols-[minmax(220px,3fr)_9fr] lg:gap-16">
      <div className="lg:sticky lg:top-28 lg:h-fit">
        <div className="font-mono text-[12px] text-paper/40">({String(n).padStart(2, "0")})</div>
        <h2 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-paper md:text-3xl">{label}</h2>
      </div>
      <div className={clsx("min-w-0", !wide && "max-w-4xl")}>{children}</div>
      {after && <div className="min-w-0 lg:col-span-2">{after}</div>}
    </section>
  );
}

function Cover({ project }: { project: WorkProject }) {
  const { locale } = useLocale();
  const m = PROJECT_MOTION[project.index];
  const still = project.cover ?? project.image;
  if (project.video || m) {
    return <MotionVideo src={project.video ?? m!.video} poster={m?.poster ?? still} className="!h-auto max-h-[78svh] w-full" />;
  }
  if (!still) return <div className="aspect-[16/8]" />;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={still} alt={project.title[locale]} className={clsx("block max-h-[78svh] w-full", project.coverFit === "contain" ? "object-contain" : "object-cover")} />
  );
}

interface WorkDetailClientProps {
  project: WorkProject;
  prev: WorkProject | null;
  next: WorkProject | null;
}

export function WorkDetailClient({ project, prev, next }: WorkDetailClientProps) {
  const { locale } = useLocale();
  const ref = useReveal<HTMLElement>();

  let n = 0;
  const sections: React.ReactNode[] = [];
  if (project.process) {
    sections.push(
      <Section key="notes" n={++n} label={COPY.notes[locale]}>
        <p className="text-[15px] leading-[1.85] text-paper/65 md:text-[17px]">{project.process[locale]}</p>
      </Section>
    );
  }
  if (project.situation) {
    sections.push(
      <Section key="challenge" n={++n} label={COPY.challenge[locale]}>
        <p className="text-xl leading-relaxed text-paper/80 md:text-2xl">{project.situation[locale]}</p>
      </Section>
    );
  }
  if (project.task) {
    sections.push(
      <Section key="objective" n={++n} label={COPY.objective[locale]}>
        <p className="text-[clamp(1.5rem,3vw,2.6rem)] font-bold leading-[1.2] tracking-[-0.03em] text-paper">{project.task[locale]}</p>
      </Section>
    );
  }
  if (project.index === "09") {
    sections.push(
      <Section key="brand" n={++n} label={locale === "ko" ? "브랜드 · 2026 리뉴얼" : "Brand · 2026 refresh"} wide>
        <TaleBrand />
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
        after={block.workbench ? <TaleWorkbench key={locale} startTab={block.workbench} /> : block.embed && <LiveEmbed {...block.embed} />}
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

  const meta = [
    { k: COPY.client[locale], v: project.client?.[locale] },
    {
      k: COPY.role[locale],
      v: project.roles?.length ? (
        <ul className="space-y-1.5">
          {project.roles.map((r, i) => (
            <li key={i}>
              <span className="text-paper">{r.label[locale]}</span>
              <span className="block text-xs text-paper/40">{r.value[locale]}</span>
            </li>
          ))}
        </ul>
      ) : undefined,
    },
    { k: COPY.stage[locale], v: project.stage?.[locale] ?? (project.url ? COPY.shipped[locale] : undefined) },
    {
      k: COPY.tools[locale],
      v: project.skills?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {project.skills.map((s) => (
            <span key={s} className="rounded-full border border-paper/15 px-2.5 py-1 text-[12px] text-paper/70">
              {s}
            </span>
          ))}
        </div>
      ) : undefined,
    },
  ].filter((x) => x.v);

  return (
    <>
      <main ref={ref} className="min-h-screen bg-ink pb-24 pt-28 text-paper md:pt-36">
        <div className="wrap">
          <Link href="/work" className="group inline-flex items-center gap-2 text-[14px] text-paper/50 transition-colors hover:text-paper">
            <span className="transition-transform group-hover:-translate-x-1">←</span> {COPY.back[locale]}
          </Link>

          <div className="mt-10 md:mt-14">
            <p className="font-mono text-[12px] text-paper/45">
              {project.index} · {project.category[locale]}
            </p>
            <h1 key={locale} className="display mt-5 max-w-6xl text-[clamp(2.8rem,9vw,8.5rem)]">
              <span className="word block">
                <span>{project.title[locale]}</span>
              </span>
            </h1>
            {project.description && (
              <p data-reveal className="mt-8 max-w-3xl text-[17px] leading-[1.75] text-paper/65 md:text-xl">
                {project.description[locale]}
              </p>
            )}
          </div>

          <dl data-reveal className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-paper/10 pt-8 md:mt-16 lg:auto-cols-fr lg:grid-flow-col">
            {meta.map(({ k, v }) => (
              <div key={k} className="min-w-0">
                <dt className="font-mono text-[12px] text-paper/40">{k}</dt>
                <dd className="mt-3 text-sm text-paper/75">{v}</dd>
              </div>
            ))}
          </dl>

          {(project.url || project.links?.length) && (
            <div data-reveal className="mt-10 flex flex-wrap gap-2">
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className="rounded-full bg-paper px-6 py-3.5 text-[15px] font-medium text-ink transition-colors hover:bg-accent hover:text-white">
                  {COPY.visit[locale]} ↗
                </a>
              )}
              {project.links?.map((l) => (
                <a
                  key={l.url}
                  href={locale === "en" && l.urlEn ? l.urlEn : l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-paper/20 px-6 py-3.5 text-[15px] transition-colors hover:border-paper"
                >
                  {l.label[locale]} ↗
                </a>
              ))}
            </div>
          )}

          <div
            data-reveal
            className="mt-14 overflow-hidden rounded-[24px] bg-ink-2 md:mt-20"
            style={project.coverBg && !PROJECT_MOTION[project.index] ? { background: project.coverBg } : undefined}
          >
            <Cover project={project} />
          </div>

          <div className="mt-16 md:mt-24">{sections}</div>
        </div>

        {project.imageShowcase && (
          <div className="wrap case-content" data-reveal>
            <div className="border-t border-paper/10 pt-14 md:pt-20">
              <ImageShowcase showcase={project.imageShowcase} />
            </div>
          </div>
        )}

        {project.reflection && (
          <div className="wrap">
            <section data-reveal className="mt-16 rounded-[28px] bg-paper px-6 py-16 text-ink md:mt-24 md:px-16 md:py-24">
              <div className="font-mono text-[12px] text-stone">
                ({String(++n).padStart(2, "0")}) {COPY.debrief[locale]}
              </div>
              <p className="mt-6 max-w-5xl text-[clamp(1.4rem,3vw,2.6rem)] font-bold leading-[1.25] tracking-[-0.03em]">“{project.reflection[locale]}”</p>
            </section>
          </div>
        )}

        <div className="wrap mt-24 md:mt-32">
          {next && (
            <Link href={`/work/${next.index}`} data-cursor={COPY.next[locale]} className="group grid gap-6 overflow-hidden rounded-[28px] bg-ink-2 p-4 md:grid-cols-[1fr_1.2fr] md:p-6">
              <div className="flex flex-col justify-between p-2 md:p-4">
                <div className="font-mono text-[12px] text-paper/45">{COPY.next[locale]} →</div>
                <div>
                  <div className="display mt-6 text-[clamp(2.2rem,6vw,5.5rem)] transition-colors group-hover:text-accent">{next.title[locale]}</div>
                  <div className="mt-3 text-[15px] text-paper/50">{next.category[locale]}</div>
                </div>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-ink">
                {PROJECT_MOTION[next.index] ? (
                  <MotionVideo src={PROJECT_MOTION[next.index].video} poster={PROJECT_MOTION[next.index].poster} className="transition-transform duration-[1.2s] group-hover:scale-[1.03]" />
                ) : (
                  (next.cover ?? next.image) && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={next.cover ?? next.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                  )
                )}
              </div>
            </Link>
          )}
          {prev && (
            <Link href={`/work/${prev.index}`} className="mt-5 inline-flex items-center gap-2 text-[14px] text-paper/45 transition-colors hover:text-paper">
              ← {COPY.prev[locale]}: {prev.title[locale]}
            </Link>
          )}
        </div>
      </main>
      <Footer dark />
    </>
  );
}
