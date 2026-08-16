"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ThemeSection } from "@/components/site-header/theme-section";
import { useRegisterThemeSection } from "@/components/site-header/gnb-theme";
import { useLocale } from "@/components/site-header/locale-context";
import { Logo } from "@/components/logo";
import { VideoSlot } from "@/components/media/video-slot";
import { WorkListPanel } from "./work-list-panel";

// Section headers ("Work" / "Contact") stay English in every locale — same
// convention as the "Service"/"About" headers.
const COPY = {
  tagline: {
    ko: ["이 길을 함께 걷겠습니다 —", "첫 스케치부터 마지막 픽셀까지."],
    en: ["Let's walk this road together —", "from the first sketch to the last pixel."],
  },
};

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Scroll-progress boundaries — everything here tracks scroll position
 * directly (scrub), exactly like the About sphere sequence: scroll down to
 * advance, scroll up to reverse, at any point.
 *
 * The track is taller than the animated sequence on purpose: position:sticky
 * only stays pinned until (trackHeight - 100vh), so the *last* 100vh of any
 * track is always "unsticking" (the pinned view starts scrolling away for
 * real). Contact's reveal has to fully finish *before* that zone starts, or
 * it ends up fading in while visually sliding off-screen. */
const LIST_END = 0.354; // list stays fully visible up to here
const FADE_END = 0.456; // list has fully faded out by here
const CIRCLE_END = 0.691; // white circle has fully grown by here
const CONTACT_END = 0.786; // Contact content fully faded in, ~50vh before unstick begins

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

export function WorkSection() {
  const { locale } = useLocale();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const listStageRef = useRef<HTMLDivElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  // Positioned inside the tall track (not the sticky viewport) so it only
  // enters the GNB's observing band once scroll has actually reached the
  // white/Contact portion — same trick as the About section's markers.
  const lightMarkerRef = useRegisterThemeSection("light");

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;

        if (listStageRef.current) {
          const listOpacity =
            p <= LIST_END ? 1 : Math.max(0, 1 - (p - LIST_END) / (FADE_END - LIST_END));
          listStageRef.current.style.opacity = `${listOpacity}`;
          listStageRef.current.style.pointerEvents = listOpacity > 0.5 ? "auto" : "none";
        }

        if (circleRef.current) {
          const circleProgress = smoothstep(
            Math.max(0, (p - FADE_END) / (CIRCLE_END - FADE_END))
          );
          circleRef.current.style.transform = `translateX(-50%) scale(${circleProgress})`;
        }

        if (backdropRef.current) {
          backdropRef.current.style.opacity = p >= CIRCLE_END - 0.01 ? "1" : "0";
        }

        if (contactRef.current) {
          const contactOpacity = Math.max(0, (p - CIRCLE_END) / (CONTACT_END - CIRCLE_END));
          contactRef.current.style.opacity = `${contactOpacity}`;
          contactRef.current.style.pointerEvents = contactOpacity > 0.5 ? "auto" : "none";
        }
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <ThemeSection theme="dark" id="work" snap>
      <div ref={trackRef} className="relative" style={{ height: "450vh" }}>
        <div
          ref={lightMarkerRef}
          className="pointer-events-none absolute inset-x-0"
          style={{ top: "74%", height: "8%" }}
          aria-hidden
        />

        <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
          <div
            ref={listStageRef}
            className="wrap absolute inset-0 flex min-h-0 flex-col pb-16 pt-[88px] md:pb-20 md:pt-[112px]"
          >
            <Logo tone="paper" size="small" className="mb-8 shrink-0 md:mb-10" />
            <p className="mb-10 shrink-0 font-display text-4xl italic text-paper md:mb-14 md:text-6xl">
              Work
            </p>
            <WorkListPanel />
          </div>

          {/* Huge circle anchored at the bottom-center — grows and shrinks
              in lockstep with scroll, exactly like the About vignette. */}
          <div
            ref={circleRef}
            className="pointer-events-none absolute bottom-0 left-1/2 h-[220vmax] w-[220vmax] rounded-full bg-paper"
            style={{ transformOrigin: "50% 100%", transform: "translateX(-50%) scale(0)" }}
            aria-hidden
          />

          {/* Solid backdrop as a safety net so no sliver of the dark
              background can peek through once fully covered. */}
          <div
            ref={backdropRef}
            className="pointer-events-none absolute inset-0 bg-paper opacity-0"
            aria-hidden
          />

          <div
            ref={contactRef}
            id="contact"
            className="wrap absolute inset-0 flex flex-col pb-16 pt-[88px] opacity-0 md:pb-20 md:pt-[112px]"
          >
            <Logo tone="ink" size="small" className="mb-8 md:mb-10" />

            <div className="mb-8 flex flex-col items-start justify-between gap-6 md:mb-12 md:flex-row md:items-end">
              <p className="font-display text-4xl italic text-ink md:text-7xl">
                Contact
              </p>
              <p className="max-w-sm text-right text-sm leading-relaxed text-muted md:text-base">
                {COPY.tagline[locale][0]}
                <br />
                {COPY.tagline[locale][1]}
              </p>
            </div>

            <div className="h-[240px] w-full md:h-[400px]">
              <VideoSlot
                basename="walking-crowd"
                label="분주히 걸어가는 사람들 영상 자리"
                grayscale={false}
                className="rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>
    </ThemeSection>
  );
}
