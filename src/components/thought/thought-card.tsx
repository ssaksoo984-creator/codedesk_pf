"use client";

import Link from "next/link";
import { useLocale } from "@/components/site-header/locale-context";
import { excerpt, type Thought } from "@/lib/thoughts";

const READ_MORE = { ko: "더 읽기", en: "Read more" };

function formatDate(iso: string, locale: "ko" | "en") {
  return new Date(iso).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ThoughtCard({ thought }: { thought: Thought }) {
  const { locale } = useLocale();

  return (
    <Link
      href={`/thought/view?id=${thought.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white transition-shadow duration-300 hover:shadow-xl hover:shadow-ink/5"
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-ink/5">
        {thought.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thought.thumbnail_url}
            alt={thought.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-3xl italic text-ink/20">{"{ }"}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <span className="text-xs uppercase tracking-[0.15em] text-muted">
          {formatDate(thought.created_at, locale)}
        </span>
        <h3 className="font-display text-2xl italic leading-snug text-ink">
          {thought.title}
        </h3>
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
          {excerpt(thought.body)}
        </p>
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/70 transition-colors group-hover:text-ink">
          {READ_MORE[locale]} →
        </span>
      </div>
    </Link>
  );
}
