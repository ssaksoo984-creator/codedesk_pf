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

const SPHERE_ROTATION_DEG = 540;
const SPHERE_TILT_DEG = 26;

/** Scroll-progress boundaries for each phase of the pinned track. */
const SPHERE_PHASE_END = 0.4; // orbiting sphere + rotating copy
const CONVERGE_END = 0.544; // cards collapse to center, finale logo fades in (ink, centered)
const BLACKOUT_END = 0.672; // background vignette closes to black, logo crossfades to paper
const RELOCATE_END = 0.8; // logo shrinks + slides top-left and settles there
const SERVICE_END = 1; // Service title/description/cards fade in below the logo, same spot
const FINAL_LOGO_SCALE = 0.4; // how small the relocated logo ends up

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

  // Registers a short window near the end of the track so the GNB flips to
  // its dark styling right as the background finishes turning black.
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

    const trigger = ScrollTrigger.create({
      trigger: trackRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;

        if (p <= SPHERE_PHASE_END) {
          // ---- Phase A: sphere orbits, story copy cycles ----
          const p2 = p / SPHERE_PHASE_END;

          if (sphereRef.current) {
            sphereRef.current.style.transform = `translateZ(-1px) rotateY(${
              p2 * SPHERE_ROTATION_DEG
            }deg) rotateX(${SPHERE_TILT_DEG}deg)`;
            sphereRef.current.style.opacity = "1";
          }

          const idx = Math.min(
            ABOUT_SLIDES.length - 1,
            Math.floor(p2 * ABOUT_SLIDES.length)
          );
          if (idx !== currentIndex) {
            currentIndex = idx;
            setSlideIndex(idx);
          }

          if (titleRef.current) titleRef.current.style.opacity = "1";
          if (descRef.current) descRef.current.style.opacity = "1";
          if (finaleStageRef.current) finaleStageRef.current.style.opacity = "0";
          if (blackoutRef.current) blackoutRef.current.style.opacity = "0";
          if (serviceStageRef.current) {
            serviceStageRef.current.style.opacity = "0";
            serviceStageRef.current.style.pointerEvents = "none";
          }

          const focusIndex = Math.floor(p2 * count);
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
        } else if (p <= CONVERGE_END) {
          // ---- Phase B: cards collapse to center, finale logo fades in ----
          const p2 = (p - SPHERE_PHASE_END) / (CONVERGE_END - SPHERE_PHASE_END);
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
            }deg) rotateX(${layout.rotX * (1 - ease)}deg) scale(${Math.max(
              0.001,
              1 - ease
            )})`;
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
            blackoutRef.current.style.opacity = "1";
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
            // ---- Phase C: vignette closes in from the edges, logo inverts ----
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
            // ---- Phase D: logo shrinks, slides toward the top-left, and
            // fades out along the way instead of settling there — it just
            // disappears mid-move. ----
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
            // ---- Phase E: logo is gone — the Service header (logo + title,
            // same layout as Work/Contact) fades in at the same anchor spot ----
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
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  const activeSlide = ABOUT_SLIDES[slideIndex];

  return (
    <div ref={trackRef} className="relative" style={{ height: "750vh" }}>
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
