"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { CaseStudy } from "@/lib/studio";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * First screen: studio intro on the left (5 cols), one printed sheet on the
 * right (7 cols). On desktop the section is taller than the viewport and its
 * stage is sticky; scroll position alone drives the sheet — it straightens,
 * travels to the centre and scales about the screenshot's own centre until
 * only the screen is left. Nothing auto-plays and no input is intercepted.
 *
 * Layers: page colour (stage) → two shadows → sheet → printed area → link.
 */
export function PaperHero({ lead }: { lead: CaseStudy }) {
  const scene = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const slot = useRef<HTMLDivElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const lifted = useRef<HTMLDivElement>(null);
  const contact = useRef<HTMLDivElement>(null);
  const lift = useRef<HTMLDivElement>(null);
  const print = useRef<HTMLAnchorElement>(null);
  const cta = useRef<HTMLAnchorElement>(null);
  const href = `/work/${lead.id}/`;

  useEffect(() => {
    const els = [scene, stage, intro, slot, paper, lifted, contact, lift, print, cta].map((r) => r.current);
    if (els.some((e) => !e)) return;
    const [sc, st, it, sl, pa, li, co, lf, pr, ct] = els as [
      HTMLElement, HTMLDivElement, HTMLDivElement, HTMLDivElement, HTMLDivElement,
      HTMLDivElement, HTMLDivElement, HTMLDivElement, HTMLAnchorElement, HTMLAnchorElement,
    ];
    const desk = matchMedia("(min-width: 1024px)");
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const g = { dx: 0, dy: 0, sEnd: 1, dist: 1, vh: 1 };
    let raf = 0;

    const measure = () => {
      if (desk.matches && !reduce.matches) {
        const stR = st.getBoundingClientRect();
        const slR = sl.getBoundingClientRect();
        // Layout offset of the printed area inside the (transformed) sheet;
        // offsets ignore transforms, so this is the untransformed geometry.
        let ix = 0;
        let iy = 0;
        let el: HTMLElement | null = pr;
        while (el && el !== pa) {
          ix += el.offsetLeft;
          iy += el.offsetTop;
          el = el.offsetParent as HTMLElement | null;
        }
        const iw = pr.offsetWidth;
        const ih = pr.offsetHeight;
        const ox = ix + iw / 2;
        const oy = iy + ih / 2;
        pa.style.transformOrigin = `${ox}px ${oy}px`;
        const vw = st.clientWidth;
        const vh = st.clientHeight;
        g.dx = vw / 2 - (slR.left - stR.left + ox);
        g.dy = vh / 2 - (slR.top - stR.top + oy);
        // Cover the frame, so the cobalt margin ends up outside it.
        g.sEnd = Math.max(vw / iw, vh / ih) * 1.004;
        g.dist = Math.max(1, sc.offsetHeight - vh);
        g.vh = vh;
      } else {
        pa.style.transformOrigin = "50% 50%";
        g.vh = innerHeight;
      }
    };

    const update = () => {
      raf = 0;
      if (reduce.matches) {
        pa.style.transform = "none";
        li.style.opacity = "0";
        co.style.opacity = "1";
        lf.style.opacity = "0";
        it.style.transform = "";
        it.style.opacity = "";
        return;
      }
      if (desk.matches) {
        const p = clamp(-sc.getBoundingClientRect().top / g.dist);
        const flat = easeOut(clamp(p / 0.5));
        const move = easeInOut(clamp((p - 0.04) / 0.62));
        const zoom = easeInOut(clamp((p - 0.22) / 0.72));
        const s = 1 + (g.sEnd - 1) * zoom;
        pa.style.transform = `translate(${(g.dx * move).toFixed(2)}px, ${(g.dy * move).toFixed(2)}px) rotate(${(-6 * (1 - flat)).toFixed(3)}deg) scale(${s.toFixed(4)})`;
        li.style.opacity = (1 - flat).toFixed(3);
        co.style.opacity = (flat * (1 - zoom)).toFixed(3);
        lf.style.opacity = (1 - flat).toFixed(3);
        it.style.transform = `translate3d(0, ${(-p * g.vh * 0.3).toFixed(1)}px, 0)`;
        it.style.opacity = (1 - clamp(p / 0.32)).toFixed(3);
        const c = clamp((p - 0.86) / 0.1);
        st.style.setProperty("--cta", c.toFixed(3));
        ct.style.pointerEvents = c > 0.5 ? "auto" : "none";
      } else {
        // Phones and tablets: no pinning — a slight straighten and lift.
        const t = clamp(scrollY / (g.vh * 0.6));
        pa.style.transform = `rotate(${(-3 * (1 - t)).toFixed(3)}deg) scale(${(1 + 0.04 * t).toFixed(4)})`;
        li.style.opacity = (1 - t).toFixed(3);
        co.style.opacity = t.toFixed(3);
        lf.style.opacity = (1 - t).toFixed(3);
        it.style.transform = "";
        it.style.opacity = "";
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    desk.addEventListener("change", onResize);
    reduce.addEventListener("change", onResize);
    // Fonts change the intro's height, which moves the sheet's slot.
    document.fonts?.ready.then(onResize).catch(() => {});
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      desk.removeEventListener("change", onResize);
      reduce.removeEventListener("change", onResize);
    };
  }, []);

  return (
    <section ref={scene} aria-label="Introduction" className="relative lg:h-[260svh] motion-reduce:lg:h-auto">
      <div
        ref={stage}
        className="relative lg:sticky lg:top-0 lg:h-svh lg:overflow-hidden motion-reduce:lg:static motion-reduce:lg:h-auto motion-reduce:lg:overflow-visible"
      >
        <div className="wrap grid grid-cols-1 pb-14 pt-24 lg:h-full lg:grid-cols-12 lg:items-center lg:gap-x-8 lg:pb-0 lg:pt-0 motion-reduce:lg:pb-24 motion-reduce:lg:pt-36">
          <div
            ref={intro}
            className="flex min-h-[62svh] flex-col justify-end pb-8 md:min-h-[60svh] lg:col-span-5 lg:min-h-0 lg:justify-center lg:pb-0"
          >
            <h1 className="title">
              Design
              <br />
              for the screen.
            </h1>
            <p className="mt-6 max-w-[26ch] text-[17px] leading-[1.5] text-muted md:text-[18px]">
              Independent web and digital design studio in Vancouver.
            </p>
            <p className="mt-6 hidden max-w-[34ch] text-[16px] leading-[1.6] text-muted lg:block">
              Websites, product interfaces and brand identities — planned, designed and built in one place.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div ref={slot} className="relative">
              <div ref={paper} className="paper-pose relative">
                <div ref={lifted} className="shadow-lifted" aria-hidden />
                <div ref={contact} className="shadow-contact" style={{ opacity: 0 }} aria-hidden />
                <div className="sheet aspect-[4/3] overflow-hidden text-white">
                  <div className="relative flex h-full flex-col px-[6%] pb-[6%] pt-[5%]">
                    <div className="flex items-baseline justify-between gap-4">
                      <Link
                        href={href}
                        className="text-[clamp(15px,1.6vw,24px)] font-medium tracking-[-0.03em] underline-offset-4 hover:underline focus-visible:outline-white"
                      >
                        {lead.title}
                      </Link>
                      <span className="font-mono text-[clamp(10px,0.8vw,12px)] text-white/80">
                        {lead.field} · {lead.year}
                      </span>
                    </div>
                    <Link
                      ref={print}
                      href={href}
                      tabIndex={-1}
                      aria-hidden
                      className="relative mt-auto block aspect-[16/10] overflow-hidden bg-[#f0d9e4]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={lead.hero.src}
                        alt={lead.hero.alt}
                        width={lead.hero.w}
                        height={lead.hero.h}
                        fetchPriority="high"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </Link>
                  </div>
                  <div ref={lift} className="sheet-lift" aria-hidden />
                </div>
              </div>
            </div>
            <Link
              href={href}
              className="mt-6 inline-flex items-baseline gap-2 text-[17px] font-medium text-cobalt lg:hidden motion-reduce:lg:inline-flex"
            >
              View project <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>

        <Link
          ref={cta}
          href={href}
          style={{ opacity: "var(--cta, 0)" }}
          className="pointer-events-none absolute bottom-[var(--gutter)] right-[var(--gutter)] z-10 hidden min-w-[260px] flex-col gap-6 bg-cobalt px-6 py-5 text-white focus-visible:!opacity-100 focus-visible:outline-white lg:flex motion-reduce:lg:hidden"
        >
          <span className="font-mono text-[12px] text-white/75">
            {lead.title} · {lead.field}
          </span>
          <span className="flex items-baseline justify-between gap-6 text-[22px] font-medium tracking-[-0.03em]">
            View project <span aria-hidden>↗</span>
          </span>
        </Link>
      </div>
    </section>
  );
}
