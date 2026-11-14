"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { CityCanvas } from "./city-canvas";
import { ALL, DISTRICTS, PROJECT } from "./tale-data";

/** What you see inside the computer: one project as a glowing city, with a
 * file-tree on the left and the selected screen on the right. */
export function PortfolioView({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [openDistricts, setOpenDistricts] = useState<Set<string>>(() => new Set(["producer"]));
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"city" | "about">("city");
  const [flow, setFlow] = useState(true);
  const [labels, setLabels] = useState(true);
  const [spin, setSpin] = useState(true);
  const [shown, setShown] = useState(false);
  const [zoomImg, setZoomImg] = useState(false);

  useEffect(() => {
    const r = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(r);
  }, []);

  const current = ALL.find((b) => b.id === selected) ?? null;
  const incoming = useMemo(() => (current ? ALL.filter((b) => b.next?.includes(current.id)) : []), [current]);
  const outgoing = useMemo(() => (current ? ALL.filter((b) => current.next?.includes(b.id)) : []), [current]);
  const q = query.trim().toLowerCase();

  const pick = (id: string | null) => {
    setSelected(id);
    setZoomImg(false);
    if (id) {
      const d = ALL.find((b) => b.id === id)?.district.id;
      if (d) setOpenDistricts((s) => new Set(s).add(d));
    }
  };

  const total = ALL.length;

  return (
    <div
      className={clsx(
        "fixed inset-0 z-40 bg-[#07060d] font-mono text-white transition-[opacity,transform] duration-[900ms] ease-out",
        shown ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"
      )}
      style={{ ["--glass" as string]: "rgba(12,11,22,0.78)", ["--line" as string]: "rgba(255,255,255,0.1)", ["--fg" as string]: "#fff", ["--muted" as string]: "#8d8aa6" }}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label={`Portfolio — ${PROJECT.title}`}
    >
      <CityCanvas selected={selected} onSelect={pick} flow={flow} labels={labels} spin={spin} />

      {/* ---- Left: project + file tree ---- */}
      <aside className="glass absolute bottom-3 left-3 top-3 hidden w-[264px] flex-col rounded-2xl md:flex">
        <div className="flex items-center gap-3 border-b border-line p-3">
          <button
            type="button"
            onClick={onClose}
            aria-label="Back to the room"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 text-[18px] hover:border-white"
          >
            ←
          </button>
          <div className="min-w-0">
            <p className="truncate font-sans text-[16px] font-medium">{PROJECT.title}</p>
            <p className="truncate text-[11px] text-white/45">{PROJECT.path}</p>
          </div>
        </div>
        <div className="m-3 grid grid-cols-2 rounded-xl bg-white/5 p-1 text-[12px]">
          {(["city", "about"] as const).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={clsx("h-8 rounded-lg capitalize", tab === t ? "bg-violet-500/80 text-white" : "text-white/60 hover:text-white")}>
              {t}
            </button>
          ))}
        </div>

        {tab === "city" ? (
          <>
            <label className="mx-3 flex h-9 items-center gap-2 rounded-xl border border-line px-3 text-[12px] text-white/50">
              <span aria-hidden>⌕</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search screen or stage…"
                className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/35"
              />
            </label>
            <ul className="mt-2 min-h-0 flex-1 overflow-y-auto px-2 pb-2 text-[12.5px]">
              {DISTRICTS.map((d) => {
                const items = d.buildings.filter((b) => !q || b.name.toLowerCase().includes(q) || d.name.toLowerCase().includes(q));
                if (q && !items.length) return null;
                const isOpen = q ? true : openDistricts.has(d.id);
                return (
                  <li key={d.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDistricts((s) => {
                          const n = new Set(s);
                          if (n.has(d.id)) n.delete(d.id);
                          else n.add(d.id);
                          return n;
                        })
                      }
                      className="flex h-8 w-full items-center gap-2 rounded-lg px-2 text-left hover:bg-white/5"
                      aria-expanded={isOpen}
                    >
                      <span className="w-3 text-white/40">{isOpen ? "⌄" : "›"}</span>
                      <span className="h-2.5 w-3 rounded-[2px]" style={{ background: d.color }} />
                      <span className="flex-1">{d.name.toLowerCase()}</span>
                      <span className="text-white/40">{d.buildings.length}</span>
                    </button>
                    {isOpen && (
                      <ul>
                        {items.map((b) => (
                          <li key={b.id}>
                            <button
                              type="button"
                              onClick={() => pick(b.id)}
                              className={clsx(
                                "flex h-8 w-full items-center gap-2 rounded-lg pl-7 pr-2 text-left",
                                selected === b.id ? "bg-violet-500/25 text-white ring-1 ring-violet-400/60" : "text-white/75 hover:bg-white/5"
                              )}
                            >
                              <span className="text-white/35">▫</span>
                              <span className="min-w-0 flex-1 truncate">{b.name.split(" · ")[1] ?? b.name}</span>
                              <span className="text-white/40">{b.id}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 text-[12.5px] leading-[1.7] text-white/75">
            <p className="font-sans text-[14px] text-white">{PROJECT.field}</p>
            <p className="mt-3">{PROJECT.intro}</p>
            <a href={PROJECT.prototype} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block rounded-lg bg-violet-500/80 px-3 py-2 text-white">
              Open the prototype ↗
            </a>
          </div>
        )}

        <div className="flex items-baseline gap-5 border-t border-line px-4 py-3">
          <p>
            <span className="font-sans text-[22px] font-medium">{DISTRICTS.length}</span>
            <span className="ml-1.5 text-[11px] text-white/45">stages</span>
          </p>
          <p>
            <span className="font-sans text-[22px] font-medium">{total}</span>
            <span className="ml-1.5 text-[11px] text-white/45">screens</span>
          </p>
          <p>
            <span className="font-sans text-[22px] font-medium">1</span>
            <span className="ml-1.5 text-[11px] text-white/45">prototype</span>
          </p>
        </div>
      </aside>

      {/* ---- Mobile top bar ---- */}
      <div className="absolute inset-x-3 top-3 flex items-center gap-2 md:hidden">
        <button type="button" onClick={onClose} aria-label="Back to the room" className="glass flex h-11 w-11 items-center justify-center rounded-full text-[18px]">
          ←
        </button>
        <div className="glass min-w-0 flex-1 rounded-2xl px-3 py-2">
          <p className="truncate font-sans text-[15px] font-medium">{PROJECT.title}</p>
          <p className="truncate text-[10.5px] text-white/50">{total} screens · tap a tower</p>
        </div>
      </div>

      {/* ---- Top right: prototype ---- */}
      <a
        href={PROJECT.prototype}
        target="_blank"
        rel="noopener noreferrer"
        className="glass absolute right-3 top-3 hidden h-10 items-center rounded-2xl px-4 text-[12px] hover:text-violet-200 md:flex"
      >
        Open prototype ↗
      </a>

      {/* ---- Right: selected screen ---- */}
      <section
        aria-live="polite"
        className={clsx(
          "glass absolute inset-x-3 bottom-3 max-h-[58svh] overflow-y-auto rounded-2xl p-4 transition-[opacity,transform] duration-500 md:inset-x-auto md:bottom-auto md:right-3 md:top-16 md:max-h-[calc(100svh-150px)] md:w-[330px]",
          current ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        )}
      >
        {current && (
          <>
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-sans text-[17px] font-medium leading-snug">{current.name}</h3>
              <button type="button" onClick={() => pick(null)} aria-label="Close" className="text-white/50 hover:text-white">
                ✕
              </button>
            </div>
            <p className="mt-2 text-[12.5px] leading-[1.65] text-white/70">{current.note}</p>
            <button
              type="button"
              onClick={() => setZoomImg(true)}
              className="mt-4 block w-full overflow-hidden rounded-xl border border-line bg-black"
              aria-label="Enlarge screen"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current.image} alt={current.name} className="block w-full" />
            </button>
            <dl className="mt-4 space-y-2 border-t border-line pt-3 text-[12px]">
              <div className="flex justify-between">
                <dt className="text-white/45">Stage</dt>
                <dd className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: current.district.color }} />
                  {current.district.name}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/45">Screen ID</dt>
                <dd>{current.id}</dd>
              </div>
            </dl>
            {outgoing.length > 0 && (
              <div className="mt-4">
                <p className="font-sans text-[13px] font-medium">Leads to</p>
                <ul className="mt-1.5 space-y-1 text-[12px]">
                  {outgoing.map((b) => (
                    <li key={b.id}>
                      <button type="button" onClick={() => pick(b.id)} className="flex items-center gap-2 text-white/75 hover:text-white">
                        <span className="h-2 w-2 rounded-sm" style={{ background: b.district.color }} />
                        {b.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {incoming.length > 0 && (
              <div className="mt-4">
                <p className="font-sans text-[13px] font-medium">Reached from</p>
                <ul className="mt-1.5 space-y-1 text-[12px]">
                  {incoming.map((b) => (
                    <li key={b.id}>
                      <button type="button" onClick={() => pick(b.id)} className="flex items-center gap-2 text-white/75 hover:text-white">
                        <span className="h-2 w-2 rounded-sm" style={{ background: b.district.color }} />
                        {b.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </section>

      {/* ---- Bottom toggles ---- */}
      <div
        className={clsx(
          "glass absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 rounded-2xl p-1 text-[11.5px] transition-opacity md:bottom-4",
          current && "max-md:opacity-0 max-md:pointer-events-none"
        )}
      >
        {[
          { on: flow, set: setFlow, label: "Flow lines" },
          { on: labels, set: setLabels, label: "Labels" },
          { on: spin, set: setSpin, label: "Auto-rotate" },
        ].map((t) => (
          <button
            key={t.label}
            type="button"
            aria-pressed={t.on}
            onClick={() => t.set(!t.on)}
            className={clsx("h-8 whitespace-nowrap rounded-xl px-2.5 sm:px-3", t.on ? "bg-violet-500/80 text-white" : "text-white/60 hover:text-white")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Enlarged screen */}
      {zoomImg && current && (
        <button type="button" onClick={() => setZoomImg(false)} className="absolute inset-0 z-10 flex items-center justify-center bg-black/85 p-4 md:p-12" aria-label="Close enlarged screen">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={current.image} alt={current.name} className="max-h-full max-w-full rounded-xl" />
        </button>
      )}
    </div>
  );
}
