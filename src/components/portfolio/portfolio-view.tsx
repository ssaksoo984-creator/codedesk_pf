"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { DbCanvas } from "./db-canvas";
import { ALL_PROJECTS, STACKS, yearOf } from "./db-data";
import { newestFirst, ProjectList, Thumb } from "./project-list";

/** What you see inside the computer: the work as databases. Pick a stack to
 * split it open, pick a layer to see the project, open it to read the case. */
export function PortfolioView({ onClose, onReady }: { onClose: () => void; onReady?: () => void }) {
  const [stack, setStack] = useState<string | null>(null);
  const [project, setProject] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [flow, setFlow] = useState(true);
  const [labels, setLabels] = useState(true);
  const [spin, setSpin] = useState(true);
  const [shown, setShown] = useState(false);


  const current = ALL_PROJECTS.find((x) => x.project.index === project) ?? null;
  const q = query.trim().toLowerCase();
  const years = new Set(ALL_PROJECTS.map((x) => x.project.year).filter(Boolean)).size;

  const choose = (stackId: string, projectId: string | null) => {
    setStack(stackId);
    setProject(projectId);
  };

  return (
    <div
      className={clsx("fixed inset-0 z-40 bg-[#07060d] font-mono text-white transition-[opacity,transform] duration-[900ms] ease-out", shown ? "scale-100 opacity-100" : "scale-[0.97] opacity-0")}
      style={{ ["--glass" as string]: "rgba(12,11,22,0.78)", ["--line" as string]: "rgba(255,255,255,0.1)", ["--fg" as string]: "#fff", ["--muted" as string]: "#8d8aa6" }}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio"
    >
      <DbCanvas
        stack={stack}
        project={project}
        onStack={setStack}
        onProject={setProject}
        flow={flow}
        labels={labels}
        spin={spin}
        onReady={() => {
          setShown(true);
          onReady?.();
        }}
      />

      {/* ---- Left: databases ---- */}
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
            <p className="truncate font-sans text-[16px] font-medium">Portfolio</p>
            <p className="truncate text-[11px] text-white/45">~/codedesk/work.db</p>
          </div>
        </div>
        <label className="m-3 flex h-9 items-center gap-2 rounded-xl border border-line px-3 text-[12px] text-white/50">
          <span aria-hidden>⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search project…"
            className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/35"
          />
        </label>
        <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-2 text-[12.5px]">
          {STACKS.map((s) => {
            const items = newestFirst(s.projects).filter((p) => !q || p.title.en.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
            if (q && !items.length) return null;
            const isOpen = q ? true : stack === s.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => (stack === s.id ? (setStack(null), setProject(null)) : choose(s.id, null))}
                  className={clsx("flex h-8 w-full items-center gap-2 rounded-lg px-2 text-left hover:bg-white/5", stack === s.id && "bg-white/5")}
                  aria-expanded={isOpen}
                >
                  <span className="w-3 text-white/40">{isOpen ? "⌄" : "›"}</span>
                  <span className="h-2.5 w-3 rounded-[2px]" style={{ background: s.color }} />
                  <span className="flex-1">{s.name.toLowerCase()}</span>
                  <span className="text-white/40">{s.projects.length}</span>
                </button>
                {isOpen && (
                  <ul>
                    {items.map((p) => (
                      <li key={p.index}>
                        <button
                          type="button"
                          onClick={() => choose(s.id, p.index)}
                          className={clsx(
                            "flex h-8 w-full items-center gap-2 rounded-lg pl-7 pr-2 text-left",
                            project === p.index ? "bg-violet-500/25 text-white ring-1 ring-violet-400/60" : "text-white/75 hover:bg-white/5"
                          )}
                        >
                          <span className="text-white/35">▤</span>
                          <span className="min-w-0 flex-1 truncate">{p.title.en}</span>
                          <span className="text-white/40">{p.index}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
        <div className="flex items-baseline gap-5 border-t border-line px-4 py-3">
          <p>
            <span className="font-sans text-[22px] font-medium">{STACKS.length}</span>
            <span className="ml-1.5 text-[11px] text-white/45">databases</span>
          </p>
          <p>
            <span className="font-sans text-[22px] font-medium">{ALL_PROJECTS.length}</span>
            <span className="ml-1.5 text-[11px] text-white/45">projects</span>
          </p>
          {years > 0 && (
            <p>
              <span className="font-sans text-[22px] font-medium">{years}</span>
              <span className="ml-1.5 text-[11px] text-white/45">years</span>
            </p>
          )}
        </div>
      </aside>

      {/* ---- Mobile top bar ---- */}
      <div className="absolute inset-x-3 top-3 flex items-center gap-2 md:hidden">
        <button type="button" onClick={onClose} aria-label="Back to the room" className="glass flex h-11 w-11 items-center justify-center rounded-full text-[18px]">
          ←
        </button>
        <div className="glass min-w-0 flex-1 rounded-2xl px-3 py-2">
          <p className="truncate font-sans text-[15px] font-medium">Portfolio</p>
          <p className="truncate text-[10.5px] text-white/50">{stack ? "tap a layer" : "tap a database to split it"}</p>
        </div>
      </div>
      <div className="no-scrollbar absolute inset-x-3 top-[68px] flex gap-1.5 overflow-x-auto md:hidden">
        {STACKS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => (stack === s.id ? (setStack(null), setProject(null)) : choose(s.id, null))}
            className={clsx("glass flex h-8 shrink-0 items-center gap-1.5 rounded-xl px-3 text-[11.5px]", stack === s.id && "ring-1 ring-white/60")}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            {s.name}
          </button>
        ))}
      </div>

      {/* ---- Split-open stack: its discs unfold into an image list ---- */}
      {stack && !current && (
        <ProjectList
          stack={STACKS.find((s) => s.id === stack)!}
          onClose={() => {
            setStack(null);
            setProject(null);
          }}
        />
      )}

      {/* ---- Right: selected project ---- */}
      <section
        aria-live="polite"
        className={clsx(
          "glass absolute inset-x-3 bottom-3 max-h-[60svh] overflow-y-auto rounded-2xl p-4 transition-[opacity,transform] duration-500 md:inset-x-auto md:bottom-auto md:right-3 md:top-3 md:max-h-[calc(100svh-90px)] md:w-[340px]",
          current ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        )}
      >
        {current && (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-[11px] text-white/50">
                  <span className="h-2 w-2 rounded-full" style={{ background: current.stack.color }} />
                  {current.stack.name} · {current.project.index}
                </p>
                <h3 className="mt-1.5 font-sans text-[19px] font-medium leading-snug">{current.project.title.en}</h3>
              </div>
              <button type="button" onClick={() => setProject(null)} aria-label="Close" className="text-white/50 hover:text-white">
                ✕
              </button>
            </div>
            <p className="mt-1 text-[12px] text-white/55">{current.project.category.en}</p>
            <div className="mt-4 aspect-[16/10] w-full overflow-hidden rounded-xl border border-line bg-black">
              <Thumb p={current.project} />
            </div>
            {current.project.description && (
              <p className="mt-4 line-clamp-5 text-[12.5px] leading-[1.65] text-white/70">{current.project.description.en}</p>
            )}
            <dl className="mt-4 space-y-2 border-t border-line pt-3 text-[12px]">
              {current.project.client && (
                <div className="flex justify-between gap-4">
                  <dt className="text-white/45">Client</dt>
                  <dd className="text-right">{current.project.client.en}</dd>
                </div>
              )}
              {yearOf(current.project) && (
                <div className="flex justify-between gap-4">
                  <dt className="text-white/45">When</dt>
                  <dd>{yearOf(current.project)}</dd>
                </div>
              )}
            </dl>
            <Link
              href={`/work/${current.project.index}/`}
              className="mt-5 flex h-11 items-center justify-between rounded-xl bg-violet-500 px-4 font-sans text-[14px] font-medium text-white hover:bg-violet-400"
            >
              Open project <span aria-hidden>→</span>
            </Link>
          </>
        )}
      </section>

      {/* ---- Bottom toggles ---- */}
      <div
        className={clsx(
          "glass absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 rounded-2xl p-1 text-[11.5px] transition-opacity md:bottom-4",
          (current || stack) && "pointer-events-none opacity-0 md:pointer-events-auto md:opacity-100", stack && !current && "md:hidden"
        )}
      >
        {[
          { on: flow, set: setFlow, label: "Data lines" },
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
    </div>
  );
}
