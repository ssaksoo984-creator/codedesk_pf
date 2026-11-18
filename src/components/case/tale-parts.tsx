"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { FLOW, type FlowNode } from "./tale-flow-data";

const C = "/media/tale/case/";

// ---------------------------------------------------------------- hero reel

const REEL = [
  { src: "site-home", label: "Landing" },
  { src: "v3-r2", label: "Projects" },
  { src: "v3-p1", label: "Producer" },
  { src: "v3-w1", label: "Writer" },
  { src: "v3-a5", label: "Artist" },
  { src: "v3-s1", label: "Storyboard" },
  { src: "v3-d1", label: "Director" },
  { src: "v3-ed1", label: "Editor" },
  { src: "site-home", label: "Landing" },
];

/**
 * The hero screen: Lumi loads, then the renewed screens rattle past like a
 * reel and land back on the landing page. Loops.
 */
export function HeroReel() {
  // -1 = loading, 0..n-1 = reel frame
  const [i, setI] = useState(-1);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const t = setTimeout(() => setI(REEL.length - 1), 0);
      return () => clearTimeout(t);
    }
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, f: () => void) => timers.push(setTimeout(() => alive && f(), ms));
    const cycle = (t0: number) => {
      at(t0, () => {
        setI(-1);
        setPct(0);
      });
      for (let k = 1; k <= 20; k++) at(t0 + 80 + k * 105, () => setPct(k * 5));
      // the reel: quick at first, slowing into the last frame
      let t = t0 + 2400;
      REEL.forEach((_, k) => {
        at(t, () => setI(k));
        t += k < REEL.length - 2 ? 300 : 520;
      });
      at(t + 3800, () => cycle(0));
    };
    cycle(300);
    return () => {
      alive = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  const loading = i < 0;
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-[#141312]">
      {/* reel strip */}
      <div
        className="absolute inset-0 flex transition-transform duration-[260ms] ease-[cubic-bezier(.3,.7,.2,1)]"
        style={{ transform: `translateX(${-Math.max(0, i) * 100}%)` }}
        aria-hidden={loading}
      >
        {REEL.map((r, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={k} src={`${C}${r.src}.webp`} alt={r.label} className="h-full w-full shrink-0 object-cover object-top" />
        ))}
      </div>

      {/* label of the current frame */}
      {!loading && (
        <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 font-mono text-[10px] text-white/85 backdrop-blur">
          {String(i + 1).padStart(2, "0")} · {REEL[i].label}
        </span>
      )}

      {/* Lumi loading */}
      <div
        className={clsx(
          "absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#141312] transition-opacity duration-300",
          loading ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="absolute inset-0 opacity-70" style={{ background: "radial-gradient(40% 50% at 50% 45%, rgba(242,163,58,.18), transparent 70%)" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/tale/lumi/complete.webp" alt="" className="lumi-loading relative w-[17%]" />
        <p className="relative text-[clamp(11px,1.3vw,15px)] text-white/80">Lumi is setting up your studio…</p>
        <div className="relative h-[3px] w-[28%] overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-[#F2A33A] via-[#8B63E8] to-[#2DB39A] transition-[width] duration-100" style={{ width: `${pct}%` }} />
        </div>
        <p className="relative font-mono text-[10px] text-white/40">{pct}%</p>
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
