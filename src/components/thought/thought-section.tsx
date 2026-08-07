"use client";

import { useEffect, useState } from "react";
import { ThemeSection } from "@/components/site-header/theme-section";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/ui/reveal";
import { useLocale } from "@/components/site-header/locale-context";
import { listThoughts, type Thought } from "@/lib/thoughts";
import { ThoughtCard } from "./thought-card";

const COPY = {
  eyebrow: { ko: "생각의 조각들", en: "Notes & fragments" },
  tagline: {
    ko: "만들면서 배운 것들, 가끔은 삽질도.",
    en: "What we learn while building — including the occasional dead end.",
  },
  empty: { ko: "첫 번째 글을 준비 중입니다.", en: "The first post is on its way." },
};

export function ThoughtSection() {
  const { locale } = useLocale();
  const [thoughts, setThoughts] = useState<Thought[] | null>(null);

  useEffect(() => {
    listThoughts()
      .then(setThoughts)
      .catch(() => setThoughts([]));
  }, []);

  return (
    <ThemeSection theme="light" id="thought" snap className="bg-paper">
      <div className="wrap flex min-h-screen flex-col justify-center py-24 md:py-32">
        <Reveal>
          <Logo tone="ink" size="small" className="mb-8 md:mb-10" />
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">
                {COPY.eyebrow[locale]}
              </p>
              <p className="font-display text-4xl italic text-ink md:text-7xl">Thought</p>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted md:text-right md:text-base">
              {COPY.tagline[locale]}
            </p>
          </div>
        </Reveal>

        {thoughts === null ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[340px] animate-pulse rounded-3xl bg-ink/5" />
            ))}
          </div>
        ) : thoughts.length === 0 ? (
          <p className="text-sm text-muted">{COPY.empty[locale]}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {thoughts.map((t, i) => (
              <Reveal key={t.id} delay={i * 80}>
                <ThoughtCard thought={t} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </ThemeSection>
  );
}
