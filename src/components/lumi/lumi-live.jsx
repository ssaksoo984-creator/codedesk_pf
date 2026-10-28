"use client";
/* eslint-disable */
// Vendored from the Lumi state-animation build (Tale Studio): the original
// illustration re-composited by a WebGL shader, driven by states.js.
import * as React from "react";
import { STATE_BY_ID, evalState, BASE } from "./states.js";
import parts from "./parts.json";

const A = "/media/lumi/";
const imgSrc = A + "body_img.webp", baseSrc = A + "body_base.webp", maskSrc = A + "flow_mask.png";
const dirSrc = A + "flow_dir.png", eyesSrc = A + "eyes.png", innerSrc = A + "inner.png";
import { drawBubble, bubbleTone, drawShapes, drawBulb, drawClouds, drawSpotlight, drawFace } from "./props.js";

// <LumiLive state="thinking" /> — 원본 Lumi 일러스트를 그대로 쓰는 상태 애니메이션.
// 원본 PNG를 몸체 · 눈 · 주변 방울로 나눠 두고(tools/build_parts.py), 셰이더가 매 프레임 다시 합친다.
//   몸체 : 원본 픽셀. 몸통 안 코랄 레드 그라데이션 물결(Lumi 꼬리 물결과 같은 방식)과 빛 세기만 바뀐다.
//   꼬리 : 꼬리 부분만 뿌리를 축으로 휘고 살랑인다.
//   눈   : 깜빡임, 시선, 눌림.
//   버블 : 원본 버블 자리에서 Lumi와 함께 둥실. 생각 중에는 몸 둘레를 돌고, 완료에서는 하트로 변한다.
//   소품 : 고치는 중 전구, 그리는 중 도형, 연출 중 구름 → 별과 조명. 표정: "오" 입, 웃는 입·눈 (props.js)
// 상태 파라미터는 states.js(가이드 표)를 그대로 쓴다. 길이 단위 1 = 몸 반지름(약 445px).

const RES = [1536, 1024];
const C = [960, 510], R = 445;                      // 몸 중심과 반지름 (원본 px)
const P0 = [C[0] - R, C[1] + 0.07 * R];             // 꼬리 뿌리
const TIP = [170, 540];                             // 꼬리 끝
const SPIN = [400, 250];                            // 고치는 중 버블이 도는 자리 (꼬리 위)
const VIEW = [-100, -120, 1736, 1736 / 1.5];        // 화면에 보이는 원본 좌표 범위 (점프·날아가기 여유)
const AVATAR = [120, 60, 1450, 980];                // 작은 크기에서 캐릭터 전체가 들어가는 범위
const BLEND = 0.35, TAU = Math.PI * 2;
const lerp = (a, b, k) => a + (b - a) * k;

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() { vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5); gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uImg, uBase, uMask, uDir, uEyes, uInner;
uniform vec2 uRes, uC, uP0, uOff, uScale;
uniform vec4 uView;
uniform float uR, uTilt, uWavePhase, uWaveAmt, uGlow, uSat, uOpacity, uMode, uPulse, uTailGlow, uScan;
uniform float uCurl, uFore, uSwingPx, uSwingPhase;
uniform vec4 uEye[2];
uniform vec4 uEyeX;          // 시선 dx, dy, 눈 가로 배율, 세로 배율
const float TAU = 6.28318530718;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 3; i++) { v += a * noise(p); p = p * 2.07 + 11.3; a *= 0.5; } return v; }
vec4 over(vec4 top, vec4 bot) { return top + bot * (1.0 - top.a); }
vec4 tex(sampler2D t, vec2 px) {
  vec2 uv = px / uRes;
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return vec4(0.0);
  vec4 c = texture2D(t, uv);
  return vec4(c.rgb * c.a, c.a);
}

float tailW(vec2 s) {
  float d = length(s - uC) - uR;
  return smoothstep(0.0, 340.0, d) * smoothstep(uC.x - 250.0, uC.x - 450.0, s.x);
}

void main() {
  vec2 p = uView.xy + vUv * uView.zw;

  // 캐릭터 전체 이동·기울기·크기 (역변환)
  vec2 v = p - uC - uOff;
  float c = cos(uTilt), sn = sin(uTilt);
  v = vec2(c * v.x - sn * v.y, sn * v.x + c * v.y) / uScale;
  vec2 s = uC + v;

  // 꼬리: 뿌리를 축으로 휘고(접힘은 짧아 보이게), 끝으로 갈수록 살랑
  // 화면 점 s로 옮겨 올 원본 점 sb를 찾는다. 꼬리 무게 w는 원본 점에서 재야 하므로 몇 번 되풀이해 맞추고,
  // 마지막에 다시 앞으로 옮겨 봐서 s에 닿지 않으면(엉뚱한 곳에 꼬리가 비치는 경우) 그리지 않는다.
  vec2 sb = s;
  bool tailOk = true;
  if (abs(uCurl) > 0.001 || uSwingPx > 0.001) {
    for (int it = 0; it < 6; it++) {
      float w = tailW(sb);
      vec2 u = s;
      u.y -= uSwingPx * w * w * sin(uSwingPhase - w * 3.0);
      float a = uCurl * w, ca = cos(a), sa = sin(a);
      vec2 t = u - uP0;
      t = vec2(ca * t.x + sa * t.y, -sa * t.x + ca * t.y) / mix(1.0, uFore, w);
      sb = uP0 + t;
    }
    float w = tailW(sb);
    float a = uCurl * w, ca = cos(a), sa = sin(a);
    vec2 t = (sb - uP0) * mix(1.0, uFore, w);
    vec2 f = uP0 + vec2(ca * t.x - sa * t.y, sa * t.x + ca * t.y);
    f.y += uSwingPx * w * w * sin(uSwingPhase - w * 3.0);
    tailOk = length(f - s) < 3.0;
  }

  // 몸체 + 몸통 안 그라데이션 물결 (원본 - 바탕 = 빨간 성분만 일렁임)
  vec2 uvb = sb / uRes;
  vec4 body = vec4(0.0);
  if (tailOk && uvb.x >= 0.0 && uvb.y >= 0.0 && uvb.x <= 1.0 && uvb.y <= 1.0) {
    vec4 o = texture2D(uImg, uvb);
    vec4 m = texture2D(uMask, uvb);
    vec2 td = normalize(texture2D(uDir, uvb).rg * 2.0 - 1.0 + 1e-4);
    vec2 nd = vec2(-td.y, td.x);
    float ph = TAU * uWavePhase;
    vec2 orbit = vec2(cos(ph), sin(ph));
    float n1 = fbm(sb / 260.0 + orbit * 0.25), n2 = fbm(sb / 180.0 - orbit.yx * 0.3 + 7.1);
    float sAlong = m.g * 701.0;
    float phi = TAU * sAlong / 250.0 - ph + (n1 - 0.5) * 2.4;
    float phi2 = TAU * sAlong / 140.0 - 2.0 * ph + (n2 - 0.5) * 3.0;
    vec2 d = (nd * (15.0 * sin(phi) + 5.0 * sin(phi2)) + td * (8.0 * cos(phi) + 3.0 * cos(phi2))) * m.r * uWaveAmt;
    vec2 q = uvb - d / uRes;
    float pinQ = texture2D(uMask, q).b;
    vec3 col = texture2D(uBase, uvb).rgb + (texture2D(uImg, q).rgb - texture2D(uBase, q).rgb) * (1.0 - pinQ);
    col += m.r * uWaveAmt * 0.025 * sin(phi) * vec3(1.0, 0.92, 0.95);
    col = mix(col, o.rgb, m.b);

    float inner = texture2D(uInner, uvb).r;
    if (uMode > 0.5 && uMode < 1.5) {          // 읽는 중: 위에서 아래로 내려가는 빛
      float y = -60.0 + fract(uScan) * 1120.0;
      col += vec3(1.0, 0.93, 0.97) * 0.3 * exp(-pow((sb.y - y) / 70.0, 2.0)) * inner;
    }
    if (uMode > 1.5) {                          // 그리는 중: 팔레트처럼 섞이며 도는 색
      vec2 r = (sb - uC) / uR;
      r = vec2(cos(ph) * r.x - sin(ph) * r.y, sin(ph) * r.x + cos(ph) * r.y);
      float m1 = 0.5 + 0.5 * sin(r.x * 3.0 + sin(r.y * 2.6) * 1.6);
      float m2 = 0.5 + 0.5 * sin(r.y * 3.3 + sin(r.x * 2.2) * 1.6 + 2.0);
      vec3 pal = mix(mix(vec3(1.0, 0.42, 0.38), vec3(0.98, 0.58, 0.76), m1), vec3(0.8, 0.66, 0.96), m2 * 0.8);
      col = mix(col, pal, 0.45 * inner);
    }
    col += vec3(1.0, 0.92, 0.96) * uPulse * 0.22 * exp(-pow(length(sb - uC - vec2(-60.0, -40.0)) / 260.0, 2.0)) * inner;
    col += vec3(1.0, 0.94, 0.98) * uTailGlow * 0.4 * smoothstep(0.55, 1.0, tailW(sb));

    float lum = dot(col, vec3(0.3, 0.59, 0.11));
    col = mix(vec3(lum) * vec3(0.97, 0.94, 1.0), col, uSat) * uGlow;
    body = vec4(clamp(col, 0.0, 1.0) * o.a, o.a);
  }

  // 눈: 원래 자리에서 시선만큼 옮기고, 눈 중심 기준으로 눌림·깜빡임
  vec4 eyes = vec4(0.0);
  for (int i = 0; i < 2; i++) {
    vec4 e = uEye[i];
    vec2 l = (s - e.xy - uEyeX.xy) / uEyeX.zw;
    if (abs(l.x) < e.z + 8.0 && abs(l.y) < e.w + 8.0) eyes = over(tex(uEyes, e.xy + l), eyes);
  }
  eyes.rgb *= mix(1.0, uGlow, 0.5);

  gl_FragColor = over(eyes, body) * uOpacity;
}`;

const loadImage = (src) => new Promise((res, rej) => {
  const im = new Image();
  im.onload = () => res(im);
  im.onerror = rej;
  im.src = src;
});

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

// 원본 좌표 → 화면에 그릴 때 쓰는 앞방향 변환 (꼬리 끝 위치를 알아야 빛의 줄을 그릴 수 있다)
function charForward(pt, P) {
  const v = [(pt[0] - C[0]) * P.scale * P.stretchX, (pt[1] - C[1]) * P.scale * P.squashY];
  const c = Math.cos(P.tilt), s = Math.sin(P.tilt);
  return [C[0] + P.x * R + c * v[0] + s * v[1], C[1] - P.y * R - s * v[0] + c * v[1]];
}
function tailTip(P, time) {
  const curl = P.curl * Math.cos(P.curlAxis);
  const fore = 1 - 0.35 * Math.abs(Math.sin(P.curlAxis)) * Math.min(1, Math.abs(P.curl));
  const t = [(TIP[0] - P0[0]) * fore, (TIP[1] - P0[1]) * fore];
  const ca = Math.cos(curl), sa = Math.sin(curl);
  const r = [P0[0] + ca * t[0] - sa * t[1], P0[1] + sa * t[0] + ca * t[1] + P.tailSwing * R * Math.sin(time * P.tailFreq - 3)];
  return charForward(r, P);
}

function drawStar(g, x, y, size, alpha) {
  g.save();
  g.globalAlpha = alpha;
  const grd = g.createRadialGradient(x, y, 0, x, y, size);
  grd.addColorStop(0, "rgba(255,190,225,0.95)");
  grd.addColorStop(1, "rgba(220,170,255,0)");
  g.fillStyle = grd;
  g.beginPath(); g.arc(x, y, size, 0, TAU); g.fill();
  g.fillStyle = "#f472b0";
  g.beginPath();
  g.moveTo(x, y - size); g.lineTo(x + size * 0.14, y - size * 0.14); g.lineTo(x + size, y); g.lineTo(x + size * 0.14, y + size * 0.14);
  g.lineTo(x, y + size); g.lineTo(x - size * 0.14, y + size * 0.14); g.lineTo(x - size, y); g.lineTo(x - size * 0.14, y - size * 0.14);
  g.closePath(); g.fill();
  g.restore();
}

export function LumiLive({ state = "idle", replay = 0, paused = false, hidden = false, onStateChange, previews, className, style, alt = "Lumi" }) {
  const glRef = React.useRef(null), fxRef = React.useRef(null), bkRef = React.useRef(null);
  const [failed, setFailed] = React.useState(false);
  const live = React.useRef({});
  live.current = { state, replay, paused, hidden, onStateChange, previews };

  React.useEffect(() => {
    const canvas = glRef.current, fx = fxRef.current, bk = bkRef.current;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true });
    if (!gl) { setFailed(true); return; }
    let raf = 0, disposed = false;

    Promise.all([imgSrc, baseSrc, maskSrc, dirSrc, eyesSrc, innerSrc].map(loadImage)).then((imgs) => {
      if (disposed) return;
      const prog = gl.createProgram();
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "aPos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ["uImg", "uBase", "uMask", "uDir", "uEyes", "uInner"].forEach((name, i) => {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imgs[i]);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.uniform1i(gl.getUniformLocation(prog, name), i);
      });
      const U = (n) => gl.getUniformLocation(prog, n);
      gl.uniform2f(U("uRes"), ...RES);
      gl.uniform2f(U("uC"), ...C);
      gl.uniform2f(U("uP0"), ...P0);
      gl.uniform1f(U("uR"), R);
      gl.uniform4f(U("uView"), ...VIEW);
      parts.eyes.forEach((e, i) => gl.uniform4f(U(`uEye[${i}]`), e.cx, e.cy, e.rx, e.ry));
      const bubbles = parts.bubbles.map((b) => ({ ...b, tone: bubbleTone(b.color) }));
      const u = {};
      ["uOff", "uScale", "uTilt", "uWavePhase", "uWaveAmt", "uGlow", "uSat", "uOpacity", "uMode", "uPulse", "uTailGlow", "uScan",
        "uCurl", "uFore", "uSwingPx", "uSwingPhase", "uEyeX"].forEach((n) => (u[n] = U(n)));


      // ---- 상태 진행 ----
      let current = null, enteredAt = 0, from = null, blendStart = -1, fired = new Set(), lastLt = 0;
      let requested = null, requestedReplay = null;
      let time = 0, last = performance.now(), lastParams = { ...BASE };
      const trail = [], sparks = [];
      const fxApi = {
        // states.js의 이벤트는 몸 반지름 단위 3D 좌표로 위치를 준다 → 원본 px로 바꿔 반짝임을 뿌린다
        burst(v, count, spread, life = 0.9, size = 0.5) {
          const x = C[0] + (v.x - 0.1) * R, y = C[1] - v.y * R;
          for (let i = 0; i < count; i++) {
            const a = Math.random() * TAU, sp = spread * R * (0.5 + Math.random());
            sparks.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - spread * R * 0.3, t: 0,
              life: life * (0.7 + Math.random() * 0.6), size: size * 60 * (0.6 + Math.random() * 0.8) });
          }
        },
      };
      const enter = (id) => {
        current = STATE_BY_ID[id] || STATE_BY_ID.idle;
        enteredAt = time; from = { ...lastParams }; blendStart = time; fired = new Set(); lastLt = 0;
      };

      const frame = (now) => {
        const L = live.current;
        const dt = L.paused ? 0 : Math.min(now - last, 100) / 1000;
        last = now;
        time += dt;
        if (L.state !== requested || L.replay !== requestedReplay) {
          requested = L.state; requestedReplay = L.replay;
          enter(L.state);
          trail.length = 0;
        }
        let tau = time - enteredAt;
        if (current.once && !current.hold && tau >= current.once) {
          const nextId = current.then || "idle";
          enter(nextId);
          if (L.onStateChange) { requested = nextId; L.onStateChange(nextId); }
          tau = 0;
        }
        // 반복 상태는 한 바퀴 돌 때마다 이벤트(반짝임)를 다시 터뜨린다
        const lt = current.loop ? tau % current.loop : tau;
        if (current.loop && lt < lastLt) fired = new Set();
        lastLt = lt;
        (current.events || []).forEach((ev, i) => { if (!fired.has(i) && lt >= ev.at) { fired.add(i); ev.run(fxApi); } });

        const target = evalState(current, tau);
        const k = Math.min(1, (time - blendStart) / BLEND), kk = k * k * (3 - 2 * k);
        const P = {};
        for (const key of Object.keys(target)) P[key] = k < 1 ? lerp(from[key] ?? target[key], target[key], kk) : target[key];
        P.mode = target.mode;
        lastParams = P;

        // ---- 그리기 ----
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
        if (canvas.width !== w || canvas.height !== h) { canvas.width = fx.width = bk.width = w; canvas.height = fx.height = bk.height = h; }
        if (!w || !h || live.current.hidden) { raf = requestAnimationFrame(frame); return; } // 화면에 보이지 않을 때는 건너뜀
        gl.viewport(0, 0, w, h);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(u.uOff, P.x * R, -P.y * R);
        gl.uniform2f(u.uScale, P.scale * P.stretchX, P.scale * P.squashY);
        gl.uniform1f(u.uTilt, P.tilt);
        gl.uniform1f(u.uWavePhase, P.wavePhase);
        gl.uniform1f(u.uWaveAmt, P.waveAmt);
        gl.uniform1f(u.uGlow, P.glow);
        gl.uniform1f(u.uSat, P.sat);
        gl.uniform1f(u.uOpacity, P.opacity);
        gl.uniform1f(u.uMode, P.mode);
        gl.uniform1f(u.uPulse, P.pulse);
        gl.uniform1f(u.uTailGlow, P.tailGlow);
        gl.uniform1f(u.uScan, P.scan);
        gl.uniform1f(u.uCurl, P.curl * Math.cos(P.curlAxis));
        gl.uniform1f(u.uFore, 1 - 0.35 * Math.abs(Math.sin(P.curlAxis)) * Math.min(1, Math.abs(P.curl)));
        gl.uniform1f(u.uSwingPx, P.tailSwing * R);
        gl.uniform1f(u.uSwingPhase, time * P.tailFreq);
        gl.uniform4f(u.uEyeX, P.lookX * 110, -P.lookY * 90, 1 + P.eyeSquash * 0.15, Math.max(0.03, P.eyeOpen * (1 - P.happy)) * (1 - P.eyeSquash * 0.45));
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        // 빛의 줄(꼬리 끝)과 반짝임은 위에 겹친 2D 캔버스에
        const g = fx.getContext("2d"), gb = bk.getContext("2d");
        for (const ctx of [g, gb]) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, w, h); }
        const toPx = (x, y) => [((x - VIEW[0]) / VIEW[2]) * w, ((y - VIEW[1]) / VIEW[3]) * h];
        const sc = w / VIEW[2];
        // 원본 px 좌표 + 캐릭터 이동·기울기·크기를 2D 캔버스에 건다 → 버블과 소품이 Lumi와 함께 움직인다
        const charSpace = (ctx) => {
          ctx.setTransform(sc, 0, 0, sc, -VIEW[0] * sc, -VIEW[1] * sc);
          ctx.translate(C[0] + P.x * R, C[1] - P.y * R);
          ctx.rotate(-P.tilt);
          ctx.scale(P.scale * P.stretchX, P.scale * P.squashY);
          ctx.translate(-C[0], -C[1]);
          ctx.globalAlpha = P.opacity;
        };
        charSpace(g);
        charSpace(gb);

        // 몸 뒤: 연출 중 조명
        const lt2 = current.loop ? tau % current.loop : tau;
        let backUsed = drawSpotlight(gb, C, R, P.spot);

        // 버블: 제자리에서 둥실 ↔ 몸 둘레 궤도. 궤도 뒤쪽 절반은 몸 뒤 캔버스에.
        bubbles.forEach((b, i) => {
          const ang = P.orbitAngle + (i * TAU) / bubbles.length;
          const hx = b.cx + 4 * Math.sin(time * 1.1 + i), hy = b.cy + 9 * Math.sin(time * 1.4 + i * 1.3);
          const depth = -Math.sin(ang);                                  // +1 = 앞
          const ox = C[0] + Math.cos(ang) * 1.42 * R, oy = C[1] + depth * 0.3 * R + 30;
          // 고치는 중: 꼬리 위 작은 원을 로딩 표시처럼 돌다가(앞쪽 버블일수록 크게) 가운데로 모여 전구가 된다
          const sa = -time * TAU / 0.9 + (i * TAU) / bubbles.length, sr = 80 * (1 - P.merge);
          const sx = SPIN[0] + Math.cos(sa) * sr, sy = SPIN[1] + Math.sin(sa) * sr;
          const x = lerp(lerp(hx, ox, P.orbit), sx, P.spin), y = lerp(lerp(hy, oy, P.orbit), sy, P.spin);
          const sizeSpin = 9 + 13 * ((bubbles.length - i) / bubbles.length);
          const r = lerp(b.r * (1 + P.orbit * (0.35 + 0.3 * depth)), sizeSpin * (1 - 0.6 * P.merge), P.spin) * (1 + 0.08 * P.heart * Math.sin(time * 6 + i));
          const behind = P.orbit > 0.5 && depth < 0;
          if (behind && P.bubbles > 0.001) backUsed = true;
          drawBubble(behind ? gb : g, x, y, r, b.tone, P.heart, P.bubbles);
        });
        // 소품과 표정 (모두 상태 파라미터로 나타나고 사라진다)
        if (drawShapes(g, gb, lt2, P.shapes, P.shapesOrbit, P.shapesAngle, C, R)) backUsed = true;
        drawClouds(g, lt2, P.clouds, P.cloudEyes, P.cloudStar);
        drawBulb(g, P.bulbX, P.bulbY, 52, 0.6 + 0.4 * Math.sin(time * 5), P.bulb);
        drawFace(g, parts.eyes, [P.lookX * 110, -P.lookY * 90], P);
        // 몸 뒤에 그린 게 없으면 뒤쪽 캔버스를 숨긴다 (지우기만 한 캔버스가 화면에 남는 브라우저가 있어서)
        bk.style.visibility = backUsed ? "visible" : "hidden";
        g.setTransform(1, 0, 0, 1, 0, 0);
        gb.setTransform(1, 0, 0, 1, 0, 0);
        g.globalAlpha = 1;
        if (P.trail > 0) {
          const [tx, ty] = tailTip(P, time);
          trail.push({ x: tx, y: ty, t: time });
        }
        while (trail.length && time - trail[0].t > Math.max(P.trail, 0.01)) trail.shift();
        g.lineCap = g.lineJoin = "round";
        for (let i = 1; i < trail.length; i++) {
          const age = (time - trail[i].t) / Math.max(P.trail, 0.01);
          const [x0, y0] = toPx(trail[i - 1].x, trail[i - 1].y), [x1, y1] = toPx(trail[i].x, trail[i].y);
          // 핑크에서 라벤더로 바래는 빛의 줄 (흰 배경에서도 보이게 색을 준다)
          const r = Math.round(lerp(244, 196, age)), gg = Math.round(lerp(120, 150, age)), b = Math.round(lerp(176, 240, age));
          g.strokeStyle = `rgba(${r},${gg},${b},${(1 - age) * 0.9 * P.opacity})`;
          g.lineWidth = 12 * sc * (1 - age * 0.6);
          g.shadowColor = "rgba(255,170,215,0.9)";
          g.shadowBlur = 18 * sc;
          g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
        }
        g.shadowBlur = 0;
        for (const s of sparks) { s.t += dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vx *= 0.94; s.vy *= 0.94; }
        for (let i = sparks.length - 1; i >= 0; i--) if (sparks[i].t > sparks[i].life) sparks.splice(i, 1);
        for (const s of sparks) {
          const kk2 = s.t / s.life;
          const [x, y] = toPx(s.x, s.y);
          drawStar(g, x, y, s.size * sc * Math.sin(Math.PI * Math.min(1, kk2 * 1.2)), 1 - kk2);
        }

        // 작은 크기 미리보기: full = 화면 그대로, avatar = 캐릭터 전체가 들어가게 맞춤(자르지 않음)
        if (L.previews) {
          const [ax0, ay0] = toPx(AVATAR[0], AVATAR[1]), [ax1, ay1] = toPx(AVATAR[2], AVATAR[3]);
          for (const pv of L.previews) {
            const el = pv.canvas;
            if (!el) continue;
            const pg = el.getContext("2d");
            pg.clearRect(0, 0, el.width, el.height);
            if (pv.crop === "avatar") {
              const sw = ax1 - ax0, sh = ay1 - ay0, f = Math.min(el.width / sw, el.height / sh);
              const dw = sw * f, dh = sh * f, dx = (el.width - dw) / 2, dy = (el.height - dh) / 2;
              for (const c of [bk, canvas, fx]) pg.drawImage(c, ax0, ay0, sw, sh, dx, dy, dw, dh);
            } else {
              for (const c of [bk, canvas, fx]) pg.drawImage(c, 0, 0, el.width, el.height);
            }
          }
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    }).catch((e) => { console.error(e); setFailed(true); });

    return () => { disposed = true; cancelAnimationFrame(raf); };
  }, []);

  if (failed) return <p role="img" aria-label={alt}>Lumi preview unavailable in this browser.</p>;
  return (
    <div className={className} style={{ position: "relative", width: "100%", aspectRatio: "3 / 2", ...style }}>
      <canvas ref={bkRef} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <canvas ref={glRef} role="img" aria-label={alt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <canvas ref={fxRef} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />
    </div>
  );
}
