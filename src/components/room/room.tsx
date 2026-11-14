"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import clsx from "clsx";
import { FOCAL, ROOM, SPOTS, type SpotId } from "./spots";
import { IntroFilm } from "./intro-film";
import { ResumeDialog } from "./resume-dialog";
import { LibraryPanel } from "./library-panel";

const PortfolioView = dynamic(() => import("../portfolio/portfolio-view").then((m) => m.PortfolioView), {
  ssr: false,
});

type Mode = "night" | "day";

// Fixed star positions inside the window (fractions of the render).
const STARS = [
  [0.845, 0.05], [0.87, 0.11], [0.9, 0.04], [0.912, 0.16], [0.858, 0.2], [0.885, 0.26], [0.9, 0.31],
  [0.842, 0.29], [0.875, 0.36], [0.905, 0.09], [0.862, 0.14], [0.918, 0.24],
];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

// Day/night and "intro seen" live on <html> (set before paint by the layout
// script), so the room reads them from there.
const subscribe = (cb: () => void) => {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode", "data-intro"] });
  return () => mo.disconnect();
};
function useHtmlData(key: "mode" | "intro") {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset[key] ?? "",
    () => ""
  );
}

export function Room() {
  const router = useRouter();
  const [vp, setVp] = useState({ w: 1440, h: 900 });
  const mode: Mode = useHtmlData("mode") === "day" ? "day" : "night";
  const introDone = useHtmlData("intro") === "seen";
  const [active, setActive] = useState<SpotId | null>(null);
  const [open, setOpen] = useState<SpotId | null>(null);
  const [hover, setHover] = useState<SpotId | null>(null);
  const [pan, setPan] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; start: number; moved: boolean } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Viewport + saved mode + whether the intro still has to play.
  useEffect(() => {
    const onResize = () => setVp({ w: innerWidth, h: innerHeight });
    onResize();
    addEventListener("resize", onResize);
    return () => removeEventListener("resize", onResize);
  }, []);

  const toggleMode = () => {
    const next: Mode = mode === "night" ? "day" : "night";
    document.documentElement.dataset.mode = next;
    try {
      localStorage.setItem("mode", next);
    } catch {}
  };

  // Stage: the render covering the viewport, centred on the computer.
  const stage = useMemo(() => {
    const ar = ROOM.w / ROOM.h;
    const w = Math.max(vp.w, vp.h * ar);
    const h = w / ar;
    const minL = vp.w - w;
    const baseL = clamp(vp.w / 2 - FOCAL.x * w, minL, 0);
    const top = clamp(vp.h / 2 - FOCAL.y * h, vp.h - h, 0);
    return { w, h, minL, baseL, top };
  }, [vp]);
  const left = clamp(stage.baseL + pan, stage.minL, 0);

  // Camera transform for the active spot.
  const cam = useMemo(() => {
    if (!active) return { x: 0, y: 0, s: 1 };
    const spot = SPOTS.find((s) => s.id === active)!;
    const [fl, ft, fw, fh] = spot.focus;
    const rw = fw * stage.w;
    const rh = fh * stage.h;
    const cx = left + (fl + fw / 2) * stage.w;
    const cy = stage.top + (ft + fh / 2) * stage.h;
    const s =
      active === "portfolio"
        ? Math.max(vp.w / rw, vp.h / rh) * 1.08 // dive into the screen
        : clamp(Math.min((vp.w * 0.86) / rw, (vp.h * 0.74) / rh), 1, 3.4);
    // Keep the render covering the screen: never reveal past its edges.
    const x = clamp(vp.w / 2 - cx * s, vp.w - (left + stage.w) * s, -left * s);
    const y = clamp(vp.h / 2 - cy * s, vp.h - (stage.top + stage.h) * s, -stage.top * s);
    return { x, y, s };
  }, [active, left, stage, vp]);

  const go = useCallback(
    (id: SpotId) => {
      if (timer.current) clearTimeout(timer.current);
      setOpen(null);
      setActive(id);
      // Let the camera arrive before opening what's there.
      timer.current = setTimeout(
        () => {
          if (id === "blog") router.push("/blog/");
          else setOpen(id);
        },
        id === "portfolio" ? 1050 : 850
      );
    },
    [router]
  );

  const back = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(null);
    setActive(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") back();
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [back]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  // Drag to look around when the room is wider than the screen (phones).
  const onPointerDown = (e: React.PointerEvent) => {
    if (active || stage.minL > -1) return;
    drag.current = { x: e.clientX, start: pan, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      setDragging(true);
    }
    if (d.moved) setPan(clamp(d.start + dx, stage.minL - stage.baseL, -stage.baseL));
  };
  const onPointerUp = () => {
    const moved = drag.current?.moved;
    drag.current = null;
    setDragging(false);
    if (moved) {
      // Swallow the click that follows a drag.
      const stop = (ev: Event) => {
        ev.stopPropagation();
        ev.preventDefault();
      };
      addEventListener("click", stop, { capture: true, once: true });
      setTimeout(() => removeEventListener("click", stop, { capture: true }), 0);
    }
  };

  const night = mode === "night";
  const shown = hover ?? active;

  return (
    <main
      className="fixed inset-0 select-none overflow-hidden bg-black touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <h1 className="sr-only">CodeDesk — Soomin Park’s workroom</h1>

      <div
        className="cam absolute inset-0"
        data-dragging={dragging || undefined}
        style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})` }}
      >
        <div className="absolute" style={{ left, top: stage.top, width: stage.w, height: stage.h }}>
          {(["day", "night"] as const).map((m) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={m}
              src={`/media/room/${m}-2400.webp`}
              srcSet={`/media/room/${m}-1400.webp 1400w, /media/room/${m}-2400.webp 2400w`}
              sizes={`${Math.round(stage.w)}px`}
              alt=""
              draggable={false}
              fetchPriority={m === "night" ? "high" : "low"}
              className="room-layer absolute inset-0 h-full w-full"
              style={{ opacity: m === mode ? 1 : 0 }}
            />
          ))}

          {/* Night-only life on top of the render. */}
          <div className="room-layer pointer-events-none absolute inset-0" style={{ opacity: night ? 1 : 0 }} aria-hidden>
            {STARS.map(([x, y], i) => (
              <span key={i} className="star" style={{ left: `${x * 100}%`, top: `${y * 100}%`, animationDelay: `${(i * 0.53) % 3}s` }} />
            ))}
            <span
              className="breathe absolute mix-blend-screen"
              style={{
                left: "30%", top: "24%", width: "41%", height: "35%",
                background: "radial-gradient(closest-side, rgba(94,242,210,0.22), transparent)",
              }}
            />
            <span
              className="breathe absolute mix-blend-screen"
              style={{
                left: "40%", top: "42%", width: "20%", height: "24%", animationDelay: "1.6s",
                background: "radial-gradient(closest-side, rgba(110,170,255,0.28), transparent)",
              }}
            />
          </div>

          {SPOTS.map((s) => (
            <button
              key={s.id}
              type="button"
              className="spot"
              data-hint={hover === s.id && !active ? "" : undefined}
              aria-label={`${s.label} — ${s.object}`}
              tabIndex={active ? -1 : 0}
              onClick={() => go(s.id)}
              onPointerEnter={() => setHover(s.id)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(s.id)}
              onBlur={() => setHover(null)}
              style={{
                left: `${s.rect[0] * 100}%`,
                top: `${s.rect[1] * 100}%`,
                width: `${s.rect[2] * 100}%`,
                height: `${s.rect[3] * 100}%`,
                visibility: active ? "hidden" : undefined,
              }}
            >
              <span className="spot-label glass rounded-xl px-3 py-1.5 text-[13px] font-medium text-fg">
                {s.label}
                <span className="ml-1.5 font-mono text-[11px] text-muted">{s.object}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Dim while a panel is open; black while diving into the computer. */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: active === "portfolio" ? "#05060a" : "rgba(4,6,10,0.45)",
          opacity: open === "portfolio" ? 1 : open ? 1 : 0,
          transitionDelay: active === "portfolio" && open !== "portfolio" ? "0.55s" : "0s",
        }}
        aria-hidden
      />

      {/* ---- Chrome ---- */}
      <header
        className={clsx(
          "pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between gap-3 p-3 transition-opacity duration-500 md:p-5",
          open === "portfolio" && "opacity-0",
          open && open !== "portfolio" && "max-sm:[&>*:not(nav)]:opacity-0 max-sm:[&>*:not(nav)]:pointer-events-none"
        )}
      >
        <div className="pointer-events-auto min-w-0 max-sm:fixed max-sm:bottom-3 max-sm:left-3">
          {active ? (
            <button type="button" onClick={back} className="glass flex h-11 items-center gap-2 rounded-2xl px-4 text-[14px] font-medium text-fg">
              <span aria-hidden>←</span> Room
            </button>
          ) : (
            <p className="glass flex h-11 items-center rounded-2xl px-4 text-[14px] font-medium text-fg">
              CodeDesk<span className="ml-2 hidden font-mono text-[11px] text-muted sm:inline">Soomin Park</span>
            </p>
          )}
        </div>

        <nav aria-label="Room" className="pointer-events-auto glass absolute left-1/2 top-3 flex -translate-x-1/2 gap-0.5 rounded-2xl p-1 md:top-5">
          {SPOTS.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              onPointerEnter={() => setHover(s.id)}
              onPointerLeave={() => setHover(null)}
              aria-current={active === s.id ? "true" : undefined}
              className={clsx(
                "h-9 rounded-xl px-2.5 text-[13px] font-medium transition-colors sm:px-3.5 sm:text-[14px]",
                shown === s.id ? "bg-fg text-bg" : "text-fg/80 hover:text-fg"
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          onClick={toggleMode}
          aria-label={night ? "Switch to day" : "Switch to night"}
          className="pointer-events-auto glass flex h-11 items-center gap-2 rounded-2xl px-3 text-[14px] font-medium text-fg max-sm:fixed max-sm:bottom-3 max-sm:right-3 md:px-4"
        >
          <span aria-hidden className="text-[16px]">{night ? "☾" : "☀"}</span>
          <span className="hidden sm:inline">{night ? "Night" : "Day"}</span>
        </button>
      </header>

      {!active && stage.minL < -1 && (
        <p className="pointer-events-none glass absolute bottom-[70px] left-1/2 sm:bottom-4 -translate-x-1/2 rounded-xl px-3 py-1.5 font-mono text-[11px] text-muted [@media(pointer:fine)]:hidden">
          ← drag to look around →
        </p>
      )}

      <ResumeDialog open={open === "resume"} onClose={back} />
      <LibraryPanel open={open === "library"} onClose={back} />
      {open === "portfolio" && <PortfolioView onClose={back} />}

      {!introDone && <IntroFilm onDone={() => (document.documentElement.dataset.intro = "seen")} />}
    </main>
  );
}
