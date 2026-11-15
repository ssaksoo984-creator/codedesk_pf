"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import clsx from "clsx";
import { PARALLAX, SCREEN, SPOTS, STARS, layout, type Box, type SpotId } from "./spots";
import { IntroFilm } from "./intro-film";
import { ResumeDialog } from "./resume-dialog";
import { LibraryPanel } from "./library-panel";
import { MONITOR, MonitorUI } from "./monitor-ui";

const PortfolioView = dynamic(() => import("../portfolio/portfolio-view").then((m) => m.PortfolioView), {
  ssr: false,
});

type Mode = "night" | "day";

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** What the hover card says about each object. */
const SPOT_INFO: Record<SpotId, { color: string; hint: string }> = {
  library: { color: "#F2A33A", hint: "About · experience · skills" },
  resume: { color: "#5ef2d2", hint: "Résumé · English / 한국어 PDF" },
  portfolio: { color: "#8B6CFF", hint: "4 databases · 10 projects" },
  blog: { color: "#E8606F", hint: "Notes from the projects" },
};

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
  // The monitor switches on a moment after the intro hands over.
  const [screenOn, setScreenOn] = useState(false);
  useEffect(() => {
    if (!introDone) return;
    const t = setTimeout(() => setScreenOn(true), 700);
    return () => clearTimeout(t);
  }, [introDone]);
  const [active, setActive] = useState<SpotId | null>(null);
  const [open, setOpen] = useState<SpotId | null>(null);
  const [hover, setHover] = useState<SpotId | null>(null);
  const [pan, setPan] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  // The room only starts leaning once the film has fully handed over, so
  // the last frame and the room line up exactly.
  const [tiltOn, setTiltOn] = useState(false);
  useEffect(() => {
    if (!introDone) return;
    const t = setTimeout(() => setTiltOn(true), 1600);
    return () => clearTimeout(t);
  }, [introDone]);
  // Repeat visits skip the film: show a small loader until the room is decoded.
  const [roomReady, setRoomReady] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const imgs = Array.from(stageRef.current?.querySelectorAll<HTMLImageElement>("img[data-room]") ?? []);
    let alive = true;
    Promise.all(imgs.map((i) => i.decode().catch(() => {}))).then(() => alive && setRoomReady(true));
    return () => {
      alive = false;
    };
  }, []);
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

  // Layers for this viewport, then slid by the pan (near layer slides more).
  const L = useMemo(() => layout(vp.w, vp.h), [vp]);
  const p = clamp(pan, -L.panRange, L.panRange);
  const deskShift = clamp(p * PARALLAX.desk, (vp.w - L.desk.w) - L.desk.x, -L.desk.x);
  const wall: Box = { ...L.wall, x: L.wall.x + p };
  const desk: Box = { ...L.desk, x: L.desk.x + deskShift };

  // Camera transform for the active spot (applied to both layers together).
  const cam = useMemo(() => {
    if (!active) return { x: 0, y: 0, s: 1 };
    const spot = SPOTS.find((s) => s.id === active)!;
    const b = spot.layer === "wall" ? wall : desk;
    const [fl, ft, fw, fh] = spot.focus;
    const rw = fw * b.w;
    const rh = fh * b.h;
    const cx = b.x + (fl + fw / 2) * b.w;
    const cy = b.y + (ft + fh / 2) * b.h;
    const s =
      active === "portfolio"
        ? Math.max(vp.w / rw, vp.h / rh) * 1.01 // the screen fills the view exactly
        : clamp(Math.min((vp.w * 0.86) / rw, (vp.h * 0.74) / rh), 1, 3.4);
    // Never look past what the layers cover.
    const x = clamp(vp.w / 2 - cx * s, vp.w - vp.w * s, 0);
    const y = clamp(vp.h / 2 - cy * s, vp.h - vp.h * s, 0);
    return { x, y, s };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, vp, p, L]);

  // Desktop: the room leans a little with the pointer (far wall less, desk more).
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setTilt({ x: e.clientX / innerWidth - 0.5, y: e.clientY / innerHeight - 0.5 });
      });
    };
    addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
    };
  }, []);

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

  // Coming back from a project page (/#portfolio): skip the intro and land
  // inside the computer.
  useEffect(() => {
    if (location.hash !== "#portfolio") return;
    document.documentElement.dataset.intro = "seen";
    history.replaceState(null, "", location.pathname);
    const r = requestAnimationFrame(() => {
      setActive("portfolio");
      setOpen("portfolio");
    });
    return () => cancelAnimationFrame(r);
  }, []);

  // Drag to look around when the room is wider than the screen (phones).
  const onPointerDown = (e: React.PointerEvent) => {
    if (active || L.panRange < 1) return;
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
    if (d.moved) setPan(clamp(d.start + dx, -L.panRange, L.panRange));
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

  // A plain render function (not a component), so hovering doesn't remount it.
  const spot = (s: (typeof SPOTS)[number]) => (
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
    </button>
  );

  return (
    <main
      className="fixed inset-0 select-none overflow-hidden bg-[#1b1c17] touch-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <h1 className="sr-only">CodeDesk — Soomin Park’s workroom</h1>

      <div
        ref={stageRef}
        className="cam absolute inset-0"
        data-dragging={dragging || undefined}
        style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})` }}
      >
        {/* ---- Far layer: the back wall ---- */}
        <div
          className="layer absolute"
          style={{
            left: wall.x,
            top: wall.y,
            width: wall.w,
            height: wall.h,
            transform: active || !tiltOn ? undefined : `translate(${-tilt.x * 10}px, ${-tilt.y * 6}px)`,
          }}
        >
          {(["day", "night"] as const).map((m) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={m}
              src={`/media/room/wall-${m}-2400.webp?v=6`}
              srcSet={`/media/room/wall-${m}-1400.webp?v=6 1400w, /media/room/wall-${m}-2400.webp?v=6 2400w`}
              sizes={`${Math.round(wall.w)}px`}
              alt=""
              draggable={false}
              fetchPriority={m === "night" ? "high" : "low"}
              data-room=""
              className="room-layer absolute inset-0 h-full w-full"
              style={{ opacity: m === mode ? 1 : 0 }}
            />
          ))}
          {/* depth: the wall falls into shadow behind the desk */}
          <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.35))" }} aria-hidden />
          <div className="room-layer pointer-events-none absolute inset-0" style={{ opacity: night ? 1 : 0 }} aria-hidden>
            {STARS.map(([x, y], i) => (
              <span key={i} className="star" style={{ left: `${x * 100}%`, top: `${y * 100}%`, animationDelay: `${(i * 0.53) % 3}s` }} />
            ))}
            <span
              className="breathe absolute mix-blend-screen"
              style={{ left: "32%", top: "16%", width: "36%", height: "44%", background: "radial-gradient(closest-side, rgba(94,242,210,0.2), transparent)" }}
            />
          </div>
          {SPOTS.filter((s) => s.layer === "wall").map(spot)}
        </div>

        {/* ---- Near layer: the desk and the monitor ---- */}
        <div
          className="layer pointer-events-none absolute"
          style={{
            left: desk.x,
            top: desk.y,
            width: desk.w,
            height: desk.h,
            transform: active || !tiltOn ? undefined : `translate(${-tilt.x * 26}px, ${-tilt.y * 10}px)`,
          }}
        >
          {(["day", "night"] as const).map((m) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={m}
              src={`/media/room/desk-${m}-2400.webp?v=6`}
              srcSet={`/media/room/desk-${m}-1400.webp?v=6 1400w, /media/room/desk-${m}-2400.webp?v=6 2400w`}
              sizes={`${Math.round(desk.w)}px`}
              alt=""
              draggable={false}
              fetchPriority={m === "night" ? "high" : "low"}
              data-room=""
              className="room-layer absolute inset-0 h-full w-full"
              style={{ opacity: m === mode ? 1 : 0 }}
            />
          ))}
          {/* The monitor: switched off (black, like the film's last frame),
              then it powers on to the portfolio — the same picture the live
              view starts from, so diving in reads as one continuous move. */}
          <div
            className="pointer-events-none absolute overflow-hidden bg-[#06070c]"
            style={{
              left: `${SCREEN[0] * 100}%`,
              top: `${SCREEN[1] * 100}%`,
              width: `${SCREEN[2] * 100}%`,
              height: `${SCREEN[3] * 100}%`,
              borderRadius: 2,
              boxShadow: night && screenOn ? "0 0 60px rgba(120,110,255,0.4)" : "none",
              transition: "box-shadow 1.2s ease",
            }}
          >
            <div className={clsx("h-full w-full", screenOn ? "screen-on" : "opacity-0")}>
              <div style={{ transform: `scale(${(desk.w * SCREEN[2]) / MONITOR.w})`, transformOrigin: "0 0" }}>
                <MonitorUI />
              </div>
            </div>
          </div>
          {SPOTS.filter((s) => s.layer === "desk").map(spot)}
        </div>
      </div>

      {/* Hover: everything else dims, the object is outlined, a card names it. */}
      {hover && !active && (() => {
        const sp = SPOTS.find((x) => x.id === hover)!;
        const b = sp.layer === "wall" ? wall : desk;
        const [rl, rt, rw, rh] = sp.rect;
        const x = b.x + rl * b.w;
        const y = b.y + rt * b.h;
        const w = rw * b.w;
        const h = rh * b.h;
        const off = !tiltOn ? [0, 0] : sp.layer === "wall" ? [-tilt.x * 10, -tilt.y * 6] : [-tilt.x * 26, -tilt.y * 10];
        const info = SPOT_INFO[sp.id];
        const cardW = 260;
        const cx = clamp(x + w / 2 - cardW / 2, 12, vp.w - cardW - 12);
        const above = y > 150;
        return (
          <div className="layer pointer-events-none absolute inset-0 z-10" style={{ transform: `translate(${off[0]}px, ${off[1]}px)` }} aria-hidden>
            <div className="spot-focus absolute rounded-2xl" style={{ left: x, top: y, width: w, height: h, ["--c" as string]: info.color }}>
              <i className="tl" />
              <i className="tr" />
              <i className="bl" />
              <i className="br" />
            </div>
            <div
              className="spot-card absolute rounded-2xl border border-white/10 bg-[rgba(12,11,22,0.82)] p-3.5 font-mono text-white shadow-2xl backdrop-blur-md"
              style={{ left: cx, top: above ? Math.max(70, y - 108) : y + h + 12, width: cardW }}
            >
              <p className="flex items-center gap-2 text-[11px] text-white/55">
                <span className="h-2 w-2 rounded-full" style={{ background: info.color }} />
                {sp.object}
              </p>
              <p className="mt-1 font-sans text-[18px] font-medium leading-tight">{sp.label}</p>
              <p className="mt-0.5 text-[11.5px] text-white/60">{info.hint}</p>
              <p className="mt-2 text-[11px]" style={{ color: info.color }}>
                Click to open →
              </p>
            </div>
          </div>
        );
      })()}

      {/* Dim while a panel is open; black while diving into the computer. */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          background: "rgba(4,6,10,0.45)",
          opacity: open && open !== "portfolio" ? 1 : 0,
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

      {!active && L.panRange > 1 && (
        <p className="pointer-events-none glass absolute bottom-[70px] left-1/2 sm:bottom-4 -translate-x-1/2 rounded-xl px-3 py-1.5 font-mono text-[11px] text-muted [@media(pointer:fine)]:hidden">
          ← drag to look around →
        </p>
      )}

      <ResumeDialog open={open === "resume"} onClose={back} />
      <LibraryPanel open={open === "library"} onClose={back} />
      {open === "portfolio" && <PortfolioView onClose={back} />}

      {introDone && !roomReady && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-[#07090d]">
          <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-white/60">CodeDesk</p>
          <div className="h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
            <div className="loader-bar h-full w-1/3 rounded-full bg-[#5ef2d2]" />
          </div>
        </div>
      )}

      {!introDone && <IntroFilm onDone={() => (document.documentElement.dataset.intro = "seen")} />}
    </main>
  );
}
