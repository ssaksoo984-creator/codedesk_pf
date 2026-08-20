"use client";

import { Logo } from "@/components/logo";
import { ServiceScroller } from "@/components/service/service-scroller";
import { useRegisterThemeSection } from "@/components/site-header/gnb-theme";
import { useLocale } from "@/components/site-header/locale-context";
import { ABOUT_IMAGES, ABOUT_SLIDES } from "@/lib/about-content";
import { SERVICE_INTRO } from "@/lib/service-content";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SPHERE_TILT_DEG = 26;
const FINAL_LOGO_SCALE = 0.4; // how small the relocated logo ends up

/** The sphere spins continuously on its own now, independent of scroll —
 * one full 360° turn every SPHERE_ROTATION_SECONDS, looping forever.
 * Tweak this to change how fast it spins. */
const SPHERE_ROTATION_SECONDS = 14;

/** The 3 About slides (title + description) still change by scroll — that
 * part reads better under the visitor's own control than autoplayed. This
 * is just the slide text now (the sphere no longer shares this track), so
 * it's shorter than it needs to be for a whole rotation — tweak this
 * directly if it still feels too long or short per slide. (Rescaled from
 * 480 — that number was set while the vh-unit bug below made it behave
 * like ~53vh in practice; 55 reproduces the same feel now that it's
 * fixed.) */
const SLIDES_TRACK_VH = 160;

/** How long the outgoing/incoming slide text takes to cross-fade — keep in
 * sync with the `duration-200` Tailwind class on titleRef/descRef below. */
const SLIDE_FADE_MS = 200;

/** A fast scroll (a single trackpad flick can easily cover several vh in
 * one tick) used to be able to jump straight from slide 1 to slide 3,
 * skipping 2 entirely, since slide index was read directly off scroll
 * position with no floor on how long each one stays on screen. This is
 * the floor: once a slide change starts, the next one can't start for at
 * least this long, so scrolling fast still steps through 1 → 2 → 3 instead
 * of skipping ahead — it just catches up to wherever the scroll ended once
 * it's done stepping. */
const SLIDE_MIN_DWELL_MS = 350;

/** Extra scroll after slide 3 with nothing scheduled to happen — dead
 * space on purpose, so there's a moment to actually read the last slide
 * before Phase B–E's transition takes over. Separate from SLIDES_TRACK_VH
 * (which only covers paging through the 3 slides) per request. (Rescaled
 * from 60 for the same vh-unit-bug reason as SLIDES_TRACK_VH above.) */
const SLIDE_TO_TRANSITION_GAP_VH = 10;

/** Everything after the slides (cards converge → blackout → logo relocates
 * → Service reveals) is purely visual, so it plays once as a fixed-duration
 * animation the moment it scrolls into view, the same way the Work
 * section's circle → Contact transition does — see the comment on the
 * ScrollTrigger below for why scroll gets briefly held while it plays. */
const PHASE_BE_TRACK_VH = 200;
const PHASE_BE_DURATION = 3.5; // seconds

/** Progress boundaries (0–1) for phases B–E, rescaled to their own local
 * range now that they run independently of Phase A (they used to share one
 * 0–1 scroll fraction with Phase A ending at 0.4; e.g. old CONVERGE_END
 * 0.544 becomes (0.544 − 0.4) / (1 − 0.4) = 0.24 here). The choreography
 * itself is unchanged. */
const CONVERGE_END = 0.24; // cards collapse to center, finale logo fades in (ink, centered)
const BLACKOUT_END = 0.453; // background vignette closes to black, logo crossfades to paper
const RELOCATE_END = 0.667; // logo shrinks + slides top-left and settles there
const SERVICE_END = 1; // Service title/description/cards fade in below the logo, same spot

function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

interface CardLayout {
  x: number;
  y: number;
  z: number;
  rotY: number;
  rotX: number;
}

export function SphereGallery() {
  const { locale } = useLocale();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const phaseBMarkerRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const sphereRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const finaleStageRef = useRef<HTMLDivElement | null>(null);
  const finaleLogoRef = useRef<HTMLDivElement | null>(null);
  const logoInkRef = useRef<HTMLDivElement | null>(null);
  const logoPaperRef = useRef<HTMLDivElement | null>(null);
  const blackoutRef = useRef<HTMLDivElement | null>(null);
  const serviceStageRef = useRef<HTMLDivElement | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const layoutsRef = useRef<CardLayout[]>([]);

  // Registered with the GNB's scroll-position-based theme system; moved by
  // hand in applyPhaseBE() once blackout completes; see the comment there.
  const darkMarkerRef = useRegisterThemeSection("dark");

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const radius = isMobile ? 137 : 360;
    const count = ABOUT_IMAGES.length;

    layoutsRef.current = ABOUT_IMAGES.map((_, i) => {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      const rotY = Math.atan2(x, z) * (180 / Math.PI);
      const rotX = Math.asin(-y / radius) * (180 / Math.PI);

      return { x, y, z, rotY, rotX };
    });

    cardRefs.current.forEach((card, i) => {
      const layout = layoutsRef.current[i];
      if (!card || !layout) return;
      card.style.transform = `translate3d(${layout.x}px, ${layout.y}px, ${layout.z}px) rotateY(${layout.rotY}deg) rotateX(${layout.rotX}deg)`;
    });

    // Where the shrunk logo should land: roughly the same top-left spot the
    // Service/Work section headers sit at.
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const wrapPadding = Math.min(64, Math.max(20, vw * 0.04));
    const contentWidth = Math.min(vw, 1800);
    const leftEdge = (vw - contentWidth) / 2 + wrapPadding;
    const topEdge = isMobile ? 88 : 112;

    // Measure the logo's real rendered size (at its natural, un-transformed
    // centered state) so the relocated position lands its LEFT edge exactly
    // on leftEdge instead of guessing at its width.
    const logoRect = finaleLogoRef.current?.getBoundingClientRect();
    const logoHalfW = logoRect ? (logoRect.width * FINAL_LOGO_SCALE) / 2 : 0;
    const logoHalfH = logoRect ? (logoRect.height * FINAL_LOGO_SCALE) / 2 : 0;
    const relocateX = leftEdge - vw / 2 + logoHalfW;
    const relocateY = topEdge - vh / 2 + logoHalfH;

    let currentIndex = -1;

    // ---- Sphere: spins continuously on its own, independent of scroll.
    // The "focused" card (full color, the rest dimmed) tracks rotation
    // progress rather than the slide below, since it's really about
    // whichever card currently faces the viewer as the sphere turns. ----
    function applyRotation(r: number) {
      if (sphereRef.current) {
        sphereRef.current.style.transform = `translateZ(-1px) rotateY(${
          r * 360
        }deg) rotateX(${SPHERE_TILT_DEG}deg)`;
      }

      const focusIndex = Math.floor(r * count);
      cardRefs.current.forEach((card, i) => {
        const layout = layoutsRef.current[i];
        if (!card || !layout) return;
        const near = Math.abs(i - focusIndex) < 2;
        card.style.opacity = "1";
        card.style.transform = `translate3d(${layout.x}px, ${layout.y}px, ${layout.z}px) rotateY(${layout.rotY}deg) rotateX(${layout.rotX}deg)`;
        card.style.filter = near
          ? "grayscale(0%) brightness(1)"
          : "grayscale(85%) brightness(0.85)";
      });
    }

    applyRotation(0);

    const rotationState = { r: 0 };
    const rotationTween = gsap.to(rotationState, {
      r: 1,
      duration: SPHERE_ROTATION_SECONDS,
      ease: "none",
      repeat: -1,
      onUpdate: () => applyRotation(rotationState.r),
    });

    // ---- Slides: still scroll-scrubbed, cross-fading between the old and
    // new text instead of swapping instantly — and always stepping through
    // 1 → 2 → 3 one at a time (see SLIDE_MIN_DWELL_MS) instead of jumping
    // straight to wherever a fast scroll landed. ----
    let slideTarget = 0;
    let slideTimeout: ReturnType<typeof setTimeout> | null = null;
    let slideStepping = false;

    function stepSlide() {
      if (slideStepping || currentIndex === slideTarget) return;
      slideStepping = true;
      const next = currentIndex + (slideTarget > currentIndex ? 1 : -1);

      if (titleRef.current) titleRef.current.style.opacity = "0";
      if (descRef.current) descRef.current.style.opacity = "0";
      slideTimeout = setTimeout(() => {
        currentIndex = next;
        setSlideIndex(next);
        requestAnimationFrame(() => {
          if (titleRef.current) titleRef.current.style.opacity = "1";
          if (descRef.current) descRef.current.style.opacity = "1";
        });
        slideTimeout = setTimeout(() => {
          slideStepping = false;
          stepSlide();
        }, SLIDE_MIN_DWELL_MS);
      }, SLIDE_FADE_MS);
    }

    function applySlideScroll(p: number) {
      slideTarget = Math.min(ABOUT_SLIDES.length - 1, Math.floor(p * ABOUT_SLIDES.length));
      stepSlide();
    }

    currentIndex = 0;
    applySlideScroll(0);

    // `end` is a function, not a "+=Nvh" string — ScrollTrigger's relative
    // offset parser doesn't actually resolve vh units (it silently reads
    // just the leading number as px), so "+=480vh" was quietly behaving
    // like "+=480px". A function recomputes in real px off the current
    // viewport height, and also keeps it correct across resizes.
    const scrubTrigger = ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top top",
      end: () => `+=${(SLIDES_TRACK_VH / 100) * window.innerHeight}`,
      scrub: 1,
      onUpdate: (self) => applySlideScroll(self.progress),
    });

    // ---- Phases B–E: converge → blackout → relocate → Service reveal —
    // plays once as a fixed-duration animation the moment it scrolls into
    // view, with scroll briefly held (input blocked, not just visually
    // pinned) so a fast scroll can't cut the sequence off partway through.
    // A click/tap skips straight to the end. ----
    let darkTriggered = false;

    function applyPhaseBE(p: number) {
      if (p <= CONVERGE_END) {
        // ---- cards collapse to center, finale logo fades in ----
        const p2 = p / CONVERGE_END;
        const ease = smoothstep(p2);

        if (titleRef.current) titleRef.current.style.opacity = `${Math.max(0, 1 - p2 * 4)}`;
        if (descRef.current) descRef.current.style.opacity = `${Math.max(0, 1 - p2 * 4)}`;

        cardRefs.current.forEach((card, i) => {
          const layout = layoutsRef.current[i];
          if (!card || !layout) return;
          card.style.transform = `translate3d(${layout.x * (1 - ease)}px, ${
            layout.y * (1 - ease)
          }px, ${layout.z * (1 - ease)}px) rotateY(${
            layout.rotY * (1 - ease)
          }deg) rotateX(${layout.rotX * (1 - ease)}deg) scale(${Math.max(0.001, 1 - ease)})`;
          card.style.filter = `grayscale(${ease * 100}%) brightness(${1 - ease})`;
          card.style.opacity = `${1 - Math.max(0, p2 - 0.85) * 6}`;
        });

        if (finaleStageRef.current) {
          const reveal = Math.max(0, (p2 - 0.5) / 0.5);
          finaleStageRef.current.style.opacity = `${Math.min(1, reveal)}`;
        }
        if (finaleLogoRef.current) {
          finaleLogoRef.current.style.transform = "translate3d(0, 0, 0) scale(1)";
        }
        if (logoInkRef.current) logoInkRef.current.style.opacity = "1";
        if (logoPaperRef.current) logoPaperRef.current.style.opacity = "0";
        if (blackoutRef.current) {
          blackoutRef.current.style.opacity = `${ease}`;
          blackoutRef.current.style.background =
            "radial-gradient(circle at center, transparent 75%, #0d0d0d 140%)";
        }
        if (serviceStageRef.current) {
          serviceStageRef.current.style.opacity = "0";
          serviceStageRef.current.style.pointerEvents = "none";
        }
      } else {
        // Cards stay fully collapsed and hidden from here on.
        cardRefs.current.forEach((card) => {
          if (card) card.style.opacity = "0";
        });
        if (titleRef.current) titleRef.current.style.opacity = "0";
        if (descRef.current) descRef.current.style.opacity = "0";
        if (finaleStageRef.current) finaleStageRef.current.style.opacity = "1";

        if (p <= BLACKOUT_END) {
          // ---- vignette closes in from the edges, logo inverts ----
          const p3 = (p - CONVERGE_END) / (BLACKOUT_END - CONVERGE_END);
          const innerRadius = (1 - p3) * 75;

          if (blackoutRef.current) {
            blackoutRef.current.style.opacity = "1";
            blackoutRef.current.style.background =
              p3 >= 0.999
                ? "#0d0d0d"
                : `radial-gradient(circle at center, transparent ${innerRadius}%, #0d0d0d ${
                    innerRadius + 65
                  }%)`;
          }
          if (logoInkRef.current) logoInkRef.current.style.opacity = `${1 - p3}`;
          if (logoPaperRef.current) logoPaperRef.current.style.opacity = `${p3}`;
          if (finaleLogoRef.current) {
            finaleLogoRef.current.style.transform = "translate3d(0, 0, 0) scale(1)";
          }
          if (serviceStageRef.current) {
            serviceStageRef.current.style.opacity = "0";
            serviceStageRef.current.style.pointerEvents = "none";
          }
        } else if (p <= RELOCATE_END) {
          // ---- logo shrinks, slides toward the top-left, and fades out
          // along the way instead of settling there — it just disappears
          // mid-move. ----
          const p4 = (p - BLACKOUT_END) / (RELOCATE_END - BLACKOUT_END);
          const ease = smoothstep(p4);

          if (blackoutRef.current) {
            blackoutRef.current.style.opacity = "1";
            blackoutRef.current.style.background = "#0d0d0d";
          }
          if (logoInkRef.current) logoInkRef.current.style.opacity = "0";
          if (logoPaperRef.current) logoPaperRef.current.style.opacity = `${1 - ease}`;
          if (serviceStageRef.current) {
            serviceStageRef.current.style.opacity = "0";
            serviceStageRef.current.style.pointerEvents = "none";
          }
          if (finaleLogoRef.current) {
            const scale = 1 - ease * (1 - FINAL_LOGO_SCALE);
            finaleLogoRef.current.style.transform = `translate3d(${
              relocateX * ease
            }px, ${relocateY * ease}px, 0) scale(${scale})`;
          }
        } else {
          // ---- logo is gone — the Service header (logo + title, same
          // layout as Work/Contact) fades in at the same anchor spot ----
          const p5 = (p - RELOCATE_END) / (SERVICE_END - RELOCATE_END);
          const reveal = smoothstep(p5);

          if (blackoutRef.current) {
            blackoutRef.current.style.opacity = "1";
            blackoutRef.current.style.background = "#0d0d0d";
          }
          if (logoPaperRef.current) logoPaperRef.current.style.opacity = "0";
          if (serviceStageRef.current) {
            serviceStageRef.current.style.opacity = `${reveal}`;
            serviceStageRef.current.style.pointerEvents = p5 > 0.5 ? "auto" : "none";
          }
        }
      }

      // The GNB's dark/light flip is driven by a marker's scroll position
      // (see gnb-theme.tsx) — but scroll is frozen for the whole time this
      // plays (see `lock`/`unlock` below), so it'd never fire on its own.
      // Move the marker across the activation line by hand at the moment
      // blackout completes, and fire a synthetic scroll event so the
      // existing scroll-position-based system picks it up regardless.
      if (p >= BLACKOUT_END && !darkTriggered) {
        darkTriggered = true;
        if (darkMarkerRef.current) darkMarkerRef.current.style.top = "0px";
        window.dispatchEvent(new Event("scroll"));
      } else if (p < BLACKOUT_END && darkTriggered) {
        darkTriggered = false;
        if (darkMarkerRef.current) darkMarkerRef.current.style.top = "58%";
        window.dispatchEvent(new Event("scroll"));
      }
    }

    applyPhaseBE(0);

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
      duration: PHASE_BE_DURATION,
      ease: "power1.inOut",
      paused: true,
      onUpdate: () => applyPhaseBE(state.p),
      onComplete: unlock,
    });

    function handleSkip() {
      if (!playing) return;
      transitionTween.progress(1);
      unlock();
    }
    const sceneEl = sceneRef.current;
    sceneEl?.addEventListener("click", handleSkip);

    // Crossing into the B–E zone doesn't necessarily mean slide 3 has
    // actually finished settling on screen yet — a fast scroll can cross
    // the (deliberately short) gap before the slide-3 fade-in from
    // stepSlide() above has landed, which was cutting slide 3 off before
    // it was ever really seen. Wait for the slide queue to fully settle on
    // the last slide before letting the animation start, instead of
    // relying on the gap's scroll distance alone to guarantee that.
    function tryEnterTransition() {
      if (state.p >= 1 || playing) return;
      // Bail if scroll has left the trigger zone again while this was
      // waiting on the slide queue (e.g. in → quickly back out) — otherwise
      // the retry can fire the lock after the user's already scrolled away.
      if (!transitionTrigger.isActive) return;
      if (slideStepping || currentIndex !== ABOUT_SLIDES.length - 1) {
        setTimeout(tryEnterTransition, 60);
        return;
      }
      rotationTween.pause();
      lock();
      transitionTween.play();
    }

    const transitionTrigger = ScrollTrigger.create({
      trigger: phaseBMarkerRef.current,
      start: "top top",
      end: () => `+=${(PHASE_BE_TRACK_VH / 100) * window.innerHeight}`,
      onEnter: tryEnterTransition,
      onLeaveBack: () => {
        transitionTween.pause(0);
        unlock();
        applyPhaseBE(0);
        rotationTween.resume();
      },
    });

    return () => {
      scrubTrigger.kill();
      transitionTrigger.kill();
      transitionTween.kill();
      rotationTween.kill();
      if (slideTimeout) clearTimeout(slideTimeout);
      sceneEl?.removeEventListener("click", handleSkip);
      document.body.style.overflow = "";
    };
  }, [darkMarkerRef]);

  const activeSlide = ABOUT_SLIDES[slideIndex];

  return (
    <div
      ref={trackRef}
      className="relative"
      style={{
        height: `${SLIDES_TRACK_VH + SLIDE_TO_TRANSITION_GAP_VH + PHASE_BE_TRACK_VH}vh`,
      }}
    >
      <div
        ref={phaseBMarkerRef}
        className="pointer-events-none absolute inset-x-0"
        style={{ top: `${SLIDES_TRACK_VH + SLIDE_TO_TRANSITION_GAP_VH}vh`, height: "1px" }}
        aria-hidden
      />
      <div
        ref={darkMarkerRef}
        className="pointer-events-none absolute inset-x-0"
        style={{ top: "58%", height: "10%" }}
        aria-hidden
      />
      <div id="service" className="absolute inset-x-0" style={{ top: "88%" }} aria-hidden />

      <div
        ref={sceneRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-paper"
        style={{ perspective: "1400px" }}
      >
        {/* The sphere now spins continuously (see rotationTween above)
            instead of only turning while the user actively scrolled, so
            cards are always somewhere mid-rotation, clipping in and out
            at the sticky viewport's top/bottom edge — including their drop
            shadow — every single loop. Fading that edge out instead of
            hard-cropping it is the same trick RollingCode uses. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-paper to-transparent md:h-32"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-paper to-transparent md:h-32"
          aria-hidden
        />

        <div className="wrap relative flex h-full items-center">
          <div
            className="pointer-events-none absolute top-[14%] z-20 max-w-[280px] md:top-[18%]"
            style={{ left: "clamp(1.25rem, 4vw, 4rem)" }}
          >
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted">
              About — 0{slideIndex + 1} / 0{ABOUT_SLIDES.length}
            </p>
            <div ref={titleRef} className="transition-opacity duration-200">
              <h2 className="font-display text-3xl italic leading-tight text-ink md:text-6xl">
                {activeSlide.title.en}
              </h2>
            </div>
          </div>

          <div
            className="pointer-events-none absolute bottom-[10%] z-20 max-w-[320px] text-right md:bottom-[14%]"
            style={{ right: "clamp(1.25rem, 4vw, 4rem)" }}
          >
            <p
              ref={descRef}
              className="text-sm leading-relaxed text-muted transition-opacity duration-200 md:text-base"
            >
              {activeSlide.desc[locale]}
            </p>
          </div>

          <div className="relative mx-auto flex h-full w-full items-center justify-center">
            <div
              ref={sphereRef}
              className="relative"
              style={{
                width: 0,
                height: 0,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              {ABOUT_IMAGES.map((src, i) => (
                <div
                  key={src}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="absolute -left-[51px] -top-[69px] h-[137px] w-[101px] rounded-xl border-2 border-white bg-white p-1 shadow-[0_18px_36px_rgba(13,13,13,0.12)] md:-left-[70px] md:-top-[95px] md:h-[190px] md:w-[140px]"
                  style={{ transformStyle: "preserve-3d", willChange: "transform" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full rounded-lg object-cover"
                    style={{ filter: "grayscale(85%) brightness(0.85)" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full-bleed vignette that closes in from the edges to black —
            lives outside .wrap so it always covers the entire viewport,
            regardless of the content max-width. */}
        <div
          ref={blackoutRef}
          className="pointer-events-none absolute inset-0 z-30 opacity-0"
          aria-hidden
        />

        {/* Finale logo: fades in centered (ink), inverts to paper, then
            shrinks + slides toward the top-left while fading out — it just
            disappears mid-move rather than settling there. */}
        <div
          ref={finaleStageRef}
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center opacity-0"
        >
          <div ref={finaleLogoRef} className="relative">
            <div ref={logoInkRef} className="opacity-100">
              <Logo size="default" tone="ink" className="!text-4xl md:!text-6xl" />
            </div>
            <div ref={logoPaperRef} className="absolute inset-0 opacity-0">
              <Logo size="default" tone="paper" className="!text-4xl md:!text-6xl" />
            </div>
          </div>

          {/* Once the logo above has vanished, the Service header fades in
              here — same logo + title layout as the Work/Contact headers,
              anchored at the same top-left spot. */}
          <div
            ref={serviceStageRef}
            className="wrap absolute inset-0 flex flex-col pb-16 pt-[88px] opacity-0 md:pb-20 md:pt-[112px]"
          >
            <Logo tone="paper" size="small" className="mb-8 md:mb-10" />
            <p className="mb-6 font-display text-4xl italic text-paper md:mb-8 md:text-6xl">
              {SERVICE_INTRO.title.en}
            </p>
            <p className="mb-10 max-w-md text-sm leading-relaxed text-white/55 md:mb-14 md:text-base">
              {SERVICE_INTRO.description[locale]}
            </p>
            <ServiceScroller />
          </div>
        </div>
      </div>
    </div>
  );
}
