"use client";

import Link from "next/link";
import type { WorkProject } from "@/lib/work-content";
import { useLocale } from "@/components/site-header/locale-context";
import { Gnb } from "@/components/site-header/gnb";
import { ThemeSection } from "@/components/site-header/theme-section";
import { SiteFooter } from "@/components/footer/site-footer";
import { NoScrollSnap } from "@/components/ui/no-scroll-snap";
import { WorkArrowIcon } from "@/components/work/work-arrow-icon";
import { WorkDesignGuide } from "@/components/work/work-design-guide";

const COPY = {
  back: { ko: "Work로 돌아가기", en: "Back to Work" },
  visit: { ko: "사이트 방문하기", en: "Visit site" },
  prev: { ko: "이전 프로젝트", en: "Previous" },
  next: { ko: "다음 프로젝트", en: "Next" },
  skills: { ko: "사용 스킬", en: "Skills" },
  process: { ko: "작업 노트", en: "Process Notes" },
};

interface WorkDetailClientProps {
  project: WorkProject;
  prev: WorkProject | null;
  next: WorkProject | null;
}

export function WorkDetailClient({ project, prev, next }: WorkDetailClientProps) {
  const { locale } = useLocale();

  return (
    <>
      <NoScrollSnap />
      <Gnb />
      <ThemeSection theme="dark">
        <main className="min-h-screen bg-ink pb-24 pt-[104px] md:pt-[132px]">
          <div className="wrap">
            <Link
              href="/work"
              className="group inline-flex items-center gap-2 text-xs text-white/50 transition-colors duration-200 hover:text-paper md:text-sm"
            >
              <WorkArrowIcon className="h-3.5 w-3.5 rotate-[225deg] transition-transform duration-300 group-hover:-translate-x-0.5" />
              {COPY.back[locale]}
            </Link>

            <div className="mt-8 grid gap-10 md:mt-14 md:grid-cols-2 md:gap-16">
              <div className="md:sticky md:top-[132px] md:h-fit md:self-start">
                <span className="font-display text-sm italic text-white/30">
                  {project.index}
                </span>
                <h1 className="mt-3 font-display text-4xl italic leading-tight text-paper md:text-6xl">
                  {project.title[locale]}
                </h1>
                <p className="mt-4 text-sm text-white/50 md:text-base">
                  {project.category[locale]}
                </p>

                {(project.tags ?? []).length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.tags!.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-wide text-white/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {(project.skills ?? []).length > 0 && (
                  <div className="mt-6 max-w-md">
                    <span className="font-display text-xs italic text-white/30">
                      {COPY.skills[locale]}
                    </span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.skills!.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-white/50"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <p className="mt-8 max-w-md text-base leading-relaxed text-white/70">
                  {project.description ? project.description[locale] : project.category[locale]}
                </p>

                {project.process && (
                  <div className="mt-6 max-w-md">
                    <span className="font-display text-xs italic text-white/30">
                      {COPY.process[locale]}
                    </span>
                    <p className="mt-2 text-sm leading-relaxed text-white/50">
                      {project.process[locale]}
                    </p>
                  </div>
                )}

                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-10 inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm text-ink transition-opacity duration-200 hover:opacity-90"
                  >
                    {COPY.visit[locale]}
                    <WorkArrowIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )}
              </div>

              <div className="flex flex-col gap-4 md:pt-1">
                {project.video ? (
                  <video
                    src={project.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full rounded-2xl"
                  />
                ) : project.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.image}
                    alt={project.title[locale]}
                    className="w-full rounded-2xl object-cover"
                  />
                ) : (
                  <div className="aspect-video w-full rounded-2xl bg-white/5" />
                )}

                {project.designGuide && <WorkDesignGuide guide={project.designGuide} />}
              </div>
            </div>

            {(prev || next) && (
              <div className="mt-20 flex items-center justify-between border-t border-white/15 pt-8 md:mt-28">
                {prev ? (
                  <Link
                    href={`/work/${prev.index}`}
                    className="group flex flex-col items-start gap-1.5"
                  >
                    <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-white/35">
                      <WorkArrowIcon className="h-3 w-3 rotate-[225deg] transition-transform duration-300 group-hover:-translate-x-0.5" />
                      {COPY.prev[locale]}
                    </span>
                    <span className="font-display text-lg italic text-paper transition-transform duration-300 group-hover:-translate-x-1 md:text-2xl">
                      {prev.title[locale]}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}

                {next ? (
                  <Link
                    href={`/work/${next.index}`}
                    className="group flex flex-col items-end gap-1.5 text-right"
                  >
                    <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-white/35">
                      {COPY.next[locale]}
                      <WorkArrowIcon className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                    <span className="font-display text-lg italic text-paper transition-transform duration-300 group-hover:translate-x-1 md:text-2xl">
                      {next.title[locale]}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            )}
          </div>
        </main>
      </ThemeSection>
      <SiteFooter />
    </>
  );
}
