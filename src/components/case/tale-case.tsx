"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { BeforeAfter, BillboardLumi, DesktopVideo, FlowChart, HeroStage, LumiPlayground, OldFlow, StageShow } from "./tale-parts";

/** Where “Open the website” points. */
const SITE_URL = "#";

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
      {/* The real Lumi: the <lumi-persona> web component from the Lumi dev guide */}
      <Script src="/media/tale/lumi-persona.js" strategy="afterInteractive" />
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

        {/* Hero stage */}
        <div className="mx-auto mt-12 max-w-[1180px] px-3 pb-4 md:mt-16 md:px-8">
          <HeroStage />
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
              { href: "#ux", k: "03", t: "UX/UI renewal", d: "Six stages by the work they do, every branch designed first, shipped as v3.", img: `${C}sim-storyboard.webp`, bg: "#141312" },
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
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src="/media/tale/tale-symbol-white.svg" alt="" className="h-9" />
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
                ["goods-2", "Goods"],
                            ].map(([f, t, span]) => (
                <figure key={f} className={clsx("group overflow-hidden rounded-2xl bg-white/5", span)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${BI}${f}.webp`} alt={t} loading="lazy" className="aspect-[4/3] h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <figcaption className="sr-only">{t}</figcaption>
                </figure>
              ))}
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <figure className="overflow-hidden rounded-2xl bg-white/5">
                <DesktopVideo />
                <figcaption className="sr-only">Desktop — the product in use</figcaption>
              </figure>
              <figure className="overflow-hidden rounded-2xl bg-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${BI}sign-ext.webp`} alt="Exterior sign" loading="lazy" className="aspect-[1600/1195] h-full w-full object-cover" />
              </figure>
            </div>
            <div className="mt-3">
              <BillboardLumi />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= CHARACTER */}
      <section id="character" className="scroll-mt-10 border-t border-white/10 py-24 md:py-32">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8">
          <div data-r className="max-w-[820px]">
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
          </div>

          {/* The guide itself */}
          <div data-r className="mt-14">
            <H3>Handed over as a living guide.</H3>
            <P className="mt-3 mb-8">
              Lumi ships to engineering as one web component: eight personas, six states and a loading scene for every stage change. This is the top of the developer guide I handed over — try it.
            </P>
            <LumiPlayground />
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

          {/* 01 · Problems found */}
          <div data-r className="mt-14">
            <Label>01 · What was broken</Label>
            <div className="mt-3"><H3>Auditing the flow first: five problems.</H3></div>
            <P className="mt-3">
              The first version ran on five AI crews in one conversation — a Producer in the Meeting Room, a Writer in the Writers’ Room, then Artist, Director and Editor. On paper, a clean hand-off. Walking every step of the live product said otherwise.
            </P>
            <div className="mt-8"><OldFlow /></div>
            <p className="mt-3 font-mono text-[11px] text-white/40">Previous service plan v1.0 · overall workflow (redrawn in English)</p>
            <ol className="mt-10 grid gap-3 md:grid-cols-2">
              {[
                ["Stages were tangled", "The Writer wrote prose, then drew and split shots — Writer 01 to 15 — so one stage did three jobs and nobody could say where the art came from."],
                ["The screen stayed live while the AI worked", "You could keep typing and editing mid-generation, so requests collided and results overwrote each other."],
                ["Settings before story", "A format picker and language choices came before there was a single line of story."],
                ["Heavy hand-offs", "Every move to the next crew opened a long confirmation sheet and a runtime check."],
                ["Only the happy path was designed", "No states for a wrong file, too little text, a failed read — or for going back when the cast changed."],
              ].map(([t, d], k) => (
                <li key={t} className={clsx("rounded-2xl bg-[#E8606F]/[0.07] p-5 ring-1 ring-[#E8606F]/25", k === 4 && "md:col-span-2")}>
                  <p className="font-mono text-[11px] text-[#ff9aa6]">ISSUE 0{k + 1}</p>
                  <p className="mt-1 text-[16px] font-medium">{t}</p>
                  <p className="mt-1.5 text-[14px] leading-[1.6] text-white/60">{d}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* 02 · What I changed */}
          <div data-r className="mt-20">
            <Label>02 · What I changed</Label>
            <div className="mt-3 mb-8"><H3>Re-split the stages by the work they do.</H3></div>
          </div>
          {/* Architecture before / after */}
          <div data-r className="rounded-3xl bg-white/[0.03] p-6 ring-1 ring-white/10 md:p-10">
            <p className="font-mono text-[11px] uppercase tracking-wide text-white/45">Architecture</p>
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

          {/* 03 · The flow */}
          <div data-r className="mt-20">
            <Label>03 · The flow</Label>
            <div className="mt-3"><H3>Every branch before a single screen.</H3></div>
            <P className="mt-3 mb-8">
              For each stage I mapped the happy path, every yes/no branch, the error states, where the AI locks the screen and where rollback is allowed. The flow chart, the clickable prototype and the developer spec share one set of node IDs. Pick a stage and drag around.
            </P>
            <FlowChart />
          </div>

          {/* 04 · Screens */}
          <div data-r className="mt-20">
            <Label>04 · Screens, before → after</Label>
            <div className="mt-3"><H3>Change by change.</H3></div>
            <P className="mt-3 mb-8">Pick a change to see the old screen next to the renewed one.</P>
            <BeforeAfter />
          </div>

          {/* 05 · After, stage by stage */}
          <div data-r className="mt-24">
            <Label>05 · After, stage by stage</Label>
            <div className="mt-3"><H3>One line becomes a film.</H3></div>
            <P className="mt-3 mb-10">
              Lumi plans it, writes the prose, draws the cast, boards the shots, renders and cuts — recorded from the stage demo on the main site. It plays through on its own, or pick a stage.
            </P>
            <StageShow />
          </div>

          <div data-r className="mt-14 flex flex-wrap gap-2">
            <a href={SITE_URL} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-white px-5 py-3 text-[14px] font-medium text-black hover:bg-white/85">
              Open the website ↗
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
