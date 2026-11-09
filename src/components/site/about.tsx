"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLocale } from "@/components/site-header/locale-context";
import { PROJECT_MOTION } from "@/lib/project-media";
import { MotionVideo } from "./motion-video";
import { useReveal } from "./reveal";

const STATEMENT = {
  en: "Most interfaces don’t fail for missing features — people just can’t find them. For seven years I’ve regrouped dense systems around what people came to do: treaty databases, university portals, museum sites, an AI video studio. Then I build it, so the flow is real before anyone writes a line of production code.",
  ko: "대부분의 화면은 기능이 없어서가 아니라, 찾지 못해서 실패합니다. 7년 동안 조약 데이터베이스, 대학 학사 포털, 박물관 사이트, AI 영상 서비스까지 — 복잡한 시스템을 사람들이 하려는 일 중심으로 다시 묶어 왔습니다. 그리고 직접 만들어서, 개발 전에 흐름이 실제로 동작하는지 확인합니다.",
};

const STATS = [
  { n: "7", l: { ko: "년차 UI/UX", en: "years in UI/UX" } },
  { n: "4–5", l: { ko: "연간 대형 공공·기업 프로젝트", en: "large public & enterprise builds a year" } },
  { n: "4", l: { ko: "인 디자인팀 리드", en: "-person design team led" } },
  { n: "KO/EN", l: { ko: "한국어 · 영어로 일해요", en: "works in Korean & English" } },
];

const CAPS = [
  {
    clip: { src: PROJECT_MOTION["02"].video, poster: PROJECT_MOTION["02"].poster },
    href: "/work/02",
    t: { ko: "정보 구조", en: "Information architecture" },
    d: { ko: "부서 기준이 아니라 사용자의 목적 기준으로. 3,000건 조약 DB를 한 화면 안에서.", en: "Grouped by what people came to do, not by org chart — 3,000 treaties, one search screen." },
  },
  {
    clip: { src: PROJECT_MOTION["10"].video, poster: PROJECT_MOTION["10"].poster },
    href: "/work/10",
    t: { ko: "플로우 · 프로토타입", en: "Flows & prototypes" },
    d: { ko: "정상 · 분기 · 오류 · 롤백까지 설계하고, 눌러 볼 수 있게 만듭니다.", en: "Happy paths, branches, errors and rollbacks — designed, then made clickable." },
  },
  {
    clip: { src: PROJECT_MOTION["04"].video, poster: PROJECT_MOTION["04"].poster },
    href: "/work/04",
    t: { ko: "UI · 디자인 시스템", en: "Interface & design systems" },
    d: { ko: "정보 밀도가 높은 화면도 차분하게. 라이트 · 다크를 한 시스템으로.", en: "Dense screens that stay calm; light and dark from one system." },
  },
  {
    clip: { src: "/media/home_work/1am/brand-film-loop.mp4", poster: "/media/home_work/1am/brand-film-poster.webp" },
    href: "/work/11",
    t: { ko: "브랜드 · 모션", en: "Brand & motion" },
    d: { ko: "로고, 브로슈어, 그리고 AI로 기획·제작한 브랜드 필름까지.", en: "Logos, print, and a brand film I planned and produced with AI." },
  },
];

/** Statement whose words fill in from grey to ink as it scrolls past, then
 * four capability cards, each with its own clip. */
export function About() {
  const { locale } = useLocale();
  const ref = useReveal<HTMLElement>();
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const words = Array.from(el.querySelectorAll<HTMLElement>("span"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => (w.style.opacity = "1"));
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
      const lit = Math.round(p * words.length);
      words.forEach((w, i) => (w.style.opacity = i < lit ? "1" : "0.16"));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [locale]);

  return (
    <section ref={ref} id="about" className="scroll-mt-24 bg-paper pb-24 text-ink md:pb-36">
      <div className="wrap">
        <p className="font-mono text-[12px] text-stone">{locale === "ko" ? "소개" : "About"}</p>
        <p ref={textRef} key={locale} className="display mt-6 max-w-[22ch] text-[clamp(1.9rem,4.6vw,4.4rem)] !leading-[1.08] md:max-w-none">
          {STATEMENT[locale].split(" ").map((w, i) => (
            <span key={i} className="transition-opacity duration-300" style={{ opacity: 0.16 }}>
              {w}{" "}
            </span>
          ))}
        </p>

        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-ink/10 pt-10 md:mt-24 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.n} data-reveal>
              <div className="display text-[clamp(2.4rem,5vw,4.5rem)]">{s.n}</div>
              <div className="mt-2 text-[14px] text-ink/55">{s.l[locale]}</div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
          {CAPS.map((c, i) => (
            <Link
              key={c.href}
              href={c.href}
              data-reveal
              data-cursor={locale === "ko" ? "보기" : "View"}
              style={{ animationDelay: `${i * 80}ms` }}
              className="group flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-ink">
                <MotionVideo src={c.clip.src} poster={c.clip.poster} className="transition-transform duration-[1.2s] [transition-timing-function:var(--ease)] group-hover:scale-105" />
              </div>
              <h3 className="mt-5 text-xl font-bold tracking-[-0.02em]">{c.t[locale]}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/60">{c.d[locale]}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
