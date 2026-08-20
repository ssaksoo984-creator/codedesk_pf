"use client";

import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/site-header/locale-context";

const CONTACT_EMAIL = "ssssssu984@gmail.com";
const COPIED_TOAST_MS = 1800;

const COPY = {
  email: { ko: "이메일 보내기", en: "Send Email" },
  copied: { ko: "이메일 주소가 복사되었습니다", en: "Email address copied" },
  resume: { ko: "이력서", en: "Resume" },
  resumeDownload: { ko: "이력서 다운로드", en: "Download Resume" },
  en: { ko: "영문 이력서", en: "English" },
  ko: { ko: "국문 이력서", en: "Korean" },
};

function MailIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5" />
      <path d="M4 20h16" />
    </svg>
  );
}

const CIRCLE_BUTTON =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-200";

/** Contact section's two CTAs, right-aligned under the tagline — a round
 * mailto icon button, and a single Resume pill (label + download icon
 * together) that opens a small dropdown for the two language versions.
 * Lives on its own (rather than inline in WorkSection) since the dropdown
 * needs its own open state + outside-click handling. */
export function ContactActions() {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const resumeGroupRef = useRef<HTMLDivElement | null>(null);
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (resumeGroupRef.current && !resumeGroupRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
    };
  }, []);

  // The mailto: link still fires normally for anyone with a default mail
  // client set up — but on a machine with none configured, clicking it does
  // nothing visible at all. Copying the address alongside it means the
  // click always produces some feedback, mail client or not.
  function handleEmailClick() {
    navigator.clipboard?.writeText(CONTACT_EMAIL).then(() => {
      setCopied(true);
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = setTimeout(() => setCopied(false), COPIED_TOAST_MS);
    }).catch(() => {});
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-3 self-end">
      <div className="relative">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          onClick={handleEmailClick}
          aria-label={COPY.email[locale]}
          title={COPY.email[locale]}
          className={clsx(CIRCLE_BUTTON, "border-ink/20 text-ink hover:border-ink hover:bg-ink hover:text-paper")}
        >
          <MailIcon />
        </a>

        {copied && (
          <span className="animate-step-in absolute top-full right-0 z-10 mt-2 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs text-paper shadow-lg">
            {COPY.copied[locale]}
          </span>
        )}
      </div>

      <div ref={resumeGroupRef} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={COPY.resumeDownload[locale]}
          aria-expanded={open}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm text-paper transition-opacity duration-200 hover:opacity-80"
        >
          {COPY.resume[locale]}
          <DownloadIcon />
        </button>

        {open && (
          <div className="absolute top-full right-0 z-10 mt-2 w-44 overflow-hidden rounded-2xl border border-ink/10 bg-paper shadow-[0_12px_32px_rgba(13,13,13,0.12)]">
            <a
              href="/media/Soomin_Park_Resume.pdf"
              download
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-left text-sm text-ink transition-colors duration-150 hover:bg-ink/[0.06]"
            >
              {COPY.en[locale]}
            </a>
            <a
              href="/media/Soomin_Park_Resume_KO.pdf"
              download
              onClick={() => setOpen(false)}
              className="block border-t border-ink/10 px-4 py-3 text-left text-sm text-ink transition-colors duration-150 hover:bg-ink/[0.06]"
            >
              {COPY.ko[locale]}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
