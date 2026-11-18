"use client";

import { useEffect, useRef, useState } from "react";
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
export function HeroStage() {
  const [phase, setPhase] = useState(0); // 0 loading · 1 left · 2 right · 3 centre
  const [pct, setPct] = useState(0);

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
    <div className="hero-digital relative aspect-[16/9] overflow-hidden rounded-[28px] bg-[#05060a] md:aspect-[2/1]">
      {/* digital backdrop */}
      <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(120,140,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(120,140,255,.07)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(70%_70%_at_50%_45%,#000,transparent)]" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(40% 55% at 30% 40%, rgba(232,96,111,.16), transparent 70%), radial-gradient(40% 55% at 70% 45%, rgba(62,155,224,.16), transparent 70%), radial-gradient(30% 40% at 50% 60%, rgba(139,99,232,.2), transparent 70%)" }} />
      <div className="hero-scan pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-0 font-mono text-[10px] text-white/30">
        <span className="absolute left-5 top-4">TALE_STUDIO // v3</span>
        <span className="absolute right-5 top-4">{phase === 0 ? "BOOTING" : "ONLINE"} ●</span>
        <span className="absolute bottom-4 left-5">LUMI.persona = {phase === 0 ? "\"producer\" · loading" : "\"pearl\" · idle"}</span>
      </div>

      {/* Lumi loading */}
      <div className={clsx("absolute inset-0 flex flex-col items-center justify-center transition-[opacity,transform] duration-700", phase === 0 ? "opacity-100" : "pointer-events-none scale-90 opacity-0")}>
        <Lumi persona="producer" state="loading" className="w-[min(34%,340px)]" />
        <p className="mt-1 font-mono text-[11px] tracking-[0.2em] text-white/60">LOADING STUDIO · {pct}%</p>
        <div className="mt-2.5 h-[2px] w-[min(22%,220px)] overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-gradient-to-r from-[#F2A33A] via-[#8B63E8] to-[#2DB39A] transition-[width] duration-100" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* three windows */}
      <div className="absolute inset-0 [perspective:1600px]">
        <div
          className={win}
          style={{ left: "6%", top: "24%", width: "32%", aspectRatio: "16/10.6", opacity: phase >= 1 ? 0.85 : 0, filter: phase >= 1 ? "none" : "blur(10px)", transform: phase >= 1 ? "rotateY(16deg) translateZ(-60px)" : "rotateY(30deg) translateX(-12%) translateZ(-120px)" }}
        >
          {bar}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${C}sim-writer.webp`} alt="Writer stage" className="h-[93%] w-full object-cover object-top" />
        </div>
        <div
          className={win}
          style={{ right: "6%", top: "24%", width: "32%", aspectRatio: "16/10.6", opacity: phase >= 2 ? 0.85 : 0, filter: phase >= 2 ? "none" : "blur(10px)", transform: phase >= 2 ? "rotateY(-16deg) translateZ(-60px)" : "rotateY(-30deg) translateX(12%) translateZ(-120px)" }}
        >
          {bar}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${C}sim-director.webp`} alt="Director stage" className="h-[93%] w-full object-cover object-top" />
        </div>
        <div
          className={clsx(win, "z-10 ring-white/25")}
          style={{ left: "50%", top: "16%", width: "44%", aspectRatio: "16/10.6", opacity: phase >= 3 ? 1 : 0, filter: phase >= 3 ? "none" : "blur(12px)", transform: phase >= 3 ? "translateX(-50%)" : "translateX(-50%) translateY(10%) scale(.92)" }}
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

/** The billboard: a white-pearl Lumi that turns into the iridescent complete Lumi and hops. */
export function BillboardLumi() {
  const box = useRef<HTMLDivElement>(null);
  const [persona, setPersona] = useState("pearl");
  const [hop, setHop] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let ts: ReturnType<typeof setTimeout>[] = [];
    const run = () => {
      ts.forEach(clearTimeout);
      ts = [];
      setPersona("pearl");
      ts.push(setTimeout(() => {
        setPersona("complete");
        setHop((h) => h + 1);
      }, 1400));
      ts.push(setTimeout(run, 7000));
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) run();
      else ts.forEach(clearTimeout);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => {
      io.disconnect();
      ts.forEach(clearTimeout);
    };
  }, []);
  return (
    <div ref={box} className="relative overflow-hidden rounded-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/media/tale/bi/billboard-wide.webp" alt="Billboard — 글 한 줄이 영상이 되기까지" loading="lazy" className="block w-full" />
      <div className="absolute" style={{ left: "58.6%", top: "33.5%", width: "21.5%" }}>
        <div key={hop} className={clsx(hop > 0 && "lumi-hop")}>
          <Lumi persona={persona} state="idle" />
        </div>
      </div>
      <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 font-mono text-[11px] text-white/85 backdrop-blur">
        pearl → complete
      </span>
    </div>
  );
}

/** The Lumi developer guide, as delivered — a living page, framed. */
export function LumiGuide() {
  return (
    <div className="overflow-hidden rounded-2xl bg-[#1b1b1f] ring-1 ring-white/10">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate font-mono text-[11px] text-white/45">lumi-persona · developer guide</span>
        <a href="/proto/lumi-guide/" target="_blank" rel="noopener noreferrer" className="ml-auto shrink-0 rounded-md bg-white/10 px-2.5 py-1 text-[11.5px] text-white/80 hover:bg-white/20">
          Open ↗
        </a>
      </div>
      <iframe src="/proto/lumi-guide/" title="Lumi persona developer guide" loading="lazy" className="block h-[min(82svh,860px)] w-full bg-white" />
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
    <div className="rounded-3xl bg-[#101015] ring-1 ring-white/10">
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
                      className="whitespace-nowrap rounded-md bg-[#101015] px-1.5 text-[10.5px] leading-[16px]"
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
