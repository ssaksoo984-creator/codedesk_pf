/* eslint-disable */
// Lumi 주변 소품과 표정: 버블(하트), 도형, 전구, 구름(눈 뜨는 구름 → 별), 조명, 입 모양, 웃는 눈.
// 모두 Lumi의 버블과 같은 반투명 젤리 질감(핑크·라벤더 그라데이션 + 흰 하이라이트).
// 좌표는 원본 일러스트 px. 호출하는 쪽에서 캐릭터 변환을 걸어 두므로 Lumi와 함께 움직인다.

const TAU = Math.PI * 2;
const pop = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2)); // 살짝 튀며 커짐
const lerp = (a, b, k) => a + (b - a) * k;

export const JELLY = {
  pink: { light: "#ffe3f0", base: "#f79cc6", dark: "#e7639f", rim: "rgba(214,72,140,0.35)" },
  lavender: { light: "#f4ecff", base: "#cdb2f7", dark: "#a47ee6", rim: "rgba(130,90,210,0.35)" },
  coral: { light: "#ffe4dc", base: "#ff9a8c", dark: "#f0606a", rim: "rgba(220,70,80,0.35)" },
  cream: { light: "#fffbea", base: "#ffe7a6", dark: "#f6c35f", rim: "rgba(220,160,60,0.35)" },
  cloud: { light: "#ffffff", base: "#fbf4ff", dark: "#e3d3f7", rim: "rgba(160,120,220,0.35)" },
  heart: { light: "#fff0f7", base: "#ff8fc0", dark: "#e4508f", rim: "rgba(200,60,130,0.4)" },
};
const FACE = "#3a1742";

export function bubbleTone(hex) {
  const r = parseInt(hex.slice(1, 3), 16), b = parseInt(hex.slice(5, 7), 16);
  return b > r ? JELLY.lavender : JELLY.pink;
}

// 모양 경로를 젤리 질감으로 채운다: 왼쪽 위가 밝은 그라데이션 + 테두리 + 흰 하이라이트
function jelly(g, path, cx, cy, size, tone, alpha = 1, highlight = true) {
  if (alpha <= 0.001 || size <= 0.01) return;
  g.save();
  g.globalAlpha *= Math.min(1, alpha);
  const grd = g.createRadialGradient(cx - size * 0.35, cy - size * 0.4, size * 0.05, cx, cy, size * 1.1);
  grd.addColorStop(0, tone.light);
  grd.addColorStop(0.45, tone.base);
  grd.addColorStop(1, tone.dark);
  path(g);
  g.fillStyle = grd;
  g.fill();
  g.lineWidth = Math.max(1, size * 0.06);
  g.strokeStyle = tone.rim;
  g.stroke();
  if (highlight) {
    g.fillStyle = "rgba(255,255,255,0.85)";
    g.beginPath();
    g.ellipse(cx - size * 0.32, cy - size * 0.38, size * 0.2, size * 0.12, -0.6, 0, TAU);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.55)";
    g.beginPath();
    g.arc(cx + size * 0.35, cy + size * 0.3, size * 0.07, 0, TAU);
    g.fill();
  }
  g.restore();
}

// ---------- 버블 ↔ 둥근 하트 (같은 매개변수의 두 윤곽을 섞어 부드럽게 변한다) ----------
function blobPath(cx, cy, r, heart) {
  return (g) => {
    g.beginPath();
    const N = 72;
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * TAU, sn = Math.sin(t);
      const ox = sn, oy = -Math.cos(t);
      const hx = (0.55 * sn * sn * sn + 0.45 * sn) * 1.08;  // 아래 끝이 둥근 하트
      const hy = -(12 * Math.cos(t) - 4 * Math.cos(2 * t) - 1.2 * Math.cos(3 * t) - 0.4 * Math.cos(4 * t)) / 14.5 - 0.08;
      const x = cx + r * (ox + (hx - ox) * heart), y = cy + r * (oy + (hy - oy) * heart);
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.closePath();
  };
}

export function drawBubble(g, x, y, r, tone, heart = 0, alpha = 1) {
  const s = r * (1 + 0.3 * heart);
  jelly(g, blobPath(x, y, s, heart), x, y, s, heart > 0.5 ? JELLY.heart : tone, alpha);
}

// ---------- 그리는 중: 네모 · 세모 · 동그라미 ----------
// orbit = 1이면 생각 중 버블처럼 몸 둘레를 돌고, 0이면 원래 자리로 퍼진다. 몸 뒤쪽은 back 캔버스에.
const SHAPES = [
  { kind: "square", x: 300, y: 250, s: 52, tone: "pink", spin: 1 },
  { kind: "triangle", x: 470, y: 150, s: 50, tone: "lavender", spin: -1 },
  { kind: "circle", x: 200, y: 680, s: 40, tone: "coral", spin: 0 },
  { kind: "square", x: 390, y: 870, s: 38, tone: "lavender", spin: -1 },
  { kind: "triangle", x: 640, y: 950, s: 42, tone: "pink", spin: 1 },
  { kind: "circle", x: 1480, y: 300, s: 30, tone: "lavender", spin: 0 },
];
function shapePath(kind, x, y, s, rot) {
  return (g) => {
    g.beginPath();
    if (kind === "circle") { g.arc(x, y, s, 0, TAU); return; }
    const n = kind === "square" ? 4 : 3, off = kind === "square" ? Math.PI / 4 : -Math.PI / 2;
    const pts = [];
    for (let i = 0; i < n; i++) { const a = rot + off + (i * TAU) / n; pts.push([x + Math.cos(a) * s * 1.25, y + Math.sin(a) * s * 1.25]); }
    // 변의 가운데에서 출발해 꼭짓점마다 둥글게 돈다
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    g.moveTo(...mid(pts[n - 1], pts[0]));
    for (let i = 0; i < n; i++) {
      const m = mid(pts[i], pts[(i + 1) % n]);
      g.arcTo(pts[i][0], pts[i][1], m[0], m[1], s * 0.3);
    }
    g.closePath();
  };
}
export function drawShapes(front, back, t, amount, orbit, angle, C, R) {
  if (amount <= 0.001) return false;
  let usedBack = false;
  SHAPES.forEach((sh, i) => {
    const ang = angle + (i * TAU) / SHAPES.length;
    const depth = -Math.sin(ang);
    const ox = C[0] + Math.cos(ang) * 1.5 * R, oy = C[1] + depth * 0.32 * R + 30;
    const hx = sh.x + 14 * Math.sin((TAU * t) / 6 + i), hy = sh.y + 18 * Math.sin((TAU * t) / 3 + i * 1.7);
    const x = lerp(hx, ox, orbit), y = lerp(hy, oy, orbit);
    const s = sh.s * pop(amount * 1.3 - i * 0.05) * (1 + orbit * 0.25 * depth);
    const behind = orbit > 0.5 && depth < 0;
    if (behind) usedBack = true;
    jelly(behind ? back : front, shapePath(sh.kind, x, y, s, sh.spin * (TAU * t) / 6), x, y, s, JELLY[sh.tone], amount);
  });
  return usedBack;
}

// ---------- 전구 (고치는 중: 고민 끝에 떠오른 생각) ----------
export function drawBulb(g, x, y, s, glow, alpha) {
  if (alpha <= 0.001) return;
  s *= pop(alpha);
  g.save();
  g.globalAlpha *= Math.min(1, alpha);
  const halo = g.createRadialGradient(x, y, s * 0.2, x, y, s * 2.6);
  halo.addColorStop(0, `rgba(255,236,170,${0.6 * glow})`);
  halo.addColorStop(1, "rgba(255,200,230,0)");
  g.fillStyle = halo;
  g.beginPath(); g.arc(x, y, s * 2.6, 0, TAU); g.fill();
  // 빛살
  g.strokeStyle = `rgba(246,195,95,${0.8 * glow})`;
  g.lineCap = "round";
  g.lineWidth = s * 0.12;
  for (let i = -2; i <= 2; i++) {
    const a = -Math.PI / 2 + i * 0.55;
    g.beginPath();
    g.moveTo(x + Math.cos(a) * s * 1.35, y + Math.sin(a) * s * 1.35);
    g.lineTo(x + Math.cos(a) * s * (1.65 + 0.25 * glow), y + Math.sin(a) * s * (1.65 + 0.25 * glow));
    g.stroke();
  }
  g.restore();
  jelly(g, (gg) => {
    gg.beginPath();
    gg.arc(x, y, s, Math.PI * 0.8, Math.PI * 2.2);
    gg.quadraticCurveTo(x + s * 0.55, y + s * 1.0, x + s * 0.42, y + s * 1.3);
    gg.lineTo(x - s * 0.42, y + s * 1.3);
    gg.quadraticCurveTo(x - s * 0.55, y + s * 1.0, x + Math.cos(Math.PI * 0.8) * s, y + Math.sin(Math.PI * 0.8) * s);
    gg.closePath();
  }, x, y, s, JELLY.cream, alpha);
  jelly(g, (gg) => { gg.beginPath(); gg.roundRect(x - s * 0.45, y + s * 1.3, s * 0.9, s * 0.55, s * 0.15); }, x, y + s * 1.55, s * 0.5, JELLY.lavender, alpha, false);
}

// ---------- 연출 중: 구름이 떠다니다 눈을 뜨고 별로 바뀐다 ----------
function starPath(x, y, r, rot) {
  return (g) => {
    g.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = rot - Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.52 : r;
      const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr;
      i ? g.lineTo(px, py) : g.moveTo(px, py);
    }
    g.closePath();
    g.lineJoin = "round";
  };
}
function cloudPath(x, y, s) {
  return (g) => {
    g.beginPath();
    g.moveTo(x - s * 1.1, y + s * 0.45);
    g.arc(x - s * 0.7, y + s * 0.05, s * 0.45, Math.PI * 0.75, Math.PI * 1.6);
    g.arc(x - s * 0.05, y - s * 0.2, s * 0.62, Math.PI * 1.15, Math.PI * 1.95);
    g.arc(x + s * 0.7, y + s * 0.1, s * 0.45, Math.PI * 1.45, Math.PI * 0.3);
    g.lineTo(x - s * 1.1, y + s * 0.45);
    g.closePath();
  };
}
const CLOUDS = [
  { x: 300, y: 230, s: 80, tone: "pink" }, { x: 1470, y: 250, s: 64, tone: "cream" }, { x: 330, y: 840, s: 70, tone: "lavender" },
];
export function drawClouds(g, t, amount, eyes, star) {
  if (amount <= 0.001) return;
  CLOUDS.forEach((c, i) => {
    const x = c.x + 24 * Math.sin((TAU * t) / 6 + i * 2), y = c.y + 12 * Math.sin((TAU * t) / 3 + i);
    const cs = c.s * pop(amount * 1.3 - i * 0.1);
    const k = 1 - star;                                     // 구름이 줄어들며 별이 튀어나온다
    if (k > 0.01) {
      jelly(g, cloudPath(x, y, cs * k), x, y, cs * k, JELLY.cloud, amount);
      if (eyes > 0.01) {
        g.save();
        g.globalAlpha *= amount * eyes;
        g.fillStyle = FACE;
        const blink = Math.abs(Math.sin((TAU * t) / 1.6 + i)) > 0.97 ? 0.2 : 1;
        for (const sx of [-0.25, 0.25]) {
          g.beginPath();
          g.ellipse(x + sx * cs * k, y + 0.05 * cs * k, 0.07 * cs * k, 0.11 * cs * k * eyes * blink, 0, 0, TAU);
          g.fill();
        }
        g.fillStyle = "rgba(247,120,170,0.45)";
        for (const sx of [-0.45, 0.45]) { g.beginPath(); g.ellipse(x + sx * cs * k, y + 0.25 * cs * k, 0.1 * cs * k, 0.06 * cs * k, 0, 0, TAU); g.fill(); }
        g.restore();
      }
    }
    if (star > 0.01) {
      const tw = 0.9 + 0.15 * Math.sin((TAU * t) / 1.2 + i * 2);
      const r = c.s * 0.8 * pop(star) * tw;
      g.save();
      g.globalAlpha *= amount * Math.min(1, star * 1.5);
      const halo = g.createRadialGradient(x, y, r * 0.2, x, y, r * 1.9);
      halo.addColorStop(0, "rgba(255,236,170,0.55)");
      halo.addColorStop(1, "rgba(255,200,230,0)");
      g.fillStyle = halo;
      g.beginPath(); g.arc(x, y, r * 1.9, 0, TAU); g.fill();
      g.restore();
      jelly(g, starPath(x, y, r, Math.sin((TAU * t) / 6 + i) * 0.25), x, y, r, JELLY[c.tone], amount * Math.min(1, star * 1.5));
    }
  });
}

// ---------- 연출 중: 위에서 비추는 조명 (몸 뒤에 그린다) ----------
export function drawSpotlight(g, C, R, amount) {
  if (amount <= 0.001) return false;
  g.save();
  g.globalAlpha *= amount;
  const top = [C[0] + 60, -140], half = R * 1.25, bottom = C[1] + R * 1.05;
  const grd = g.createLinearGradient(0, top[1], 0, bottom);
  grd.addColorStop(0, "rgba(255,246,214,0.85)");
  grd.addColorStop(1, "rgba(255,226,240,0.18)");
  g.fillStyle = grd;
  g.beginPath();
  g.moveTo(top[0] - 40, top[1]);
  g.lineTo(top[0] + 40, top[1]);
  g.lineTo(C[0] + half, bottom);
  g.lineTo(C[0] - half, bottom);
  g.closePath();
  g.fill();
  const floor = g.createRadialGradient(C[0], bottom, 0, C[0], bottom, half);
  floor.addColorStop(0, "rgba(255,236,190,0.6)");
  floor.addColorStop(1, "rgba(255,236,190,0)");
  g.fillStyle = floor;
  g.beginPath(); g.ellipse(C[0], bottom, half, half * 0.18, 0, 0, TAU); g.fill();
  g.restore();
  return true;
}

// ---------- 표정: "오" 입, 웃는 입, 웃는 눈(∩) ----------
export function drawFace(g, eyes, look, P) {
  const mx = (eyes[0].cx + eyes[1].cx) / 2 + look[0] * 0.6, my = (eyes[0].cy + eyes[1].cy) / 2 + 150 + look[1] * 0.5;
  g.save();
  g.lineCap = "round";
  if (P.happy > 0.01) {
    g.strokeStyle = FACE;
    g.globalAlpha *= Math.min(1, P.happy * 1.4);
    g.lineWidth = 15;
    for (const e of eyes) {
      g.beginPath();
      g.arc(e.cx + look[0], e.cy + look[1] + 22, e.rx * 1.05, Math.PI * 1.15, Math.PI * 1.85);
      g.stroke();
    }
    g.globalAlpha /= Math.min(1, P.happy * 1.4) || 1;
  }
  if (P.mouthO > 0.01) {
    const k = pop(P.mouthO);
    g.fillStyle = FACE;
    g.beginPath(); g.ellipse(mx, my, 30 * k, 38 * k, 0, 0, TAU); g.fill();
    g.fillStyle = "rgba(240,110,160,0.9)";
    g.beginPath(); g.ellipse(mx, my + 16 * k, 18 * k, 12 * k, 0, 0, TAU); g.fill();
  }
  if (P.smile > 0.01) {
    g.strokeStyle = FACE;
    g.globalAlpha *= Math.min(1, P.smile * 1.4);
    g.lineWidth = 12;
    g.beginPath();
    g.arc(mx, my - 30, 38, Math.PI * 0.22, Math.PI * 0.78);
    g.stroke();
  }
  g.restore();
}
