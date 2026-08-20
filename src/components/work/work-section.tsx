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
import { ContactActions } from "./contact-actions";

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

/** Progress boundaries (0–1) for the circle → Contact transition. The list
 * above is a normal, freely-scrollable block now — browsing it and clicking
 * into a project has to stay entirely under the visitor's control. Only
 * this passive transition autoplays once scrolled into view, the same way
 * the About sequence does. */
const CIRCLE_END = 0.75; // white circle has fully grown by here
const CONTACT_END = 1; // Contact content fully faded in

const TRANSITION_DURATION = 3.5; // seconds
const TRANSITION_TRACK_VH = 140;

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

export function WorkSection() {
  const { locale } = useLocale();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);

  // Positioned inside the transition track (not the sticky viewport) so it
  // only enters the GNB's observing band once the reveal has actually
  // reached the white/Contact portion — same trick as the About markers,
  // moved by hand in applyPhase() since scroll is frozen while this plays.
  const lightMarkerRef = useRegisterThemeSection("light");

  useEffect(() => {
    let lightTriggered = false;

    function applyPhase(p: number) {
      if (circleRef.current) {
        const circleProgress = smoothstep(Math.min(1, p / CIRCLE_END));
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

      if (p >= CIRCLE_END && !lightTriggered) {
        lightTriggered = true;
        if (lightMarkerRef.current) lightMarkerRef.current.style.top = "0px";
        window.dispatchEvent(new Event("scroll"));
      } else if (p < CIRCLE_END && lightTriggered) {
        lightTriggered = false;
        if (lightMarkerRef.current) lightMarkerRef.current.style.top = "74%";
        window.dispatchEvent(new Event("scroll"));
      }
    }

    applyPhase(0);

    const state = { p: 0 };
    let playing = false;

    function lock() {
      playing = true;
      document.body.style.overflow = "hidden";
    }
    function unlock() {
      playing = false;
      document.body.style.overflow = "";
    }

    const transitionTween = gsap.to(state, {
      p: 1,
      duration: TRANSITION_DURATION,
      ease: "power1.inOut",
      paused: true,
      onUpdate: () => applyPhase(state.p),
      onComplete: unlock,
    });

    function handleSkip() {
      if (!playing) return;
      transitionTween.progress(1);
      unlock();
    }
    const sceneEl = sceneRef.current;
    sceneEl?.addEventListener("click", handleSkip);

    const trigger = ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top top",
      end: "bottom bottom",
      onEnter: () => {
        if (state.p >= 1 || playing) return;
        lock();
        transitionTween.play();
      },
      onLeaveBack: () => {
        transitionTween.pause(0);
        unlock();
        applyPhase(0);
      },
    });

    return () => {
      trigger.kill();
      transitionTween.kill();
      sceneEl?.removeEventListener("click", handleSkip);
      document.body.style.overflow = "";
    };
  }, [lightMarkerRef]);

  return (
    <ThemeSection theme="dark" id="work" snap>
      <div className="bg-ink pb-16 pt-[88px] md:pb-20 md:pt-[112px]">
        <div className="wrap flex flex-col">
          <Logo tone="paper" size="small" className="mb-8 shrink-0 md:mb-10" />
          <p className="mb-10 shrink-0 font-display text-4xl italic text-paper md:mb-14 md:text-6xl">
            Work
          </p>
          <WorkListPanel />
        </div>
      </div>

      <div ref={trackRef} className="relative" style={{ height: `${TRANSITION_TRACK_VH}vh` }}>
        <div
          ref={lightMarkerRef}
          className="pointer-events-none absolute inset-x-0"
          style={{ top: "74%", height: "8%" }}
          aria-hidden
        />

        <div ref={sceneRef} className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
          {/* Huge circle anchored at the bottom-center — grows and shrinks
              in lockstep with the transition, exactly like the About vignette. */}
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

            <ContactActions />

            <div className="mt-8 h-[240px] w-full md:mt-12 md:h-[400px]">
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
