"use client";

import { useState } from "react";
import clsx from "clsx";
import { useLocale, type Locale } from "@/components/site-header/locale-context";
import type { ImageShowcase as ImageShowcaseData, ShowcaseCard } from "@/lib/work-content";
import { LightboxProvider, Zoomable } from "./lightbox";

const HEADING = { ko: "이미지 쇼케이스", en: "Image Showcase" };

const THEME_LABEL = {
  dark: { ko: "다크", en: "Dark" },
  light: { ko: "라이트", en: "Light" },
};

const DEVICE_LABEL = {
  desktop: { ko: "PC", en: "PC" },
  mobile: { ko: "모바일", en: "Mobile" },
};

/** Full-width, screen-by-screen gallery — sits above a project's normal
 * two-column layout. One card per screen, each with its own Light/Dark
 * swatch and (when a desktop capture exists) Desktop/Mobile tab, so a
 * visitor can flip through real screens without leaving the card grid. */
export function ImageShowcase({ showcase }: { showcase: ImageShowcaseData }) {
  const { locale } = useLocale();

  return (
    <LightboxProvider>
      <div className="mt-8 md:mt-14">
        <span className="font-display text-xs italic text-white/30">Image Showcase</span>
        <h2 className="mt-2 font-display text-2xl italic text-paper md:text-3xl">
          {HEADING[locale]}
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <ShowcaseCardView card={showcase.main} locale={locale} />
        </div>

        {showcase.groups.map((group, gi) => (
          <div key={gi} className="mt-10 md:mt-12">
            <div className="font-display text-lg italic text-paper md:text-xl">
              {group.label[locale]}
            </div>
            <p className="mt-1 text-xs text-white/40">{group.caption[locale]}</p>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {group.cards.map((card, ci) => (
                <ShowcaseCardView key={ci} card={card} locale={locale} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </LightboxProvider>
  );
}

function ShowcaseCardView({ card, locale }: { card: ShowcaseCard; locale: Locale }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [device, setDevice] = useState<"desktop" | "mobile">(card.desktop ? "desktop" : "mobile");

  const pair = device === "desktop" && card.desktop ? card.desktop : card.mobile;
  const src = pair[theme];

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="font-display text-base italic text-paper">{card.title[locale]}</div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex w-fit items-center gap-1 rounded-full border border-white/15 p-1">
          {(["dark", "light"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={clsx(
                "rounded-full px-3.5 py-1 text-xs transition-colors duration-200",
                theme === t ? "bg-paper text-ink" : "text-white/45 hover:text-paper"
              )}
            >
              {THEME_LABEL[t][locale]}
            </button>
          ))}
        </div>

        {card.desktop && (
          <div className="flex w-fit items-center gap-1 rounded-full border border-white/15 p-1">
            {(["desktop", "mobile"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                className={clsx(
                  "rounded-full px-3.5 py-1 text-xs transition-colors duration-200",
                  device === d ? "bg-paper text-ink" : "text-white/45 hover:text-paper"
                )}
              >
                {DEVICE_LABEL[d][locale]}
              </button>
            ))}
          </div>
        )}
      </div>

      <Zoomable
        item={{ src, alt: card.title[locale] }}
        className="block aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/10 bg-black/20"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={card.title[locale]} className="h-full w-full object-cover object-top" />
      </Zoomable>
    </div>
  );
}
