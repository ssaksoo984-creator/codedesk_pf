"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { VISIBLE_WORK_PROJECTS } from "@/lib/work-content";
import { useRestored } from "@/lib/mission-progress";
import { useLocale } from "@/components/site-header/locale-context";
import { MissionCover } from "./mission-browser";
import { MissionPreview, useTapPreview } from "./mission-preview";

const W = 1000;
const H = 420;

/** Deterministic pseudo-random in [0,1) so node layout is stable between
 * server and client renders. */
function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** Network map of every project as a sector node. Red = still infected,
 * cyan = restored (visited). Lines connect each node to its two nearest
 * neighbours so the map reads as one connected world. Hovering a node shows
 * the project's thumbnail; on touch screens a tap opens a preview popup.
 * `collapsible` starts it folded behind an open/close header. */
export function SectorMap({ collapsible }: { collapsible?: boolean }) {
  const { locale } = useLocale();
  const restored = useRestored();
  const [hover, setHover] = useState<string | null>(null);
  const [open, setOpen] = useState(!collapsible);
  const { preview, intercept, close } = useTapPreview();

  const nodes = useMemo(() => {
    const n = VISIBLE_WORK_PROJECTS.length;
    return VISIBLE_WORK_PROJECTS.map((p, i) => {
      const col = (i + 0.5) / n;
      return {
        p,
        x: 70 + col * (W - 140) + (hash(i) - 0.5) * 50,
        y: 70 + hash(i + 17) * (H - 140),
      };
    });
  }, []);

  const edges = useMemo(() => {
    const set = new Set<string>();
    const out: [number, number][] = [];
    nodes.forEach((a, i) => {
      const nearest = nodes
        .map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 }))
        .filter((o) => o.j !== i)
        .sort((x, y) => x.d - y.d)
        .slice(0, 2);
      for (const { j } of nearest) {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!set.has(key)) {
          set.add(key);
          out.push([i, j]);
        }
      }
    });
    return out;
  }, [nodes]);

  const hovered = nodes.find((n) => n.p.index === hover);

  return (
    <div className="brackets relative border border-neon/20 bg-ink/60 backdrop-blur-sm">
      <div
        className={clsx(
          "flex items-center justify-between px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40",
          open && "border-b border-neon/15"
        )}
      >
        {collapsible ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            className="ko-safe flex items-center gap-2 uppercase tracking-[0.25em] text-neon hover:text-paper"
          >
            <span className={clsx("inline-block transition-transform", open && "rotate-90")}>▶</span>
            World map {"//"} {open ? (locale === "ko" ? "접기" : "Close") : locale === "ko" ? "열기" : "Open"}
          </button>
        ) : (
          <span>World map {"//"} live</span>
        )}
        <span className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <i className="h-2 w-2 bg-alert" /> {locale === "ko" ? "감염" : "Infected"}
          </span>
          <span className="flex items-center gap-1.5">
            <i className="h-2 w-2 bg-neon" /> {locale === "ko" ? "복구" : "Restored"}
          </span>
        </span>
      </div>

      <div className={clsx("relative", !open && "hidden")}>
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Sector map">
          <defs>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="rgba(0,240,255,0.12)" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#dots)" />

          {edges.map(([a, b]) => {
            const A = nodes[a];
            const B = nodes[b];
            const ok = restored.includes(A.p.index) && restored.includes(B.p.index);
            return (
              <line
                key={`${a}-${b}`}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke={ok ? "rgba(0,240,255,0.55)" : "rgba(255,51,85,0.25)"}
                strokeWidth={1}
                strokeDasharray={ok ? undefined : "4 5"}
              />
            );
          })}

          {nodes.map(({ p, x, y }, i) => {
            const ok = restored.includes(p.index);
            const color = ok ? "#00f0ff" : "#ff3355";
            const on = hover === p.index;
            return (
              <Link
                key={p.index}
                href={`/work/${p.index}`}
                onMouseEnter={() => setHover(p.index)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(p.index)}
                onBlur={() => setHover(null)}
                onClick={intercept(p)}
                aria-label={p.title[locale]}
              >
                <g transform={`translate(${x} ${y})`} className="cursor-pointer">
                  {!ok && (
                    <circle r="10" fill="none" stroke={color} strokeWidth="1" className="pulse-ring" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
                  )}
                  <rect
                    x={on ? -11 : -8}
                    y={on ? -11 : -8}
                    width={on ? 22 : 16}
                    height={on ? 22 : 16}
                    transform="rotate(45)"
                    fill={ok ? "rgba(0,240,255,0.18)" : "rgba(255,51,85,0.15)"}
                    stroke={color}
                    strokeWidth="1.5"
                    style={{ transition: "all .2s", filter: `drop-shadow(0 0 6px ${color})` }}
                  />
                  <text
                    y={30}
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="11"
                    fill={on ? color : "rgba(230,246,255,0.45)"}
                  >
                    S-{String(i + 1).padStart(2, "0")}
                  </text>
                </g>
              </Link>
            );
          })}
        </svg>

        {hovered && (
          <div
            className={clsx(
              "pointer-events-none absolute z-10 hidden w-64 border border-neon/40 bg-ink/95 font-mono text-[11px] shadow-[0_0_28px_rgba(0,240,255,0.25)] md:block",
              hovered.y < H / 2 ? "translate-y-[26px]" : "-translate-y-[calc(100%+26px)]",
              hovered.x < 160 ? "translate-x-0" : hovered.x > W - 160 ? "-translate-x-full" : "-translate-x-1/2"
            )}
            style={{ left: `${(hovered.x / W) * 100}%`, top: `${(hovered.y / H) * 100}%` }}
          >
            <div className="relative aspect-[16/10] overflow-hidden border-b border-neon/20">
              <MissionCover project={hovered.p} className="h-full w-full" />
              <div className="scanlines absolute inset-0 opacity-50" />
            </div>
            <div className="p-3">
              <div className={clsx("text-[9px] tracking-[0.25em]", restored.includes(hovered.p.index) ? "text-neon" : "text-alert")}>
                {restored.includes(hovered.p.index) ? "● RESTORED" : "● INFECTED"}
              </div>
              <div className="mt-1.5 font-sans text-sm font-semibold text-paper">{hovered.p.title[locale]}</div>
              <div className="mt-0.5 text-white/45">{hovered.p.category[locale]}</div>
            </div>
          </div>
        )}
      </div>
      <MissionPreview project={preview} onClose={close} />
    </div>
  );
}
