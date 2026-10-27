import type { WorkProject } from "./work-content";

const TS = "/media/home_work/talestudio";
const NAIL = "/media/home_work/nail";

const LUMI_POSES: { file: string; ko: string; en: string; noteKo: string; noteEn: string }[] = [
  { file: "idle_0", ko: "기본", en: "Idle", noteKo: "채팅 아바타 · 평소", noteEn: "Chat avatar, at rest" },
  { file: "listening_1", ko: "듣는 중", en: "Listening", noteKo: "사용자가 입력할 때", noteEn: "While the user types" },
  { file: "thinking_0.75", ko: "생각 중", en: "Thinking", noteKo: "응답을 기다릴 때", noteEn: "Waiting on a reply" },
  { file: "complete_0.9", ko: "완료", en: "Complete", noteKo: "버블이 하트로 바뀌며 점프", noteEn: "Bubbles turn into a heart" },
  { file: "error_1.5", ko: "오류", en: "Error", noteKo: "읽기 · 생성 실패", noteEn: "Read or generation failed" },
  { file: "reading_1.4", ko: "읽는 중", en: "Reading", noteKo: "눈이 한 바퀴 → “오” → 끄덕", noteEn: "Eyes roll, “oh”, nod" },
  { file: "writing_3", ko: "쓰는 중", en: "Writing", noteKo: "꼬리로 공중에 빛의 글씨", noteEn: "Tail writes light in the air" },
  { file: "drawing_4", ko: "그리는 중", en: "Drawing", noteKo: "도형이 돌다 퍼지며 웃음", noteEn: "Shapes orbit, spread, smile" },
  { file: "directing_4.8", ko: "연출 중", en: "Directing", noteKo: "구름 → 별 → 전구 → 감탄", noteEn: "Clouds → stars → bulb → wow" },
  { file: "greeting_1.5", ko: "인사", en: "Greeting", noteKo: "첫 화면 · 빈 화면", noteEn: "First and empty screens" },
  { file: "suggest_0.4", ko: "제안", en: "Suggest", noteKo: "추천 설정 · 다음 단계 제안", noteEn: "Recommendations, next step" },
  { file: "searching_0.75", ko: "찾는 중", en: "Searching", noteKo: "빠진 인물 찾기", noteEn: "Finding a missing character" },
];

const LUMI_BG = "radial-gradient(circle at 50% 55%, rgba(255,43,214,0.18), rgba(5,7,13,0) 70%)";

/** Newest work, listed ahead of the archive in WORK_PROJECTS. Indexes are
 * URL ids, so they continue from the existing set rather than renumbering. */
export const RECENT_PROJECTS: WorkProject[] = [
  {
    index: "09",
    isNew: true,
    title: { ko: "Tale Studio 리뉴얼", en: "Tale Studio Renewal" },
    category: {
      ko: "AI 영상 제작 서비스 · 캐릭터 & 제작 흐름 리뉴얼",
      en: "AI video studio — character & production-flow renewal",
    },
    tags: ["Systems & Tools", "Brand & Identity"],
    stage: { ko: "진행 중", en: "In progress" },
    skills: ["Character System", "Motion Spec", "UX Flow", "Prototyping", "Dev Handoff"],
    client: { ko: "Tale Studio", en: "Tale Studio" },
    roles: [
      { label: { ko: "캐릭터 리뉴얼", en: "Character renewal" }, value: { ko: "Lumi 상태 17종 설계", en: "17 Lumi states" } },
      { label: { ko: "제작 흐름 재설계", en: "Flow redesign" }, value: { ko: "플로우 차트 · 동작 프로토타입", en: "Flow chart · working prototype" } },
      { label: { ko: "개발 전달", en: "Dev handoff" }, value: { ko: "기존 → 리뉴얼 변경 명세", en: "Before → after change spec" } },
    ],
    description: {
      ko: "아이디어 한 줄에서 영상까지 만들어 주는 AI 제작 서비스 Tale Studio의 리뉴얼에 참여하고 있습니다. 에이전트 캐릭터 Lumi가 지금 무엇을 하는지 한눈에 읽히도록 상태 17종을 설계했고, 뒤섞여 있던 제작 단계를 Producer → Writer → Artist → Storyboard로 다시 나눠 실제로 눌러 볼 수 있는 프로토타입으로 만들었습니다.",
      en: "I'm part of the renewal of Tale Studio, an AI service that takes a one-line idea all the way to video. I designed 17 states for its agent character Lumi so users can always read what the AI is doing, and re-split a tangled production pipeline into Producer → Writer → Artist → Storyboard — delivered as a clickable prototype.",
    },
    situation: {
      ko: "기존 제품은 단계가 섞여 있었습니다. Writer 안에서 산문을 쓰다가 그림과 샷까지 다뤘고, AI가 작업하는 동안에도 화면 일부는 그대로 열려 있어 요청이 겹치곤 했습니다. AI가 지금 읽는 중인지, 쓰는 중인지, 멈춘 건지도 화면에서 알기 어려웠습니다.",
      en: "Stages were tangled: Writer handled prose, then drawings and shots too, and parts of the screen stayed live while the AI was working, so requests collided. It was also hard to tell from the screen whether the AI was reading, writing, or stuck.",
    },
    task: {
      ko: "단계를 하는 일의 성격대로 나누고, AI가 일하는 상태를 캐릭터의 움직임만으로 읽히게 만드는 것.",
      en: "Split the stages by the kind of work they do, and make the AI's state readable from the character's motion alone.",
    },
    reflection: {
      ko: "해피 패스만 그리면 화면은 금방 나옵니다. 하지만 이 서비스의 어려움은 분기와 오류, 되돌아가는 흐름에 있었습니다. 플로우에서 그 구간들을 먼저 설계하고 화면을 그리니, 캐릭터의 상태도 '어느 화면에서, 어떤 크기로, 몇 초 동안'까지 정해서 넘길 수 있었습니다.",
      en: "Drawing only the happy path gets you screens fast — but this product's difficulty lived in branches, errors, and rollbacks. Designing those in the flow first meant even the character's states could be handed off as 'which screen, what size, for how long.'",
    },
    cover: `${TS}/assets/lumi_original.webp`,
    coverFit: "contain",
    coverBg: LUMI_BG,
    links: [
      { label: { ko: "Lumi 상태 17종 보기", en: "Lumi — 17 states" }, url: "https://claude.ai/artifact/LbhbVTNxmxQLcq8WyPzAc1" },
      { label: { ko: "리뉴얼 프로토타입", en: "Renewal prototype" }, url: "https://claude.ai/artifact/C5xmoMhBQq9Juh3AeTP4Z2" },
    ],
    story: [
      {
        id: "lumi",
        label: { ko: "캐릭터 · Lumi 상태 17종", en: "Character — 17 Lumi states" },
        title: {
          ko: "원본 일러스트는 그대로, 움직임만으로 상태를 말하게.",
          en: "Keep the original illustration — let motion alone say the state.",
        },
        body: [
          {
            ko: "원본 Lumi 일러스트를 유지하면서 몸통 안의 코랄 레드 그라데이션 물결, 꼬리, 눈, 주변 방울만 움직여 17개 상태를 표현했습니다. 상태를 바꿀 때는 0.35초 동안 이어서 전환돼 툭 끊기지 않습니다.",
            en: "The original Lumi artwork stays intact; only the coral-red gradient wave inside the body, the tail, the eyes, and the surrounding bubbles move to express 17 states. Switching states blends over 0.35s so nothing snaps.",
          },
          {
            ko: "상태는 쓰임에 따라 세 묶음입니다. 모든 단계에서 쓰는 공통 상태 5종, 긴 로딩을 채우는 '만드는 중' 5종, 한 번 재생하고 기본으로 돌아가는 '특별한 순간' 7종.",
            en: "States fall into three groups by use: 5 common states used everywhere, 5 'making' states that fill long loads, and 7 'moments' that play once and return to idle.",
          },
        ],
        columns: 4,
        images: LUMI_POSES.map((p) => ({
          src: `${TS}/keyposes/${p.file}.webp`,
          fit: "contain" as const,
          bg: LUMI_BG,
          caption: { ko: `${p.ko} — ${p.noteKo}`, en: `${p.en} — ${p.noteEn}` },
        })),
      },
      {
        id: "sizes",
        label: { ko: "크기별 설계", en: "Designed per size" },
        items: [
          {
            label: { ko: "40px · 채팅 아바타", en: "40px · chat avatar" },
            note: { ko: "기본 · 듣는 중 · 생각 중 · 완료 · 오류. 작은 크기에서도 눈과 몸짓만으로 구분되도록.", en: "Idle, listening, thinking, complete, error — distinguishable by eyes and posture even this small." },
          },
          {
            label: { ko: "200px · 로딩 · 확인 팝업", en: "200px · loading & confirm" },
            note: { ko: "읽는 중 · 쓰는 중 · 고치는 중 · 그리는 중 · 연출 중. 몇 초에서 몇 분까지 이어지는 대기를 이야기로 채움.", en: "Reading, writing, editing, drawing, directing — turning waits of seconds to minutes into a small story." },
          },
          {
            label: { ko: "320px · 첫 화면 · 단계 전환", en: "320px · first screen & transitions" },
            note: { ko: "인사 · 다음 단계로. 화면을 날아 나갔다 반대편에서 들어오며 단계가 바뀐 것을 알림.", en: "Greeting and next-stage — Lumi flies out and back in from the other side to mark a stage change." },
          },
        ],
      },
      {
        id: "flow",
        label: { ko: "제작 흐름 재설계", en: "Re-splitting the pipeline" },
        title: {
          ko: "단계가 하는 일대로: 산문은 Writer, 그림은 Artist, 샷은 Storyboard.",
          en: "Stages by the work they do: prose in Writer, art in Artist, shots in Storyboard.",
        },
        flow: {
          before: [
            { ko: "P1 기초 세팅", en: "P1 setup" },
            { ko: "P2 Producer", en: "P2 Producer" },
            { ko: "Writer 01~04 씬 스토리", en: "Writer 01–04 scenes" },
            { ko: "넘기기 · 러닝타임 검사", en: "Hand-off runtime check" },
            { ko: "Writer 05~15 그림·샷·러프", en: "Writer 05–15 art, shots" },
            { ko: "Artist (자동)", en: "Artist (auto)" },
            { ko: "Director", en: "Director" },
          ],
          after: [
            { ko: "Producer 아이디어·조건", en: "Producer idea & terms" },
            { ko: "Writer 산문만", en: "Writer prose only" },
            { ko: "산문 확정", en: "Lock prose" },
            { ko: "Artist 인물·배경", en: "Artist cast & sets" },
            { ko: "완료하기", en: "Complete" },
            { ko: "Storyboard 씬·샷·러프", en: "Storyboard shots" },
            { ko: "Director", en: "Director" },
          ],
        },
        items: [
          {
            label: { ko: "넘어간 단계는 '잠금'이 아니라 '완료'", en: "Passed stages are 'done', not 'locked'" },
            note: { ko: "뒤 단계의 변화(인물 추가 · 모습 · 샷)를 앞 단계로 다시 맞추지 않습니다. Artist ⇄ Storyboard만 오가며 고칩니다.", en: "Later changes (new cast, looks, shots) never sync back. Only Artist ⇄ Storyboard go back and forth." },
          },
          {
            label: { ko: "AI가 일하는 동안 화면 전체 잠금", en: "Full-screen lock while the AI works" },
            note: { ko: "생성 요청이 겹치지 않도록, 모든 입력을 막고 Lumi의 '만드는 중' 상태로 대기를 보여줍니다.", en: "Every input pauses so requests can't collide, and Lumi's 'making' states carry the wait." },
          },
          {
            label: { ko: "직접 고치기는 팝업에서만", en: "Manual edits live in a popup" },
            note: { ko: "열려 있는 동안 채팅을 잠가, 채팅과 손 편집이 같은 데이터를 동시에 건드리지 않게 했습니다.", en: "Chat locks while it's open, so chat and hand edits never touch the same data at once." },
          },
          {
            label: { ko: "롤백은 꼭 필요할 때만", en: "Rollback only when it must" },
            note: { ko: "산문에 없는 인물 · 배경이 필요할 때만 산문으로 되돌아가며, 영향받는 샷과 예상 크레딧을 먼저 보여줍니다.", en: "Only a cast member or set missing from the prose sends you back — with affected shots and estimated credits shown first." },
          },
        ],
      },
      {
        id: "method",
        label: { ko: "설계 방식", en: "How it was designed" },
        body: [
          {
            ko: "해피 패스(정상 흐름)만이 아니라 분기(예/아니오)에 따른 대안 흐름, 오류 시 예외 흐름, 롤백 가능 · 불가 구간까지 플로우 차트에서 먼저 설계하고 화면을 그렸습니다. 프로토타입에서 화면을 고르면 플로우의 해당 노드가 표시되고, 플로우의 노드를 누르면 그 화면으로 이동합니다.",
            en: "Beyond the happy path, alternate flows on every yes/no branch, exception flows on errors, and where rollback is or isn't possible were all designed in the flow chart before any screen was drawn. Picking a screen in the prototype highlights its node in the flow, and clicking a node jumps to that screen.",
          },
          {
            ko: "개발 전달 문서에는 기능마다 기존 → 리뉴얼과 처리(보존 · 바뀜 · 이동 · 신규 · 기능 분리 · 삭제), 개발에 닿는 곳을 화면 ID와 함께 정리해, 명세에서 바로 해당 프로토타입 화면을 열 수 있게 했습니다.",
            en: "The dev handoff lists every feature as before → after with its disposition (kept, changed, moved, new, split, removed) and where it touches the code, keyed by screen ID so any row opens its prototype screen.",
          },
        ],
      },
    ],
  },
  {
    index: "10",
    isNew: true,
    title: { ko: "NAIL 로고 디자인", en: "NAIL Logo Design" },
    category: {
      ko: "국회 인공지능 도서관 BI · AI 챗봇 적용",
      en: "National Assembly AI Library identity — AI chatbot",
    },
    tags: ["Brand & Identity", "Public"],
    stage: { ko: "제안", en: "Proposal" },
    skills: ["Logo Design", "Visual Identity", "Grid System", "Chatbot UI"],
    client: { ko: "국회 인공지능 도서관", en: "National Assembly AI Library" },
    roles: [
      { label: { ko: "로고 디자인", en: "Logo design" }, value: { ko: "TYPE-1 · TYPE-2 두 안", en: "Two directions — TYPE-1 · TYPE-2" } },
      { label: { ko: "적용 시안", en: "Application" }, value: { ko: "AI 챗봇 화면", en: "AI chatbot screens" } },
    ],
    description: {
      ko: "국회 인공지능 도서관(National Assembly AI Library)의 로고를 두 방향으로 제안했습니다. 공공기관의 신뢰감을 단단한 직선으로 담은 TYPE-1, 2025 타이포그래피 트렌드인 스크래치(절단) 기법과 그라데이션으로 AI의 유연함을 담은 TYPE-2. 두 안 모두 '책'과 'AI의 별'이라는 같은 상징에서 출발합니다.",
      en: "Two logo directions for the National Assembly AI Library (NAIL). TYPE-1 carries public-sector trust in solid straight strokes; TYPE-2 uses 2025's scratch (cut) typography trend and a gradient for AI's flexibility. Both start from the same symbols: the book, and the AI star.",
    },
    situation: {
      ko: "인공지능 도서관의 얼굴은 도서관이 가진 무게감과, '누구나 물어볼 수 있는 AI'라는 새로운 성격을 함께 담아야 했습니다.",
      en: "The face of an AI library had to hold both a library's weight and a new character — an AI anyone can ask.",
    },
    task: {
      ko: "책 · 북마크 · 별이라는 도서관과 AI의 상징을, 공공기관의 신뢰와 친근함 사이 두 방향으로 풀어내는 것.",
      en: "Express the library and AI symbols — book, bookmark, star — in two directions between public trust and approachability.",
    },
    cover: `${NAIL}/nail_cover.webp`,
    story: [
      {
        id: "type1",
        label: { ko: "TYPE-1 · 신뢰의 직선", en: "TYPE-1 · Straight lines of trust" },
        title: {
          ko: "펼쳐진 책의 그림자 위로 떠오르는 별.",
          en: "A star rising over the shadow of an opened book.",
        },
        body: [
          {
            ko: "직선적이고 두꺼운 형태로 지식과 정보의 무게감, 공공기관으로서의 신뢰감을 전달하면서도, 단순하고 안정적인 구조로 국민 누구나 쉽게 다가갈 수 있는 친근한 인상을 만들었습니다.",
            en: "Thick, straight forms carry the weight of knowledge and the trust of a public institution, while a simple, stable structure keeps it approachable for every citizen.",
          },
          {
            ko: "'A'는 책이 펼쳐지며 생기는 그림자와 그 위에 떠오른 별로 AI가 제공하는 통찰과 미래지향성을, 'I'는 북마크처럼 표현해 정보를 기억하고 저장하는 도서관의 핵심 기능을 상징합니다.",
            en: "The 'A' is the shadow of an opening book with a star floating above it — the insight AI brings. The 'I' is a bookmark: remembering and storing information, the library's core job.",
          },
        ],
        columns: 1,
        images: [
          { src: `${NAIL}/nail_type1.jpg`, caption: { ko: "TYPE-1 — 그리드 · 아웃라인 · 컬러 · 의미 설명", en: "TYPE-1 — grid, outline, color, rationale" }, fit: "contain", bg: "#ffffff" },
        ],
        colors: [
          { hex: "#1F398D", name: { ko: "네이비 · 신뢰", en: "Navy · trust" } },
          { hex: "#2178F9", name: { ko: "블루 · 지식", en: "Blue · knowledge" } },
          { hex: "#0046E2", name: { ko: "딥 블루 · 그림자", en: "Deep blue · shadow" } },
        ],
      },
      {
        id: "type2",
        label: { ko: "TYPE-2 · 유연한 지식 공간", en: "TYPE-2 · A flexible knowledge space" },
        title: {
          ko: "세워진 책들 사이에 'AI'를 놓다.",
          en: "Setting 'AI' between books standing on a shelf.",
        },
        body: [
          {
            ko: "2025년 로고 트렌드인 스크래치(절단) 타이포그래피를 활용해 '책'의 형태와 AI의 미래지향적 이미지를 결합했습니다. 곡선형 구조는 세워진 책을 연상시키고, 그라데이션은 방대한 지식과 데이터의 흐름을 시각화합니다.",
            en: "Built on 2025's scratch (cut) typography trend, combining the shape of books with AI's forward-looking image. Curved strokes read as books standing upright; the gradient visualizes vast knowledge and data in motion.",
          },
          {
            ko: "'n'과 'l'은 소문자로 부드럽게 처리해 누구나 다가가기 쉬운 지식 공간을, 그 사이 'AI'는 핵심 가치를 강조합니다. 상단의 별은 AI가 이끄는 미래와 창의적 인사이트를 뜻합니다.",
            en: "Lowercase 'n' and 'l' soften the mark into a space anyone can enter, with 'AI' set between them as the core value. The star above stands for an AI-led future and creative insight.",
          },
        ],
        columns: 1,
        images: [
          { src: `${NAIL}/nail_type2.jpg`, caption: { ko: "TYPE-2 — 그리드 · 아웃라인 · 컬러 · 의미 설명", en: "TYPE-2 — grid, outline, color, rationale" }, fit: "contain", bg: "#ffffff" },
        ],
        colors: [
          { hex: "#3362F6", name: { ko: "코발트", en: "Cobalt" } },
          { hex: "#9282EF", name: { ko: "라벤더", en: "Lavender" } },
          { hex: "#24B4F3", name: { ko: "스카이", en: "Sky" } },
        ],
      },
      {
        id: "chatbot",
        label: { ko: "적용 시안 · AI 챗봇", en: "Applied — AI chatbot" },
        pending: {
          ko: "로고를 실제 AI 챗봇 화면에 적용한 시안과 챗봇 창 디자인을 준비 중입니다. 곧 이 자리에 공개됩니다.",
          en: "Screens applying the logo to the AI chatbot, and the chat window design itself, are being prepared — they'll land here soon.",
        },
      },
    ],
  },
  {
    index: "11",
    isNew: true,
    title: { ko: "1AM VAPE", en: "1AM VAPE" },
    category: { ko: "전자담배 온라인 쇼핑몰", en: "Vape e-commerce store" },
    tags: ["Business"],
    skills: ["E-commerce"],
    url: "https://1amvape.com/",
    description: {
      ko: "전자담배 브랜드 1AM VAPE의 온라인 쇼핑몰 작업입니다. 실제 운영 중인 사이트에서 결과물을 확인할 수 있습니다.",
      en: "Online store work for the vape brand 1AM VAPE. The live store is linked below.",
    },
    story: [
      {
        id: "screens",
        label: { ko: "화면", en: "Screens" },
        pending: {
          ko: "메인 · 상품 목록 · 상세 · 장바구니 화면 캡처와 작업 과정을 정리하고 있습니다. 그동안 라이브 사이트에서 먼저 확인해 주세요.",
          en: "Captures of the home, listing, product, and cart screens — and the process behind them — are being written up. Meanwhile, the live store is one click away.",
        },
      },
    ],
  },
];
