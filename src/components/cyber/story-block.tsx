"use client";

import clsx from "clsx";
import type { StoryBlock as StoryBlockData } from "@/lib/work-content";
import { useLocale } from "@/components/site-header/locale-context";
import { LightboxProvider, Zoomable } from "@/components/work/lightbox";
import { LumiLoadingScenes } from "./lumi-loading-scenes";
import { LiveEmbed } from "./live-embed";

const COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-4",
};

const COPY = {
  before: { ko: "기존", en: "Before" },
  after: { ko: "리뉴얼", en: "After" },
  pending: { ko: "데이터 수신 중", en: "Incoming transmission" },
};

/** Renders one free-form case-study section's content (the section label
 * itself is drawn by the detail page's sticky left column). */
export function StoryBlockContent({ block }: { block: StoryBlockData }) {
  const { locale } = useLocale();

  return (
    <div className="flex flex-col gap-10">
      {block.title && (
        <p className="font-display text-2xl font-semibold leading-snug text-paper md:text-4xl">{block.title[locale]}</p>
      )}

      {block.body && (
        <div className="flex max-w-3xl flex-col gap-5">
          {block.body.map((b, i) => (
            <p key={i} className="text-[15px] leading-[1.85] text-white/65 md:text-[17px]">
              {b[locale]}
            </p>
          ))}
        </div>
      )}

      {block.widget === "lumi-loading" && <LumiLoadingScenes />}

      {block.embed && <LiveEmbed {...block.embed} />}

      {block.video && (
        <figure>
          <div className="brackets relative overflow-hidden border border-white/10 bg-black">
            <video src={block.video.src} poster={block.video.poster} controls playsInline preload="metadata" className="block w-full" />
          </div>
          {block.video.caption && (
            <figcaption className="mt-2 font-mono text-[11px] leading-snug text-white/45">{block.video.caption[locale]}</figcaption>
          )}
        </figure>
      )}

      {block.flow && (
        <div className="flex flex-col gap-6">
          {(["before", "after"] as const).map((lane) => (
            <div key={lane}>
              <div
                className={clsx(
                  "ko-safe mb-3 font-mono text-[10px] uppercase tracking-[0.3em]",
                  lane === "before" ? "text-alert/80" : "text-neon"
                )}
              >
                {COPY[lane][locale]}
              </div>
              <div className="no-scrollbar -mx-4 flex items-stretch gap-1.5 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:gap-y-2 md:px-0">
                {block.flow![lane].map((step, i) => (
                  <div key={i} className="flex shrink-0 items-center gap-1.5">
                    <div
                      className={clsx(
                        "min-w-[112px] border px-3 py-2.5 text-center text-xs leading-snug",
                        lane === "before"
                          ? "border-white/10 text-white/45"
                          : "border-neon/40 bg-neon/[0.06] text-paper"
                      )}
                    >
                      {step[locale]}
                    </div>
                    {i < block.flow![lane].length - 1 && (
                      <span className={lane === "before" ? "text-white/25" : "text-neon"}>→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {block.items && (
        <ol className="flex flex-col">
          {block.items.map((it, i) => (
            <li key={i} className="grid gap-2 border-t border-white/10 py-5 md:grid-cols-[56px_1fr_1.2fr] md:gap-6">
              <span className="font-mono text-xs text-neon">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-semibold text-paper">{it.label[locale]}</span>
              {it.note && <span className="text-sm leading-relaxed text-white/55">{it.note[locale]}</span>}
            </li>
          ))}
        </ol>
      )}

      {block.images && (
        <LightboxProvider>
          <div className={clsx("grid gap-3 md:gap-4", COLS[block.columns ?? 2])}>
            {block.images.map((img, i) => (
              <figure key={i} className="group">
                <Zoomable item={{ src: img.src, alt: img.caption?.[locale] ?? "" }} className="w-full">
                  <div
                    className="relative overflow-hidden border border-white/10 transition-colors group-hover:border-neon/50"
                    style={img.bg ? { background: img.bg } : undefined}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt={img.caption?.[locale] ?? ""}
                      loading="lazy"
                      className={clsx(
                        "w-full transition-transform duration-500 group-hover:scale-[1.03]",
                        img.fit === "contain" ? "object-contain" : "object-cover",
                        (block.columns ?? 2) > 2 && "aspect-[3/2]"
                      )}
                    />
                  </div>
                </Zoomable>
                {img.caption && (
                  <figcaption className="mt-2 font-mono text-[11px] leading-snug text-white/45">{img.caption[locale]}</figcaption>
                )}
              </figure>
            ))}
          </div>
        </LightboxProvider>
      )}

      {block.colors && (
        <div className="grid grid-cols-3 gap-3">
          {block.colors.map((c) => (
            <div key={c.hex} className="border border-white/10">
              <div className="true-color h-20 md:h-28" style={{ background: c.hex }} />
              <div className="p-3">
                <div className="font-mono text-xs text-paper">{c.hex}</div>
                <div className="mt-0.5 text-xs text-white/45">{c.name[locale]}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {block.pending && (
        <div className="relative overflow-hidden border border-dashed border-magenta/50 bg-magenta/[0.04] p-8 md:p-12">
          <div className="scanlines pointer-events-none absolute inset-0" />
          <div className="relative">
            <div className="ko-safe flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-magenta">
              <span className="flicker">●</span> {COPY.pending[locale]}
              <span className="caret">_</span>
            </div>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/65 md:text-lg">{block.pending[locale]}</p>
          </div>
        </div>
      )}
    </div>
  );
}
