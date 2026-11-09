"use client";

import Link from "next/link";
import clsx from "clsx";
import { useLocale } from "@/components/site-header/locale-context";
import { PROJECT_MOTION } from "@/lib/project-media";
import { MotionVideo } from "./motion-video";

type Piece = { t: string } | { clip: string; href: string };

const LINES: Record<"ko" | "en", Piece[][]> = {
  en: [
    [{ t: "Calm" }, { clip: "04", href: "/work/04" }, { t: "screens" }],
    [{ t: "for" }, { t: "complicated" }, { clip: "02", href: "/work/02" }],
    [{ clip: "09", href: "/work/09" }, { t: "products." }],
  ],
  ko: [
    [{ t: "복잡한" }, { clip: "02", href: "/work/02" }, { t: "서비스를" }],
    [{ t: "누구나" }, { clip: "04", href: "/work/04" }, { t: "쓰는" }],
    [{ t: "화면으로." }, { clip: "09", href: "/work/09" }],
  ],
};

const COPY = {
  role: { ko: "UI/UX 디자이너 박수민", en: "Soomin Park — UI/UX designer" },
  lead: {
    ko: "공공 시스템부터 커머스, AI 영상 서비스까지 7년. 기능을 어떻게 묶고, 화면 어디에 두고, 어떤 순서로 만나게 할지 설계하고 — 직접 만들어 확인합니다.",
    en: "Seven years across public-sector systems, commerce and AI products. I decide how features group, where they sit and in what order people meet them — then build it to prove the flow works.",
  },
  available: { ko: "지금 함께할 수 있어요 · 밴쿠버", en: "Available now · Vancouver" },
  work: { ko: "작업 보기", en: "See the work" },
  resume: { ko: "이력서", en: "Résumé" },
};

/** Butter-style headline: big type with live project clips set inline as
 * pills. Each pill links to its case study and widens on hover. */
export function Hero() {
  const { locale } = useLocale();
  let w = 0;

  return (
    <section className="relative overflow-hidden bg-paper pb-16 pt-36 text-ink md:pb-24 md:pt-44">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(60%_60%_at_50%_0%,#ffffff,transparent)]" />
      <div className="wrap relative">
        <div className="mb-8 flex items-center gap-3 font-mono text-[12px] tracking-wide text-stone md:mb-12">
          <span className="relative flex h-2 w-2">
            <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-[#2DB39A]" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#2DB39A]" />
          </span>
          {COPY.available[locale]}
        </div>

        <h1 key={locale} className="display flex flex-wrap items-center gap-x-[0.18em] text-[clamp(2.7rem,9.2vw,11rem)] md:block">
          {LINES[locale].map((line, li) => (
            <span key={li} className="contents md:flex md:flex-wrap md:items-center md:gap-x-[0.18em]">
              {line.map((p, pi) => {
                const delay = { animationDelay: `${(w++) * 70 + 120}ms` };
                if ("t" in p)
                  return (
                    <span key={pi} className="word">
                      <span style={delay}>{p.t}</span>
                    </span>
                  );
                const m = PROJECT_MOTION[p.clip];
                return (
                  <span key={pi} className="word">
                    <Link
                      href={p.href}
                      style={delay}
                      data-cursor={locale === "ko" ? "보기" : "View"}
                      className={clsx(
                        "relative inline-block h-[0.74em] w-[1.5em] overflow-hidden rounded-full align-middle",
                        "transition-[width] duration-700 [transition-timing-function:var(--ease)] hover:w-[2.6em]"
                      )}
                    >
                      <MotionVideo src={m.video} poster={m.poster} rootMargin="0px" />
                    </Link>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-[1fr_auto] md:items-end">
          <div data-reveal="in" className="max-w-xl">
            <p className="text-sm font-semibold">{COPY.role[locale]}</p>
            <p className="mt-2 text-[17px] leading-relaxed text-ink/65 md:text-lg">{COPY.lead[locale]}</p>
          </div>
          <div className="flex gap-3">
            <Link href="#work" className="rounded-full bg-ink px-7 py-4 text-[15px] font-medium text-paper transition-colors hover:bg-accent">
              {COPY.work[locale]} ↓
            </Link>
            <a
              href={locale === "ko" ? "/media/Soomin_Park_Resume_KO.pdf" : "/media/Soomin_Park_Resume.pdf"}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-ink/15 px-7 py-4 text-[15px] font-medium transition-colors hover:border-ink"
            >
              {COPY.resume[locale]} ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
