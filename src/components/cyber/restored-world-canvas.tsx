"use client";

import { useEffect, useRef } from "react";

/** The hero's city after the rescue, drawn in the same neon-vector language
 * (grid floor, outlined skyline, glyph rain) but healed: a dawn sun, pixel
 * clouds, every window lit, hologram hearts, hover-cars and neon people
 * strolling the grid plaza. Pointer movement leaves a sparkle trail. */

const NEON = "0, 240, 255";
const MAGENTA = "255, 43, 214";
const ACID = "232, 255, 58";
const PINK = "255, 140, 200";
const WINDOW_COLORS = [NEON, NEON, ACID, PINK, "255,255,255"];
const PEOPLE_COLORS = [NEON, PINK, ACID, MAGENTA, "160, 200, 255"];
const GLYPHS = "01♥✦OK+*<>{}";

interface Building {
  x: number;
  w: number;
  h: number;
  windows: { x: number; y: number; c: string; ph: number }[];
  holo: boolean;
  antenna: boolean;
}
interface Cloud {
  x: number;
  y: number;
  s: number;
  v: number;
  cells: [number, number][];
}
interface Person {
  x: number;
  depth: number; // 0 (far) – 1 (near)
  v: number;
  color: string;
  phase: number;
  kid: boolean;
  balloon: string | null;
  wave: boolean;
}
interface Car {
  x: number;
  y: number;
  v: number;
  color: string;
}
interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

// Pixel-art cloud silhouettes (col,row cells).
const CLOUD_SHAPES: [number, number][][] = [
  [[2,0],[3,0],[4,0],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]],
  [[3,0],[4,0],[2,1],[3,1],[4,1],[5,1],[7,1],[8,1],[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2]],
  [[1,0],[2,0],[0,1],[1,1],[2,1],[3,1],[4,1],[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]],
];

export function RestoredWorldCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = 1; // full-section canvas: 1× keeps paint cost down
    let w = 0;
    let h = 0;
    let horizon = 0;
    let t = 0;
    let raf = 0;
    let running = true;
    let buildings: Building[] = [];
    let clouds: Cloud[] = [];
    let people: Person[] = [];
    let cars: Car[] = [];
    let sparks: Spark[] = [];
    let rain: { x: number; y: number; speed: number; len: number }[] = [];
    const mouse = { sx: 0.5, tx: 0.5 };

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

    function build() {
      const r = canvas!.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      horizon = h - Math.min(h * 0.3, 280);

      const maxH = Math.min(horizon * 0.42, 250);
      buildings = [];
      let x = -20;
      while (x < w + 20) {
        const bw = rand(30, 78);
        const bh = rand(maxH * 0.25, maxH) * (Math.random() < 0.1 ? 1.3 : 1);
        const windows: Building["windows"] = [];
        for (let wy = 9; wy < bh - 6; wy += 10) {
          for (let wx = 6; wx < bw - 6; wx += 9) {
            if (Math.random() < 0.55) windows.push({ x: wx, y: wy, c: pick(WINDOW_COLORS), ph: rand(0, 6) });
          }
        }
        buildings.push({ x, w: bw, h: bh, windows, holo: Math.random() < 0.16, antenna: Math.random() < 0.35 });
        x += bw + rand(3, 12);
      }

      clouds = Array.from({ length: Math.max(3, Math.round(w / 320)) }, () => ({
        x: rand(0, w),
        y: Math.max(20, horizon - maxH - rand(30, 170)),
        s: rand(9, 15),
        v: rand(0.08, 0.25),
        cells: pick(CLOUD_SHAPES),
      }));

      people = Array.from({ length: Math.max(10, Math.round(w / 80)) }, () => ({
        x: rand(0, w),
        depth: Math.pow(Math.random(), 0.8),
        v: (Math.random() < 0.5 ? -1 : 1) * rand(0.25, 0.6),
        color: pick(PEOPLE_COLORS),
        phase: rand(0, 6),
        kid: Math.random() < 0.2,
        balloon: Math.random() < 0.2 ? pick([PINK, ACID, NEON]) : null,
        wave: Math.random() < 0.12,
      }));

      cars = Array.from({ length: 5 }, (_, i) => ({
        x: rand(0, w),
        y: horizon - maxH * (0.55 + i * 0.12),
        v: (i % 2 ? -1 : 1) * rand(0.8, 1.6),
        color: pick([NEON, PINK, ACID]),
      }));

      rain = Array.from({ length: Math.floor(w / 46) }, (_, i) => ({
        x: i * 46 + rand(0, 16),
        y: rand(0, h),
        speed: rand(0.3, 0.9),
        len: Math.floor(rand(3, 8)),
      }));
    }

    function drawSky() {
      const g = ctx.createLinearGradient(0, 0, 0, horizon);
      g.addColorStop(0, "rgba(5,7,13,0)");
      g.addColorStop(0.55, `rgba(${NEON},0.06)`);
      g.addColorStop(1, `rgba(${PINK},0.28)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, horizon);

      // Dawn sun — same sliced disc as the hero, now warm and whole.
      const sunX = w * (0.5 + (mouse.sx - 0.5) * 0.06);
      const sunR = Math.min(w * 0.18, 210);
      const cy = horizon - sunR * 0.3;
      const halo = ctx.createRadialGradient(sunX, cy, sunR * 0.6, sunX, cy, sunR * 2.4);
      halo.addColorStop(0, `rgba(${ACID},0.16)`);
      halo.addColorStop(1, "rgba(255,200,120,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, horizon);
      const sg = ctx.createLinearGradient(0, cy - sunR, 0, horizon);
      sg.addColorStop(0, `rgba(${ACID},0.95)`);
      sg.addColorStop(0.6, "rgba(255,170,120,0.85)");
      sg.addColorStop(1, `rgba(${PINK},0.6)`);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, w, horizon);
      ctx.clip();
      ctx.beginPath();
      ctx.arc(sunX, cy, sunR, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = sg;
      ctx.fillRect(sunX - sunR, cy - sunR, sunR * 2, sunR * 2);
      ctx.fillStyle = "rgba(5,7,13,0.85)";
      for (let i = 0; i < 6; i++) {
        const yy = cy + sunR * 0.15 + i * (sunR / 7) + ((t * 6) % (sunR / 7));
        ctx.fillRect(sunX - sunR, yy, sunR * 2, 1 + i * 0.6);
      }
      ctx.restore();
    }

    function drawClouds() {
      for (const c of clouds) {
        if (!reduce) c.x += c.v;
        if (c.x > w + 200) c.x = -200;
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.shadowColor = `rgba(${NEON},0.8)`;
        ctx.shadowBlur = 0;
        for (const [cx, cy] of c.cells) {
          ctx.fillStyle = `rgba(230,246,255,${0.1 + cy * 0.04})`;
          ctx.fillRect(cx * c.s, cy * c.s, c.s - 2, c.s - 2);
          ctx.strokeStyle = `rgba(${NEON},0.45)`;
          ctx.lineWidth = 1;
          ctx.strokeRect(cx * c.s + 0.5, cy * c.s + 0.5, c.s - 3, c.s - 3);
        }
        ctx.restore();
      }
    }

    function drawRain() {
      // The glyph rain still falls — but now it's hearts and OKs.
      ctx.font = "12px 'JetBrains Mono', monospace";
      for (const d of rain) {
        if (!reduce) d.y += d.speed;
        if (d.y - d.len * 16 > horizon) d.y = rand(-150, 0);
        for (let k = 0; k < d.len; k++) {
          const yy = d.y - k * 16;
          if (yy < 0 || yy > horizon) continue;
          const a = (1 - k / d.len) * 0.3;
          const g = GLYPHS[(Math.floor(yy / 16) + Math.floor(d.x)) % GLYPHS.length];
          ctx.fillStyle = k === 0 ? `rgba(${g === "♥" ? PINK : ACID},0.7)` : `rgba(${NEON},${a})`;
          ctx.fillText(g, d.x, yy);
        }
      }
    }

    function heart(x: number, y: number, s: number) {
      ctx.beginPath();
      ctx.moveTo(x, y + s * 0.35);
      ctx.bezierCurveTo(x - s, y - s * 0.4, x - s * 0.4, y - s, x, y - s * 0.35);
      ctx.bezierCurveTo(x + s * 0.4, y - s, x + s, y - s * 0.4, x, y + s * 0.35);
      ctx.closePath();
    }

    function drawCity() {
      const shift = (mouse.sx - 0.5) * -30;
      for (const b of buildings) {
        const bx = b.x + shift;
        const by = horizon - b.h;
        ctx.fillStyle = "rgba(10,16,32,0.94)";
        ctx.fillRect(bx, by, b.w, b.h);
        ctx.strokeStyle = `rgba(${NEON},0.45)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(bx + 0.5, by + 0.5, b.w - 1, b.h);
        for (const win of b.windows) {
          const tw = 0.55 + Math.sin(t * 1.5 + win.ph) * 0.3;
          ctx.fillStyle = `rgba(${win.c},${tw})`;
          ctx.fillRect(bx + win.x, by + win.y, 4, 4);
        }
        if (b.antenna) {
          ctx.strokeStyle = `rgba(${NEON},0.5)`;
          ctx.beginPath();
          ctx.moveTo(bx + b.w / 2, by);
          ctx.lineTo(bx + b.w / 2, by - 14);
          ctx.stroke();
          ctx.fillStyle = Math.sin(t * 3 + b.x) > 0 ? `rgba(${ACID},1)` : `rgba(${ACID},0.25)`;
          ctx.fillRect(bx + b.w / 2 - 1.5, by - 17, 3, 3);
        }
        if (b.holo) {
          const hy = by - 26 + Math.sin(t * 2 + b.x) * 3;
          ctx.save();
          ctx.shadowColor = `rgba(${PINK},1)`;
          ctx.shadowBlur = 14;
          ctx.strokeStyle = `rgba(${PINK},0.95)`;
          ctx.lineWidth = 1.5;
          heart(bx + b.w / 2, hy, 11);
          ctx.stroke();
          ctx.restore();
          ctx.fillStyle = `rgba(${PINK},0.08)`;
          ctx.beginPath();
          ctx.moveTo(bx + b.w / 2 - 3, hy + 6);
          ctx.lineTo(bx + b.w / 2 + 3, hy + 6);
          ctx.lineTo(bx + b.w / 2 + 12, by);
          ctx.lineTo(bx + b.w / 2 - 12, by);
          ctx.fill();
        }
      }
    }

    function drawCars() {
      for (const c of cars) {
        if (!reduce) c.x += c.v;
        if (c.v > 0 && c.x > w + 60) c.x = -60;
        if (c.v < 0 && c.x < -60) c.x = w + 60;
        const dir = Math.sign(c.v);
        const tr = ctx.createLinearGradient(c.x, 0, c.x - dir * 70, 0);
        tr.addColorStop(0, `rgba(${c.color},0.8)`);
        tr.addColorStop(1, `rgba(${c.color},0)`);
        ctx.fillStyle = tr;
        ctx.fillRect(Math.min(c.x, c.x - dir * 70), c.y + 3, 70, 1.5);
        ctx.save();
        ctx.shadowColor = `rgba(${c.color},1)`;
        ctx.shadowBlur = 0;
        ctx.strokeStyle = `rgba(${c.color},0.95)`;
        ctx.strokeRect(c.x - 9, c.y, 18, 6);
        ctx.restore();
      }
    }

    function drawGrid() {
      const vx = w * (0.5 + (mouse.sx - 0.5) * 0.15);
      const g = ctx.createLinearGradient(0, horizon, 0, h);
      g.addColorStop(0, `rgba(${PINK},0.12)`);
      g.addColorStop(1, "rgba(5,7,13,0.6)");
      ctx.fillStyle = g;
      ctx.fillRect(0, horizon, w, h - horizon);
      ctx.lineWidth = 1;
      const spread = w * 2.4;
      for (let i = -24; i <= 24; i++) {
        const bx = vx + (i / 24) * spread;
        ctx.strokeStyle = `rgba(${NEON},${Math.max(0.08, 0.5 - Math.abs(i) * 0.014)})`;
        ctx.beginPath();
        ctx.moveTo(vx + (bx - vx) * 0.02, horizon);
        ctx.lineTo(bx, h);
        ctx.stroke();
      }
      const speed = reduce ? 0 : (t * 0.12) % 1;
      for (let i = 0; i < 18; i++) {
        const p = (i + speed) / 18;
        const y = horizon + Math.pow(p, 2.4) * (h - horizon);
        ctx.strokeStyle = `rgba(${MAGENTA},${0.1 + p * 0.45})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      ctx.save();
      ctx.strokeStyle = `rgba(${NEON},0.95)`;
      ctx.shadowColor = `rgba(${NEON},1)`;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(0, horizon);
      ctx.lineTo(w, horizon);
      ctx.stroke();
      ctx.restore();
    }

    function drawPeople() {
      // Far people first so near ones overlap them.
      const sorted = [...people].sort((a, b) => a.depth - b.depth);
      for (const p of sorted) {
        if (!reduce) p.x += p.v * (0.4 + p.depth);
        if (p.x > w + 30) p.x = -30;
        if (p.x < -30) p.x = w + 30;
        const y = horizon + 12 + Math.pow(p.depth, 1.6) * (h - horizon - 30);
        const s = (0.45 + p.depth * 1.15) * (p.kid ? 0.68 : 1);
        const step = Math.sin(t * 7 + p.phase);
        const hgt = 34 * s;
        ctx.save();
        ctx.translate(p.x, y);
        ctx.strokeStyle = `rgba(${p.color},0.95)`;
        ctx.fillStyle = "rgba(5,7,13,0.85)";
        ctx.shadowColor = `rgba(${p.color},1)`;
        ctx.shadowBlur = 0;
        ctx.lineWidth = Math.max(1, 1.6 * s);
        ctx.lineCap = "round";
        // legs
        ctx.beginPath();
        ctx.moveTo(0, -hgt * 0.42);
        ctx.lineTo(step * 6 * s, 0);
        ctx.moveTo(0, -hgt * 0.42);
        ctx.lineTo(-step * 6 * s, 0);
        // body
        ctx.moveTo(0, -hgt * 0.42);
        ctx.lineTo(0, -hgt * 0.8);
        // arms
        if (p.wave) {
          ctx.moveTo(0, -hgt * 0.74);
          ctx.lineTo(7 * s + Math.sin(t * 8) * 2 * s, -hgt * 1.02);
        } else {
          ctx.moveTo(0, -hgt * 0.74);
          ctx.lineTo(-step * 5 * s, -hgt * 0.5);
        }
        ctx.moveTo(0, -hgt * 0.74);
        ctx.lineTo(step * 5 * s, -hgt * 0.5);
        ctx.stroke();
        // head
        ctx.beginPath();
        ctx.arc(0, -hgt * 0.92, 4.6 * s, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (p.balloon) {
          const bx = 9 * s + Math.sin(t * 2 + p.phase) * 2 * s;
          const by = -hgt * 1.65;
          ctx.strokeStyle = `rgba(${p.balloon},0.5)`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(step * 5 * s, -hgt * 0.5);
          ctx.quadraticCurveTo(bx + 4 * s, -hgt * 1.1, bx, by + 8 * s);
          ctx.stroke();
          ctx.strokeStyle = `rgba(${p.balloon},1)`;
          ctx.shadowColor = `rgba(${p.balloon},1)`;
          ctx.lineWidth = Math.max(1, 1.4 * s);
          ctx.fillStyle = `rgba(${p.balloon},0.25)`;
          ctx.beginPath();
          ctx.ellipse(bx, by, 6 * s, 8 * s, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
        // reflection on the grid floor
        ctx.fillStyle = `rgba(${p.color},${0.08 + p.depth * 0.1})`;
        ctx.fillRect(p.x - 6 * s, y + 2, 12 * s, 1.5);
      }
    }

    function drawSparks() {
      if (!reduce && Math.random() < 0.25) {
        sparks.push({ x: rand(0, w), y: rand(horizon * 0.3, h), vx: rand(-0.1, 0.1), vy: rand(-0.6, -0.2), life: 1, color: pick([ACID, NEON, PINK]) });
      }
      for (const s of sparks) {
        s.x += s.vx;
        s.y += s.vy;
        s.life -= 0.012;
        const a = Math.max(0, s.life);
        ctx.fillStyle = `rgba(${s.color},${a})`;
        ctx.fillRect(s.x - 2, s.y, 5, 1);
        ctx.fillRect(s.x, s.y - 2, 1, 5);
      }
      sparks = sparks.filter((s) => s.life > 0);
    }

    function frame() {
      t += 1 / 60;
      mouse.sx += (mouse.tx - mouse.sx) * 0.05;
      ctx.clearRect(0, 0, w, h);
      drawSky();
      drawClouds();
      drawRain();
      drawCars();
      drawCity();
      drawGrid();
      drawPeople();
      drawSparks();
      if (running && !reduce) raf = requestAnimationFrame(frame);
    }

    const host = canvas.parentElement?.parentElement ?? canvas;
    function onMove(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      mouse.tx = x / r.width;
      if (e.pointerType === "mouse" && Math.random() < 0.5) {
        sparks.push({ x, y, vx: rand(-0.6, 0.6), vy: rand(-0.8, 0.2), life: 1, color: pick([ACID, NEON, PINK]) });
      }
    }

    build();
    frame();
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running && !reduce) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!e.isIntersecting) {
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
    host.addEventListener("pointermove", onMove);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      host.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
