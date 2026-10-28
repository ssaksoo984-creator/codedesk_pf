"use client";

import { useEffect, useRef } from "react";

/** The world after the rescue: a bright, pastel digital city with drifting
 * clouds, hover-cars, sparkles and people strolling the street. Pure canvas,
 * laid out from a seeded RNG so it looks the same on every visit, and only
 * animated while on screen. */

type Building = { x: number; w: number; h: number; color: string; roof: number; holo: boolean };
type Cloud = { x: number; y: number; s: number; v: number };
type Person = { x: number; v: number; color: string; skin: string; h: number; phase: number; balloon: string | null };
type Car = { x: number; y: number; v: number; color: string };
type Spark = { x: number; y: number; v: number; r: number; t: number };

const PASTELS = ["#7fd6ff", "#ff9ad5", "#b59cff", "#8ef0c8", "#ffd36e", "#9fb7ff", "#ffb38a"];
const SHIRTS = ["#ff5fa8", "#3fc6ff", "#8b6cff", "#22c79a", "#ffb000", "#ff7a59", "#5b8cff"];
const SKINS = ["#ffd8b8", "#f2c09a", "#d99b73", "#a8714f", "#ffe3cc"];

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

export function DigitalWorld({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let far: Building[] = [];
    let near: Building[] = [];
    let clouds: Cloud[] = [];
    let people: Person[] = [];
    let cars: Car[] = [];
    let sparks: Spark[] = [];
    let raf = 0;
    let visible = false;
    let last = performance.now();

    const layout = () => {
      const r = rng(20771);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const ground = H * 0.78;
      far = [];
      for (let x = -10; x < W + 40; ) {
        const w = 28 + r() * 50;
        far.push({ x, w, h: ground * (0.25 + r() * 0.35), color: "", roof: r(), holo: false });
        x += w + 2;
      }
      near = [];
      for (let x = -20; x < W + 60; ) {
        const w = 46 + r() * 70;
        near.push({
          x,
          w,
          h: ground * (0.22 + r() * 0.42),
          color: PASTELS[Math.floor(r() * PASTELS.length)],
          roof: r(),
          holo: r() < 0.22,
        });
        x += w + 10 + r() * 26;
      }
      clouds = Array.from({ length: Math.max(4, Math.round(W / 220)) }, () => ({
        x: r() * W,
        y: H * (0.06 + r() * 0.28),
        s: 0.6 + r() * 0.9,
        v: 4 + r() * 8,
      }));
      people = Array.from({ length: Math.max(8, Math.round(W / 70)) }, () => {
        const dir = r() < 0.5 ? -1 : 1;
        return {
          x: r() * W,
          v: dir * (14 + r() * 22),
          color: SHIRTS[Math.floor(r() * SHIRTS.length)],
          skin: SKINS[Math.floor(r() * SKINS.length)],
          h: 0.85 + r() * 0.35,
          phase: r() * Math.PI * 2,
          balloon: r() < 0.18 ? PASTELS[Math.floor(r() * PASTELS.length)] : null,
        };
      });
      cars = Array.from({ length: 4 }, (_, i) => ({
        x: r() * W,
        y: H * (0.3 + i * 0.09),
        v: (i % 2 ? -1 : 1) * (40 + r() * 50),
        color: SHIRTS[(i * 2) % SHIRTS.length],
      }));
      sparks = Array.from({ length: 34 }, () => ({ x: r() * W, y: r() * H, v: 6 + r() * 14, r: 1 + r() * 2.2, t: r() * 10 }));
    };

    const cloud = (c: Cloud) => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(c.s, c.s);
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.shadowColor = "rgba(150,200,255,0.6)";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      for (const [dx, dy, rr] of [
        [0, 0, 26],
        [28, -12, 32],
        [62, -2, 26],
        [86, 6, 18],
        [-24, 8, 18],
      ]) {
        ctx.moveTo(dx + rr, dy);
        ctx.arc(dx, dy, rr, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillRect(-40, 8, 140, 18);
      // tiny "pixel" bits trailing behind — it's a digital sky
      ctx.fillStyle = "rgba(120,220,255,0.7)";
      for (let i = 0; i < 4; i++) ctx.fillRect(-56 - i * 12, 14 + (i % 2) * 6, 6, 6);
      ctx.restore();
    };

    const person = (p: Person, ground: number, t: number) => {
      const s = (Math.min(W, 1200) / 1200) * 0.5 + 0.7;
      const h = 30 * p.h * s;
      const step = Math.sin(t * 8 + p.phase);
      const x = p.x;
      const bob = Math.abs(step) * 1.5;
      ctx.save();
      ctx.translate(x, ground + 18 - bob);
      ctx.lineCap = "round";
      // legs
      ctx.strokeStyle = "#3b3f66";
      ctx.lineWidth = 3 * s;
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.38);
      ctx.lineTo(step * 5 * s, 0);
      ctx.moveTo(0, -h * 0.38);
      ctx.lineTo(-step * 5 * s, 0);
      ctx.stroke();
      // body
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-5 * s, -h * 0.8, 10 * s, h * 0.45, 4 * s);
      ctx.fill();
      // arm (one holds the balloon string)
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2.6 * s;
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.72);
      ctx.lineTo(-step * 5 * s * Math.sign(p.v), -h * 0.45);
      ctx.stroke();
      // head
      ctx.fillStyle = p.skin;
      ctx.beginPath();
      ctx.arc(0, -h * 0.92, 5.2 * s, 0, Math.PI * 2);
      ctx.fill();
      if (p.balloon) {
        ctx.strokeStyle = "rgba(60,60,100,0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(4 * s, -h * 0.7);
        ctx.quadraticCurveTo(10 * s, -h * 1.3, 8 * s + Math.sin(t * 2) * 2, -h * 1.75);
        ctx.stroke();
        ctx.fillStyle = p.balloon;
        ctx.beginPath();
        ctx.ellipse(8 * s + Math.sin(t * 2) * 2, -h * 1.95, 7 * s, 9 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.beginPath();
        ctx.arc(6 * s + Math.sin(t * 2) * 2, -h * 2.05, 2 * s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const draw = (t: number, dt: number) => {
      const ground = H * 0.78;
      // sky
      const sky = ctx.createLinearGradient(0, 0, 0, ground);
      sky.addColorStop(0, "#ffd3ef");
      sky.addColorStop(0.45, "#cdeeff");
      sky.addColorStop(1, "#f1fbff");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // sun + halo
      const sx = W * 0.78;
      const sy = H * 0.2;
      const halo = ctx.createRadialGradient(sx, sy, 10, sx, sy, H * 0.45);
      halo.addColorStop(0, "rgba(255,247,190,0.95)");
      halo.addColorStop(0.25, "rgba(255,226,170,0.45)");
      halo.addColorStop(1, "rgba(255,226,170,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff8d6";
      ctx.beginPath();
      ctx.arc(sx, sy, Math.min(W, H) * 0.07, 0, Math.PI * 2);
      ctx.fill();

      // holo rainbow
      ctx.save();
      ctx.globalAlpha = 0.28;
      ["#ff8fcf", "#ffd36e", "#8ef0c8", "#7fd6ff", "#b59cff"].forEach((c, i) => {
        ctx.strokeStyle = c;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.arc(W * 0.3, ground, H * 0.62 - i * 7, Math.PI, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();

      // faint digital scan lines in the sky
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      for (let y = 0; y < ground; y += 6) ctx.fillRect(0, y, W, 1);

      for (const c of clouds) {
        c.x += c.v * dt;
        if (c.x - 120 > W) c.x = -160;
        cloud(c);
      }

      // far skyline
      ctx.fillStyle = "rgba(170,180,255,0.35)";
      for (const b of far) ctx.fillRect(b.x, ground - b.h, b.w, b.h);

      // hover cars between the layers
      for (const c of cars) {
        c.x += c.v * dt;
        if (c.v > 0 && c.x > W + 40) c.x = -40;
        if (c.v < 0 && c.x < -40) c.x = W + 40;
        const trail = ctx.createLinearGradient(c.x, 0, c.x - Math.sign(c.v) * 60, 0);
        trail.addColorStop(0, c.color);
        trail.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = trail;
        ctx.fillRect(Math.min(c.x, c.x - Math.sign(c.v) * 60), c.y + 4, 60, 2);
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.roundRect(c.x - 11, c.y, 22, 8, 4);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillRect(c.x - 4, c.y + 1.5, 8, 3);
      }

      // near buildings
      for (const b of near) {
        const top = ground - b.h;
        const g = ctx.createLinearGradient(0, top, 0, ground);
        g.addColorStop(0, b.color);
        g.addColorStop(1, "#ffffff");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.roundRect(b.x, top, b.w, b.h + 2, [8, 8, 0, 0]);
        ctx.fill();
        // windows
        const cols = Math.max(2, Math.floor(b.w / 16));
        const gap = b.w / cols;
        for (let row = 0; top + 14 + row * 18 < ground - 14; row++) {
          for (let col = 0; col < cols; col++) {
            const lit = Math.sin(row * 3.1 + col * 1.7 + b.x + t * 0.4) > 0.2;
            ctx.fillStyle = lit ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)";
            ctx.fillRect(b.x + col * gap + gap * 0.25, top + 14 + row * 18, gap * 0.5, 9);
          }
        }
        // antenna with blinking light
        if (b.roof > 0.5) {
          ctx.strokeStyle = "rgba(90,100,160,0.6)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(b.x + b.w / 2, top);
          ctx.lineTo(b.x + b.w / 2, top - 16);
          ctx.stroke();
          ctx.fillStyle = Math.sin(t * 3 + b.x) > 0 ? "#ff5fa8" : "rgba(255,95,168,0.3)";
          ctx.beginPath();
          ctx.arc(b.x + b.w / 2, top - 18, 3, 0, Math.PI * 2);
          ctx.fill();
        }
        // floating hologram heart above some roofs
        if (b.holo) {
          const hy = top - 30 + Math.sin(t * 2 + b.x) * 4;
          const hx = b.x + b.w / 2;
          ctx.save();
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = "#ff7ac2";
          ctx.beginPath();
          ctx.moveTo(hx, hy + 7);
          ctx.bezierCurveTo(hx - 14, hy - 4, hx - 6, hy - 14, hx, hy - 5);
          ctx.bezierCurveTo(hx + 6, hy - 14, hx + 14, hy - 4, hx, hy + 7);
          ctx.fill();
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = "#7fd6ff";
          ctx.beginPath();
          ctx.moveTo(hx - 4, hy + 10);
          ctx.lineTo(hx + 4, hy + 10);
          ctx.lineTo(hx + 10, top);
          ctx.lineTo(hx - 10, top);
          ctx.fill();
          ctx.restore();
        }
      }

      // street
      const street = ctx.createLinearGradient(0, ground, 0, H);
      street.addColorStop(0, "#e9f2ff");
      street.addColorStop(1, "#d8e6ff");
      ctx.fillStyle = street;
      ctx.fillRect(0, ground, W, H - ground);
      ctx.fillStyle = "#c3d6ff";
      ctx.fillRect(0, ground, W, 3);
      ctx.fillStyle = "rgba(127,214,255,0.7)";
      for (let x = ((t * 30) % 60) - 60; x < W; x += 60) ctx.fillRect(x, ground + 30, 30, 3);

      // trees
      for (let x = 30; x < W; x += 150) {
        ctx.fillStyle = "#b08a6a";
        ctx.fillRect(x - 2, ground - 22, 4, 24);
        ctx.fillStyle = "#6ee0b4";
        ctx.beginPath();
        ctx.arc(x, ground - 28, 13, 0, Math.PI * 2);
        ctx.arc(x - 9, ground - 20, 9, 0, Math.PI * 2);
        ctx.arc(x + 9, ground - 20, 9, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const p of people) {
        p.x += p.v * dt;
        if (p.x > W + 20) p.x = -20;
        if (p.x < -20) p.x = W + 20;
        person(p, ground, t);
      }

      // rising sparkles
      for (const s of sparks) {
        s.y -= s.v * dt;
        s.t += dt;
        if (s.y < -10) s.y = H + 10;
        ctx.fillStyle = `rgba(255,255,255,${0.5 + Math.sin(s.t * 3) * 0.4})`;
        ctx.fillRect(s.x - s.r, s.y, s.r * 2, 1);
        ctx.fillRect(s.x, s.y - s.r, 1, s.r * 2);
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(now / 1000, dt);
      if (visible && !reduced) raf = requestAnimationFrame(loop);
    };

    layout();
    draw(0, 0);
    const ro = new ResizeObserver(() => {
      layout();
      draw(performance.now() / 1000, 0);
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduced) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
