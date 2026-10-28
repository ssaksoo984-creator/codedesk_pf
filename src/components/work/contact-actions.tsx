"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/site-header/locale-context";

export const CONTACT_EMAIL = "ssssssu984@gmail.com";
const COPIED_TOAST_MS = 1800;

const COPY = {
  email: { ko: "이메일 보내기", en: "Send email" },
  copied: { ko: "주소 복사 완료", en: "Address copied" },
  resumeEn: { ko: "영문 이력서", en: "Resume — EN" },
  resumeKo: { ko: "국문 이력서", en: "Resume — KO" },
};

/** Email (mailto + copy-to-clipboard, so a click always gives feedback even
 * with no mail client configured) and the two résumé downloads. */
export function ContactActions() {
  const { locale } = useLocale();
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  function handleEmailClick() {
    navigator.clipboard
      ?.writeText(CONTACT_EMAIL)
      .then(() => {
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), COPIED_TOAST_MS);
      })
      .catch(() => {});
  }

  return (
    <div className="flex flex-col gap-6">
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        onClick={handleEmailClick}
        aria-label={COPY.email[locale]}
        className="group relative block break-all font-display text-[clamp(1.6rem,5.5vw,4.5rem)] font-semibold leading-none text-paper transition-colors hover:text-neon"
      >
        {CONTACT_EMAIL}
        <span className="mt-3 block h-[2px] w-full origin-left scale-x-[0.15] bg-neon shadow-[0_0_12px_var(--neon)] transition-transform duration-500 group-hover:scale-x-100" />
        {copied && (
          <span className="animate-step-in absolute -top-8 left-0 border border-neon bg-ink px-3 py-1 ko-safe font-mono text-[11px] tracking-widest text-neon">
            ✓ {COPY.copied[locale]}
          </span>
        )}
      </a>

      <div className="flex flex-wrap gap-3">
        {[
          ["/media/Soomin_Park_Resume.pdf", COPY.resumeEn[locale]],
          ["/media/Soomin_Park_Resume_KO.pdf", COPY.resumeKo[locale]],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            download
            className="ko-safe notch-sm inline-flex items-center gap-3 border border-white/20 px-5 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-white/70 transition-colors hover:border-neon hover:bg-neon hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
              <path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5" />
              <path d="M4 20h16" />
            </svg>
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
