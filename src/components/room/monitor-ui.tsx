
/**
 * What the monitor shows, drawn in HTML/SVG rather than a screenshot, so it
 * stays sharp however far the camera zooms in. It reproduces the first frame
 * of the live portfolio (same camera, same platforms, same chrome) so the
 * hand-over to the 3D view is a cross-fade between two matching pictures.
 */
export const MONITOR = { w: 1418, h: 800 };

// Kept light on purpose (no project data in the room's bundle); mirrors
// STACKS in portfolio/db-data.ts.
const STACKS = [
  { id: "systems", name: "Systems & tools", color: "#8B6CFF", count: 3 },
  { id: "public", name: "Public & culture", color: "#3E9BE0", count: 2 },
  { id: "brand", name: "Brand & identity", color: "#F2A33A", count: 2 },
  { id: "business", name: "Business websites", color: "#E8606F", count: 3 },
];

// Same numbers as the live view (db-canvas.tsx).
const LAYOUT: [number, number][] = [
  [-15, -3],
  [3, -14],
  [16, 1],
  [0, 13],
];
const R = 3;
const SIZE = R * 2 + 3;
const CAM = { r: 70, phi: 0.95, theta: 0.6, fov: 32, target: [0, 3, 0] as const };

type V3 = [number, number, number];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
  const l = Math.hypot(...a);
  return [a[0] / l, a[1] / l, a[2] / l];
};

const T: V3 = [...CAM.target];
const C: V3 = [
  T[0] + CAM.r * Math.sin(CAM.phi) * Math.sin(CAM.theta),
  T[1] + CAM.r * Math.cos(CAM.phi),
  T[2] + CAM.r * Math.sin(CAM.phi) * Math.cos(CAM.theta),
];
const F = norm(sub(T, C));
const RIGHT = norm(cross(F, [0, 1, 0]));
const UP = cross(RIGHT, F);
const TAN = Math.tan((CAM.fov * Math.PI) / 360);
const ASPECT = MONITOR.w / MONITOR.h;

function project(p: V3): [number, number] {
  const d = sub(p, C);
  const z = dot(d, F);
  const x = dot(d, RIGHT) / (z * TAN * ASPECT);
  const y = dot(d, UP) / (z * TAN);
  return [((x + 1) / 2) * MONITOR.w, ((1 - y) / 2) * MONITOR.h];
}
const pts = (ps: V3[]) => ps.map((p) => project(p).map((n) => n.toFixed(1)).join(",")).join(" ");

const RING = Array.from({ length: 121 }, (_, i) => {
  const a = (i / 120) * Math.PI * 2;
  return [Math.cos(a) * 34, 0, Math.sin(a) * 34 * 0.92] as V3;
});

const PLATFORMS = STACKS.map((s, i) => {
  const [ox, oz] = LAYOUT[i];
  const h = SIZE / 2;
  const y = 0.25;
  const corners: V3[] = [
    [ox - h, y, oz - h],
    [ox + h, y, oz - h],
    [ox + h, y, oz + h],
    [ox - h, y, oz + h],
  ];
  const grid: [V3, V3][] = [];
  for (let k = 1; k < 8; k++) {
    const t = -h + (k / 8) * SIZE;
    grid.push([[ox + t, y, oz - h], [ox + t, y, oz + h]]);
    grid.push([[ox - h, y, oz + t], [ox + h, y, oz + t]]);
  }
  const [cx, cy] = project([ox, 0, oz]);
  return { color: s.color, corners, grid, cx, cy };
});

export function MonitorUI() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#07060d] font-mono text-white" style={{ width: MONITOR.w, height: MONITOR.h }}>
      <svg viewBox={`0 0 ${MONITOR.w} ${MONITOR.h}`} className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          {PLATFORMS.map((p, i) => (
            <radialGradient key={i} id={`haze${i}`}>
              <stop offset="0" stopColor={p.color} stopOpacity="0.32" />
              <stop offset="1" stopColor={p.color} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>
        <polyline points={pts(RING)} fill="none" stroke="#6d6a9c" strokeOpacity="0.45" strokeWidth="1.2" strokeDasharray="6 8" />
        {PLATFORMS.map((p, i) => (
          <g key={i}>
            <ellipse cx={p.cx} cy={p.cy} rx="190" ry="110" fill={`url(#haze${i})`} />
            <polygon points={pts(p.corners)} fill={p.color} fillOpacity="0.09" stroke={p.color} strokeOpacity="0.75" strokeWidth="1.4" />
            {p.grid.map(([a, b], k) => (
              <polyline key={k} points={pts([a, b])} stroke={p.color} strokeOpacity="0.14" strokeWidth="1" />
            ))}
          </g>
        ))}
        <circle cx="270" cy="105" r="9" fill="#ff4d6d" opacity="0.8" />
        <circle cx="1220" cy="690" r="7" fill="#5b8cff" opacity="0.7" />
      </svg>

      {/* Sidebar, same as the live view */}
      <div className="absolute bottom-3 left-3 top-3 flex w-[264px] flex-col rounded-2xl border border-white/10 bg-[rgba(12,11,22,0.78)]">
        <div className="flex items-center gap-3 border-b border-white/10 p-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-[18px]">←</span>
          <span>
            <span className="block font-sans text-[16px] font-medium">Portfolio</span>
            <span className="block text-[11px] text-white/45">~/codedesk/work.db</span>
          </span>
        </div>
        <span className="m-3 flex h-9 items-center gap-2 rounded-xl border border-white/10 px-3 text-[12px] text-white/35">⌕ Search project…</span>
        <ul className="px-2 text-[12.5px]">
          {STACKS.map((s) => (
            <li key={s.id} className="flex h-8 items-center gap-2 px-2">
              <span className="w-3 text-white/40">›</span>
              <span className="h-2.5 w-3 rounded-[2px]" style={{ background: s.color }} />
              <span className="flex-1">{s.name.toLowerCase()}</span>
              <span className="text-white/40">{s.count}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex items-baseline gap-5 border-t border-white/10 px-4 py-3">
          <span>
            <span className="font-sans text-[22px] font-medium">{STACKS.length}</span>
            <span className="ml-1.5 text-[11px] text-white/45">databases</span>
          </span>
          <span>
            <span className="font-sans text-[22px] font-medium">{STACKS.reduce((n, s) => n + s.count, 0)}</span>
            <span className="ml-1.5 text-[11px] text-white/45">projects</span>
          </span>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1 rounded-2xl border border-white/10 bg-[rgba(12,11,22,0.78)] p-1 text-[11.5px]">
        {["Data lines", "Labels", "Auto-rotate"].map((t) => (
          <span key={t} className="flex h-8 items-center rounded-xl bg-violet-500/80 px-3">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
