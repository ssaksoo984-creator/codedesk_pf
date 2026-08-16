"use client";

import clsx from "clsx";
import { createContext, useContext, useEffect, useState } from "react";
import { useLocale, type Locale } from "@/components/site-header/locale-context";
import type { DesignGuide } from "@/lib/work-content";
import { WorkArrowIcon } from "./work-arrow-icon";

type GuidePanel = DesignGuide["panels"][number];
type GuideImage = NonNullable<GuidePanel["images"]>[number];
type GuideListItem = NonNullable<GuidePanel["list"]>[number];

const HEADING = { ko: "설계 가이드", en: "Design Guide" };

interface LightboxItem {
  src: string;
  alt: string;
}

/** Lets any image nested arbitrarily deep under WorkDesignGuide open the one
 * shared full-size viewer, without threading an `onOpen` prop through every
 * intermediate component (PhoneFrame, ScrollableFrame, ImageCarousel, ...). */
const LightboxContext = createContext<((item: LightboxItem) => void) | null>(null);

function useLightbox() {
  const open = useContext(LightboxContext);
  if (!open) throw new Error("useLightbox must be used within WorkDesignGuide");
  return open;
}

/** Wraps an image/video preview so it's clickable and keyboard-operable
 * (a plain onClick on <img> isn't focusable). Visual look is untouched aside
 * from the zoom cursor — the click affordance is discoverable, not shouty. */
function Zoomable({ item, className, children }: { item: LightboxItem; className?: string; children: React.ReactNode }) {
  const open = useLightbox();
  return (
    <button
      type="button"
      onClick={() => open(item)}
      className={clsx("block cursor-zoom-in text-left", className)}
    >
      {children}
    </button>
  );
}

/** Lives inside the right-hand column, under the project photo — a plain,
 * page-scrolling block (no sticky rail) since the column itself is already
 * fairly narrow. Which tabs exist, and what each one shows, is entirely
 * data-driven per project — a marketing site documents layout/IA/colors,
 * a SaaS design piece might document IA/design-system/responsive instead. */
export function WorkDesignGuide({ guide }: { guide: DesignGuide }) {
  const { locale } = useLocale();
  const [activeId, setActiveId] = useState(guide.panels[0]?.id);
  const [lightboxItem, setLightboxItem] = useState<LightboxItem | null>(null);
  const panel = guide.panels.find((p) => p.id === activeId) ?? guide.panels[0];

  if (!panel) return null;

  return (
    <LightboxContext.Provider value={setLightboxItem}>
      <div className="mt-10 border-t border-white/15 pt-8 md:mt-12 md:pt-10">
        <span className="font-display text-xs italic text-white/30">Design Guide</span>
        <h2 className="mt-2 font-display text-2xl italic text-paper md:text-3xl">
          {HEADING[locale]}
        </h2>

        <div className="no-scrollbar mt-6 flex gap-2 overflow-x-auto">
          {guide.panels.map((p) => (
            <button
              key={p.id}
              onClick={() => setActiveId(p.id)}
              className={clsx(
                "shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors duration-200",
                panel.id === p.id ? "bg-paper text-ink" : "text-white/45 hover:text-paper"
              )}
            >
              {p.label[locale]}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <GuidePanelView key={panel.id} panel={panel} locale={locale} />
        </div>
      </div>

      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </LightboxContext.Provider>
  );
}

/** Full-size viewer for any Design Guide image — constrained to a max width
 * rather than the viewport height, so a tall full-page capture stays large
 * and readable and simply scrolls, instead of being squeezed down to fit. */
function Lightbox({ item, onClose }: { item: LightboxItem | null; onClose: () => void }) {
  useEffect(() => {
    if (!item) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-ink/95 p-4 py-12 md:p-10"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="fixed right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-paper transition-colors duration-200 hover:bg-white/20 md:right-8 md:top-8"
      >
        <CloseIcon />
      </button>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.src}
        alt={item.alt}
        className="mx-auto w-full max-w-[1100px] rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 4l16 16M20 4 4 20" />
    </svg>
  );
}

const THEME_LABEL = {
  dark: { ko: "다크", en: "Dark" },
  light: { ko: "라이트", en: "Light" },
};

const DEVICE_LABEL = {
  desktop: { ko: "PC", en: "PC" },
  mobile: { ko: "모바일", en: "Mobile" },
};

const SECTION_LABEL = {
  ranking: { ko: "가장 많이 이용된 서비스", en: "Most-Used Services" },
  rankingNote: {
    ko: "정확한 이용률 수치가 아닌, 상대적 순위입니다 — 메인 화면 노출 우선순위를 정한 기준.",
    en: "A relative rank, not an exact usage figure — this is what I used to prioritize the main dashboard.",
  },
  causes: { ko: "이탈 원인 (추정)", en: "Suspected Drop-off Causes" },
  resolution: { ko: "해결 방법", en: "How I Solved It" },
};

function GuidePanelView({ panel, locale }: { panel: GuidePanel; locale: Locale }) {
  const images = panel.images ?? [];
  const themes = [...new Set(images.map((img) => img.theme).filter(Boolean))] as (
    | "dark"
    | "light"
  )[];
  const hasThemeToggle = themes.length > 1;
  const [theme, setTheme] = useState<"dark" | "light">(themes[0] ?? "dark");

  const visibleImages = hasThemeToggle ? images.filter((img) => img.theme === theme) : images;

  return (
    <div className="flex flex-col gap-6">
      {panel.intro && (
        <p className="text-sm leading-relaxed text-white/60">{panel.intro[locale]}</p>
      )}

      {panel.bubbles && panel.bubbles.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2">
          {panel.bubbles.map((group, i) => (
            <div key={i}>
              <div className="mb-3 text-xs font-medium uppercase tracking-wide text-white/40">
                {group.label[locale]}
              </div>
              <div className="flex flex-col items-start gap-2">
                {group.items.map((item, j) => (
                  <div
                    key={j}
                    className="max-w-full rounded-2xl rounded-tl-sm bg-white/[0.06] px-4 py-2.5 text-sm leading-snug text-white/75"
                  >
                    {item[locale]}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div>
          {hasThemeToggle && (
            <div className="mb-5 flex items-center gap-1 rounded-full border border-white/15 p-1 w-fit">
              {themes.map((t) => (
                <button
                  key={t}
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
          )}

          <div className="flex flex-col gap-8">
            {visibleImages
              .filter((img) => img.device === "mobile")
              .map((img, i) => (
                <figure key={i} className="flex flex-col items-center">
                  {img.video ? (
                    <PhoneFrame src={img.src} video={img.video} alt={img.caption[locale]} />
                  ) : (
                    <Zoomable item={{ src: img.src, alt: img.caption[locale] }} className="w-full max-w-[280px]">
                      <PhoneFrame src={img.src} alt={img.caption[locale]} />
                    </Zoomable>
                  )}
                  <figcaption className="mt-3 text-xs text-white/40">
                    {img.caption[locale]}
                  </figcaption>
                </figure>
              ))}

            {(() => {
              const desktopImages = visibleImages.filter((img) => img.device !== "mobile");
              if (desktopImages.length === 0) return null;
              if (desktopImages.length === 1) {
                const img = desktopImages[0];
                return (
                  <figure>
                    {img.video ? (
                      <video
                        src={img.video}
                        poster={img.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full rounded-xl border border-white/10"
                      />
                    ) : (
                      <Zoomable item={{ src: img.src, alt: img.caption[locale] }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.src}
                          alt={img.caption[locale]}
                          className="w-full rounded-xl border border-white/10"
                        />
                      </Zoomable>
                    )}
                    <figcaption className="mt-2 text-xs text-white/40">
                      {img.caption[locale]}
                    </figcaption>
                  </figure>
                );
              }
              return <ImageCarousel images={desktopImages} locale={locale} />;
            })()}
          </div>
        </div>
      )}

      {panel.responsive && <ResponsiveShowcase shots={panel.responsive} locale={locale} />}

      {panel.compare && (
        <div className="grid gap-4 sm:grid-cols-2">
          {(["left", "right"] as const).map((side) => {
            const shot = panel.compare![side];
            return (
              <figure key={side}>
                <Zoomable item={{ src: shot.src, alt: shot.caption[locale] }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={shot.src}
                    alt={shot.caption[locale]}
                    className="w-full rounded-xl border border-white/10"
                  />
                </Zoomable>
                <figcaption className="mt-2 text-xs text-white/40">{shot.caption[locale]}</figcaption>
              </figure>
            );
          })}
        </div>
      )}

      {panel.steps && panel.steps.length > 0 && (
        <StepFlow steps={panel.steps} locale={locale} accent={panel.stepsAccent} />
      )}

      {panel.ranking && panel.ranking.length > 0 && (
        <div>
          <div className="font-display text-base italic text-paper">
            {SECTION_LABEL.ranking[locale]}
          </div>
          <p className="mt-1 text-xs text-white/40">{SECTION_LABEL.rankingNote[locale]}</p>
          <div className="mt-4 flex flex-col gap-3">
            {panel.ranking.map((item, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-paper">{item.label[locale]}</span>
                  {item.note && (
                    <span className="text-right text-xs text-white/40">{item.note[locale]}</span>
                  )}
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-paper/70"
                    style={{ width: `${Math.max(30, 100 - i * 28)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {panel.percentBars && panel.percentBars.length > 0 && (
        <div>
          <div className="flex flex-col gap-3">
            {panel.percentBars.map((item, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-sm text-paper">{item.label[locale]}</span>
                  <span className="shrink-0 font-display text-sm italic text-paper">
                    {item.value}%
                  </span>
                </div>
                {item.note && (
                  <p className="mt-0.5 text-xs text-white/40">{item.note[locale]}</p>
                )}
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-paper/70"
                    style={{ width: `${Math.min(100, Math.max(1, item.value))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          {panel.percentBarsSource && (
            <p className="mt-3 text-xs text-white/35">{panel.percentBarsSource[locale]}</p>
          )}
        </div>
      )}

      {panel.causes && panel.causes.length > 0 && (
        <div>
          <div className="font-display text-base italic text-paper">
            {SECTION_LABEL.causes[locale]}
          </div>
          <ol className="mt-4 flex flex-col">
            {panel.causes.map((item, i) => (
              <li
                key={i}
                className="flex gap-3 border-t border-white/10 py-3 first:border-t-0"
              >
                <span className="shrink-0 font-display text-sm italic text-white/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm text-white/60">{item.label[locale]}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {panel.resolution && (
        <div className="rounded-xl border border-white/15 bg-white/[0.03] p-4">
          <div className="font-display text-base italic text-paper">
            {SECTION_LABEL.resolution[locale]}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            {panel.resolution[locale]}
          </p>
        </div>
      )}

      {panel.list && panel.list.length > 0 && (
        <ol className="flex flex-col">
          {panel.list.map((item, i) => (
            <li
              key={i}
              className="flex gap-4 border-t border-white/10 py-4 first:border-t-0"
            >
              <span className="shrink-0 font-display text-sm italic text-white/30">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="font-display text-base italic text-paper">
                  {item.label[locale]}
                </div>
                {item.note && (
                  <p className="mt-1 text-sm leading-relaxed text-white/50">
                    {item.note[locale]}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}

      {panel.tree && panel.tree.length > 0 && (
        <ul className="flex flex-col gap-3">
          {panel.tree.map((node, i) => (
            <li key={i}>
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-xs italic text-white/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-base italic text-paper">
                  {node.label[locale]}
                </span>
              </div>
              {node.children && node.children.length > 0 && (
                <ul className="ml-1 mt-2 flex flex-col gap-1.5 border-l border-white/10 pl-5">
                  {node.children.map((c, j) => (
                    <li key={j} className="text-sm text-white/50">
                      {c[locale]}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}

      {panel.colors && panel.colors.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {panel.colors.map((c, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-white/10">
              <div className="true-color h-16 w-full" style={{ backgroundColor: c.hex }} />
              <div className="p-3">
                <div className="text-sm text-paper">{c.name[locale]}</div>
                <div className="mt-0.5 font-mono text-[11px] uppercase text-white/40">
                  {c.hex}
                </div>
                <div className="mt-1.5 text-[11px] leading-snug text-white/35">
                  {c.role[locale]}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** A numbered process timeline — for a sequence that IS the point (an
 * argument order, a pipeline), not just a rundown of parallel features.
 * Always vertical (a horizontal row reads worse once labels wrap). Nodes
 * connect with a gradient line that runs solid-to-faded through each
 * segment, so consecutive segments chain into one line that visibly pushes
 * from 01 toward the last step. Reveals step by step on mount via
 * `animationDelay`, CSS-only, so it replays every time the tab is opened. */
function StepFlow({
  steps,
  locale,
  accent = "#ffffff",
}: {
  steps: GuideListItem[];
  locale: Locale;
  accent?: string;
}) {
  return (
    <div className="flex flex-col">
      {steps.map((step, i) => (
        <div
          key={i}
          className="animate-step-in relative flex gap-4 pb-8 last:pb-0"
          style={{ animationDelay: `${i * 150}ms` }}
        >
          {i < steps.length - 1 && (
            <span
              className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px"
              style={{ background: `linear-gradient(to bottom, ${accent}, ${accent}33)` }}
              aria-hidden
            />
          )}
          <span
            className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm italic text-paper"
            style={{ border: `1px solid ${accent}99` }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="pt-1">
            <div className="font-display text-base italic text-paper">{step.label[locale]}</div>
            {step.note && (
              <p className="mt-1 text-sm leading-relaxed text-white/50">{step.note[locale]}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/** CSS-only phone bezel — no device-mockup asset needed. With a `video`,
 * that plays looped/muted in place of the still (its natural scroll-through
 * *is* the scroll demo). Without one, the still — a full page capture — is
 * cropped to just the top (object-top) rather than squeezed to fit. */
function PhoneFrame({ src, video, alt }: { src: string; video?: string; alt: string }) {
  return (
    <div className="relative w-full max-w-[280px]">
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.6rem] border-[7px] border-white/15 bg-black shadow-lg">
        <div
          className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-black"
          aria-hidden
        />
        {video ? (
          <video
            src={video}
            poster={src}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover object-top"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="h-full w-full object-cover object-top" />
        )}
      </div>
    </div>
  );
}

/** PC/Mobile toggle over a single tall full-page capture — for a responsive
 * screen where a flat crop can't show the whole page, unlike the paired
 * dark/light captures elsewhere which are already a manageable height. */
function ResponsiveShowcase({
  shots,
  locale,
}: {
  shots: NonNullable<GuidePanel["responsive"]>;
  locale: Locale;
}) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const shot = shots[device];

  return (
    <div>
      <div className="mb-5 flex w-fit items-center gap-1 rounded-full border border-white/15 p-1">
        {(["desktop", "mobile"] as const).map((d) => (
          <button
            key={d}
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

      <figure className="flex flex-col items-center">
        <ScrollableFrame key={device} src={shot.src} alt={shot.caption[locale]} device={device} />
        <figcaption className="mt-3 text-xs text-white/40">{shot.caption[locale]}</figcaption>
      </figure>
    </div>
  );
}

/** Full-page capture inside a device frame, scrolled with the mouse/trackpad/
 * finger instead of statically cropped — the browser's own scrollbar is left
 * visible as the "there's more" affordance, backed by a bottom fade so a
 * partially-scrolled view doesn't read as simply cut off. `key={device}` on
 * the caller resets scroll position when switching PC/Mobile. */
function ScrollableFrame({
  src,
  alt,
  device,
}: {
  src: string;
  alt: string;
  device: "desktop" | "mobile";
}) {
  if (device === "mobile") {
    return (
      <div className="relative w-full max-w-[340px] md:max-w-[380px]">
        <div className="relative max-h-[660px] overflow-hidden rounded-[2.6rem] border-[7px] border-white/15 bg-black shadow-lg md:max-h-[720px]">
          <div
            className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-black"
            aria-hidden
          />
          <Zoomable item={{ src, alt }} className="h-full w-full overflow-y-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="w-full" />
          </Zoomable>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-12 rounded-b-[2rem] bg-gradient-to-t from-black/70 to-transparent"
            aria-hidden
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/15 bg-[#151515] shadow-lg">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      </div>
      <Zoomable item={{ src, alt }} className="max-h-[420px] w-full overflow-y-auto md:max-h-[560px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full" />
      </Zoomable>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#151515] to-transparent"
        aria-hidden
      />
    </div>
  );
}

function ImageCarousel({ images, locale }: { images: GuideImage[]; locale: Locale }) {
  const [index, setIndex] = useState(0);
  const img = images[Math.min(index, images.length - 1)];

  return (
    <figure>
      <Zoomable item={{ src: img.src, alt: img.caption[locale] }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.src}
          alt={img.caption[locale]}
          className="w-full rounded-xl border border-white/10"
        />
      </Zoomable>
      <figcaption className="mt-2 flex items-center justify-between text-xs text-white/40">
        <span>{img.caption[locale]}</span>
        <span className="flex items-center gap-3">
          <button
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            aria-label="Previous"
            className="transition-colors hover:text-paper"
          >
            <WorkArrowIcon className="h-3 w-3 rotate-[225deg]" />
          </button>
          <span>
            {index + 1} / {images.length}
          </span>
          <button
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            aria-label="Next"
            className="transition-colors hover:text-paper"
          >
            <WorkArrowIcon className="h-3 w-3 rotate-45" />
          </button>
        </span>
      </figcaption>
    </figure>
  );
}
