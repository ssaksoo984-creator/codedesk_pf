"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useLocale } from "@/components/site-header/locale-context";
import { RESUME_FAQ, type FaqItem } from "@/lib/resume-faq";

const COPY = {
  title: { ko: "수민에 대해 물어보기", en: "Ask about Soomin" },
  hello: {
    ko: "안녕하세요! 수민의 이력서를 바탕으로 답해 드려요. 궁금한 질문을 골라 주세요 ↓",
    en: "Hi! Answers here come straight from Soomin’s résumé. Pick a question below ↓",
  },
  pick: { ko: "질문 고르기", en: "Pick a question" },
  close: { ko: "닫기", en: "Close" },
  restart: { ko: "처음부터", en: "Restart" },
  done: { ko: "모든 질문을 확인했어요! 더 궁금한 건 메일로 물어봐 주세요.", en: "That's every question! Anything else — just email her." },
};

type Msg = { from: "bot" | "me"; item?: FaqItem; text?: { ko: string; en: string } };

/** Preset-question chat opened by clicking the robot. No AI and no network:
 * every answer is pre-written from the resume, so it stays on-topic. */
export function AskChat({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { locale } = useLocale();
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: COPY.hello }]);
  const [typing, setTyping] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const asked = new Set(msgs.filter((m) => m.from === "me").map((m) => m.item!.id));
  const left = RESUME_FAQ.filter((f) => !asked.has(f.id));

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function ask(item: FaqItem) {
    if (typing) return;
    setMsgs((m) => [...m, { from: "me", item }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "bot", item }]);
    }, 650);
  }

  return (
    <div
      role="dialog"
      aria-label={COPY.title[locale]}
      className={clsx(
        "fixed inset-x-2 bottom-2 z-[70] flex max-h-[78svh] flex-col overflow-hidden rounded-[24px] bg-[#f7f6f1] text-ink shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)] transition-all duration-300 md:inset-x-auto md:bottom-24 md:right-6 md:max-h-[min(620px,80svh)] md:w-[390px]",
        open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-[13px] font-bold text-white">SP</span>
          <div>
            <div className="font-mono text-[11px] text-[#2DB39A]">● Online</div>
            <div className="text-[15px] font-semibold text-ink">{COPY.title[locale]}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMsgs([{ from: "bot", text: COPY.hello }])}
            className="px-2 py-1 text-[12px] text-stone hover:text-ink"
          >
            ↺ {COPY.restart[locale]}
          </button>
          <button type="button" onClick={onClose} aria-label={COPY.close[locale]} className="px-2 py-1 text-ink/50 hover:text-ink">
            ✕
          </button>
        </div>
      </div>

      <div ref={scroller} className="flex min-h-[160px] flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        {msgs.map((m, i) =>
          m.from === "me" ? (
            <div key={i} className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ink px-3.5 py-2.5 text-[14px] leading-snug text-paper">
              {m.item!.q[locale]}
            </div>
          ) : (
            <div key={i} className="max-w-[92%] rounded-2xl rounded-bl-md bg-black/[0.05] px-3.5 py-3 text-[14px] leading-relaxed text-ink/80">
              {m.text ? m.text[locale] : m.item!.a[locale]}
              {m.item?.links && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {m.item.links.map((l) => {
                    const cls =
                      "rounded-full bg-ink px-3 py-1.5 text-[12px] text-paper transition-colors hover:bg-accent";
                    return l.href.startsWith("/work") ? (
                      <Link key={l.href} href={l.href} onClick={onClose} className={cls}>
                        {l.label[locale]} →
                      </Link>
                    ) : (
                      <a key={l.href} href={l.href} target={l.href.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer" className={cls}>
                        {l.label[locale]} ↗
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          )
        )}
        {typing && (
          <div className="flex w-16 gap-1 rounded-2xl bg-black/[0.05] px-4 py-3.5" aria-label="typing">
            {[0, 1, 2].map((d) => (
              <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/50" style={{ animationDelay: `${d * 120}ms` }} />
            ))}
          </div>
        )}
        {!typing && left.length === 0 && (
          <div className="max-w-[92%] rounded-2xl bg-accent/10 px-3.5 py-3 text-[14px] text-ink">{COPY.done[locale]}</div>
        )}
      </div>

      {left.length > 0 && (
        <div className="border-t border-black/10 px-4 pb-4 pt-3">
          <div className="mb-2 font-mono text-[11px] text-stone">{COPY.pick[locale]}</div>
          <div className="no-scrollbar flex max-h-[132px] flex-wrap gap-1.5 overflow-y-auto">
            {left.map((f) => (
              <button
                key={f.id}
                type="button"
                disabled={typing}
                onClick={() => ask(f)}
                className="rounded-full border border-black/12 px-3 py-1.5 text-left text-[13px] text-ink/75 transition-colors hover:border-ink hover:text-ink disabled:opacity-40"
              >
                {f.q[locale]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
