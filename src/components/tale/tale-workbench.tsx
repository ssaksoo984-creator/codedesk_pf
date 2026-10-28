"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/site-header/locale-context";
import { TALE_BODY, TALE_BODY_EN } from "./tale-body";

const BASE = "/proto/tale";
// Her own code, in the order the original file ran it. `true` = has an
// English build (*.en.js), loaded when the site is in EN.
const SCRIPTS: [string, boolean][] = [
  ["flow-data", true],
  ["flow-view", true],
  ["proto", true],
  ["glue", true],
  ["spec", true],
];
export const TALE_TAB_EVENT = "tale-tab";
export type TaleTab = "flow" | "proto" | "spec";

declare global {
  interface Window {
    mermaid?: unknown;
    TaleSetTab?: (t: TaleTab) => void;
    TALE_START_TAB?: TaleTab;
  }
}

const COPY = {
  loading: { ko: "프로토타입을 불러오는 중", en: "Booting the prototype" },
  full: { ko: "새 창으로 열기", en: "Open full screen" },
  live: { ko: "실제로 눌러 보세요 — 플로우 · 프로토타입 · 내용 정리", en: "Live — flow, prototype and spec, click around" },
  failed: { ko: "불러오지 못했어요. 새 창으로 열어 보세요.", en: "Couldn't load here — open it full screen." },
};

function loadOnce(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[data-tale="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.dataset.tale = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(src));
    document.body.appendChild(s);
  });
}

async function load(src: string) {
  const r = await fetch(src);
  if (!r.ok) throw new Error(src);
  return r.text();
}

/** Re-executes a script every mount: her code wires itself to the DOM it
 * finds at run time, so a fresh page needs a fresh run. */
function exec(code: string) {
  const s = document.createElement("script");
  s.text = code;
  document.body.appendChild(s);
  s.remove();
}

/** Soomin's Tale Studio prototype — flow chart, clickable screens and the
 * dev-handoff spec — mounted directly in the page (no iframe). Her CSS is
 * scoped under .tale-wb and re-skinned with the site's dark/neon tokens. */
export function TaleWorkbench({ startTab = "proto" }: { startTab?: TaleTab }) {
  const { locale } = useLocale();
  const host = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const en = locale === "en";

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let cancelled = false; // e.g. the language flipped mid-load and this instance was replaced
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || started.current) return;
        started.current = true;
        io.disconnect();
        setState("loading");
        (async () => {
          if (!document.querySelector(`link[data-tale]`)) {
            const l = document.createElement("link");
            l.rel = "stylesheet";
            l.href = `${BASE}/tale.css`;
            l.dataset.tale = "1";
            document.head.appendChild(l);
          }
          await loadOnce(`${BASE}/mermaid.js`);
          if (cancelled) return;
          el.innerHTML = en ? TALE_BODY_EN : TALE_BODY;
          window.TALE_START_TAB = startTab;
          for (const [n, hasEn] of SCRIPTS) {
            const code = await load(`${BASE}/${n}${en && hasEn ? ".en" : ""}.js`);
            if (cancelled) return;
            exec(code);
          }
          setState("ready");
          // Mermaid lays out after fonts settle; fit the chart once it has.
          [400, 1500].forEach((t) => setTimeout(() => (document.getElementById("zfit") as HTMLButtonElement | null)?.click(), t));
        })().catch(() => setState("error"));
      },
      { rootMargin: "800px 0px" }
    );
    io.observe(el);

    const onTab = (e: Event) => window.TaleSetTab?.((e as CustomEvent<TaleTab>).detail);
    window.addEventListener(TALE_TAB_EVENT, onTab);
    return () => {
      cancelled = true;
      io.disconnect();
      window.removeEventListener(TALE_TAB_EVENT, onTab);
    };
  }, [startTab, en]);

  return (
    <div className="brackets relative">
      <div className="ko-safe flex items-center justify-between gap-3 border border-b-0 border-neon/25 bg-ink px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] md:px-4">
        <span className="flex min-w-0 items-center gap-2 text-neon">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-neon" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
          </span>
          <span className="truncate">{COPY.live[locale]}</span>
        </span>
        <a href="/proto/tale-studio/" target="_blank" rel="noopener noreferrer" className="shrink-0 text-white/50 transition-colors hover:text-neon">
          {COPY.full[locale]} ↗
        </a>
      </div>
      {/* Left empty for React on purpose: the skeleton is injected right
          before her scripts run, so a re-render can never wipe what they built. */}
      <div id="taleWb" ref={host} className="tale-wb relative min-h-[520px]" />
      {state !== "ready" && (
        <div className="ko-safe absolute inset-x-0 bottom-0 top-9 flex items-center justify-center bg-[#070b14] font-mono text-xs text-white/50">
          {state === "error" ? (
            <a href="/proto/tale-studio/" target="_blank" rel="noopener noreferrer" className="text-neon underline">
              {COPY.failed[locale]}
            </a>
          ) : (
            <span>
              <span className="flicker text-neon">●</span> {COPY.loading[locale]}
              <span className="caret">_</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
