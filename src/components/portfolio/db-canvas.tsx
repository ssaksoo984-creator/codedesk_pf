"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { STACKS } from "./db-data";
import { newestFirst } from "./project-list";

const BG = 0x07060d;
const LAYOUT: [number, number][] = [
  [-15, -3],
  [3, -14],
  [16, 1],
  [0, 13],
];
const R = 3; // disc radius
const DH = 0.8; // disc height
const GAP = 0.55; // gap between discs when stacked
const SPLIT = 3.4; // gap when the stack is split open
const BASE = 0.6;

interface Api {
  open: (stackId: string | null) => void;
  select: (projectId: string | null) => void;
  setFlow: (on: boolean) => void;
  setLabels: (on: boolean) => void;
  setSpin: (on: boolean) => void;
}

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grd.addColorStop(0, "rgba(255,255,255,0.9)");
  grd.addColorStop(0.35, "rgba(255,255,255,0.35)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const ease = (x: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, x)), 3);
const easeIO = (x: number) => {
  const c = Math.min(1, Math.max(0, x));
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

/**
 * Portfolio as data: each category is a database drawn as a stack of glowing
 * discs, one disc per project. On open the platforms trace in and the discs
 * drop into place one by one. Clicking a stack splits it apart so every
 * project gets its own layer and label; clicking a layer selects it.
 */
export function DbCanvas({
  stack,
  project,
  onStack,
  onProject,
  flow,
  labels,
  spin,
  onReady,
}: {
  stack: string | null;
  project: string | null;
  onStack: (id: string | null) => void;
  onProject: (id: string | null) => void;
  flow: boolean;
  labels: boolean;
  spin: boolean;
  /** Called once the first frames are on screen. */
  onReady?: () => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const labelLayer = useRef<HTMLDivElement>(null);
  const api = useRef<Api | null>(null);
  const cb = useRef({ onStack, onProject, stack, project, onReady });
  useEffect(() => {
    cb.current = { onStack, onProject, stack, project, onReady };
  });

  useEffect(() => {
    const host = wrap.current!;
    const layer = labelLayer.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // "#city-still" freezes the first moment (platforms, no discs yet) — used
    // to capture the picture shown on the room's monitor.
    const still = location.hash === "#city-still";
    const small = innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
    renderer.setClearColor(BG, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.prepend(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);
    scene.fog = new THREE.FogExp2(BG, 0.008);
    const camera = new THREE.PerspectiveCamera(small ? 44 : 32, 1, 0.1, 600);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    controls.minDistance = 22;
    controls.maxDistance = 120;
    controls.minPolarAngle = 0.45;
    controls.maxPolarAngle = 1.25;
    controls.autoRotate = !reduce && !still;
    controls.autoRotateSpeed = 0.3;
    controls.target.set(0, 3, 0);
    const HOME_R = small ? 92 : 70;
    camera.position.setFromSpherical(new THREE.Spherical(HOME_R, 0.95, 0.6)).add(controls.target);
    camera.lookAt(controls.target);

    const glow = glowTexture();
    const disposables: { dispose: () => void }[] = [glow];
    type Fade = { mat: THREE.Material & { opacity: number }; to: number };

    // Stars
    {
      const n = 600;
      const pts = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const r = 160 + Math.random() * 200;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.random() * Math.PI * 0.5;
        pts[i * 3] = r * Math.sin(ph) * Math.cos(th);
        pts[i * 3 + 1] = r * Math.cos(ph) * 0.6 + 10;
        pts[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pts, 3));
      const m = new THREE.PointsMaterial({ color: 0x8f86c9, size: 0.9, transparent: true, opacity: 0.55, fog: false });
      scene.add(new THREE.Points(g, m));
      disposables.push(g, m);
    }

    // Dashed orbit + travelling lights
    const ringR = 34;
    const ringPts = new THREE.EllipseCurve(0, 0, ringR, ringR * 0.92, 0, Math.PI * 2).getPoints(200).map((p) => new THREE.Vector3(p.x, 0, p.y));
    const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPts);
    const ringMat = new THREE.LineDashedMaterial({ color: 0x6d6a9c, dashSize: 1.2, gapSize: 1.6, transparent: true, opacity: 0.45 });
    const ring = new THREE.Line(ringGeo, ringMat);
    ring.computeLineDistances();
    scene.add(ring);
    disposables.push(ringGeo, ringMat);
    const orbiters = [0x5b8cff, 0xff4d6d].map((c, i) => {
      const m = new THREE.SpriteMaterial({ map: glow, color: c, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
      const s = new THREE.Sprite(m);
      s.scale.set(3.2, 3.2, 1);
      scene.add(s);
      disposables.push(m);
      return { s, phase: i * Math.PI };
    });

    // Stacks
    type Disc = {
      id: string;
      stackId: string;
      i: number;
      group: THREE.Group;
      fill: THREE.MeshBasicMaterial;
      rim: THREE.LineBasicMaterial;
      hit: THREE.Mesh;
      label: HTMLDivElement;
      color: THREE.Color;
      drop: number; // build start time
      y: number; // current animated y
    };
    type StackObj = {
      id: string;
      pos: THREE.Vector3;
      discs: Disc[];
      fades: Fade[];
      start: number;
      label: HTMLDivElement;
      top: THREE.Vector3;
      split: number; // 0 stacked → 1 split
    };
    const stacks: StackObj[] = [];
    const discs: Disc[] = [];
    const hits: THREE.Mesh[] = [];
    let dropIndex = 0;

    STACKS.forEach((st, si) => {
      const color = new THREE.Color(st.color);
      const [ox, oz] = LAYOUT[si];
      const group = new THREE.Group();
      group.position.set(ox, 0, oz);
      scene.add(group);
      const size = R * 2 + 3;

      const hazeGeo = new THREE.PlaneGeometry(size * 2.6, size * 2.6);
      const hazeMat = new THREE.MeshBasicMaterial({ map: glow, color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
      const haze = new THREE.Mesh(hazeGeo, hazeMat);
      haze.rotation.x = -Math.PI / 2;
      haze.position.y = -0.4;
      group.add(haze);

      const platGeo = new THREE.BoxGeometry(size, 0.5, size);
      const platMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
      group.add(new THREE.Mesh(platGeo, platMat));
      const platEdgeGeo = new THREE.EdgesGeometry(platGeo);
      const platEdgeMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0 });
      group.add(new THREE.LineSegments(platEdgeGeo, platEdgeMat));
      const grid = new THREE.GridHelper(size, 8, color, color);
      const gridMat = grid.material as THREE.LineBasicMaterial;
      gridMat.transparent = true;
      gridMat.opacity = 0;
      grid.position.y = 0.26;
      group.add(grid);
      disposables.push(hazeGeo, hazeMat, platGeo, platMat, platEdgeGeo, platEdgeMat, grid.geometry, gridMat);

      const label = document.createElement("div");
      label.className = "absolute left-0 top-0 whitespace-nowrap font-mono text-[11px] leading-tight text-white/55 transition-opacity duration-300";
      label.innerHTML = `<b class="font-sans text-[13px] font-medium text-white/90">${st.name}</b><br/>${st.projects.length} project${st.projects.length > 1 ? "s" : ""}`;
      label.style.opacity = "0";
      layer.appendChild(label);

      const so: StackObj = {
        id: st.id,
        pos: group.position.clone(),
        discs: [],
        start: 0.1 + si * 0.14,
        fades: [
          { mat: hazeMat, to: 0.09 },
          { mat: platMat, to: 0.09 },
          { mat: platEdgeMat, to: 0.7 },
          { mat: gridMat, to: 0.12 },
        ],
        label,
        top: new THREE.Vector3(ox, 0, oz),
        split: 0,
      };

      // oldest at the bottom, the newest on top of the stack
      newestFirst(st.projects).reverse().forEach((p, i) => {
        const g = new THREE.Group();
        group.add(g);
        const geo = new THREE.CylinderGeometry(R, R, DH, 56, 1, false);
        const fill = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
        const body = new THREE.Mesh(geo, fill);
        g.add(body);
        const rimGeo = new THREE.EdgesGeometry(geo, 30);
        const rim = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0 });
        g.add(new THREE.LineSegments(rimGeo, rim));
        // an inner ring on the top face, the classic "database" read
        const innerGeo = new THREE.RingGeometry(R * 0.55, R * 0.58, 48);
        const inner = new THREE.Mesh(innerGeo, rim);
        inner.rotation.x = -Math.PI / 2;
        inner.position.y = DH / 2 + 0.01;
        g.add(inner);
        // invisible, slightly larger hit target
        const hitGeo = new THREE.CylinderGeometry(R * 1.05, R * 1.05, DH + GAP, 16);
        const hit = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ visible: false }));
        hit.userData = { project: p.index, stack: st.id };
        g.add(hit);
        hits.push(hit);
        disposables.push(geo, fill, rimGeo, rim, innerGeo, hitGeo, hit.material as THREE.Material);

        const lab = document.createElement("div");
        lab.className = "absolute left-0 top-0 whitespace-nowrap rounded-lg px-2 py-1 font-mono text-[11px] leading-tight transition-opacity duration-300";
        lab.style.opacity = "0";
        lab.innerHTML = `<b class="font-sans text-[13px] font-medium text-white">${p.title.en}</b><br/><span class="text-white/55">${p.year ?? p.stage?.en ?? ""}</span>`;
        layer.appendChild(lab);

        const d: Disc = {
          id: p.index,
          stackId: st.id,
          i,
          group: g,
          fill,
          rim,
          hit,
          label: lab,
          color,
          drop: 0.75 + dropIndex++ * 0.2,
          y: BASE + i * (DH + GAP) + DH / 2,
        };
        so.discs.push(d);
        discs.push(d);
      });
      stacks.push(so);
    });

    // Data lines between stacks
    const flowGroup = new THREE.Group();
    scene.add(flowGroup);
    const travellers: { s: THREE.Sprite; curve: THREE.QuadraticBezierCurve3; t: number }[] = [];
    const flowLines: { g: THREE.BufferGeometry; n: number }[] = [];
    const topOf = (s: StackObj) => new THREE.Vector3(s.pos.x, BASE + s.discs.length * (DH + GAP), s.pos.z);
    [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [0, 2],
    ].forEach(([a, b]) => {
      const A = topOf(stacks[a]);
      const B = topOf(stacks[b]);
      const mid = A.clone().lerp(B, 0.5);
      mid.y = Math.max(A.y, B.y) + 4 + A.distanceTo(B) * 0.15;
      const curve = new THREE.QuadraticBezierCurve3(A, mid, B);
      const pts = curve.getPoints(48);
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      const ca = new THREE.Color(STACKS[a].color);
      const cbb = new THREE.Color(STACKS[b].color);
      const colors = new Float32Array(pts.length * 3);
      pts.forEach((_, i) => {
        const c = ca.clone().lerp(cbb, i / (pts.length - 1));
        colors.set([c.r, c.g, c.b], i * 3);
      });
      g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      g.setDrawRange(0, 0);
      const m = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.45 });
      flowGroup.add(new THREE.Line(g, m));
      flowLines.push({ g, n: pts.length });
      const sm = new THREE.SpriteMaterial({ map: glow, color: ca, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
      const s = new THREE.Sprite(sm);
      s.scale.set(1.2, 1.2, 1);
      s.visible = false;
      flowGroup.add(s);
      travellers.push({ s, curve, t: Math.random() });
      disposables.push(g, m, sm);
    });

    // Post
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), small ? 0.45 : 0.55, 0.4, 0.22));
    composer.addPass(new OutputPass());

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = w + "px";
      renderer.domElement.style.height = h + "px";
      composer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // State
    let openId: string | null = null;
    let selId: string | null = null;
    let hoverId: string | null = null; // project id
    let showLabels = true;
    const camMove = { t: 1, fromT: new THREE.Vector3(), toT: new THREE.Vector3(0, 3, 0), fromR: HOME_R, toR: HOME_R };
    const moveCamera = (target: THREE.Vector3, r: number) => {
      camMove.t = 0;
      camMove.fromT.copy(controls.target);
      camMove.toT.copy(target);
      camMove.fromR = camera.position.distanceTo(controls.target);
      camMove.toR = r;
    };

    // Picking
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const pick = (e: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const h = ray.intersectObjects(hits, false)[0];
      return h ? (h.object.userData as { project: string; stack: string }) : null;
    };
    let down: { x: number; y: number } | null = null;
    const onDown = (e: PointerEvent) => {
      down = { x: e.clientX, y: e.clientY };
      controls.autoRotate = false;
    };
    const onUp = (e: PointerEvent) => {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) {
        down = null;
        return;
      }
      down = null;
      const h = pick(e);
      if (!h) {
        cb.current.onProject(null);
        cb.current.onStack(null);
      } else if (cb.current.stack !== h.stack) {
        cb.current.onStack(h.stack);
        cb.current.onProject(null);
      } else {
        cb.current.onProject(h.project);
      }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const h = pick(e);
      const id = h ? (openId === h.stack ? h.project : `stack:${h.stack}`) : null;
      if (id !== hoverId) {
        hoverId = id;
        renderer.domElement.style.cursor = h ? "pointer" : "grab";
      }
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.style.cursor = "grab";

    api.current = {
      open(id) {
        if (id === openId) return;
        openId = id;
        const s = stacks.find((x) => x.id === id);
        if (s) {
          const h = BASE + s.discs.length * (DH + SPLIT);
          moveCamera(new THREE.Vector3(s.pos.x, h * 0.45, s.pos.z), small ? 52 : 34);
        } else {
          moveCamera(new THREE.Vector3(0, 3, 0), HOME_R);
        }
      },
      select(id) {
        selId = id;
      },
      setFlow(on) {
        flowGroup.visible = on;
      },
      setLabels(on) {
        showLabels = on;
        layer.style.opacity = on ? "1" : "0";
      },
      setSpin(on) {
        controls.autoRotate = on && !reduce;
      },
    };

    // Loop
    const clock = new THREE.Clock();
    const t0 = performance.now();
    let raf = 0;
    const v = new THREE.Vector3();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, clock.getDelta());
      const el = clock.elapsedTime;
      const bt = reduce ? 99 : still ? 0.7 : (performance.now() - t0) / 1000;

      // Platforms trace in
      stacks.forEach((s) => {
        const e = ease((bt - s.start) / 0.6);
        s.fades.forEach((f) => (f.mat.opacity = f.to * e));
      });

      // Split / stack, and the drop-in build
      stacks.forEach((s) => {
        const goal = openId === s.id ? 1 : 0;
        s.split += (goal - s.split) * Math.min(1, dt * 5);
        const dim = openId && openId !== s.id ? 0.35 : 1;
        s.discs.forEach((d) => {
          const restY = BASE + d.i * (DH + GAP + (SPLIT - GAP) * easeIO(s.split)) + DH / 2;
          const k = (bt - d.drop) / 0.7;
          const built = ease(k);
          const y = restY + (1 - built) * 7;
          d.group.position.set(0, y, 0);
          // when split open, layers slide out a little and turn to read as a list
          d.group.position.x = Math.sin(d.i * 1.3) * 0.6 * s.split;
          const on = selId === d.id;
          const hv = hoverId === d.id || hoverId === `stack:${s.id}`;
          d.fill.opacity = built * dim * (on ? 0.45 : hv ? 0.22 : 0.08);
          d.rim.opacity = built * dim * (on || hv ? 1 : 0.85);
          d.rim.color.copy(on ? new THREE.Color(0xffffff) : d.color);
          d.y = y;
        });
      });

      // Data lines draw after the last disc lands
      const flowStart = 0.75 + discs.length * 0.2 + 0.3;
      const fe = ease((bt - flowStart) / 1.4);
      flowLines.forEach((l) => l.g.setDrawRange(0, Math.ceil(l.n * fe)));
      travellers.forEach((tr) => {
        tr.s.visible = fe >= 1;
        tr.t = (tr.t + dt * 0.18) % 1;
        tr.curve.getPoint(tr.t, tr.s.position);
      });
      orbiters.forEach((o) => {
        const a = el * 0.12 + o.phase;
        o.s.position.set(Math.cos(a) * ringR, 0.4, Math.sin(a) * ringR * 0.92);
      });

      // Camera moves between overview and an open stack
      if (camMove.t < 1) {
        camMove.t = Math.min(1, camMove.t + dt / 1.1);
        const e = easeIO(camMove.t);
        controls.target.lerpVectors(camMove.fromT, camMove.toT, e);
        const dir = camera.position.clone().sub(controls.target).normalize();
        camera.position.copy(controls.target).addScaledVector(dir, camMove.fromR + (camMove.toR - camMove.fromR) * e);
      }
      controls.update();

      // Labels
      if (showLabels) {
        const w = host.clientWidth;
        const h = host.clientHeight;
        const place = (lab: HTMLElement, p: THREE.Vector3, o: number) => {
          v.copy(p).project(camera);
          lab.style.display = v.z < 1 ? "block" : "none";
          lab.style.transform = `translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px)`;
          lab.style.opacity = String(o);
        };
        stacks.forEach((s) => {
          const lastDrop = s.discs[s.discs.length - 1]?.drop ?? 1;
          place(s.label, v.set(s.pos.x + R + 2, 0, s.pos.z + R + 2).clone(), ease((bt - lastDrop - 0.4) / 0.5) * (1 - s.split));
          s.discs.forEach((d) => {
            const sel = selId === d.id;
            place(d.label, new THREE.Vector3(s.pos.x + R + 0.8, d.y, s.pos.z), s.split > 0.6 ? (s.split - 0.6) / 0.4 : 0);
            d.label.style.background = sel ? "rgba(139,108,255,0.35)" : "transparent";
          });
        });
      }
      composer.render();
    };
    tick();
    // Two frames in, the scene (shaders compiled, first composite done) is real.
    let readyRaf = requestAnimationFrame(() => {
      readyRaf = requestAnimationFrame(() => cb.current.onReady?.());
    });

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(readyRaf);
      ro.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointermove", onMove);
      disposables.forEach((d) => d.dispose());
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      layer.replaceChildren();
      api.current = null;
    };
  }, []);

  useEffect(() => api.current?.open(stack), [stack]);
  useEffect(() => api.current?.select(project), [project]);
  useEffect(() => api.current?.setFlow(flow), [flow]);
  useEffect(() => api.current?.setLabels(labels), [labels]);
  useEffect(() => api.current?.setSpin(spin), [spin]);

  return (
    <div ref={wrap} className="absolute inset-0 overflow-hidden">
      <div ref={labelLayer} className="pointer-events-none absolute inset-0 transition-opacity duration-300" />
    </div>
  );
}
