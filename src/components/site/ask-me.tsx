"use client";

import { useState } from "react";
import clsx from "clsx";
import { useLocale } from "@/components/site-header/locale-context";
import { AskChat } from "./ask-chat";

/** Small pill that opens the résumé Q&A (preset questions, answers taken
 * from the résumé only — no AI behind it). */
export function AskMe() {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  return (
    <>
      <AskChat open={open} onClose={() => setOpen(false)} />
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={clsx(
          "fixed bottom-4 right-4 z-[60] flex items-center gap-2 rounded-full bg-ink p-1.5 text-[14px] md:py-2 md:pl-2 md:pr-4 text-paper shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10 transition-transform duration-300 hover:-translate-y-0.5 md:bottom-6 md:right-6",
          open && "max-md:hidden"
        )}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[12px] font-bold text-white">SP</span>
        <span className="sr-only md:not-sr-only">
          {open ? (locale === "ko" ? "닫기" : "Close") : locale === "ko" ? "저에 대해 물어보세요" : "Ask about me"}
        </span>
      </button>
    </>
  );
}
