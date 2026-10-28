"use client";

import { useLocale } from "@/components/site-header/locale-context";
import { ABOUT_SLIDES } from "@/lib/about-content";
import { SERVICES, SERVICE_INTRO } from "@/lib/service-content";
import { VISIBLE_WORK_PROJECTS } from "@/lib/work-content";
import { Chip, SectionHeader, useRevealChildren } from "./primitives";

const COPY = {
  directives: { ko: "핵심 원칙", en: "Core directives" },
  loadout: { ko: "장착 능력", en: "Loadout" },
  tools: { ko: "실전 투입 기술", en: "Field-tested skills" },
};

const MODULE_GLYPHS = ["◇", "◎", "⌁", "◉", "⟁"];

/** "About" reimagined as the operator's profile: the three design beliefs
 * become directives, the five working principles become an ability loadout,
 * and the skill cloud is pulled straight from the projects themselves. */
export function OperatorSection() {
  const { locale } = useLocale();
  const ref = useRevealChildren<HTMLElement>();

  const skills = Array.from(new Set(VISIBLE_WORK_PROJECTS.flatMap((p) => p.skills ?? [])));

  return (
    <section ref={ref} id="operator" className="relative scroll-mt-20 py-24 md:py-28">
      <div className="wrap">
        <SectionHeader
          index="01"
          label="Operator profile"
          title={
            <>
              Designer <span className="text-neon">×</span>
              <br />
              <span className="text-white/40">Code</span> Operator
            </>
          }
        />

        <div className="grid gap-12 lg:grid-cols-[280px_1fr] lg:gap-20">
          <p data-reveal className="ko-safe font-mono text-[11px] uppercase tracking-[0.3em] text-white/40 lg:sticky lg:top-32 lg:h-fit">
            {"//"} {COPY.directives[locale]}
          </p>
          <ol className="flex flex-col">
            {ABOUT_SLIDES.map((s, i) => (
              <li
                key={i}
                data-reveal
                style={{ animationDelay: `${i * 80}ms` }}
                className="group grid gap-4 border-t border-white/10 py-8 transition-colors hover:border-neon/50 md:grid-cols-[90px_1fr_1.1fr] md:gap-8 md:py-10"
              >
                <span className="font-mono text-sm text-neon">DIR-0{i + 1}</span>
                <h3 className="font-display text-2xl font-semibold leading-tight text-paper transition-colors group-hover:text-neon md:text-3xl">
                  {s.title[locale]}
                </h3>
                <p className="text-[15px] leading-relaxed text-white/60">{s.desc[locale]}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-24 grid gap-12 lg:grid-cols-[280px_1fr] lg:gap-20">
          <div data-reveal className="lg:sticky lg:top-32 lg:h-fit">
            <p className="ko-safe font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">{"//"} {COPY.loadout[locale]}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/50">{SERVICE_INTRO.description[locale]}</p>
          </div>
          <div className="grid gap-px bg-neon/10 sm:grid-cols-2">
            {SERVICES.map((s, i) => (
              <article
                key={s.index}
                data-reveal
                style={{ animationDelay: `${i * 70}ms` }}
                className="group relative bg-ink p-6 transition-colors hover:bg-[#071019] md:p-8 [&:last-child]:sm:col-span-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-white/35">MOD-{s.index}</span>
                  <span className="text-2xl text-neon/70 transition-transform duration-500 group-hover:rotate-180 group-hover:text-magenta">
                    {MODULE_GLYPHS[i]}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold text-paper md:text-2xl">{s.title[locale]}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{s.description[locale]}</p>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-neon shadow-[0_0_10px_var(--neon)] transition-all duration-500 group-hover:w-full" />
              </article>
            ))}
          </div>
        </div>

        <div data-reveal className="mt-20 flex flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <span className="shrink-0 ko-safe font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
            {"//"} {COPY.tools[locale]}
          </span>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
