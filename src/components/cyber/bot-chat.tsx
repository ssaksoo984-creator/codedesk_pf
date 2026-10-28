"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { useLocale } from "@/components/site-header/locale-context";
import { RESUME_FAQ, type FaqItem } from "@/lib/resume-faq";

const COPY = {
  title: { ko: "SYS-BOT · 수민 안내", en: "SYS-BOT · Ask about Soomin" },
  hello: {
    ko: "안녕하세요! 저는 수민의 이력서를 학습한 안내 로봇이에요. 궁금한 질문을 골라주세요 ↓",
    en: "Hi! I'm a guide bot loaded with Soomin's resume. Pick a question below ↓",
  },
  pick: { ko: "질문 고르기", en: "Pick a question" },
  close: { ko: "닫기", en: "Close" },
  restart: { ko: "처음부터", en: "Restart" },
  done: { ko: "모든 질문을 확인했어요! 더 궁금한 건 메일로 물어봐 주세요.", en: "That's every question! Anything else — just email her." },
};

type Msg = { from: "bot" | "me"; item?: FaqItem; text?: { ko: string; en: string } };

/** Preset-question chat opened by clicking the robot. No AI and no network:
 * every answer is pre-written from the resume, so it stays on-topic. */
export function BotChat({ open, onClose }: { open: boolean; onClose: () => void }) {
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
        "ko-safe fixed inset-x-2 bottom-2 z-[70] flex max-h-[78svh] flex-col border border-neon/50 bg-[#060a13]/95 shadow-[0_0_40px_rgba(0,240,255,0.18)] backdrop-blur-md transition-all duration-300 md:inset-x-auto md:bottom-[100px] md:right-[128px] md:max-h-[min(620px,80svh)] md:w-[380px]",
        open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/fx/bot.webp" alt="" className="h-8 w-8 object-contain" />
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-neon">● Online</div>
            <div className="text-sm font-semibold text-paper">{COPY.title[locale]}</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMsgs([{ from: "bot", text: COPY.hello }])}
            className="px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white/40 hover:text-neon"
          >
            ↺ {COPY.restart[locale]}
          </button>
          <button type="button" onClick={onClose} aria-label={COPY.close[locale]} className="px-2 py-1 font-mono text-white/50 hover:text-white">
            ✕
          </button>
        </div>
      </div>

      <div ref={scroller} className="flex min-h-[160px] flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        {msgs.map((m, i) =>
          m.from === "me" ? (
            <div key={i} className="ml-auto max-w-[85%] bg-neon px-3 py-2 text-[13px] leading-snug text-ink">
              {m.item!.q[locale]}
            </div>
          ) : (
            <div key={i} className="max-w-[92%] border border-white/10 bg-white/[0.04] px-3 py-2.5 text-[13px] leading-relaxed text-white/80">
              {m.text ? m.text[locale] : m.item!.a[locale]}
              {m.item?.links && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {m.item.links.map((l) => {
                    const cls =
                      "border border-neon/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-neon transition-colors hover:bg-neon hover:text-ink";
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
          <div className="flex w-14 gap-1 border border-white/10 bg-white/[0.04] px-3 py-3" aria-label="typing">
            {[0, 1, 2].map((d) => (
              <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-neon" style={{ animationDelay: `${d * 120}ms` }} />
            ))}
          </div>
        )}
        {!typing && left.length === 0 && (
          <div className="max-w-[92%] border border-acid/40 bg-acid/[0.06] px-3 py-2.5 text-[13px] text-acid">{COPY.done[locale]}</div>
        )}
      </div>

      {left.length > 0 && (
        <div className="border-t border-white/10 px-4 pb-4 pt-3">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">{COPY.pick[locale]}</div>
          <div className="no-scrollbar flex max-h-[132px] flex-wrap gap-1.5 overflow-y-auto">
            {left.map((f) => (
              <button
                key={f.id}
                type="button"
                disabled={typing}
                onClick={() => ask(f)}
                className="border border-white/15 px-2.5 py-1.5 text-left text-[12px] text-white/75 transition-colors hover:border-neon hover:text-neon disabled:opacity-40"
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
