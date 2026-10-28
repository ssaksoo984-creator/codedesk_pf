/* eslint-disable */
// Vendored from the Lumi state-animation build (Tale Studio).
// 반짝임 위치: 몸 반지름 단위 좌표 (x 오른쪽, y 위, z 앞)
const v3 = (x, y, z) => ({ x, y, z });

// Lumi 상태 17개. "Lumi 3D 상태 제작 가이드" 문서의 표를 그대로 옮긴 것.
// 각 상태는 기본 파라미터(BASE)에서 바뀌는 값만 돌려준다. τ = 상태에 들어온 뒤 지난 시간(초).
//   loop  : 반복 길이(초)    once : 1회 재생 길이(초), 끝나면 then 상태로
//   hold  : 1회 재생 뒤 마지막 자세를 유지하는 상태(오류, 물어보기)

const TAU = Math.PI * 2;
const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const seg = (t, a, b) => ease((t - a) / (b - a));
const lerpN = (a, b, k) => a + (b - a) * k;
const blink = (t, every, dur = 0.16, offset = 0.4) => {
  const ph = (((t - offset) % every) + every) % every;
  return ph < dur ? 1 - Math.sin((Math.PI * ph) / dur) : 1;
};

export const BASE = {
  x: 0, y: 0, tilt: 0, scale: 1, squashY: 1, stretchX: 1, opacity: 1,
  glow: 1, sat: 1, waveAmt: 1, wavePhase: 0, mode: 0, pulse: 0, tailGlow: 0, scan: 0,
  tailSwing: 0.06, tailFreq: TAU / 3.25, curl: 0, curlAxis: 0,
  eyeOpen: 1, eyeSquash: 0, lookX: 0, lookY: 0,
  orbit: 0, orbitAngle: 0, trail: 0,
  bubbles: 1, heart: 0,          // 버블 보이는 정도, 하트로 변한 정도
  mouthO: 0, smile: 0, happy: 0,  // "오" 입, 웃는 입, 웃는 눈(∩)
  bulb: 0, bulbX: 1215, bulbY: 10, clouds: 0, cloudEyes: 0, cloudStar: 0, spot: 0, // 전구(위치), 구름(눈 뜸 → 별), 조명
  spin: 0, merge: 0,              // 버블이 꼬리 위에서 로딩처럼 도는 정도, 가운데로 모여 합쳐진 정도
  shapes: 0, shapesOrbit: 0, shapesAngle: 0,               // 그리는 중 도형: 보이는 정도, 몸 둘레 도는 정도, 각도
};

// 꼬리를 위로 들어 공중에 글씨를 쓰는 움직임 (쓰는 중, 고치는 중)
const tailWrite = (t, speed = 1) => ({
  curl: 0.95 + 0.22 * Math.sin(TAU * t * speed) + 0.08 * Math.sin(TAU * t * speed * 2.3),
  curlAxis: 0.35 * Math.sin((TAU * t * speed) / 2),
  tailSwing: 0.025, trail: 1.1 / speed, tailGlow: 0.9,
});

// 기본(Idle)의 움직임. 다른 상태들이 이 위에 덧붙인다.
const idle = (t, period = 6.5) => ({
  y: 0.04 * Math.sin((TAU * t) / (period / 2)),
  wavePhase: t / period,
  eyeOpen: blink(t, period / 2 + 0.75),
});

export const GROUPS = [
  { id: "common", label: "공통 상태", note: "모든 단계 · 40px 채팅 아바타" },
  { id: "making", label: "만드는 중", note: "긴 로딩 화면 · 200px" },
  { id: "moment", label: "특별한 순간", note: "1회 재생 뒤 기본으로" },
];

export const STATES = [
  // ---------- 공통 ----------
  {
    id: "idle", name: "기본", en: "Idle", group: "common", phase: 1, screens: "채팅 아바타, 평소", size: "40px", loop: 6.5,
    params: (t) => idle(t),
  },
  {
    id: "listening", name: "듣는 중", en: "Listening", group: "common", phase: 1, screens: "사용자가 입력할 때", size: "40px", loop: 3,
    params: (t) => ({
      ...idle(t), y: 0.015 * Math.sin((TAU * t) / 3),
      tilt: -0.09, lookX: 0.22, lookY: -0.3, glow: 1.07, tailSwing: 0.02,
      eyeOpen: blink(t, 1.5, 0.14, 0.3),
    }),
  },
  {
    id: "thinking", name: "생각 중", en: "Thinking", group: "common", phase: 1, screens: "보낸 뒤 응답 기다릴 때", size: "40px", loop: 3,
    params: (t) => {
      const b = Math.sin((TAU * t) / 3);
      return {
        y: 0.02 * b, scale: 1 + 0.04 * b, pulse: 0.5 + 0.5 * b, wavePhase: t / 3,
        orbit: 1, orbitAngle: (TAU * t) / 3, tailSwing: 0.03,
        eyeOpen: 0.55, lookY: 0.35, lookX: -0.05,
      };
    },
  },
  {
    id: "complete", name: "완료", en: "Complete", group: "common", phase: 1, screens: "생성이 끝났을 때", size: "40px", once: 1.2, then: "idle",
    events: [{ at: 0.3, run: (L) => L.burst(v3(0.1, 0.4, 0.4), 14, 1.6, 0.9, 0.55) }],
    params: (t) => {
      const jump = t < 0.6 ? Math.sin((Math.PI * t) / 0.6) : 0;
      const land = t > 0.55 && t < 0.85 ? Math.sin((Math.PI * (t - 0.55)) / 0.3) : 0;
      return {
        ...idle(t), y: 0.38 * jump, squashY: 1 - 0.08 * land + 0.05 * jump, stretchX: 1 + 0.05 * land,
        glow: 1 + 0.35 * Math.exp(-Math.pow((t - 0.35) / 0.18, 2)),
        curl: 0.6 * Math.sin(Math.PI * Math.min(1, t / 0.7)),
        heart: seg(t, 0.1, 0.4),          // 버블이 하트로 (기본으로 돌아가며 다시 동그라미)
        eyeOpen: blink(t, 10, 0.18, 0.85),
      };
    },
  },
  {
    id: "error", name: "오류", en: "Error", group: "common", phase: 1, screens: "읽기 실패, 생성 실패", size: "40px, 200px", once: 1, hold: true,
    params: (t) => {
      const k = seg(t, 0, 0.35);
      const shake = t < 1 ? 0.06 * Math.sin(TAU * 2 * t) * (1 - t) : 0;
      return {
        x: shake, y: 0.015 * Math.sin((TAU * t) / 4) - 0.03 * k,
        glow: 1 - 0.08 * k, sat: 1 - 0.3 * k, waveAmt: 1 - 0.5 * k, wavePhase: t / 13,
        tailSwing: 0.025, curl: -0.45 * k, eyeSquash: 0.55 * k, lookY: -0.15 * k,
      };
    },
  },

  // ---------- 만드는 중 ----------
  {
    // 눈이 한 바퀴 빙 돌고 → "오" 입 → 끄덕끄덕, 반복
    id: "reading", name: "읽는 중", en: "Reading", group: "making", phase: 2, screens: "E2 AI가 글 읽는 중", size: "200px", loop: 3,
    params: (t) => {
      const roll = seg(t, 0, 0.2) * (1 - seg(t, 1.25, 1.45)), a = TAU * Math.min(1, t / 1.3) + Math.PI / 2;
      const nod = t > 1.5 && t < 2.9 ? Math.pow(Math.abs(Math.sin((TAU * (t - 1.5)) / 1.4)), 1.5) : 0;
      return {
        ...idle(t, 6), mode: 1, scan: t / 3,
        lookX: 0.4 * Math.cos(a) * roll, lookY: 0.32 * Math.sin(a) * roll - 0.18 * nod,
        mouthO: seg(t, 1.15, 1.4) * (1 - seg(t, 2.6, 2.9)),
        y: 0.02 * Math.sin((TAU * t) / 3) - 0.06 * nod, squashY: 1 - 0.03 * nod, tilt: -0.03 * nod,
        eyeOpen: 1,
      };
    },
  },
  {
    // 꼬리를 위로 들어 공중에 빛의 줄로 글씨를 쓴다
    id: "writing", name: "쓰는 중", en: "Writing", group: "making", phase: 1, screens: "E5 산문 초안 쓰는 중", size: "200px", loop: 4,
    params: (t) => ({
      ...idle(t, 8), ...tailWrite(t), bubbles: 0,
      lookX: -0.42 + 0.08 * Math.sin(TAU * t), lookY: 0.3, eyeOpen: blink(t, 4, 0.16, 2.2),
    }),
  },
  {
    // 버블이 꼬리 위에서 로딩처럼 돌다가 → 가운데로 모여 전구가 되고 → 꼬리로 고쳐 쓴다
    id: "editing", name: "고치는 중", en: "Editing", group: "making", phase: 2, screens: "W2 산문 고치는 중", size: "200px", loop: 4.5,
    params: (t) => {
      const load = 1 - seg(t, 1.5, 1.8), write = seg(t, 1.9, 2.3) * (1 - seg(t, 4.1, 4.5));
      const tw = tailWrite(t - 1.9, 1.3), rise = seg(t, 1.75, 2.3);
      return {
        ...idle(t, 4.5),
        spin: seg(t, 0, 0.35) * (1 - seg(t, 3.8, 4.0)), merge: seg(t, 1.25, 1.6),
        bubbles: 1 - seg(t, 1.5, 1.65) + seg(t, 4.05, 4.5),
        bulb: seg(t, 1.4, 1.7) * (1 - seg(t, 3.7, 4.2)), bulbX: 400 + 130 * rise, bulbY: 250 - 120 * rise,
        lookX: load * (-0.38 + 0.08 * Math.sin(TAU * t * 1.2)) + (1 - load) * (-0.3 - 0.12 * write),
        lookY: load * 0.42 + (1 - load) * (0.45 - 0.1 * write),
        mouthO: 0.7 * seg(t, 1.45, 1.65) * (1 - seg(t, 2.0, 2.3)),
        curl: tw.curl * write, curlAxis: tw.curlAxis * write, trail: write > 0.5 ? tw.trail : 0, tailGlow: tw.tailGlow * write,
        tailSwing: 0.04 * load + 0.025 * write, eyeOpen: blink(t, 10, 0.16, 3.4),
      };
    },
  },
  {
    // 도형들이 생각 중 버블처럼 곁을 돌다가 → 퍼지고, 그때 Lumi가 웃는다
    id: "drawing", name: "그리는 중", en: "Drawing", group: "making", phase: 2, screens: "A4 그림 만드는 중", size: "200px", loop: 6,
    params: (t) => {
      const spread = seg(t, 2.8, 3.5) * (1 - seg(t, 5.3, 6));
      const happy = seg(t, 3.0, 3.4) * (1 - seg(t, 5.1, 5.5));
      return {
        ...idle(t, 6), mode: 2, wavePhase: t / 6, bubbles: 0,
        shapes: 1, shapesOrbit: 1 - spread, shapesAngle: (TAU * t) / 3,
        smile: happy, eyeOpen: 1,
        y: 0.04 * Math.sin((TAU * t) / 3) + 0.05 * Math.sin(Math.PI * seg(t, 2.9, 3.5)),
        lookX: (1 - spread) * 0.3 * Math.cos((TAU * t) / 3), lookY: 0.1,
      };
    },
  },
  {
    // 눈동자가 좌우로 구름을 따라가고 → 구름이 눈을 뜨고 별이 된다 → 전구가 켜지고 → 감탄
    id: "directing", name: "연출 중", en: "Directing", group: "making", phase: 1, screens: "S0 스토리보드 준비", size: "200px", loop: 12,
    events: [{ at: 7.4, run: (L) => L.burst(v3(0.1, 0.45, 0.4), 12, 1.3, 1.0, 0.5) }],
    params: (t) => {
      const wow = seg(t, 7.2, 7.6) * (1 - seg(t, 11, 11.7));
      return {
        ...idle(t, 12), y: 0.03 * Math.sin((TAU * t) / 6) + 0.06 * Math.sin(Math.PI * seg(t, 7.2, 7.9)), wavePhase: t / 12, bubbles: 0,
        clouds: seg(t, 0, 0.9) * (1 - seg(t, 11, 11.8)),
        cloudEyes: seg(t, 4.3, 5.0), cloudStar: seg(t, 5.4, 6.3),
        bulb: seg(t, 6.3, 6.9) * (1 - seg(t, 10.8, 11.6)),
        lookX: (1 - wow) * 0.42 * Math.sin((TAU * t) / 3), lookY: 0.05 + 0.2 * wow,
        eyeOpen: wow > 0.5 ? 1 + 0.15 * wow : blink(t, 4, 0.16, 2.6), mouthO: wow, glow: 1 + 0.12 * wow, scale: 1 + 0.03 * wow,
      };
    },
  },

  // ---------- 특별한 순간 ----------
  {
    id: "asking", name: "물어보기", en: "Asking", group: "moment", phase: 2, screens: "W6 산문 확정, A1c 재점검, S3c 적용 확인", size: "200px", once: 0.8, hold: true,
    params: (t) => {
      const k = seg(t, 0, 0.6);
      return { ...idle(t), tilt: 0.17 * k, lookX: 0.35 * k, lookY: -0.22 * k, curl: 0.4 * k, curlAxis: 0.3 };
    },
  },
  {
    id: "nudge", name: "살짝 알림", en: "Gentle nudge", group: "moment", phase: 2, screens: "E1e \"조금 더 써 주세요\", 화면 비율 잠김 안내", size: "200px (제안)", once: 1, then: "idle",
    params: (t) => ({ ...idle(t), tilt: 0.09 * Math.sin(Math.PI * Math.min(1, t / 1)), tailSwing: 0.04, eyeOpen: blink(t, 10, 0.32, 0.45) }),
  },
  {
    id: "greeting", name: "인사", en: "Greeting", group: "moment", phase: 3, screens: "E1 첫 화면, 빈 화면", size: "320px 이상", once: 1.5, then: "idle",
    events: [{ at: 1.0, run: (L) => L.burst(v3(0.2, 0.9, 0.3), 6, 0.8, 0.8, 0.4) }],
    params: (t) => {
      const k = seg(t, 0, 1.2);
      return {
        ...idle(t), opacity: seg(t, 0, 0.7), y: -0.7 * (1 - k) + 0.04 * Math.sin((TAU * t) / 3.25),
        glow: 0.6 + 0.5 * seg(t, 0.2, 0.9) - 0.1 * seg(t, 0.9, 1.5), curl: 1.2 * (1 - k), eyeOpen: blink(t, 10, 0.18, 1.15),
      };
    },
  },
  {
    id: "suggest", name: "제안", en: "Suggest", group: "moment", phase: 3, screens: "E3 추천 설정, WP \"다음 단계로 갈까요?\"", size: "200px (제안)", once: 1, then: "idle",
    events: [{ at: 0.1, run: (L) => L.burst(v3(0.25, 1.25, 0.2), 5, 0.35, 0.9, 0.45) }],
    params: (t) => ({ ...idle(t), y: 0.08 * Math.sin(Math.PI * t), glow: 1.12, lookY: 0.35 * Math.sin(Math.PI * t) }),
  },
  {
    id: "searching", name: "찾는 중", en: "Searching", group: "moment", phase: 3, screens: "WT 빠진 인물 찾기", size: "200px (제안)", loop: 3,
    params: (t) => {
      const lx = 0.38 * Math.sin((TAU * t) / 1.5), ly = 0.22 * Math.sin((TAU * t) / 3 + 1);
      return { ...idle(t), lookX: lx, lookY: ly, tilt: -0.06 * lx, curl: 0.5 * Math.sin((TAU * t) / 1.5), curlAxis: Math.PI / 2, tailSwing: 0.02 };
    },
  },
  {
    // 꼬리 물결이 끝에서 뿌리 쪽으로 거꾸로 감기고, 몸속 물결도 거꾸로 흐른다
    id: "rewind", name: "되돌리기", en: "Rewind", group: "moment", phase: 3, screens: "R2 · R3 롤백", size: "200px (제안)", once: 1.2, then: "idle",
    params: (t) => {
      const k = Math.sin(Math.PI * Math.min(1, t / 1.2));
      return { ...idle(t), wavePhase: -t * 1.6, tailSwing: 0.06 + 0.07 * k, tailFreq: -TAU / 0.6, curl: -0.3 * k, lookX: -0.25 * k, lookY: 0.1 * k };
    },
  },
  {
    id: "next", name: "다음 단계로", en: "Next stage", group: "moment", phase: 3, screens: "Producer → Writer → Artist → Storyboard 전환", size: "320px 이상", once: 2, then: "idle",
    events: [
      { at: 0.75, run: (L) => L.burst(v3(1.6, 0.2, 0.3), 22, 2.2, 1.0, 0.7) },
      { at: 1.75, run: (L) => L.burst(v3(0.1, 0.3, 0.4), 10, 1.2, 0.8, 0.5) },
    ],
    params: (t) => {
      const wind = t < 0.3 ? Math.sin((Math.PI * t) / 0.3) : 0;
      const out = seg(t, 0.3, 0.85), back = seg(t, 1.1, 1.9);
      return {
        // 웅크렸다가 오른쪽(앞)으로 날아가 사라지고, 왼쪽에서 다시 들어와 제자리로
        ...idle(t), x: t <= 1.0 ? 2.6 * out - 0.15 * wind : -2.6 * (1 - back),
        stretchX: 1 - 0.07 * wind + 0.12 * Math.sin(Math.PI * seg(t, 0.3, 0.9)), squashY: 1 + 0.05 * wind,
        opacity: t < 0.75 ? 1 : t < 1.05 ? 1 - seg(t, 0.75, 0.95) : seg(t, 1.05, 1.4),
        glow: 1 + 0.3 * Math.sin(Math.PI * seg(t, 0.2, 1.9)), trail: 0.6, tailGlow: 0.6,
        curl: -0.3 * out * (1 - back), eyeOpen: blink(t, 10, 0.18, 1.85),
      };
    },
  },
];

export const STATE_BY_ID = Object.fromEntries(STATES.map((s) => [s.id, s]));

// 상태 하나의 파라미터를 τ에서 계산 (BASE 위에 덮음)
export function evalState(state, tau) {
  // 반복 상태는 한 바퀴마다 처음부터, 1회 상태는 끝 장면에서 멈춤
  const t = state.loop ? tau % state.loop : state.once && !state.hold ? Math.min(tau, state.once) : tau;
  return { ...BASE, ...state.params(t) };
}
