"use client";

import { useEffect, useRef } from "react";

const NEON = "0, 240, 255";
const MAGENTA = "255, 43, 214";
const GLYPHS = "01アイウエオカキクケコ<>/{}[]#=+*ABCDEF";
const CELL = 48; // matches .grid-bg so pulses run along the drawn grid

/** Site-wide ambient motion behind every section: sparse glyph rain, a
 * drifting node network and light pulses racing along the blueprint grid.
 * Low alpha, ~30fps, paused while the tab is hidden; a single still frame
 * under reduced motion. */
export function DataField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Phones: lighter field (no glyph rain, fewer nodes, ~20fps).
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const FRAME_MS = coarse ? 50 : 33;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let t = 0;
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    let drops: { x: number; y: number; v: number; len: number; on: boolean }[] = [];
    let nodes: { x: number; y: number; vx: number; vy: number }[] = [];
    let pulses: { x: number; y: number; dx: number; dy: number; life: number; c: string }[] = [];

    function build() {
      w = window.innerWidth;
      // Sized to the tallest the viewport gets (address bar hidden), so it
      // never needs a resize mid-scroll.
      h = Math.max(window.innerHeight, window.screen?.height || 0);
      canvas.width = w;
      canvas.height = h;
      canvas.style.height = `${h}px`;
      drops = Array.from({ length: Math.ceil(w / 64) }, (_, i) => ({
        x: i * 64 + rand(0, 20),
        y: rand(-h, h),
        v: rand(40, 110),
        len: Math.floor(rand(5, 14)),
        on: Math.random() < 0.45,
      }));
      nodes = Array.from({ length: Math.round(Math.min(coarse ? 16 : 46, (w * h) / 32000)) }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-8, 8),
        vy: rand(-8, 8),
      }));
      pulses = [];
    }

    function spawnPulse() {
      const horiz = Math.random() < 0.5;
      const dir = Math.random() < 0.5 ? -1 : 1;
      pulses.push({
        x: horiz ? (dir > 0 ? 0 : w) : Math.round(rand(0, w) / CELL) * CELL,
        y: horiz ? Math.round(rand(0, h) / CELL) * CELL : dir > 0 ? 0 : h,
        dx: horiz ? dir * rand(160, 320) : 0,
        dy: horiz ? 0 : dir * rand(160, 320),
        life: 1,
        c: Math.random() < 0.7 ? NEON : MAGENTA,
      });
    }

    function frame(dt: number) {
      ctx.clearRect(0, 0, w, h);

      // node network
      for (const n of nodes) {
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d2 = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
          if (d2 > 170 * 170) continue;
          ctx.strokeStyle = `rgba(${NEON},${0.13 * (1 - Math.sqrt(d2) / 170)})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(${NEON},${0.35 + Math.sin(t * 2 + i) * 0.2})`;
        ctx.fillRect(a.x - 1.5, a.y - 1.5, 3, 3);
      }

      // glyph rain
      if (!coarse) ctx.font = "12px 'JetBrains Mono', monospace";
      for (const d of coarse ? [] : drops) {
        d.y += d.v * dt;
        if (d.y - d.len * 15 > h) {
          d.y = rand(-300, 0);
          d.on = Math.random() < 0.45;
        }
        if (!d.on) continue;
        for (let k = 0; k < d.len; k++) {
          const yy = d.y - k * 15;
          if (yy < 0 || yy > h) continue;
          ctx.fillStyle = k === 0 ? `rgba(${NEON},0.4)` : `rgba(${NEON},${(1 - k / d.len) * 0.13})`;
          ctx.fillText(GLYPHS[(Math.floor(yy / 15) + Math.floor(d.x)) % GLYPHS.length], d.x, yy);
        }
      }

      // grid pulses
      if (Math.random() < dt * 1.6) spawnPulse();
      for (const p of pulses) {
        p.x += p.dx * dt;
        p.y += p.dy * dt;
        p.life -= dt * 0.35;
        const len = 90;
        const g = p.dx
          ? ctx.createLinearGradient(p.x, 0, p.x - Math.sign(p.dx) * len, 0)
          : ctx.createLinearGradient(0, p.y, 0, p.y - Math.sign(p.dy) * len);
        g.addColorStop(0, `rgba(${p.c},${0.7 * p.life})`);
        g.addColorStop(1, `rgba(${p.c},0)`);
        ctx.fillStyle = g;
        if (p.dx) ctx.fillRect(Math.min(p.x, p.x - Math.sign(p.dx) * len), p.y - 0.5, len, 1.5);
        else ctx.fillRect(p.x - 0.5, Math.min(p.y, p.y - Math.sign(p.dy) * len), 1.5, len);
      }
      pulses = pulses.filter((p) => p.life > 0 && p.x > -100 && p.x < w + 100 && p.y > -100 && p.y < h + 100);
    }

    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      if (document.hidden || now - last < FRAME_MS) return;
      const dt = Math.min(0.1, (now - (last || now)) / 1000);
      last = now;
      t += dt;
      frame(dt);
    }

    build();
    if (reduce) frame(0);
    else raf = requestAnimationFrame(loop);
    // Mobile browsers fire resize as the address bar slides in and out while
    // scrolling; only rebuild when the width actually changes.
    const onResize = () => {
      if (window.innerWidth === w) return;
      build();
      if (reduce) frame(0);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="absolute inset-x-0 top-0 w-full" />;
}
