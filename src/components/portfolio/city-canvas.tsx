"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { DISTRICTS } from "./tale-data";

const BG = 0x07060d;
const LAYOUT: [number, number][] = [
  [-17, -3],
  [0, -15],
  [17, -4],
  [10, 13],
  [-9, 14],
];
const SPACING = 3.6;
const FOOT = 2.3;
const UNIT = 2.6;

interface Api {
  select: (id: string | null) => void;
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

/** Codebase-City-style view: districts on glowing platforms, screens as
 * translucent towers, flow arcs between them. Drag to orbit, scroll to zoom,
 * click a tower to select it. */
export function CityCanvas({
  selected,
  onSelect,
  flow,
  labels,
  spin,
}: {
  selected: string | null;
  onSelect: (id: string | null) => void;
  flow: boolean;
  labels: boolean;
  spin: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const labelLayer = useRef<HTMLDivElement>(null);
  const api = useRef<Api | null>(null);
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const host = wrap.current!;
    const layer = labelLayer.current!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
    renderer.setClearColor(BG, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.prepend(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(BG, 0.0085);
    const camera = new THREE.PerspectiveCamera(small ? 42 : 32, 1, 0.1, 600);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.enablePan = false;
    controls.minDistance = 28;
    controls.maxDistance = 120;
    controls.minPolarAngle = 0.45;
    controls.maxPolarAngle = 1.2;
    controls.autoRotate = !reduce;
    controls.autoRotateSpeed = 0.35;
    controls.target.set(0, 2, 0);

    // Final camera pose; the intro flies in from further out.
    const sph = new THREE.Spherical(small ? 92 : 74, 0.92, 0.6);
    const startR = reduce ? sph.radius : sph.radius * 1.9;
    const setCam = (r: number) => {
      const s = new THREE.Spherical(r, sph.phi, sph.theta);
      camera.position.setFromSpherical(s).add(controls.target);
      camera.lookAt(controls.target);
    };
    setCam(startR);

    const glow = glowTexture();
    const disposables: { dispose: () => void }[] = [glow];
    const towers: THREE.Mesh[] = [];
    const towerById = new Map<string, { mesh: THREE.Mesh; edges: THREE.LineSegments; top: THREE.Vector3; color: THREE.Color }>();
    const labelEls: { el: HTMLDivElement; pos: THREE.Vector3 }[] = [];

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
      const m = new THREE.PointsMaterial({ color: 0x8f86c9, size: 0.9, sizeAttenuation: true, transparent: true, opacity: 0.55, fog: false });
      scene.add(new THREE.Points(g, m));
      disposables.push(g, m);
    }

    // Dashed orbit ring + two travelling lights
    const ringR = 36;
    const ringCurve = new THREE.EllipseCurve(0, 0, ringR, ringR * 0.92, 0, Math.PI * 2);
    const ringPts = ringCurve.getPoints(200).map((p) => new THREE.Vector3(p.x, 0, p.y));
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

    // Districts
    DISTRICTS.forEach((d, di) => {
      const color = new THREE.Color(d.color);
      const [ox, oz] = LAYOUT[di];
      const n = d.buildings.length;
      const cols = Math.ceil(Math.sqrt(n));
      const rows = Math.ceil(n / cols);
      const w = cols * SPACING + 1.6;
      const dp = rows * SPACING + 1.6;
      const group = new THREE.Group();
      group.position.set(ox, 0, oz);
      scene.add(group);

      // haze under the district
      const hazeGeo = new THREE.PlaneGeometry(w * 2.4, dp * 2.4);
      const hazeMat = new THREE.MeshBasicMaterial({ map: glow, color, transparent: true, opacity: 0.13, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
      const haze = new THREE.Mesh(hazeGeo, hazeMat);
      haze.rotation.x = -Math.PI / 2;
      haze.position.y = -0.4;
      group.add(haze);
      disposables.push(hazeGeo, hazeMat);

      // platform
      const platGeo = new THREE.BoxGeometry(w, 0.6, dp);
      const platMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending, depthWrite: false });
      const plat = new THREE.Mesh(platGeo, platMat);
      plat.position.y = 0;
      group.add(plat);
      const platEdgeGeo = new THREE.EdgesGeometry(platGeo);
      const platEdgeMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 });
      const platEdge = new THREE.LineSegments(platEdgeGeo, platEdgeMat);
      group.add(platEdge);
      const grid = new THREE.GridHelper(Math.max(w, dp), Math.round(Math.max(w, dp) / 1.2), color, color);
      (grid.material as THREE.Material).transparent = true;
      (grid.material as THREE.Material).opacity = 0.12;
      grid.scale.set(w / Math.max(w, dp), 1, dp / Math.max(w, dp));
      grid.position.y = 0.31;
      group.add(grid);
      disposables.push(platGeo, platMat, platEdgeGeo, platEdgeMat, grid.geometry, grid.material as THREE.Material);

      d.buildings.forEach((b, bi) => {
        const cx = (bi % cols) * SPACING - ((cols - 1) * SPACING) / 2;
        const cz = Math.floor(bi / cols) * SPACING - ((rows - 1) * SPACING) / 2;
        const H = b.h * UNIT;
        const geo = new THREE.BoxGeometry(FOOT, H, FOOT);
        const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(cx, H / 2 + 0.3, cz);
        mesh.userData.id = b.id;
        group.add(mesh);
        const eg = new THREE.EdgesGeometry(geo);
        const em = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85 });
        const edges = new THREE.LineSegments(eg, em);
        edges.position.copy(mesh.position);
        group.add(edges);
        // a few floor lines for the "building" read
        for (let f = 1; f < b.h * 2; f++) {
          const y = f * (UNIT / 2) - H / 2;
          const fg = new THREE.EdgesGeometry(new THREE.PlaneGeometry(FOOT, FOOT));
          const fm = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.18 });
          const fl = new THREE.LineSegments(fg, fm);
          fl.rotation.x = -Math.PI / 2;
          fl.position.set(cx, H / 2 + 0.3 + y, cz);
          group.add(fl);
          disposables.push(fg, fm);
        }
        towers.push(mesh);
        towerById.set(b.id, { mesh, edges, top: new THREE.Vector3(ox + cx, H + 0.3, oz + cz), color });
        disposables.push(geo, mat, eg, em);
      });

      const el = document.createElement("div");
      el.className = "absolute left-0 top-0 whitespace-nowrap font-mono text-[11px] leading-tight text-white/55";
      el.innerHTML = `<b class="font-sans text-[13px] font-medium text-white/90">${d.name}</b><br/>${n} screen${n > 1 ? "s" : ""}`;
      layer.appendChild(el);
      labelEls.push({ el, pos: new THREE.Vector3(ox + w / 2 + 0.6, 0, oz + dp / 2 + 0.6) });
    });

    // Flow arcs, each with a travelling light
    const flowGroup = new THREE.Group();
    scene.add(flowGroup);
    const travellers: { s: THREE.Sprite; curve: THREE.QuadraticBezierCurve3; t: number }[] = [];
    DISTRICTS.forEach((d) =>
      d.buildings.forEach((b) =>
        (b.next ?? []).forEach((to) => {
          const a = towerById.get(b.id);
          const z = towerById.get(to);
          if (!a || !z) return;
          const mid = a.top.clone().lerp(z.top, 0.5);
          mid.y = Math.max(a.top.y, z.top.y) + 3 + a.top.distanceTo(z.top) * 0.18;
          const curve = new THREE.QuadraticBezierCurve3(a.top, mid, z.top);
          const pts = curve.getPoints(48);
          const g = new THREE.BufferGeometry().setFromPoints(pts);
          const colors = new Float32Array(pts.length * 3);
          pts.forEach((_, i) => {
            const c = a.color.clone().lerp(z.color, i / (pts.length - 1));
            colors.set([c.r, c.g, c.b], i * 3);
          });
          g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
          const m = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.55 });
          flowGroup.add(new THREE.Line(g, m));
          const sm = new THREE.SpriteMaterial({ map: glow, color: a.color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
          const s = new THREE.Sprite(sm);
          s.scale.set(1.1, 1.1, 1);
          flowGroup.add(s);
          travellers.push({ s, curve, t: Math.random() });
          disposables.push(g, m, sm);
        })
      )
    );

    // Post: bloom
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), small ? 0.55 : 0.7, 0.45, 0.12);
    composer.addPass(bloom);
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

    // Selection & hover
    let selectedId: string | null = null;
    let hoverId: string | null = null;
    const paint = () => {
      towerById.forEach((t, id) => {
        const on = id === selectedId;
        const hv = id === hoverId;
        (t.mesh.material as THREE.MeshBasicMaterial).opacity = on ? 0.6 : hv ? 0.32 : selectedId ? 0.09 : 0.16;
        (t.edges.material as THREE.LineBasicMaterial).color.copy(on ? new THREE.Color(0xffffff) : t.color);
        (t.edges.material as THREE.LineBasicMaterial).opacity = on || hv ? 1 : selectedId ? 0.45 : 0.85;
      });
    };
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const pick = (e: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(towers, false)[0];
      return (hit?.object.userData.id as string) ?? null;
    };
    let down: { x: number; y: number } | null = null;
    const onDown = (e: PointerEvent) => {
      down = { x: e.clientX, y: e.clientY };
      controls.autoRotate = false;
    };
    const onUp = (e: PointerEvent) => {
      if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 6) onSelectRef.current(pick(e));
      down = null;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const id = pick(e);
      if (id !== hoverId) {
        hoverId = id;
        renderer.domElement.style.cursor = id ? "pointer" : "grab";
        paint();
      }
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    renderer.domElement.addEventListener("pointerup", onUp);
    renderer.domElement.addEventListener("pointermove", onMove);
    renderer.domElement.style.cursor = "grab";

    let showLabels = true;
    let spinOn = !reduce;
    const focus = new THREE.Vector3(0, 2, 0);
    api.current = {
      select(id) {
        selectedId = id;
        paint();
        const t = id ? towerById.get(id) : null;
        focus.set(t ? t.top.x * 0.6 : 0, 2, t ? t.top.z * 0.6 : 0);
      },
      setFlow(on) {
        flowGroup.visible = on;
      },
      setLabels(on) {
        showLabels = on;
        layer.style.opacity = on ? "1" : "0";
      },
      setSpin(on) {
        spinOn = on && !reduce;
        controls.autoRotate = spinOn;
      },
    };

    // Loop
    const clock = new THREE.Clock();
    const t0 = performance.now();
    let raf = 0;
    const v = new THREE.Vector3();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = clock.getDelta();
      const el = clock.elapsedTime;
      const k = Math.min(1, (performance.now() - t0) / 1900);
      if (k < 1) {
        const e = 1 - Math.pow(1 - k, 3);
        setCam(startR + (sph.radius - startR) * e);
      }
      controls.target.lerp(focus, 0.04);
      if (k >= 1) controls.update();
      else camera.lookAt(controls.target);

      orbiters.forEach((o) => {
        const a = el * 0.12 + o.phase;
        o.s.position.set(Math.cos(a) * ringR, 0.4, Math.sin(a) * ringR * 0.92);
      });
      travellers.forEach((tr) => {
        tr.t = (tr.t + dt * 0.22) % 1;
        tr.curve.getPoint(tr.t, tr.s.position);
      });

      if (showLabels) {
        const w = host.clientWidth;
        const h = host.clientHeight;
        labelEls.forEach(({ el: lab, pos }) => {
          v.copy(pos).project(camera);
          const vis = v.z < 1;
          lab.style.display = vis ? "block" : "none";
          lab.style.transform = `translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px)`;
        });
      }
      composer.render();
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("pointerdown", onDown);
      renderer.domElement.removeEventListener("pointerup", onUp);
      renderer.domElement.removeEventListener("pointermove", onMove);
      disposables.forEach((d) => d.dispose());
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      labelEls.forEach(({ el: lab }) => lab.remove());
      api.current = null;
    };
  }, []);

  useEffect(() => api.current?.select(selected), [selected]);
  useEffect(() => api.current?.setFlow(flow), [flow]);
  useEffect(() => api.current?.setLabels(labels), [labels]);
  useEffect(() => api.current?.setSpin(spin), [spin]);

  return (
    <div ref={wrap} className="absolute inset-0 overflow-hidden">
      <div ref={labelLayer} className="pointer-events-none absolute inset-0 transition-opacity duration-300" />
    </div>
  );
}
