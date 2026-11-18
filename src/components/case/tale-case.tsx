"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const C = "/media/tale/case/";
const L = "/media/tale/lumi/";
const BI = "/media/tale/bi/";

const NAV = [
  { id: "overview", label: "Overview" },
  { id: "brand", label: "Logo & BI" },
  { id: "character", label: "Character" },
  { id: "ux", label: "UX/UI renewal" },
  { id: "reflection", label: "Reflection" },
];

const STAGES = [
  { id: "producer", name: "Producer", color: "#F2A33A", role: "Planning · settings", prop: "Clipboard, and a light bulb on its head while loading", mood: "An upbeat manager who keeps things tidy. Wide eyes, leaning slightly forward.", line: "What story do you want to make?" },
  { id: "writer", name: "Writer", color: "#E8606F", role: "Prose", prop: "Round red glasses", mood: "A thoughtful author. Eyes half closed, head tilted.", line: "Shall we make this scene a little funnier?" },
  { id: "artist", name: "Artist", color: "#8B63E8", role: "Characters · settings", prop: "Purple beret, and a brush while loading", mood: "A free-spirited painter. Winks with one eye.", line: "Let me draw the cast in this style." },
  { id: "storyboard", name: "Storyboard", color: "#5A6AE6", role: "Boards · shot breakdown", prop: "A blue pencil tucked on its head", mood: "A meticulous planner. Narrowed, focused eyes.", line: "I split it into four shots." },
  { id: "director", name: "Director", color: "#3E9BE0", role: "Direction · shooting", prop: "Teal cap, and a megaphone while loading", mood: "A confident director. Faces front, chin slightly up.", line: "This shot slowly pushes in." },
  { id: "editor", name: "Editor", color: "#2DB39A", role: "Edit · finish", prop: "Green headphones", mood: "A calm finisher. Eyes closed, riding the rhythm.", line: "Music laid, cut to 33 seconds." },
];

const LOGO_COLORS = [
  { n: "Gold Orange", h: "#FFA600" },
  { n: "Rose Red", h: "#FF3D5A" },
  { n: "Violet", h: "#7B2FFF" },
  { n: "Deep Blue", h: "#2F45FF" },
  { n: "Azure", h: "#0096FF" },
  { n: "Mint Teal", h: "#00C9A7" },
];
const NEUTRALS = [
  { n: "Ink", h: "#141312" },
  { n: "Surface", h: "#1F1E1D" },
  { n: "Workspace", h: "#262624" },
  { n: "Stone", h: "#8E8B82" },
  { n: "Cream", h: "#EDEAE0" },
  { n: "Paper", h: "#F5F4EE" },
];

// ---------------------------------------------------------------- pieces

/** A desktop display drawn in CSS around a real screen. */
function Display({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) {
  return (
    <figure className={clsx(!className?.includes("absolute") && "relative", className)} style={style}>
      <div className="rounded-[14px] bg-[#1b1b1f] p-[1.1%] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} loading="lazy" className="block w-full rounded-[6px]" />
      </div>
    </figure>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">{children}</p>;
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[clamp(30px,4vw,48px)] font-medium leading-[1.08] tracking-[-0.035em]">{children}</h2>;
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[clamp(22px,2.4vw,30px)] font-medium leading-[1.15] tracking-[-0.03em]">{children}</h3>;
}

function P({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={clsx("max-w-[62ch] text-[16px] leading-[1.75] text-white/70", className)}>{children}</p>;
}

/** Fades blocks up as they enter the viewport. */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-r]"));
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.r = "in";
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -10% 0px" }
    );
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight) {
        el.dataset.r = "0";
        io.observe(el);
      }
    });
    return () => io.disconnect();
  }, []);
  return ref;
}

/** Drag to compare the planning prototype with the shipped design. */
function Compare({ before, after, beforeLabel, afterLabel }: { before: string; after: string; beforeLabel: string; afterLabel: string }) {
  const [x, setX] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const drag = (clientX: number) => {
    const r = box.current!.getBoundingClientRect();
    setX(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div className="select-none">
      <div
        ref={box}
        className="relative aspect-[16/10] cursor-ew-resize overflow-hidden rounded-2xl bg-black ring-1 ring-white/10"
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          drag(e.clientX);
        }}
        onPointerMove={(e) => e.buttons && drag(e.clientX)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={after} alt={afterLabel} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={before} alt={beforeLabel} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
        </div>
        <div className="pointer-events-none absolute inset-y-0 w-px bg-white" style={{ left: `${x}%` }}>
          <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[13px] text-black shadow-lg">
            ⇆
          </span>
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 font-mono text-[11px] text-white">{beforeLabel}</span>
        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 font-mono text-[11px] text-black">{afterLabel}</span>
      </div>
      <label className="mt-3 flex items-center gap-3 font-mono text-[11px] text-white/45">
        <span className="sr-only">Compare position</span>
        <input type="range" min={0} max={100} value={x} onChange={(e) => setX(+e.target.value)} className="w-full accent-white" />
      </label>
    </div>
  );
}

/** Pick a stage, see that stage's Lumi, its states and its role. */
function LumiPicker() {
  const [i, setI] = useState(0);
  const s = STAGES[i];
  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
      <div
        className="relative flex aspect-square items-end overflow-hidden rounded-3xl p-6 transition-colors duration-700 md:p-8"
        style={{ background: `linear-gradient(160deg, ${s.color}ee, ${s.color})` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={s.id} src={`${L}${s.id}-xl.webp`} alt={`Lumi as ${s.name}`} className="lumi-pop absolute left-1/2 top-[44%] w-[62%]" />
        <p className="relative text-[clamp(28px,4vw,44px)] font-semibold tracking-[-0.03em] text-black/85">{s.name}</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-3">
          {STAGES.map((x, k) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setI(k)}
              onMouseEnter={() => setI(k)}
              aria-pressed={k === i}
              className={clsx("flex flex-col items-center gap-1 rounded-2xl border p-2 transition-colors", k === i ? "border-transparent" : "border-white/10 hover:border-white/30")}
              style={k === i ? { background: x.color } : undefined}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${L}${x.id}.webp`} alt="" className="h-12 w-12 object-contain" loading="lazy" />
              <span className={clsx("text-[12px] font-medium", k === i ? "text-black" : "text-white/80")}>{x.name}</span>
            </button>
          ))}
        </div>
        <dl className="divide-y divide-white/10 rounded-2xl border border-white/10 px-5 text-[14px]">
          {[
            ["Role", s.role],
            ["Colour", s.color],
            ["Prop", s.prop],
            ["Personality", s.mood],
          ].map(([k, v]) => (
            <div key={k} className="grid grid-cols-[110px_1fr] gap-3 py-3">
              <dt className="font-mono text-[11px] uppercase tracking-wide text-white/45">{k}</dt>
              <dd className="text-white/85">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="flex items-start gap-3 rounded-2xl bg-[#1f1e1d] p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${L}${s.id}.webp`} alt="" className="h-10 w-10 object-contain" />
          <div className="rounded-2xl bg-white/5 px-4 py-3 text-[14px]">
            <p className="text-[12px]" style={{ color: s.color }}>
              Lumi <span className="text-white/45">{s.name}</span>
            </p>
            <p className="mt-0.5">“{s.line}”</p>
          </div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${C}lumi-row-${s.id}.webp`} alt={`${s.name} Lumi: idle, listening, thinking, complete, error, loading`} className="w-full rounded-2xl bg-[#f3f1ec]" loading="lazy" />
        <p className="-mt-2 font-mono text-[11px] text-white/40">idle · listening · thinking · complete · error · loading</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- page

export function TaleCase() {
  const ref = useReveal();
  const [section, setSection] = useState("overview");
  const [navOn, setNavOn] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setSection(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    NAV.forEach((n) => {
      const el = document.getElementById(n.id);
      if (el) io.observe(el);
    });
    const onScroll = () => setNavOn(scrollY > innerHeight * 0.9);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="tale-case bg-[#0b0b0f] text-white">
      {/* Close / back to the database */}
      <Link
        href="/#portfolio"
        aria-label="Back to the database"
        className="fixed right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-[18px] text-white ring-1 ring-white/15 backdrop-blur-md hover:bg-black md:right-6 md:top-6"
      >
        ✕
      </Link>

      {/* Section index */}
      <nav
        aria-label="Sections"
        className={clsx(
          "fixed left-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 transition-opacity duration-500 xl:flex",
          navOn ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`} className={clsx("group flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.16em]", section === n.id ? "text-white" : "text-white/35 hover:text-white/70")}>
            <span className={clsx("h-px transition-all", section === n.id ? "w-6 bg-white" : "w-3 bg-white/35")} />
            {n.label}
          </a>
        ))}
      </nav>

      {/* ================================================= HERO (light) */}
      <header className="bg-[#f3f2ee] pt-24 text-[#141312] md:pt-28">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <p className="font-mono text-[12px] tracking-wide text-black/50">TALE STUDIO</p>
          <h1 className="mt-3 max-w-[16ch] text-[clamp(38px,6vw,72px)] font-medium leading-[1.02] tracking-[-0.045em]">
            Your tale deserves a take — brand, character and product, end to end.
          </h1>
          <p className="mt-6 max-w-[60ch] text-[16px] font-medium leading-[1.65] text-black/75">
            Tale Studio turns a one-line idea into a film with an AI teammate. I designed its whole face: the logo and brand
            system, the AI character Lumi, and the UX/UI renewal — from re-splitting the product into six stages to a
            clickable prototype, the shipped v3 screens and the developer handoff.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Brand identity · logo", "Character design · Lumi", "UX/UI renewal · v3"].map((t) => (
              <span key={t} className="rounded-full bg-black/5 px-3.5 py-1.5 text-[12.5px] text-black/70">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Mockups */}
        <div className="mx-auto mt-12 max-w-[1280px] px-3 md:mt-16 md:px-8">
          <div className="relative overflow-hidden rounded-t-[36px] bg-gradient-to-b from-[#d9d7d0] to-[#a9a7a0] px-[4%] pb-0 pt-[5%] [perspective:1800px]">
            <div className="relative mx-auto max-w-[1080px]">
              <Display
                src={`${C}v3-p1.webp`}
                alt="Producer stage with Lumi"
                className="hero-left absolute left-[-6%] top-[8%] w-[52%] opacity-95"
                style={{ transform: "rotateY(22deg) rotateZ(-2deg)" }}
              />
              <Display
                src={`${C}v3-d1.webp`}
                alt="Director node view"
                className="hero-right absolute right-[-6%] top-[8%] w-[52%] opacity-95"
                style={{ transform: "rotateY(-22deg) rotateZ(2deg)" }}
              />
              <Display src={`${C}v3-home.webp`} alt="Tale Studio landing" className="relative z-10 mx-auto w-[72%]" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${L}complete.webp`} alt="" className="lumi-float absolute -top-[9%] right-[2%] z-20 w-[11%] drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </header>

      {/* ================================================= META */}
      <section className="bg-[#f3f2ee] pb-20 text-[#141312] md:pb-28">
        <div className="mx-auto grid max-w-[1180px] gap-10 border-t border-black/10 px-5 pt-12 md:grid-cols-[1fr_1.4fr] md:px-8">
          <dl className="space-y-6 text-[14.5px]">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-black/45">Client</dt>
              <dd className="mt-1">Tale Studio — AI video pre-visualisation</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-black/45">Role</dt>
              <dd className="mt-1">
                Product designer
                <br />
                <span className="text-black/55">Brand identity, character design, UX architecture, UI design, prototype, dev handoff</span>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-black/45">Status</dt>
              <dd className="mt-1">v3 live, November 2026 · BI guideline v1.0</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wide text-black/45">Tools</dt>
              <dd className="mt-1">Figma · single-file HTML prototype · AI image & video generation</dd>
            </div>
          </dl>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wide text-black/45">Contribution</p>
            <ul className="mt-3 space-y-3 text-[15px] leading-[1.6]">
              {[
                ["Logo & BI", "Symbol, signature, colour system (logo, neutral and stage colours), type, usage rules and applications — a 29-page guideline."],
                ["Character", "Lumi, the AI teammate: form, the white-pearl → six-stage → complete growth story, stage outfits, and six states per stage."],
                ["UX/UI renewal", "Re-split the product into six stages, drew every branch, error and rollback as flow charts, then designed every screen in Figma and shipped v3."],
                ["Prototype & handoff", "A single HTML file where flow, screens and the before → after spec point at each other by screen ID."],
              ].map(([t, d]) => (
                <li key={t} className="grid grid-cols-[130px_1fr] gap-4 border-b border-black/10 pb-3">
                  <b className="font-medium">{t}</b>
                  <span className="text-black/65">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================================================= OVERVIEW */}
      <section id="overview" className="scroll-mt-10 rounded-t-[40px] bg-[#0b0b0f] py-24 md:py-32">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8">
          <div data-r className="mx-auto max-w-[760px] text-center">
            <Label>Overview</Label>
            <p className="mt-6 text-[clamp(22px,2.6vw,32px)] font-medium leading-[1.35] tracking-[-0.025em]">
              Write a story, get a film. Tale Studio walks a single idea through six stages — <span className="text-white/50">Producer, Writer, Artist, Storyboard, Director, Editor</span> — with an AI teammate at each step.
            </p>
            <P className="mx-auto mt-6 text-center">
              The product had grown stage by stage and it showed: tangled steps, a brand that didn’t exist yet, and an AI with no face. I took on all three, so the logo, the character and the interface could share one idea — a tale is a tail you follow from the first line to the final cut.
            </P>
          </div>
          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {[
              { href: "#brand", k: "01", t: "Logo & BI", d: "Tale = tail. A half-T with a story tail, in two colour families for the two halves of the pipeline.", img: "/media/tale/tale-symbol.svg", bg: "#F5F4EE", contain: true },
              { href: "#character", k: "02", t: "Character · Lumi", d: "A jelly-bodied AI teammate with a tail, who changes outfit and colour at every stage.", img: `${L}complete.webp`, bg: "#1f1e1d", contain: true },
              { href: "#ux", k: "03", t: "UX/UI renewal", d: "Six stages by the work they do, every branch designed first, shipped as v3.", img: `${C}v3-s1.webp`, bg: "#141312" },
            ].map((c) => (
              <a key={c.k} href={c.href} data-r className="group overflow-hidden rounded-3xl bg-white/[0.04] ring-1 ring-white/10 transition-colors hover:bg-white/[0.07]">
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden" style={{ background: c.bg }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.img} alt="" loading="lazy" className={clsx("transition-transform duration-700 group-hover:scale-105", c.contain ? "h-[60%] w-auto object-contain" : "h-full w-full object-cover object-left-top")} />
                </div>
                <div className="p-5">
                  <p className="font-mono text-[11px] text-white/40">{c.k}</p>
                  <p className="mt-1 text-[20px] font-medium tracking-[-0.02em]">{c.t}</p>
                  <p className="mt-2 text-[14px] leading-[1.6] text-white/60">{c.d}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================= BRAND */}
      <section id="brand" className="scroll-mt-10 border-t border-white/10 py-24 md:py-32">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8">
          <div data-r>
            <Label>01 · Logo & BI</Label>
            <div className="mt-4"><H2>Tale = tail. A story you can grab by its tail.</H2></div>
            <P className="mt-5">
              Tale sounds like tail. The name and the symbol carry the same promise — <i>grab the tail of a story and start</i>. The symbol is the first stroke of a T left half-drawn, with a tail running off below it; where the two meet sits a small droplet, shaped like Lumi.
            </P>
          </div>

          {/* Symbol anatomy */}
          <div data-r className="mt-14 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-3xl bg-[#F5F4EE]">
              <svg viewBox="0 0 100 100" className="absolute h-[64%] text-black/25" aria-hidden>
                <g fill="none" stroke="currentColor" strokeWidth="0.4" strokeDasharray="1.2 1.2">
                  <rect x="0.5" y="0.5" width="99" height="99" />
                  <line x1="50" y1="0" x2="50" y2="100" />
                  <line x1="0" y1="50" x2="100" y2="50" />
                  <circle cx="25" cy="25" r="25" />
                  <circle cx="75" cy="25" r="25" />
                  <circle cx="25" cy="75" r="25" />
                  <circle cx="75" cy="75" r="25" />
                </g>
              </svg>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/tale/tale-symbol.svg" alt="Tale Studio symbol" className="symbol-breathe relative h-[64%]" />
              <span className="absolute left-5 top-5 font-mono text-[11px] text-black/45">2u × 2u · r = u/2</span>
            </div>
            <div className="grid gap-3">
              {[
                { t: "Half T", d: "The first stroke of Tale’s T, left half-drawn. The first three stages — planning, writing, drawing — in warm colours.", c: "linear-gradient(120deg,#FFA600,#FF3D5A,#C13C9E)" },
                { t: "Story tail", d: "The tail running off below the T. The last three stages — boards, direction, edit — in cool colours.", c: "linear-gradient(120deg,#2F45FF,#0096FF,#00C9A7)" },
                { t: "The droplet", d: "Where the stem meets the tail. Lumi-shaped, the two colours blend like light (screen 90%).", c: "linear-gradient(120deg,#FF8A7A,#E95CE8)" },
              ].map((x) => (
                <div key={x.t} className="flex gap-4 rounded-2xl bg-white/[0.04] p-5 ring-1 ring-white/10">
                  <span className="mt-1 h-10 w-10 shrink-0 rounded-xl" style={{ background: x.c }} />
                  <div>
                    <p className="text-[17px] font-medium">{x.t}</p>
                    <p className="mt-1 text-[14px] leading-[1.6] text-white/60">{x.d}</p>
                  </div>
                </div>
              ))}
              <div className="rounded-2xl bg-white/[0.04] p-5 font-mono text-[12px] leading-[1.8] text-white/55 ring-1 ring-white/10">
                Whole 2u×2u · T bar 2u×u, right end round · T stem u×2u · tail 2u×u, both ends round · outer corners r = u/2 · gradient top-left → bottom-right
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div data-r className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              { bg: "#F5F4EE", fg: "#141312", label: "Horizontal · default" },
              { bg: "#141312", fg: "#F5F4EE", label: "On ink" },
              { bg: "#7B2FFF", fg: "#ffffff", label: "On colour · mono white", mono: true },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex aspect-[16/9] items-center justify-center gap-3 rounded-2xl" style={{ background: s.bg }}>
                  {s.mono ? (
                    <span className="block h-9 w-9 rounded-[10px] bg-white" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/media/tale/tale-symbol.svg" alt="" className="h-9" />
                  )}
                  <span className="text-[30px] font-extrabold tracking-[-0.04em]" style={{ color: s.fg }}>
                    tale studio
                  </span>
                </div>
                <p className="mt-2 font-mono text-[11px] text-white/45">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Colour */}
          <div data-r className="mt-20">
            <H3>Colour — vivid for the mark, warm neutrals for the work.</H3>
            <P className="mt-3">The six logo colours live only in the symbol. Screens and print sit on warm neutrals, and the product uses one muted stage colour at a time.</P>
            <div className="mt-8 grid grid-cols-3 gap-2 md:grid-cols-6">
              {LOGO_COLORS.map((c) => (
                <div key={c.h} className="group">
                  <div className="h-24 rounded-xl transition-[height] duration-500 group-hover:h-32" style={{ background: c.h }} />
                  <p className="mt-2 text-[13px] font-medium">{c.n}</p>
                  <p className="font-mono text-[11px] text-white/45">{c.h}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 md:grid-cols-6">
              {NEUTRALS.map((c) => (
                <div key={c.h}>
                  <div className="h-16 rounded-xl ring-1 ring-white/10" style={{ background: c.h }} />
                  <p className="mt-2 text-[13px] font-medium">{c.n}</p>
                  <p className="font-mono text-[11px] text-white/45">{c.h}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 md:grid-cols-6">
              {STAGES.map((c) => (
                <div key={c.id} className="flex items-center gap-2 rounded-xl p-2.5" style={{ background: `${c.color}22` }}>
                  <span className="h-6 w-6 rounded-full" style={{ background: c.color }} />
                  <span className="text-[12.5px]">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Type */}
          <div data-r className="mt-20 grid gap-4 md:grid-cols-[1.4fr_1fr]">
            <div className="rounded-3xl bg-[#F5F4EE] p-8 text-[#141312]">
              <p className="font-mono text-[11px] text-black/45">KOREAN · LATIN</p>
              <p className="mt-2 text-[clamp(48px,7vw,88px)] font-extrabold leading-none tracking-[-0.045em]">Pretendard</p>
              <p className="mt-6 text-[26px] font-light">가나다라 이야기 Aa Bb 123</p>
              <p className="text-[26px] font-medium">가나다라 이야기 Aa Bb 123</p>
              <p className="text-[26px] font-bold">가나다라 이야기 Aa Bb 123</p>
            </div>
            <div className="flex flex-col justify-between rounded-3xl bg-white/[0.04] p-8 ring-1 ring-white/10">
              <p className="font-mono text-[11px] text-white/45">NUMERALS · INTER</p>
              <p className="text-[56px] font-semibold leading-none tracking-[-0.03em]">0:05 · 9:16</p>
              <p className="text-[13px] text-white/55">Time, credits and ratios. H1 64 ExtraBold · H2 40 Bold · body 15–16 at 155%.</p>
            </div>
          </div>

          {/* Applications */}
          <div data-r className="mt-20">
            <H3>Applications</H3>
            <P className="mt-3">The system carried onto paper, objects, signage and screens — the mark stays fixed, the surface changes.</P>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                ["card-letterpress", "Business cards", "md:col-span-2 md:row-span-2"],
                ["letterhead", "Letterhead"],
                ["app-icon", "App icon"],
                ["tags", "Labels · tags"],
                ["goods-1", "Goods"],
                ["sign-lobby", "Lobby sign", "md:col-span-2"],
                ["subway", "Subway ad"],
                ["billboard", "Billboard"],
                ["mobile", "Mobile"],
                ["web", "Website"],
                ["desktop", "Desktop", "md:col-span-2"],
                ["sign-ext", "Exterior sign"],
              ].map(([f, t, span]) => (
                <figure key={f} className={clsx("group overflow-hidden rounded-2xl bg-white/5", span)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${BI}${f}.webp`} alt={t} loading="lazy" className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <figcaption className="sr-only">{t}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= CHARACTER */}
      <section id="character" className="scroll-mt-10 border-t border-white/10 py-24 md:py-32">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8">
          <div data-r className="grid gap-10 md:grid-cols-[1fr_1fr] md:items-center">
            <div>
              <Label>02 · Character</Label>
              <div className="mt-4"><H2>Lumi — an AI teammate with a tail.</H2></div>
              <P className="mt-5">
                A round jelly body, a tail of light flowing to the lower left, two tall oval eyes — and no mouth or arms. The tail is the same tail as the symbol, so it is never removed or shortened. Lumi changes outfit and colour at every stage and works next to you.
              </P>
              <dl className="mt-8 grid grid-cols-3 gap-3 text-[13px]">
                {[
                  ["Form", "Jelly body · tail · two eyes"],
                  ["Growth", "White pearl → six stages → complete"],
                  ["Sizes", "XL 150 · L 100 · M 78 · S 56 · XS 36"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/10">
                    <dt className="font-mono text-[10.5px] uppercase text-white/45">{k}</dt>
                    <dd className="mt-1.5 leading-[1.5] text-white/80">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#121116]">
              <video src="/media/tale/lumi-complete.mp4" poster="/media/tale/lumi-complete.webp" autoPlay muted loop playsInline className="h-full w-full object-cover" />
              <span className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 font-mono text-[11px] text-white/80">Lumi · complete</span>
            </div>
          </div>

          {/* Growth lineup */}
          <div data-r className="mt-16 overflow-hidden rounded-3xl bg-[#f3f1ec] px-4 py-10 text-[#141312] md:px-8">
            <p className="font-mono text-[11px] text-black/45">GROWTH · starts as a white pearl, puts on each stage’s colour, ends as an iridescent pearl</p>
            <div className="no-scrollbar mt-6 flex snap-x gap-2 overflow-x-auto md:grid md:grid-cols-8 md:overflow-visible">
              {[["pearl", "White pearl"], ...STAGES.map((s) => [s.id, s.name]), ["complete", "Complete"]].map(([id, n], k) => (
                <div key={id} className="lineup w-[30%] shrink-0 snap-start text-center md:w-auto" style={{ animationDelay: `${k * 90}ms` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${L}${id}.webp`} alt={n} loading="lazy" className="mx-auto w-full max-w-[120px] transition-transform duration-500 hover:-translate-y-2" />
                  <p className="mt-2 text-[12.5px] font-medium">{n}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stage picker */}
          <div data-r className="mt-20">
            <H3>Six stages, six outfits.</H3>
            <P className="mt-3 mb-8">Each stage has its own colour, prop and personality. The colour also drives the product: the chat name, the stage badge and the progress bar all wear it. Pick one.</P>
            <LumiPicker />
          </div>

          {/* In product */}
          <div data-r className="mt-20 grid gap-4 md:grid-cols-2">
            <div>
              <Display src={`${C}v3-p1.webp`} alt="Lumi greeting on the Producer stage" />
              <p className="mt-3 text-[14px] text-white/60"><b className="font-medium text-white">Greeting.</b> On an empty stage, a large Lumi in that stage’s outfit says what to do next.</p>
            </div>
            <div>
              <Display src={`${C}v3-as.webp`} alt="Lumi asking which style to draw" />
              <p className="mt-3 text-[14px] text-white/60"><b className="font-medium text-white">Asking.</b> Before the AI works, Lumi asks the one question it needs — here, which style to draw the cast in.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= UX */}
      <section id="ux" className="scroll-mt-10 border-t border-white/10 py-24 md:py-32">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8">
          <div data-r>
            <Label>03 · UX/UI renewal</Label>
            <div className="mt-4"><H2>Stages by the work they do — every branch designed before a single screen.</H2></div>
          </div>

          <div data-r className="mt-12 grid gap-10 md:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wide text-white/45">Problem</p>
              <P className="mt-3">
                Stages were tangled. Writer handled prose, then drawings and shots, with checks like a runtime gate at every hand-off. Parts of the screen stayed live while the AI worked, so requests collided — and design and engineering struggled to share one picture of what was changing where.
              </P>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wide text-white/45">Goal</p>
              <P className="mt-3">
                Re-split the stages by the work each one does, design every branch and exception first, and deliver it in a form you can click through and hand straight to engineering.
              </P>
            </div>
          </div>

          {/* Architecture before / after */}
          <div data-r className="mt-16 rounded-3xl bg-white/[0.03] p-6 ring-1 ring-white/10 md:p-10">
            <H3>Architecture, before → after</H3>
            {[
              { k: "Before", steps: ["P1 setup", "P2 Producer", "Writer 01–04 scenes", "Hand-off runtime check", "Writer 05–15 art, shots", "Artist (auto)", "Director"], warn: [3, 4] },
              { k: "After", steps: ["Producer · idea & terms", "Writer · prose only", "Lock prose", "Artist · cast & sets", "Storyboard · shots", "Director", "Editor"], ok: [2] },
            ].map((row) => (
              <div key={row.k} className="mt-8">
                <p className="font-mono text-[11px] uppercase tracking-wide text-white/45">{row.k}</p>
                <ol className="mt-3 flex flex-wrap items-center gap-2">
                  {row.steps.map((s, i) => (
                    <li key={s} className="flex items-center gap-2">
                      <span
                        className={clsx(
                          "rounded-xl px-3 py-2 text-[13px]",
                          row.warn?.includes(i) ? "bg-[#E8606F]/20 text-[#ffb3bc] ring-1 ring-[#E8606F]/50" : row.ok?.includes(i) ? "bg-[#2DB39A]/20 text-[#9ff0dc] ring-1 ring-[#2DB39A]/50" : row.k === "After" ? "bg-white text-black" : "bg-white/10 text-white/75"
                        )}
                        style={row.k === "After" && !row.ok?.includes(i) ? { background: ["#F2A33A", "#E8606F", "", "#8B63E8", "#5A6AE6", "#3E9BE0", "#2DB39A"][i] || undefined, color: "#111" } : undefined}
                      >
                        {s}
                      </span>
                      {i < row.steps.length - 1 && <span className="text-white/30">→</span>}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
            <div className="mt-10 grid gap-3 md:grid-cols-2">
              {[
                ["Passed stages are ‘done’, not ‘locked’", "Later changes (new cast, looks, shots) never sync back. Only Artist ⇄ Storyboard go back and forth."],
                ["Full-screen lock while the AI works", "Every input pauses so requests can’t collide, and Lumi’s ‘making’ states carry the wait."],
                ["Manual edits live in a popup", "Chat locks while it’s open, so chat and hand edits never touch the same data at once."],
                ["Rollback only when it must", "Only a cast member or set missing from the prose sends you back — with affected shots and estimated credits shown first."],
              ].map(([t, d], i) => (
                <div key={t} className="rounded-2xl bg-black/30 p-5 ring-1 ring-white/10">
                  <p className="font-mono text-[11px] text-white/40">0{i + 1}</p>
                  <p className="mt-1 text-[16px] font-medium">{t}</p>
                  <p className="mt-1.5 text-[14px] leading-[1.6] text-white/60">{d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Process: flow + prototype */}
          <div data-r className="mt-20">
            <H3>Flow before screens.</H3>
            <P className="mt-3">
              For every stage I drew the happy path, the alternate flow at each yes/no branch, the exception flow on errors, and where rollback is and isn’t allowed — then built a single HTML file where the flow chart, the clickable prototype and the change spec point at each other by screen ID.
            </P>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <Display src={`${C}plan-flow.webp`} alt="Per-stage flow chart" />
              <Display src={`${C}plan-spec.webp`} alt="Before → after change spec by screen ID" />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Display src={`${C}plan-proto-producer.webp`} alt="Prototype: Producer" />
              <Display src={`${C}plan-proto-writer.webp`} alt="Prototype: Writer" />
              <Display src={`${C}plan-proto-artist.webp`} alt="Prototype: Artist" />
            </div>
            <p className="mt-4 font-mono text-[11px] text-white/40">Planning prototype · flow chart · prototype · change spec in one file</p>
          </div>

          {/* Before / after */}
          <div data-r className="mt-20">
            <H3>From plan to product.</H3>
            <P className="mt-3 mb-8">Drag to compare the planning prototype with the shipped v3 design for the same screen.</P>
            <div className="grid gap-8">
              <Compare before={`${C}plan-proto-producer.webp`} after={`${C}v3-p1.webp`} beforeLabel="Plan · Producer" afterLabel="v3 · Producer" />
              <div className="grid gap-8 md:grid-cols-2">
                <Compare before={`${C}plan-proto-writer.webp`} after={`${C}v3-w1.webp`} beforeLabel="Plan · Writer" afterLabel="v3 · Writer" />
                <Compare before={`${C}plan-proto-artist.webp`} after={`${C}v3-a5.webp`} beforeLabel="Plan · Artist" afterLabel="v3 · Artist" />
              </div>
            </div>
          </div>

          {/* Final screens */}
          <div data-r className="mt-20">
            <H3>The shipped v3, stage by stage.</H3>
            <div className="mt-8 grid gap-x-4 gap-y-10 md:grid-cols-2">
              {[
                ["v3-home", "Landing", "A soft stage-coloured glow instead of a video background; the v3 mark, title and badge."],
                ["v3-r2", "Projects", "A large white-pearl Lumi on the first screen; restyled cards and top bar."],
                ["v3-p1", "Producer", "Option chips and selection cards in the Producer colour."],
                ["v3-w1", "Writer", "Prose only. The screen/chat toggle is gone; paragraphs can be attached to chat."],
                ["v3-a5", "Artist", "Filters for all, characters and backgrounds; cards carry version badges inside version groups."],
                ["v3-s1", "Storyboard", "Scene headers with place, time, summary, shot count and seconds; chips for size, angle, movement, colour temperature."],
                ["v3-d1", "Director", "Restyled nodes and edges; chat starts closed and opens from a Lumi pill with an unread count."],
                ["v3-ed1", "Editor", "Final edit · cuts · length · video, the source panel beside the preview and a full-width timeline."],
              ].map(([f, t, d]) => (
                <figure key={f}>
                  <Display src={`${C}${f}.webp`} alt={`${t} — v3`} />
                  <figcaption className="mt-3 text-[14px] leading-[1.6] text-white/60">
                    <b className="font-medium text-white">{t}.</b> {d}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div data-r className="mt-14 flex flex-wrap gap-2">
            <a href="/proto/tale-studio/" target="_blank" rel="noopener noreferrer" className="rounded-xl bg-white px-5 py-3 text-[14px] font-medium text-black hover:bg-white/85">
              Open the prototype ↗
            </a>
          </div>
        </div>
      </section>

      {/* ================================================= REFLECTION */}
      <section id="reflection" className="scroll-mt-10 border-t border-white/10 py-24 md:py-32">
        <div className="mx-auto max-w-[900px] px-5 text-center md:px-8">
          <Label>Reflection</Label>
          <p data-r className="mt-6 text-[clamp(22px,2.8vw,34px)] font-medium leading-[1.35] tracking-[-0.025em]">
            “Drawing only the happy path gets you screens fast — but this product’s difficulty lived in branches, errors and rollbacks.”
          </p>
          <P className="mx-auto mt-6 text-center">
            Setting the architecture and flows first meant the Figma screens, the prototype and the dev spec all shared one set of screen IDs — one language for everyone. And because the logo, the character and the screens came from the same idea, the brand isn’t a layer on top of the product; Lumi’s colour <i>is</i> the stage you’re in.
          </P>
          <div className="mt-12 flex justify-center gap-2">
            <Link href="/#portfolio" className="rounded-xl bg-white/10 px-5 py-3 text-[14px] hover:bg-white/15">
              ← Back to the database
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
