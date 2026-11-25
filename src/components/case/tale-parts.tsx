"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import clsx from "clsx";
import { FLOW, type FlowNode } from "./tale-flow-data";

const C = "/media/tale/case/";

// ---------------------------------------------------------------- lumi

type LumiProps = { persona?: string; state?: string; className?: string; style?: React.CSSProperties };

/** The real Lumi (the <lumi-persona> web component from the Lumi dev guide). */
export function Lumi({ persona = "pearl", state = "idle", className, style }: LumiProps) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    ref.current?.setAttribute("persona", persona);
  }, [persona]);
  useEffect(() => {
    ref.current?.setAttribute("state", state);
  }, [state]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = "lumi-persona" as any;
  return (
    <Tag ref={ref} persona={persona} state={state} class={className} style={{ display: "block", aspectRatio: "3 / 2", ...style }}>
      {/* shown until the web component upgrades (or if WebGL is unavailable) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/media/tale/lumi/${persona}.webp`} alt="" className="lumi-fallback h-full w-auto" />
    </Tag>
  );
}

// ---------------------------------------------------------------- hero

/**
 * A dark, digital stage: Lumi loads, then three windows land — left, right,
 * and the main site's first screen in the centre.
 */
const narrowQuery = "(max-width: 639px)";
function useNarrow() {
  return useSyncExternalStore(
    (cb) => {
      const m = matchMedia(narrowQuery);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => matchMedia(narrowQuery).matches,
    () => false
  );
}

export function HeroStage() {
  const [phase, setPhase] = useState(0); // 0 loading · 1 left · 2 right · 3 centre
  const [pct, setPct] = useState(0);
  const narrow = useNarrow();
  // phones: a portrait stage — two windows peek in up top, the main site large below
  const pos = narrow
    ? { l: { left: "3%", top: "10%", width: "58%" }, r: { right: "3%", top: "22%", width: "58%" }, c: { left: "50%", top: "47%", width: "92%" } }
    : { l: { left: "6%", top: "24%", width: "32%" }, r: { right: "6%", top: "24%", width: "32%" }, c: { left: "50%", top: "16%", width: "44%" } };

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ts: ReturnType<typeof setTimeout>[] = [];
    let alive = true;
    if (reduce) {
      ts.push(setTimeout(() => setPhase(3), 0));
      return () => ts.forEach(clearTimeout);
    }
    // the bar fills while Lumi's script loads; the show starts once Lumi is on screen
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(p + 2, 70);
      setPct(p);
    }, 60);
    const start = () => {
      if (!alive) return;
      clearInterval(tick);
      const from = p;
      for (let k = 1; k <= 10; k++) ts.push(setTimeout(() => setPct(Math.round(from + ((100 - from) * k) / 10)), 2000 + k * 60));
      ts.push(setTimeout(() => setPhase(1), 2900));
      ts.push(setTimeout(() => setPhase(2), 3350));
      ts.push(setTimeout(() => setPhase(3), 3800));
    };
    const ready = customElements.whenDefined("lumi-persona");
    const fallback = new Promise((r) => setTimeout(r, 6000));
    Promise.race([ready, fallback]).then(start);
    return () => {
      alive = false;
      clearInterval(tick);
      ts.forEach(clearTimeout);
    };
  }, []);

  const win = "absolute overflow-hidden rounded-[10px] bg-[#16161b] ring-1 ring-white/15 shadow-[0_30px_80px_-20px_rgba(0,0,0,.9),0_0_0_1px_rgba(120,140,255,.06)] transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(.2,.8,.2,1)]";
  const bar = (
    <div className="flex h-[7%] min-h-3 items-center gap-[1.2%] bg-[#202027] px-[2%]">
      <i className="aspect-square h-[34%] rounded-full bg-[#ff5f57]" />
      <i className="aspect-square h-[34%] rounded-full bg-[#febc2e]" />
      <i className="aspect-square h-[34%] rounded-full bg-[#28c840]" />
    </div>
  );
  return (
    <div className="hero-digital relative aspect-[4/5] overflow-hidden rounded-[22px] bg-[#05060a] sm:aspect-[16/10] md:aspect-[2/1] md:rounded-[28px]">
      {/* digital backdrop */}
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(120,140,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(120,140,255,.07)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(70%_70%_at_50%_45%,#000,transparent)]" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(40% 55% at 30% 40%, rgba(232,96,111,.16), transparent 70%), radial-gradient(40% 55% at 70% 45%, rgba(62,155,224,.16), transparent 70%), radial-gradient(30% 40% at 50% 60%, rgba(139,99,232,.2), transparent 70%)" }} />
      <div className="hero-scan pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 font-mono text-[10px] text-white/30">
        <span className="absolute left-5 top-4">TALE_STUDIO // v3</span>
        <span className="absolute right-5 top-4">{phase === 0 ? "BOOTING" : "ONLINE"} ●</span>
        <span className="absolute bottom-4 left-5 hidden sm:inline">LUMI.persona = {phase === 0 ? "\"producer\" · loading" : "\"pearl\" · idle"}</span>
      </div>

      {/* Lumi loading */}
      <div className={clsx("absolute inset-0 flex flex-col items-center justify-center transition-[opacity,transform] duration-700", phase === 0 ? "opacity-100" : "pointer-events-none scale-90 opacity-0")}>
        <Lumi persona="producer" state="loading" className="w-[min(70%,340px)] sm:w-[min(34%,340px)]" />
        <p className="mt-1 font-mono text-[11px] tracking-[0.2em] text-white/60">LOADING STUDIO · {pct}%</p>
        <div className="mt-2.5 h-[2px] w-[min(22%,220px)] overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-gradient-to-r from-[#F2A33A] via-[#8B63E8] to-[#2DB39A] transition-[width] duration-100" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* three windows */}
      <div className="absolute inset-0 [perspective:1600px]">
        <div
          className={win}
          style={{ ...pos.l, aspectRatio: "16/10.6", opacity: phase >= 1 ? 0.85 : 0, filter: phase >= 1 ? "none" : "blur(10px)", transform: phase >= 1 ? "rotateY(16deg) translateZ(-60px)" : "rotateY(30deg) translateX(-12%) translateZ(-120px)" }}
        >
          {bar}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${C}sim-writer.webp`} alt="Writer stage" className="h-[93%] w-full object-cover object-top" />
        </div>
        <div
          className={win}
          style={{ ...pos.r, aspectRatio: "16/10.6", opacity: phase >= 2 ? 0.85 : 0, filter: phase >= 2 ? "none" : "blur(10px)", transform: phase >= 2 ? "rotateY(-16deg) translateZ(-60px)" : "rotateY(-30deg) translateX(12%) translateZ(-120px)" }}
        >
          {bar}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${C}sim-director.webp`} alt="Director stage" className="h-[93%] w-full object-cover object-top" />
        </div>
        <div
          className={clsx(win, "z-10 ring-white/25")}
          style={{ ...pos.c, aspectRatio: "16/10.6", opacity: phase >= 3 ? 1 : 0, filter: phase >= 3 ? "none" : "blur(12px)", transform: phase >= 3 ? "translateX(-50%)" : "translateX(-50%) translateY(10%) scale(.92)" }}
        >
          {bar}
          <video className="h-[93%] w-full object-cover object-top" muted loop playsInline autoPlay poster={`${C}site-hero.webp`} aria-label="Main site first screen — the word Lumi types out and turns into Lumi">
            <source src={`${C}site-hero.mp4`} type="video/mp4" />
            <source src={`${C}site-hero.webm`} type="video/webm" />
          </video>
        </div>
      </div>
    </div>
  );
}

/** The billboard: the white pearl fills with colour into the complete Lumi, bouncing as it goes. */
export function BillboardLumi() {
  const box = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const hopEl = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    const canvas = cv.current;
    if (!el || !canvas) return;
    const ctx = canvas.getContext("2d")!;
    // the dev guide's own pearl → complete transition, recorded frame by frame
    const N = FILL_FRAMES;
    // frames load the first time the billboard comes near the viewport
    const imgs: HTMLImageElement[] = [];
    const load = () => {
      if (imgs.length) return;
      for (let k = 0; k < N; k++) {
        const im = new Image();
        im.src = `${C}fill/${String(k).padStart(2, "0")}.webp`;
        imgs.push(im);
      }
      imgs[0].onload = () => draw(0);
    };
    const draw = (k: number) => {
      const im = imgs[k];
      if (!im || !im.complete || !im.naturalWidth) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(im, 0, 0, canvas.width, canvas.height);
    };
    let raf = 0;
    let ts: ReturnType<typeof setTimeout>[] = [];
    const stop = () => {
      cancelAnimationFrame(raf);
      ts.forEach(clearTimeout);
      ts = [];
    };
    const play = (dir: 1 | -1, done: () => void) => {
      const t0 = performance.now();
      const step = () => {
        const f = Math.min(N - 1, Math.floor((performance.now() - t0) / FILL_MS));
        draw(dir === 1 ? f : N - 1 - f);
        if (f < N - 1) raf = requestAnimationFrame(step);
        else done();
      };
      raf = requestAnimationFrame(step);
    };
    // pearl → fill (forward) → hop → hold → the same animation backwards → pearl → again
    const loop = () => {
      ts.push(
        setTimeout(
          () =>
            play(1, () => {
              // restart the bounce without remounting the canvas
              const h = hopEl.current;
              if (h) {
                h.classList.remove("bb-bounce");
                void h.offsetWidth;
                h.classList.add("bb-bounce");
              }
              ts.push(setTimeout(() => play(-1, () => ts.push(setTimeout(loop, 400))), 2600));
            }),
          1100
        )
      );
    };
    const io = new IntersectionObserver(
      ([e]) => {
        stop();
        if (e.isIntersecting) {
          load();
          draw(0);
          loop();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
    };
  }, []);
  return (
    <div ref={box} className="relative overflow-hidden rounded-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/media/tale/bi/billboard-wide.webp" alt="Billboard — One line, to film. All-in-one previz studio." loading="lazy" className="block w-full" />
      <div className="absolute" style={{ left: "52.6%", top: "36.5%", width: "17.8%", transform: "rotate(-2.6deg)" }}>
        <div ref={hopEl}>
          <canvas ref={cv} width={420} height={313} className="block h-auto w-full" aria-hidden />
        </div>
      </div>
      <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 font-mono text-[11px] text-white/85 backdrop-blur">
        pearl → complete
      </span>
    </div>
  );
}

const FILL_FRAMES = 96;
const FILL_MS = 31;

/** A desktop mockup with the product playing on its screen. */
export function DesktopVideo({ video = "sim-producer" }: { video?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setK(el.clientWidth / 1600));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // screen corners in the 1600×1195 photo: TL, TR, BR, BL
  const m = quadMatrix(1440, 900, [
    [351, 236],
    [1267, 213],
    [1267, 816],
    [351, 796],
  ]);
  return (
    <div ref={box} className="relative aspect-[1600/1195] overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/media/tale/bi/desktop.webp" alt="Desktop mockup" loading="lazy" className="absolute inset-0 h-full w-full" />
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: 1600, height: 1195, transform: `scale(${k})` }}>
        <video
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: 1440, height: 900, transform: m }}
          muted
          loop
          playsInline
          autoPlay
          poster={`${C}${video}.webp`}
          aria-label="The Producer stage playing on the desktop"
        >
          <source src={`${C}${video}.mp4`} type="video/mp4" />
          <source src={`${C}${video}.webm`} type="video/webm" />
        </video>
      </div>
    </div>
  );
}

/** CSS matrix3d that maps a w×h box onto the quad q (TL, TR, BR, BL). */
function quadMatrix(w: number, h: number, q: [number, number][]) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q;
  const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3;
  const dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (dx3 * dy2 - dx2 * dy3) / den;
  const hh = (dx1 * dy3 - dx3 * dy1) / den;
  const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, c = x0;
  const d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3, f = y0;
  // unit square → quad, then scale the w×h box down to the unit square
  const M = [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, c, f, 0, 1];
  return `matrix3d(${M.map((n) => +n.toFixed(8)).join(",")})`;
}

// ---------------------------------------------------------------- lumi playground

const PERSONAS = [
  { id: "pearl", name: "White pearl", when: "Start · home and projects", loading: "—" },
  { id: "producer", name: "Producer", when: "Planning · settings", loading: "Pearl → Producer: reads the brief" },
  { id: "writer", name: "Writer", when: "Writing the prose", loading: "Producer → Writer: bubbles, a bulb, writes with its tail" },
  { id: "artist", name: "Artist", when: "Drawing cast and sets", loading: "Writer → Artist: shapes spin, burst, and it smiles" },
  { id: "storyboard", name: "Storyboard", when: "Boards · shot breakdown", loading: "Artist → Storyboard: cloud → star → bulb → wow" },
  { id: "director", name: "Director", when: "Direction · shooting", loading: "Storyboard → Director: shouts through a megaphone" },
  { id: "editor", name: "Editor", when: "Edit · finish", loading: "Director → Editor: cuts and splices clips" },
  { id: "complete", name: "Complete", when: "Film done · export", loading: "Editor → Complete: a 2.4 s finale plays" },
];
const STATES = [
  { id: "idle", when: "Resting (all personas)", plays: "Loops" },
  { id: "listening", when: "While the user types", plays: "Loops, 3 s" },
  { id: "thinking", when: "Waiting for a reply", plays: "Loops, 3 s" },
  { id: "complete", when: "A generation finished", plays: "Once, 1.2 s → back to idle" },
  { id: "error", when: "Read or generation failed", plays: "Once, 1 s → holds" },
  { id: "loading", when: "Moving to the next stage", plays: "Loops until idle" },
];

/**
 * The top of the Lumi developer guide, in English and without the code:
 * pick a persona and a state and the real Lumi plays it.
 */
export function LumiPlayground() {
  const [p, setP] = useState("writer");
  const [st, setSt] = useState("idle");
  const P = PERSONAS.find((x) => x.id === p)!;
  const S = STATES.find((x) => x.id === st)!;
  const chip = (on: boolean) => clsx("h-9 rounded-full px-3.5 text-[13px] ring-1 transition-colors", on ? "bg-[#141312] text-white ring-[#141312]" : "bg-white text-[#141312] ring-black/15 hover:ring-black/40");
  return (
    <div className="rounded-3xl bg-[#F5F4EE] p-5 text-[#141312] md:p-8">
      <p className="font-mono text-[11px] tracking-[0.14em] text-black/45">TALE STUDIO · LUMI PERSONA GUIDE</p>
      <p className="mt-2 text-[clamp(24px,3vw,36px)] font-semibold tracking-[-0.03em]">Pick one — Lumi plays it.</p>
      <p className="mt-2 max-w-[62ch] text-[14.5px] leading-[1.65] text-black/60">
        One file and one tag. Change the persona or the state and the transition plays on its own — the same component the product uses.
      </p>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
        <div className="flex items-center justify-center rounded-2xl bg-white ring-1 ring-black/10">
          <Lumi persona={p} state={st} className="w-[86%]" />
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 font-mono text-[11px] text-black/45">persona</p>
            <div className="flex flex-wrap gap-1.5">
              {PERSONAS.map((x) => (
                <button key={x.id} type="button" aria-pressed={p === x.id} onClick={() => setP(x.id)} className={chip(p === x.id)}>
                  {x.id}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-mono text-[11px] text-black/45">state</p>
            <div className="flex flex-wrap gap-1.5">
              {STATES.map((x) => (
                <button key={x.id} type="button" aria-pressed={st === x.id} onClick={() => setSt(x.id)} className={chip(st === x.id)}>
                  {x.id}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-[#141312] p-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/media/tale/lumi/${p}.webp`} alt="" className="w-[80%]" />
            </span>
            <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/media/tale/lumi/${p}.webp`} alt="" className="w-[80%]" />
            </span>
            <span className="text-[13px] text-white/80">Chat avatar · 28 · 40 px</span>
          </div>
          <dl className="divide-y divide-black/10 rounded-2xl bg-white px-4 text-[13.5px] ring-1 ring-black/10">
            {[
              [P.name, P.when],
              ["Stage loading", P.loading],
              [`state · ${S.id}`, `${S.when} — ${S.plays}`],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[120px_1fr] gap-3 py-2.5">
                <dt className="font-mono text-[11px] leading-[1.9] text-black/45">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- old flow

/** The previous service structure (service plan v1.0, §6.1), redrawn in English. */
export function OldFlow() {
  const crews = [
    { n: "Producer", d: "Planning · set-up", r: "Meeting Room", o: ["Cast lock", "Setting tags · treatment"] },
    { n: "Writer", d: "Story · dialogue", r: "Writers’ Room", o: ["Scene / shot split", "Rough boards · script"] },
    { n: "Artist", d: "Cast · places · art", r: "The Visual Studio", o: ["Character sheets", "Sets · look variants"] },
    { n: "Director", d: "Shooting · overall", r: "The Set", o: ["Live-action stills", "Per-shot video"] },
    { n: "Editor", d: "Edit · post", r: "Editor", o: ["Timeline edit", "Final export"] },
  ];
  return (
    <div className="no-scrollbar overflow-x-auto">
      <div className="min-w-[860px] rounded-2xl bg-[#f5f4ee] p-6 font-sans text-[#1f2328] md:p-8">
        <div className="grid grid-cols-5 gap-4 text-center font-mono text-[10.5px] uppercase tracking-wide text-black/55">
          <p className="col-span-3 rounded bg-black/[0.06] py-1.5">Pre-production</p>
          <p className="rounded bg-black/[0.06] py-1.5">Production</p>
          <p className="rounded bg-black/[0.06] py-1.5">Post</p>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-4">
          <div className="col-span-3 border border-black/50 bg-white px-4 py-2.5 text-[12.5px]">
            <span className="text-black/50">Own assets (optional) · </span>TEXT story, script, notes · IMAGE characters, sets, webtoon
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {["bulk input", "text", "image"].map((t, k) => (
            <p key={t} className={clsx("flex h-9 items-center justify-center gap-1 text-[10.5px] text-black/50", k === 0 ? "" : "")}>
              <span className={clsx("h-full border-l", k === 0 ? "border-black/60" : "border-dashed border-black/40")} />
              {t}
            </p>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-4">
          {crews.map((c, k) => (
            <div key={c.n} className="relative border border-black/40 bg-white p-3.5 text-[12.5px]">
              <p className="text-[15px] font-bold">{c.n}</p>
              <p className="text-black/70">{c.d}</p>
              <p className="text-black/45">{c.r}</p>
              <div className="mt-3 border-t border-black/10 pt-2 text-black/70">
                {c.o.map((o) => (
                  <p key={o}>{o}</p>
                ))}
              </div>
              {k < 4 && <span className="absolute -right-[14px] top-1/2 text-black/50">→</span>}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-4">
          {crews.map((c) => (
            <span key={c.n} className="mx-auto h-6 border-l border-dashed border-black/40" />
          ))}
        </div>
        <div className="flex items-center gap-6 border-2 border-[#D93025] bg-[#FDEDEB] px-5 py-3 text-[12.5px]">
          <b className="text-[14px] text-[#D93025]">Agent (the brain)</b>
          <span>In one conversation the crew asks first, does the work, answers, and hands off to the next crew · FAQ</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- new flow

const STAGE_TABS = [
  { id: "entry", name: "Producer", color: "#F2A33A" },
  { id: "writer", name: "Writer", color: "#E8606F" },
  { id: "artist", name: "Artist", color: "#8B63E8" },
  { id: "board", name: "Storyboard", color: "#5A6AE6" },
] as const;
const STAGE_COLOR: Record<string, string> = { entry: "#F2A33A", writer: "#E8606F", artist: "#8B63E8", board: "#5A6AE6", after: "#3E9BE0" };

const EDGE_COLOR: Record<string, string> = { go: "rgba(255,255,255,.42)", yes: "#2DB39A", no: "rgba(255,255,255,.28)", back: "#FF5A6E" };

function path(pts: [number, number][]) {
  if (pts.length < 3) return `M${pts.map((p) => p.join(",")).join(" L")}`;
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let k = 1; k < pts.length - 1; k++) {
    const [x, y] = pts[k];
    const [nx, ny] = pts[k + 1];
    d += ` Q${x},${y} ${(x + nx) / 2},${(y + ny) / 2}`;
  }
  const l = pts[pts.length - 1];
  return d + ` L${l[0]},${l[1]}`;
}

function Node({ n, color }: { n: FlowNode; color: string }) {
  const x = n.x - n.w / 2;
  const y = n.y - n.h / 2;
  const text = (fill: string, size = 12.5, weight = 500) => (
    <foreignObject x={x} y={y} width={n.w} height={n.h}>
      <div
        className="flex h-full w-full items-center justify-center px-2.5 text-center leading-[1.25]"
        style={{ color: fill, fontSize: size, fontWeight: weight }}
      >
        {n.label}
      </div>
    </foreignObject>
  );
  switch (n.type) {
    case "decision":
      return (
        <g>
          <polygon points={`${n.x},${y} ${x + n.w},${n.y} ${n.x},${y + n.h} ${x},${n.y}`} fill="#1a1a20" stroke="#E9C46A" strokeWidth="1.4" />
          <foreignObject x={x + n.w * 0.17} y={y + 6} width={n.w * 0.66} height={n.h - 12}>
            <div className="flex h-full items-center justify-center text-center text-[11px] font-medium leading-[1.2] text-[#F3D98B]">{n.label}</div>
          </foreignObject>
        </g>
      );
    case "ai":
      return (
        <g>
          <rect x={x} y={y} width={n.w} height={n.h} rx={n.h / 2} fill="url(#ai-fill)" stroke="#9F8BFF" strokeWidth="1.2" />
          {text("#fff", 12.5, 500)}
        </g>
      );
    case "modal":
      return (
        <g>
          <rect x={x} y={y} width={n.w} height={n.h} rx="10" fill="#18181d" stroke={color} strokeOpacity=".8" strokeWidth="1.3" strokeDasharray="5 4" />
          {text("rgba(255,255,255,.88)")}
        </g>
      );
    case "error":
      return (
        <g>
          <rect x={x} y={y} width={n.w} height={n.h} rx="10" fill="#2a1418" stroke="#FF5A6E" strokeWidth="1.3" />
          {text("#FFB3BC", 12)}
        </g>
      );
    case "ghost":
      return (
        <g>
          <rect x={x} y={y} width={n.w} height={n.h} rx={n.h / 2} fill="transparent" stroke={STAGE_COLOR[n.stage ?? "after"]} strokeOpacity=".7" strokeDasharray="2 4" strokeWidth="1.3" />
          {text(STAGE_COLOR[n.stage ?? "after"], 11.5, 500)}
        </g>
      );
    case "ext":
      return (
        <g>
          <rect x={x} y={y} width={n.w} height={n.h} rx="10" fill="transparent" stroke="#3E9BE0" strokeDasharray="2 4" />
          {text("#8cc8f2", 12)}
        </g>
      );
    default:
      return (
        <g>
          <rect x={x} y={y} width={n.w} height={n.h} rx="10" fill={color} />
          {n.vs === "new" && <circle cx={x + n.w - 8} cy={y + 8} r="3.5" fill="#fff" />}
          {text("#111", 13, 600)}
        </g>
      );
  }
}

/** The renewal's user flow, per stage, redrawn from the planning data. */
export function FlowChart() {
  const [tab, setTab] = useState<(typeof STAGE_TABS)[number]["id"]>("entry");
  const g = FLOW[tab];
  const color = STAGE_TABS.find((t) => t.id === tab)!.color;
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; sl: number; st: number } | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    el.scrollTop = 0;
  }, [tab]);

  const scale = 0.82;
  return (
    <div className="rounded-3xl bg-[#141312] ring-1 ring-white/10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-3 md:p-4">
        <div role="tablist" aria-label="Stage" className="flex flex-wrap gap-1.5">
          {STAGE_TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={clsx("flex h-9 items-center gap-2 rounded-xl px-3.5 text-[13px] transition-colors", tab === t.id ? "text-black" : "text-white/70 hover:bg-white/5")}
              style={tab === t.id ? { background: t.color } : undefined}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: tab === t.id ? "#111" : t.color }} />
              {t.name}
            </button>
          ))}
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[10.5px] text-white/55">
          <li className="flex items-center gap-1.5"><span className="h-3 w-5 rounded-[3px]" style={{ background: color }} />screen</li>
          <li className="flex items-center gap-1.5"><span className="h-3 w-5 rounded-[3px] border border-dashed" style={{ borderColor: color }} />popup</li>
          <li className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rotate-45 border border-[#E9C46A]" />decision</li>
          <li className="flex items-center gap-1.5"><span className="h-3 w-5 rounded-full border border-[#9F8BFF] bg-[#9F8BFF]/40" />AI working · full lock</li>
          <li className="flex items-center gap-1.5"><span className="h-3 w-5 rounded-[3px] border border-[#FF5A6E]" />error</li>
          <li className="flex items-center gap-1.5"><span className="w-5 border-t border-[#2DB39A]" />yes</li>
          <li className="flex items-center gap-1.5"><span className="w-5 border-t border-dashed border-[#FF5A6E]" />rollback</li>
          <li className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-white" />new in renewal</li>
        </ul>
      </div>
      <div
        ref={box}
        className="flow-pan relative max-h-[78svh] cursor-grab overflow-auto active:cursor-grabbing"
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") return;
          const el = box.current!;
          drag.current = { x: e.clientX, y: e.clientY, sl: el.scrollLeft, st: el.scrollTop };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const el = box.current!;
          el.scrollLeft = d.sl - (e.clientX - d.x);
          el.scrollTop = d.st - (e.clientY - d.y);
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerLeave={() => (drag.current = null)}
      >
        <svg
          key={tab}
          width={g.w * scale}
          height={g.h * scale}
          viewBox={`0 0 ${g.w} ${g.h}`}
          className="flow-in mx-auto block select-none font-sans"
          role="img"
          aria-label={`${STAGE_TABS.find((t) => t.id === tab)!.name} user flow`}
        >
          <defs>
            <linearGradient id="ai-fill" x1="0" x2="1">
              <stop offset="0" stopColor="#3b2f7a" />
              <stop offset="1" stopColor="#5a3fa8" />
            </linearGradient>
            {Object.entries(EDGE_COLOR).map(([k, c]) => (
              <marker key={k} id={`ah-${k}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill={c} />
              </marker>
            ))}
          </defs>
          {g.edges.map((e, k) => (
            <path
              key={k}
              d={path(e.pts)}
              fill="none"
              stroke={EDGE_COLOR[e.kind] ?? EDGE_COLOR.go}
              strokeWidth={e.kind === "yes" || e.kind === "back" ? 1.6 : 1.2}
              strokeDasharray={e.kind === "back" ? "6 5" : e.kind === "no" ? "3 4" : undefined}
              markerEnd={`url(#ah-${e.kind in EDGE_COLOR ? e.kind : "go"})`}
            />
          ))}
          {g.nodes.map((n) => (
            <Node key={n.id} n={n} color={color} />
          ))}
          {g.edges.map(
            (e, k) =>
              e.label && (
                <foreignObject key={k} x={e.lx - 80} y={e.ly - 10} width="160" height="20" className="overflow-visible">
                  <div className="flex h-full items-center justify-center">
                    <span
                      className="whitespace-nowrap rounded-md bg-[#141312] px-1.5 text-[10.5px] leading-[16px]"
                      style={{ color: e.kind === "yes" ? "#7fe0c8" : e.kind === "back" ? "#ff9aa6" : "rgba(255,255,255,.6)" }}
                    >
                      {e.label}
                    </span>
                  </div>
                </foreignObject>
              )
          )}
        </svg>
      </div>
      <p className="border-t border-white/10 px-4 py-3 font-mono text-[10.5px] text-white/40">
        Drag to pan · {g.nodes.filter((n) => n.type !== "ghost").length} nodes in this stage · dashed pills lead to other stages
      </p>
    </div>
  );
}


// ---------------------------------------------------------------- before / after

export const CHANGES = [
  {
    id: "start",
    tab: "Starting a project",
    color: "#F2A33A",
    before: { img: "old-start", note: "A format picker (short film, ad, music video…) came first — before there was any story — then a blank script box with no hint of what the AI needed." },
    after: { video: "sim-producer", note: "Producer: write one line and Lumi asks one thing at a time — genre, length, ratio — with a recommended card already marked." },
  },
  {
    id: "handoff",
    tab: "Hand-off",
    color: "#F2A33A",
    before: { img: "old-handoff", note: "Every hand-off to the Writer opened a long confirmation sheet of settings on top of a live workspace." },
    after: { img: "sim-producer", note: "One summary card — “Here’s how we’ll start” — with the ratio locked and a single yes. The screen locks while the AI writes." },
  },
  {
    id: "writing",
    tab: "Writing",
    color: "#E8606F",
    before: { img: "old-meeting", note: "Scene card, casting, sets and the script shared one screen that stayed editable while the agent kept talking." },
    after: { video: "sim-writer", note: "Writer: prose only. Pick a paragraph, ask for a change, compare the revision in place and apply — then lock the prose." },
  },
  {
    id: "style",
    tab: "Cast & style",
    color: "#8B63E8",
    before: { img: "old-style", note: "The art style was picked mid-conversation, in a carousel layered over the Writer’s workspace." },
    after: { img: "sim-artist-style", note: "Artist: once the prose is locked, Lumi asks the one question it needs — which style — in a single popup, then draws every cast member and set." },
  },
  {
    id: "shots",
    tab: "Shots",
    color: "#5A6AE6",
    before: { img: "old-writers", note: "The Writers’ Room also handled art and shots, so one stage did three jobs and its steps ran 01 to 15." },
    after: { video: "sim-storyboard", note: "Storyboard gets its own stage: scenes split into shots and sketched as roughs before anything is rendered." },
  },
] as const;

function Frame({ label, tone, children }: { label: string; tone: "before" | "after"; children: React.ReactNode }) {
  return (
    <figure>
      <div className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em]">
        <span className={clsx("h-1.5 w-1.5 rounded-full", tone === "before" ? "bg-white/35" : "bg-[#2DB39A]")} />
        <span className={tone === "before" ? "text-white/45" : "text-white/80"}>{label}</span>
      </div>
      <div className={clsx("rounded-[12px] p-[1.2%] ring-1", tone === "before" ? "bg-[#151518] ring-white/10" : "bg-[#1b1b1f] ring-white/20")}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-black">{children}</div>
      </div>
    </figure>
  );
}

/** Each change on its own: pick it above, see before and after side by side. */
export function BeforeAfter() {
  const [i, setI] = useState(0);
  const c = CHANGES[i];
  return (
    <div>
      <div role="tablist" aria-label="Change" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
        {CHANGES.map((x, k) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={k === i}
            onClick={() => setI(k)}
            className={clsx("flex h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-[13.5px] transition-colors", k === i ? "text-black" : "bg-white/[0.05] text-white/65 ring-1 ring-white/10 hover:text-white")}
            style={k === i ? { background: x.color } : undefined}
          >
            <span className="font-mono text-[10.5px] opacity-60">{String(k + 1).padStart(2, "0")}</span>
            {x.tab}
          </button>
        ))}
      </div>

      <div key={c.id} className="flow-in mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <Frame label="Before" tone="before">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${C}${c.before.img}.webp`} alt={`Before — ${c.tab}`} className="h-full w-full object-cover object-top" />
          </Frame>
          <p className="mt-3 text-[14px] leading-[1.65] text-white/55">{c.before.note}</p>
        </div>
        <div>
          <Frame label="After" tone="after">
            {"video" in c.after ? (
              <video key={c.after.video} className="h-full w-full object-cover object-top" muted loop playsInline autoPlay poster={`${C}${c.after.video}.webp`} aria-label={`After — ${c.tab}`}>
                <source src={`${C}${c.after.video}.mp4`} type="video/mp4" />
                <source src={`${C}${c.after.video}.webm`} type="video/webm" />
              </video>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`${C}${c.after.img}.webp`} alt={`After — ${c.tab}`} className="h-full w-full object-cover object-top" />
            )}
          </Frame>
          <p className="mt-3 text-[14px] leading-[1.65] text-white/80">{c.after.note}</p>
        </div>
      </div>
    </div>
  );
}
// ---------------------------------------------------------------- stage show

export const SHOW = [
  { id: "producer", name: "Producer", color: "#F2A33A", line: "One line in. Lumi asks for genre, length and ratio with recommended cards, then sums it up.", lumi: "producer" },
  { id: "writer", name: "Writer", color: "#E8606F", line: "Prose only. Pick a paragraph, ask for a change, compare and apply — or lock the prose and break it down.", lumi: "writer" },
  { id: "artist", name: "Artist", color: "#8B63E8", line: "Lumi asks one question — which style — then draws the cast and sets as versioned cards.", lumi: "artist" },
  { id: "storyboard", name: "Storyboard", color: "#5A6AE6", line: "Scenes split into shots and sketched as roughs; empty shots fill in while you watch.", lumi: "storyboard" },
  { id: "director", name: "Director", color: "#3E9BE0", line: "Cast and sets wire into each shot as nodes; shots render to video one by one.", lumi: "director" },
  { id: "editor", name: "Editor", color: "#2DB39A", line: "The shots land on a timeline — trim, add sound, preview and export.", lumi: "editor" },
] as const;

/**
 * The renewed product in motion, stage by stage — recorded from the live
 * stage demo on the main site. Plays through on its own; tabs jump around.
 */
export function StageShow() {
  const [i, setI] = useState(0);
  const [inView, setInView] = useState(false);
  const [prog, setProg] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    vids.current.forEach((v, k) => {
      if (!v) return;
      if (k === i && inView) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else v.pause();
    });
  }, [i, inView]);

  const s = SHOW[i];
  return (
    <div ref={root}>
      <div role="tablist" aria-label="Stage" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:justify-center md:px-0">
        {SHOW.map((x, k) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={k === i}
            onClick={() => setI(k)}
            className={clsx(
              "relative flex h-12 shrink-0 items-center gap-2 overflow-hidden rounded-2xl pl-2 pr-4 text-[13.5px] font-medium ring-1 backdrop-blur transition-colors",
              k === i ? "bg-white/[0.08] text-white ring-white/30" : "bg-white/[0.03] text-white/55 ring-white/10 hover:text-white"
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/media/tale/lumi/${x.lumi}.webp`} alt="" className="h-9 w-9 object-contain" />
            {x.name}
            {k === i && <span className="absolute bottom-0 left-0 h-[2px]" style={{ width: `${prog * 100}%`, background: x.color }} />}
          </button>
        ))}
      </div>

      <div className="relative mt-5">
        <div className="absolute -inset-y-6 inset-x-0 -z-10 md:-inset-x-10 opacity-60 blur-3xl transition-colors duration-700" style={{ background: `radial-gradient(50% 50% at 50% 50%, ${s.color}33, transparent 70%)` }} />
        <div className="rounded-[16px] bg-[#1b1b1f] p-[0.8%] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
          <div className="relative aspect-[1152/720] overflow-hidden rounded-[8px] bg-[#1f1e1d]">
            {SHOW.map((x, k) => (
              <video
                key={x.id}
                ref={(v) => {
                  vids.current[k] = v;
                }}
                poster={`/media/tale/case/sim-${x.id}.webp`}
                muted
                playsInline
                preload={k === 0 ? "auto" : "metadata"}
                onTimeUpdate={(e) => k === i && setProg(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
                onEnded={() => k === i && setI((i + 1) % SHOW.length)}
                className={clsx("absolute inset-0 h-full w-full object-cover transition-opacity duration-500", k === i ? "opacity-100" : "opacity-0")}
                aria-label={`${x.name} stage in motion`}
              >
                <source src={`/media/tale/case/sim-${x.id}.mp4`} type="video/mp4" />
                <source src={`/media/tale/case/sim-${x.id}.webm`} type="video/webm" />
              </video>
            ))}
          </div>
        </div>
      </div>
      <p className="mx-auto mt-5 max-w-[60ch] text-center text-[15px] leading-[1.6] text-white/70">
        <b className="font-medium" style={{ color: s.color }}>
          {s.name}.
        </b>{" "}
        {s.line}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------- logo, drawn

const T_PATH = "M50 0H150A50 50 0 0 1 150 100H100V150A50 50 0 0 1 50 200A50 50 0 0 1 0 150V50A50 50 0 0 1 50 0Z";
const TAIL_PATH = "M50 100H150A50 50 0 0 1 150 200H50A50 50 0 0 1 50 100Z";
const DROP_PATH = "M50 100H100V150A50 50 0 0 1 50 200A50 50 0 0 1 0 150A50 50 0 0 1 50 100Z";

/**
 * The symbol being built: construction guides sketch in (2u grid, u/2
 * circles), the outlines are traced over them, then the colour pours in.
 * Loops.
 */
export function LogoDraw({ className }: { className?: string }) {
  const guide = { fill: "none", stroke: "#141312", strokeOpacity: 0.28, strokeWidth: 0.8, pathLength: 1 } as const;
  return (
    <svg viewBox="-14 -14 228 228" className={clsx("logo-draw", className)} aria-label="The Tale Studio symbol being drawn">
      <defs>
        <linearGradient id="ld-t" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFA600" />
          <stop offset=".55" stopColor="#FF3D5A" />
          <stop offset="1" stopColor="#C13C9E" />
        </linearGradient>
        <linearGradient id="ld-tail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2F45FF" />
          <stop offset=".5" stopColor="#0096FF" />
          <stop offset="1" stopColor="#00C9A7" />
        </linearGradient>
        <linearGradient id="ld-drop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF8A7A" />
          <stop offset="1" stopColor="#E95CE8" />
        </linearGradient>
      </defs>
      {/* construction */}
      <g className="ld-guides">
        <rect x="0" y="0" width="200" height="200" {...guide} strokeDasharray="1" />
        <line x1="100" y1="-10" x2="100" y2="210" {...guide} />
        <line x1="-10" y1="100" x2="210" y2="100" {...guide} />
        <circle cx="50" cy="50" r="50" {...guide} />
        <circle cx="150" cy="50" r="50" {...guide} />
        <circle cx="50" cy="150" r="50" {...guide} />
        <circle cx="150" cy="150" r="50" {...guide} />
      </g>
      {/* colour */}
      <g className="ld-fill">
        <path d={T_PATH} fill="url(#ld-t)" />
        <path d={TAIL_PATH} fill="url(#ld-tail)" />
        <path d={DROP_PATH} fill="url(#ld-drop)" />
      </g>
      {/* outlines traced over the guides */}
      <g className="ld-lines" fill="none" strokeWidth="1.6" strokeLinejoin="round">
        <path d={T_PATH} stroke="#141312" pathLength={1} />
        <path d={TAIL_PATH} stroke="#141312" pathLength={1} />
        <path d={DROP_PATH} stroke="#141312" pathLength={1} />
      </g>
    </svg>
  );
}
