"use client";

import { useState } from "react";
import clsx from "clsx";
import type { WorkProject } from "@/lib/work-content";
import { useLocale } from "@/components/site-header/locale-context";
import { WorkDesignGuide } from "@/components/work/work-design-guide";
import { WorkArrowIcon } from "@/components/work/work-arrow-icon";

interface Copy {
  ko: string;
  en: string;
}

const COPY = {
  situation: { ko: "Situation", en: "Situation" },
  task: { ko: "Task", en: "Task" },
  more: { ko: "더 보기", en: "Read more" },
  less: { ko: "접기", en: "Show less" },
  situationTask: { ko: "Situation & Task", en: "Situation & Task" },
  action: { ko: "Action", en: "Action" },
  reflection: { ko: "Reflection", en: "Reflection" },
};

// Below this length, the situation quote already fits comfortably inside a
// 3-line clamp — showing a "read more" toggle that visibly does nothing
// reads as broken, so it's only offered past the point clamping would bite.
const SITUATION_CLAMP_THRESHOLD = 140;

/** Situation as a dark serif quote, Task as a tonally-opposite bright card,
 * so the problem→goal turn reads visually, not just in the copy. Lives as
 * the first tab's content in CaseStudyTabs, not the left meta column. */
function SituationTaskBlock({ situation, task }: { situation: Copy; task: Copy }) {
  const { locale } = useLocale();
  const [expanded, setExpanded] = useState(false);
  const text = situation[locale];
  const canClamp = text.length > SITUATION_CLAMP_THRESHOLD;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl bg-white/[0.04] p-5 md:p-6">
        <span className="font-display text-xs italic text-white/30">
          {COPY.situation[locale]}
        </span>
        <p
          className={clsx(
            "mt-3 font-point text-base italic leading-relaxed text-white/80 md:text-lg",
            canClamp && !expanded && "line-clamp-3"
          )}
        >
          {text}
        </p>
        {canClamp && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-2 text-xs text-white/40 underline underline-offset-2 transition-colors duration-200 hover:text-white/70"
          >
            {expanded ? COPY.less[locale] : COPY.more[locale]}
          </button>
        )}
      </div>

      <div className="rounded-2xl bg-paper px-5 py-7 text-center md:px-8">
        <WorkArrowIcon className="mx-auto h-4 w-4 text-ink/40" />
        <span className="mt-3 block font-display text-xs italic text-ink/40">
          {COPY.task[locale]}
        </span>
        <p className="mt-2 text-base font-semibold leading-snug text-ink md:text-lg">
          {task[locale]}
        </p>
      </div>
    </div>
  );
}

/** Right-column top-level tabs — Situation & Task / Action / Reflection.
 * Styled as an underline nav rather than WorkDesignGuide's own pill tabs,
 * so the top-level (case-study framing) and the nested Action sub-tabs
 * (concrete design artifacts) read as two distinct tiers instead of
 * blurring into one long row of identical pills. Action's content is
 * WorkDesignGuide itself, embedded so it only contributes its own
 * (already-existing) 01–05 sub-tab bar, not a second heading. */
export function CaseStudyTabs({ project }: { project: WorkProject }) {
  const { locale } = useLocale();
  type TabId = "situation" | "action" | "reflection";
  const hasSituation = Boolean(project.situation && project.task);
  const [activeId, setActiveId] = useState<TabId>(hasSituation ? "situation" : "action");

  const tabs: { id: TabId; label: string }[] = [
    ...(hasSituation ? ([{ id: "situation", label: COPY.situationTask[locale] }] as const) : []),
    { id: "action", label: COPY.action[locale] },
    ...(project.reflection ? ([{ id: "reflection", label: COPY.reflection[locale] }] as const) : []),
  ];

  return (
    <div>
      <div className="no-scrollbar flex gap-6 overflow-x-auto border-b border-white/10">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveId(t.id)}
            className={clsx(
              "relative shrink-0 pb-3 text-sm transition-colors duration-200",
              activeId === t.id ? "text-paper" : "text-white/40 hover:text-white/70"
            )}
          >
            {t.label}
            <span
              className={clsx(
                "absolute inset-x-0 -bottom-px h-0.5 bg-paper transition-opacity duration-200",
                activeId === t.id ? "opacity-100" : "opacity-0"
              )}
            />
          </button>
        ))}
      </div>

      <div className="mt-8">
        {activeId === "situation" && project.situation && project.task && (
          <SituationTaskBlock situation={project.situation} task={project.task} />
        )}
        {activeId === "action" && project.designGuide && (
          <WorkDesignGuide guide={project.designGuide} embedded />
        )}
        {activeId === "reflection" && project.reflection && (
          <ReflectionBlock reflection={project.reflection} />
        )}
      </div>
    </div>
  );
}

/** Symmetric with Situation — same serif quote treatment, but the background
 * flips to full dark so the section reads as a deliberate pause before the
 * page ends, not just another content block. */
function ReflectionBlock({ reflection }: { reflection: Copy }) {
  const { locale } = useLocale();
  return (
    <div className="animate-step-in rounded-2xl bg-black px-6 py-12 text-center md:px-10 md:py-16">
      <p className="font-point text-lg italic leading-relaxed text-paper md:text-xl">
        {reflection[locale]}
      </p>
    </div>
  );
}
