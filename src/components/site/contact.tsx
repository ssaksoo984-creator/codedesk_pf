"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/components/site-header/locale-context";
import { CONTACT_EMAIL } from "@/components/work/contact-actions";
import { Wordmark } from "./nav";
import { useReveal } from "./reveal";

const COPY = {
  eyebrow: { ko: "연락", en: "Contact" },
  line: { ko: ["같이 쉽게", "만들어 봐요."], en: ["Let’s make it", "make sense."] },
  lead: {
    ko: "풀타임 · 프리랜서 모두 열려 있어요. 밴쿠버에 있고, 한국어와 영어로 일합니다.",
    en: "Open to full-time and freelance. Based in Vancouver, working in Korean and English.",
  },
  copy: { ko: "클릭하면 주소가 복사돼요", en: "Click to copy" },
  copied: { ko: "복사했어요 ✓", en: "Copied ✓" },
  resumeEn: { ko: "영문 이력서", en: "Résumé (EN)" },
  resumeKo: { ko: "국문 이력서", en: "Résumé (KO)" },
  top: { ko: "맨 위로", en: "Back to top" },
};

export function Contact() {
  const { locale } = useLocale();
  const ref = useReveal<HTMLElement>();
  const [copied, setCopied] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = () => {
    navigator.clipboard?.writeText(CONTACT_EMAIL).then(() => {
      setCopied(true);
      if (t.current) clearTimeout(t.current);
      t.current = setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  };

  return (
    <section ref={ref} id="contact" className="scroll-mt-24 bg-paper text-ink">
      <div className="wrap pb-10 pt-24 md:pt-36">
        <p data-reveal className="font-mono text-[12px] text-stone">{COPY.eyebrow[locale]}</p>
        <h2 key={locale} className="display mt-6 text-[clamp(3.2rem,12vw,12rem)]">
          {COPY.line[locale].map((l, i) => (
            <span key={i} className="word block">
              <span style={{ animationDelay: `${i * 90}ms` }}>{l}</span>
            </span>
          ))}
        </h2>

        <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div data-reveal>
            <button
              type="button"
              onClick={copy}
              data-cursor={copied ? COPY.copied[locale] : COPY.copy[locale]}
              className="group block text-left"
            >
              <span className="block break-all text-[clamp(1.6rem,4.4vw,4rem)] font-bold tracking-[-0.035em] underline decoration-ink/15 decoration-2 underline-offset-[0.18em] transition-colors group-hover:text-accent group-hover:decoration-accent">
                {CONTACT_EMAIL}
              </span>
              <span className="mt-3 block font-mono text-[12px] text-stone">{copied ? COPY.copied[locale] : COPY.copy[locale]}</span>
            </button>
          </div>
          <div data-reveal className="flex flex-col gap-5">
            <p className="max-w-sm text-[16px] leading-relaxed text-ink/60">{COPY.lead[locale]}</p>
            <div className="flex flex-wrap gap-2">
              <a href={`mailto:${CONTACT_EMAIL}`} className="rounded-full bg-ink px-6 py-3.5 text-[15px] text-paper transition-colors hover:bg-accent">
                Email ↗
              </a>
              <a href="/media/Soomin_Park_Resume.pdf" download className="rounded-full border border-ink/15 px-6 py-3.5 text-[15px] transition-colors hover:border-ink">
                {COPY.resumeEn[locale]} ↓
              </a>
              <a href="/media/Soomin_Park_Resume_KO.pdf" download className="rounded-full border border-ink/15 px-6 py-3.5 text-[15px] transition-colors hover:border-ink">
                {COPY.resumeKo[locale]} ↓
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
}

export function Footer({ dark }: { dark?: boolean }) {
  const { locale } = useLocale();
  return (
    <footer className={dark ? "bg-ink text-paper" : "bg-paper text-ink"}>
      <div className={`wrap flex flex-wrap items-center justify-between gap-4 border-t py-8 text-[13px] ${dark ? "border-paper/10 text-paper/50" : "border-ink/10 text-ink/50"}`}>
        <Link href="/" className={dark ? "text-paper" : "text-ink"}>
          <Wordmark />
        </Link>
        <span>© {new Date().getFullYear()} Soomin Park · Vancouver ⇄ Seoul</span>
        <span className="flex gap-5">
          <a href="https://www.linkedin.com/in/soomin-park-codedesk" target="_blank" rel="noreferrer" className="hover:text-accent">
            LinkedIn ↗
          </a>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-accent">
            {COPY.top[locale]} ↑
          </button>
        </span>
      </div>
    </footer>
  );
}
