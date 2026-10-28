"use client";

import { useEffect, useRef } from "react";

interface Virus {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface Building {
  x: number;
  w: number;
  h: number;
  windows: { x: number; y: number; infected: boolean }[];
}

const GLYPHS = "01アイウエオカキクケコサシスセソ<>/{}[]#$%=+*ABCDEF";
const NEON = "0, 240, 255";
const MAGENTA = "255, 43, 214";
const ALERT = "255, 51, 85";

/** The hero's playable backdrop: a synthwave grid floor rushing toward the
 * viewer, a procedural skyline on the horizon with infected (red) windows,
 * data rain, and drifting red virus signals. Sweeping the pointer over a
 * virus purges it into a cyan burst and reports it via `onPurge` — the
 * first "save the world" interaction a visitor gets. */
export function HeroCanvas({
  onPurge,
  impactRef,
  saved,
}: {
  onPurge?: () => void;
  /** Filled with a function the meteor strike calls (in % of the canvas)
   * to blast debris and drop new viruses at the impact point. */
  impactRef?: React.MutableRefObject<((xPct: number, yPct: number) => void) | null>;
  /** Every sector restored: no more viruses, the whole skyline lights up cyan. */
  saved?: boolean;
}) {
  const savedRef = useRef(saved);
  useEffect(() => {
    savedRef.current = saved;
  }, [saved]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const purgeRef = useRef(onPurge);

  useEffect(() => {
    purgeRef.current = onPurge;
  }, [onPurge]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let horizon = 0;
    let raf = 0;
    let running = true;
    let t = 0;

    const mouse = { x: -9999, y: -9999, tx: 0.5, sx: 0.5 };
    let viruses: Virus[] = [];
    let sparks: Spark[] = [];
    let buildings: Building[] = [];
    let rain: { x: number; y: number; speed: number; len: number }[] = [];

    function rand(a: number, b: number) {
      return a + Math.random() * (b - a);
    }

    function spawnVirus(): Virus {
      return {
        x: rand(w * 0.08, w * 0.92),
        y: rand(h * 0.12, horizon - 30),
        vx: rand(-0.25, 0.25),
        vy: rand(-0.15, 0.15),
        r: rand(5, 9),
        phase: rand(0, Math.PI * 2),
      };
    }

    function build() {
      const rect = canvas!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      horizon = h * 0.64;

      buildings = [];
      let x = -20;
      while (x < w + 20) {
        const bw = rand(26, 70);
        const bh = rand(h * 0.06, h * 0.3) * (Math.random() < 0.12 ? 1.5 : 1);
        const windows: Building["windows"] = [];
        for (let wy = 8; wy < bh - 6; wy += 9) {
          for (let wx = 5; wx < bw - 5; wx += 8) {
            if (Math.random() < 0.28) windows.push({ x: wx, y: wy, infected: Math.random() < 0.18 });
          }
        }
        buildings.push({ x, w: bw, h: bh, windows });
        x += bw + rand(2, 10);
      }

      const cols = Math.floor(w / 26);
      rain = Array.from({ length: cols }, (_, i) => ({
        x: i * 26 + rand(0, 10),
        y: rand(-h, h),
        speed: rand(0.6, 2.2),
        len: Math.floor(rand(6, 18)),
      }));

      const count = w < 700 ? 6 : 11;
      viruses = Array.from({ length: count }, spawnVirus);
    }

    function drawSky() {
      const g = ctx!.createLinearGradient(0, 0, 0, horizon);
      g.addColorStop(0, "rgba(5,7,13,0)");
      g.addColorStop(1, `rgba(${MAGENTA},0.16)`);
      ctx!.fillStyle = g;
      ctx!.fillRect(0, 0, w, horizon);

      // Sun disc behind the skyline, sliced by scan bars.
      const sunX = w * (0.5 + (mouse.sx - 0.5) * 0.06);
      const sunR = Math.min(w, h) * 0.2;
      const sg = ctx!.createLinearGradient(0, horizon - sunR * 2, 0, horizon);
      sg.addColorStop(0, `rgba(${MAGENTA},0.55)`);
      sg.addColorStop(1, `rgba(${ALERT},0.15)`);
      ctx!.save();
      ctx!.beginPath();
      ctx!.arc(sunX, horizon - sunR * 0.35, sunR, 0, Math.PI * 2);
      ctx!.clip();
      ctx!.fillStyle = sg;
      ctx!.fillRect(sunX - sunR, horizon - sunR * 1.4, sunR * 2, sunR * 2);
      ctx!.fillStyle = "rgba(5,7,13,1)";
      for (let i = 0; i < 7; i++) {
        const yy = horizon - sunR * 0.35 + i * (sunR / 7) + ((t * 8) % (sunR / 7));
        ctx!.fillRect(sunX - sunR, yy, sunR * 2, 2 + i * 0.7);
      }
      ctx!.restore();
    }

    function drawRain() {
      ctx!.font = "12px 'JetBrains Mono', monospace";
      for (const d of rain) {
        if (!reduce) d.y += d.speed;
        if (d.y - d.len * 14 > horizon) d.y = rand(-200, 0);
        for (let k = 0; k < d.len; k++) {
          const yy = d.y - k * 14;
          if (yy < 0 || yy > horizon) continue;
          const a = (1 - k / d.len) * 0.22;
          ctx!.fillStyle = k === 0 ? `rgba(${NEON},0.55)` : `rgba(${NEON},${a})`;
          ctx!.fillText(GLYPHS[(Math.floor(yy / 14) + Math.floor(d.x)) % GLYPHS.length], d.x, yy);
        }
      }
    }

    function drawCity() {
      const shift = (mouse.sx - 0.5) * -30;
      for (const b of buildings) {
        const bx = b.x + shift;
        const by = horizon - b.h;
        ctx!.fillStyle = "rgba(7,10,20,0.96)";
        ctx!.fillRect(bx, by, b.w, b.h);
        ctx!.strokeStyle = `rgba(${NEON},0.22)`;
        ctx!.lineWidth = 1;
        ctx!.strokeRect(bx + 0.5, by + 0.5, b.w - 1, b.h);
        for (const win of b.windows) {
          if (win.infected && !savedRef.current) {
            const on = Math.sin(t * 6 + win.x * 3 + win.y) > -0.2;
            ctx!.fillStyle = on ? `rgba(${ALERT},0.85)` : `rgba(${ALERT},0.2)`;
          } else {
            ctx!.fillStyle = `rgba(${NEON},0.45)`;
          }
          ctx!.fillRect(bx + win.x, by + win.y, 3, 3);
        }
      }
    }

    function drawGrid() {
      const vx = w * (0.5 + (mouse.sx - 0.5) * 0.15);
      const g = ctx!.createLinearGradient(0, horizon, 0, h);
      g.addColorStop(0, "rgba(5,7,13,0.2)");
      g.addColorStop(1, "rgba(5,7,13,0.9)");
      ctx!.fillStyle = g;
      ctx!.fillRect(0, horizon, w, h - horizon);

      ctx!.lineWidth = 1;
      // Vertical lines converging on the vanishing point.
      const spread = w * 2.4;
      for (let i = -24; i <= 24; i++) {
        const bx = vx + (i / 24) * spread;
        const a = 0.42 - Math.abs(i) * 0.012;
        ctx!.strokeStyle = `rgba(${MAGENTA},${Math.max(0.06, a)})`;
        ctx!.beginPath();
        ctx!.moveTo(vx + (bx - vx) * 0.02, horizon);
        ctx!.lineTo(bx, h);
        ctx!.stroke();
      }
      // Horizontal lines rushing toward the viewer.
      const speed = reduce ? 0 : (t * 0.35) % 1;
      for (let i = 0; i < 22; i++) {
        const p = (i + speed) / 22;
        const y = horizon + Math.pow(p, 2.6) * (h - horizon);
        ctx!.strokeStyle = `rgba(${NEON},${0.08 + p * 0.5})`;
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(w, y);
        ctx!.stroke();
      }
      // Horizon glow line.
      ctx!.strokeStyle = `rgba(${NEON},0.9)`;
      ctx!.shadowColor = `rgba(${NEON},1)`;
      ctx!.shadowBlur = 14;
      ctx!.beginPath();
      ctx!.moveTo(0, horizon);
      ctx!.lineTo(w, horizon);
      ctx!.stroke();
      ctx!.shadowBlur = 0;
    }

    function burst(x: number, y: number, color = NEON, n = 22, power = 4.5) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = rand(1, power);
        sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, color });
      }
    }

    if (impactRef) {
      impactRef.current = (xPct, yPct) => {
        const x = (xPct / 100) * w;
        const y = (yPct / 100) * h;
        burst(x, y, MAGENTA, 70, 9);
        burst(x, y, ALERT, 40, 6);
        // Infect nearby windows and drop fresh virus signals around the crater.
        for (const b of buildings) {
          if (Math.abs(b.x + b.w / 2 - x) < w * 0.12) for (const win of b.windows) if (Math.random() < 0.5) win.infected = true;
        }
        const max = w < 700 ? 10 : 18;
        for (let i = 0; i < 4 && viruses.length < max; i++) {
          const v = spawnVirus();
          v.x = x + rand(-60, 60);
          v.y = Math.min(horizon - 20, y + rand(-80, 10));
          viruses.push(v);
        }
      };
    }

    function drawViruses() {
      if (savedRef.current) viruses.length = 0;
      for (let i = 0; i < viruses.length; i++) {
        const v = viruses[i];
        if (!reduce) {
          v.x += v.vx + Math.sin(t + v.phase) * 0.2;
          v.y += v.vy + Math.cos(t * 0.8 + v.phase) * 0.15;
        }
        if (v.x < 0 || v.x > w) v.vx *= -1;
        if (v.y < 40 || v.y > horizon - 10) v.vy *= -1;

        const dx = mouse.x - v.x;
        const dy = mouse.y - v.y;
        if (dx * dx + dy * dy < 34 * 34) {
          burst(v.x, v.y);
          viruses[i] = spawnVirus();
          purgeRef.current?.();
          continue;
        }

        const pulse = 1 + Math.sin(t * 5 + v.phase) * 0.25;
        ctx!.save();
        ctx!.translate(v.x, v.y);
        ctx!.rotate(t + v.phase);
        ctx!.shadowColor = `rgba(${ALERT},1)`;
        ctx!.shadowBlur = 16;
        ctx!.strokeStyle = `rgba(${ALERT},0.95)`;
        ctx!.lineWidth = 1.5;
        const r = v.r * pulse;
        ctx!.strokeRect(-r, -r, r * 2, r * 2);
        ctx!.fillStyle = `rgba(${ALERT},0.9)`;
        ctx!.fillRect(-2, -2, 4, 4);
        ctx!.restore();
        ctx!.font = "9px 'JetBrains Mono', monospace";
        ctx!.fillStyle = `rgba(${ALERT},0.7)`;
        ctx!.fillText("ERR", v.x + r + 4, v.y - r);
      }

      for (const s of sparks) {
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.94;
        s.vy *= 0.94;
        s.life -= 0.025;
        ctx!.fillStyle = `rgba(${s.color},${Math.max(0, s.life)})`;
        ctx!.fillRect(s.x, s.y, 2.5, 2.5);
      }
      sparks = sparks.filter((s) => s.life > 0);
    }

    function frame() {
      t += 1 / 60;
      mouse.sx += (mouse.tx - mouse.sx) * 0.05;
      ctx!.clearRect(0, 0, w, h);
      drawSky();
      drawRain();
      drawCity();
      drawGrid();
      drawViruses();
      if (running && !reduce) raf = requestAnimationFrame(frame);
    }

    function onMove(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.tx = mouse.x / r.width;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    build();
    frame();

    const io = new IntersectionObserver(([entry]) => {
      const vis = entry.isIntersecting;
      if (vis && !running && !reduce) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!vis) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      build();
      if (reduce) frame();
    });
    ro.observe(canvas);

    const host = canvas.parentElement ?? canvas;
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerdown", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerdown", onMove);
      host.removeEventListener("pointerleave", onLeave);
      if (impactRef) impactRef.current = null;
    };
  }, [impactRef]);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
