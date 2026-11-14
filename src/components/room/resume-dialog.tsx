"use client";

import { useState } from "react";
import { Sheet } from "./sheet";

const FILES = {
  en: { label: "English", file: "/media/Soomin_Park_Resume.pdf" },
  ko: { label: "한국어", file: "/media/Soomin_Park_Resume_KO.pdf" },
} as const;
type Lang = keyof typeof FILES;

/** Idea board → résumé: pick a language first, then read the PDF in place. */
export function ResumeDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [lang, setLang] = useState<Lang | null>(null);
  const close = () => {
    onClose();
    setTimeout(() => setLang(null), 500);
  };

  return (
    <Sheet open={open} onClose={close} label={lang ? `Résumé — ${FILES[lang].label}` : "Résumé"} wide={Boolean(lang)}>
      {!lang ? (
        <div className="p-5 md:p-6">
          <p className="text-[15px] text-muted">Which language would you like to read it in?</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {(Object.keys(FILES) as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className="group flex aspect-[4/3] flex-col justify-between rounded-2xl border border-line p-4 text-left transition-colors hover:border-glow"
              >
                <span className="font-mono text-[11px] uppercase text-muted">{l === "en" ? "EN" : "KO"} · PDF</span>
                <span className="text-[24px] font-medium tracking-[-0.03em] md:text-[28px]">{FILES[l].label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-[78svh] flex-col">
          <div className="flex flex-wrap items-center gap-2 border-b border-line px-5 py-3 text-[14px] md:px-6">
            <button type="button" onClick={() => setLang(lang === "en" ? "ko" : "en")} className="rounded-xl border border-line px-3 py-1.5 hover:border-glow">
              {lang === "en" ? "한국어로 보기" : "View in English"}
            </button>
            <a href={FILES[lang].file} download className="rounded-xl border border-line px-3 py-1.5 hover:border-glow">
              Download PDF ↓
            </a>
            <a href={FILES[lang].file} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-line px-3 py-1.5 hover:border-glow">
              Open in new tab ↗
            </a>
          </div>
          <iframe key={lang} title={`Résumé (${FILES[lang].label})`} src={`${FILES[lang].file}#view=FitH`} className="min-h-0 w-full flex-1 bg-white" />
        </div>
      )}
    </Sheet>
  );
}
