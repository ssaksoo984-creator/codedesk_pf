"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Gnb } from "@/components/site-header/gnb";
import { BackToTop } from "@/components/site-header/back-to-top";
import { LocaleToggle } from "@/components/site-header/locale-toggle";
import { SiteFooter } from "@/components/footer/site-footer";
import { NoScrollSnap } from "@/components/ui/no-scroll-snap";
import { useLocale } from "@/components/site-header/locale-context";
import { getThought, type Thought } from "@/lib/thoughts";

const COPY = {
  back: { ko: "← Thought로 돌아가기", en: "← Back to Thought" },
  loading: { ko: "불러오는 중…", en: "Loading…" },
  notFound: { ko: "글을 찾을 수 없습니다.", en: "This post doesn't exist." },
};

function formatDate(iso: string, locale: "ko" | "en") {
  return new Date(iso).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ThoughtView() {
  const id = useSearchParams().get("id");
  const { locale } = useLocale();
  const [status, setStatus] = useState<"loading" | "notfound" | "ready">("loading");
  const [thought, setThought] = useState<Thought | null>(null);

  useEffect(() => {
    if (!id) {
      setStatus("notfound");
      return;
    }
    getThought(id)
      .then((t) => {
        if (!t) {
          setStatus("notfound");
          return;
        }
        setThought(t);
        setStatus("ready");
      })
      .catch(() => setStatus("notfound"));
  }, [id]);

  return (
    <main className="min-h-screen bg-paper pb-24">
      <div className="wrap max-w-3xl pb-24 pt-32 md:pt-40">
        <Link
          href="/#thought"
          className="mb-12 inline-block text-sm text-muted transition-colors hover:text-ink"
        >
          {COPY.back[locale]}
        </Link>

        {status === "loading" && <p className="text-sm text-muted">{COPY.loading[locale]}</p>}
        {status === "notfound" && <p className="text-sm text-muted">{COPY.notFound[locale]}</p>}

        {status === "ready" && thought ? (
          <article>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">
              {formatDate(thought.created_at, locale)}
            </p>
            <h1 className="mb-10 font-display text-4xl italic leading-tight text-ink md:text-6xl">
              {thought.title}
            </h1>

            {thought.thumbnail_url ? (
              <div className="mb-10 overflow-hidden rounded-3xl bg-ink/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thought.thumbnail_url}
                  alt={thought.title}
                  className="w-full object-cover"
                />
              </div>
            ) : null}

            <div className="whitespace-pre-wrap text-base leading-relaxed text-muted md:text-lg">
              {thought.body}
            </div>
          </article>
        ) : null}
      </div>
    </main>
  );
}

export default function ThoughtViewPage() {
  return (
    <>
      <NoScrollSnap />
      <Gnb />
      <Suspense fallback={null}>
        <ThoughtView />
      </Suspense>
      <SiteFooter />
      <LocaleToggle />
      <BackToTop />
    </>
  );
}
