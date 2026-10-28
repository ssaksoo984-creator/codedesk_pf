import type { WorkProject } from "./work-content";

const TS = "/media/home_work/talestudio";

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
      ko: "AI 영상 제작 서비스 · 아키텍처 · UX 프로세스 · UI 디자인 · 프로토타입",
      en: "AI video studio — architecture, UX process, UI design & prototype",
    },
    tags: ["Systems & Tools", "Built by Me", "Brand & Identity"],
    stage: { ko: "진행 중", en: "In progress" },
    skills: ["Service Architecture", "User Flow", "Figma Design System", "HTML Prototype", "Dev Handoff", "Character System"],
    client: { ko: "Tale Studio", en: "Tale Studio" },
    roles: [
      { label: { ko: "아키텍처 · 프로세스", en: "Architecture & process" }, value: { ko: "단계 재정의 · 단계별 플로우 차트", en: "Stage model · per-stage flow charts" } },
      { label: { ko: "UI 디자인", en: "UI design" }, value: { ko: "Figma — 파운데이션 · 컴포넌트 · 4단계 화면", en: "Figma — foundations, components, 4 stages" } },
      { label: { ko: "프로토타입", en: "Prototype" }, value: { ko: "플로우와 연동된 단일 HTML 파일", en: "Single-file HTML, wired to the flow" } },
      { label: { ko: "개발 전달", en: "Dev handoff" }, value: { ko: "기존 → 리뉴얼 변경 명세", en: "Before → after change spec" } },
      { label: { ko: "캐릭터 · 로고", en: "Character & logo" }, value: { ko: "Lumi 상태 17종 · TAil 로고", en: "17 Lumi states · TAil logo" } },
    ],
    description: {
      ko: "아이디어 한 줄에서 영상까지 만들어 주는 AI 제작 서비스 Tale Studio의 리뉴얼을 처음부터 끝까지 맡았습니다. 뒤섞여 있던 제작 단계를 Producer → Writer → Artist → Storyboard로 다시 나누는 아키텍처를 세우고, 단계마다 정상 · 분기 · 오류 · 롤백 흐름을 플로우 차트로 설계했습니다. 그 위에 Figma로 디자인 시스템과 전 단계 화면을 디자인하고, 플로우와 연동되는 단일 파일 프로토타입과 개발 전달 문서까지 만들었습니다. 에이전트 캐릭터 Lumi의 상태 17종도 함께 설계했습니다.",
      en: "I led Tale Studio's renewal end to end — an AI service that takes a one-line idea to video. I re-architected a tangled pipeline into Producer → Writer → Artist → Storyboard, designed every stage's happy, branching, error and rollback flows as flow charts, then designed the design system and every screen in Figma, built a single-file prototype wired to those flows, and wrote the dev handoff. I also designed 17 states for the agent character, Lumi.",
    },
    situation: {
      ko: "기존 제품은 단계가 섞여 있었습니다. Writer 안에서 산문을 쓰다가 그림과 샷까지 다뤘고, 넘어가는 순간마다 러닝타임 검사 같은 장벽이 있었습니다. AI가 작업하는 동안에도 화면 일부가 열려 있어 요청이 겹쳤고, 어디서 무엇이 바뀌었는지 개발과 기획이 같은 그림을 보기 어려웠습니다.",
      en: "Stages were tangled: Writer handled prose, then drawings and shots, with gates like a runtime check at every hand-off. Parts of the screen stayed live while the AI worked, so requests collided — and design and engineering struggled to share one picture of what was changing where.",
    },
    task: {
      ko: "단계를 하는 일의 성격대로 다시 나누고, 모든 분기와 예외를 먼저 설계한 뒤, 그대로 눌러 보고 개발에 넘길 수 있는 형태로 만드는 것.",
      en: "Re-split the stages by the work they do, design every branch and exception first, and deliver it in a form you can click through and hand straight to engineering.",
    },
    reflection: {
      ko: "해피 패스만 그리면 화면은 금방 나옵니다. 하지만 이 서비스의 어려움은 분기와 오류, 되돌아가는 흐름에 있었습니다. 아키텍처와 플로우를 먼저 세우고 화면을 그리니, Figma 화면 · 프로토타입 · 개발 명세가 모두 같은 화면 ID로 묶여 한 언어로 이야기할 수 있었습니다.",
      en: "Drawing only the happy path gets you screens fast — but this product's difficulty lived in branches, errors and rollbacks. Setting the architecture and flows first meant the Figma screens, the prototype and the dev spec all share one set of screen IDs — one language for everyone.",
    },
    cover: "/media/covers/09.webp?v=2",
    links: [
      { label: { ko: "프로토타입 열기", en: "Open prototype" }, url: "/proto/tale-studio.html" },
      { label: { ko: "Lumi 상태 17종", en: "Lumi — 17 states" }, url: "https://claude.ai/artifact/LbhbVTNxmxQLcq8WyPzAc1" },
    ],
    story: [
      {
        id: "flow",
        label: { ko: "아키텍처 · 단계 재정의", en: "Architecture — redefining stages" },
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
        id: "loading",
        label: { ko: "AI가 일하는 시간 · Lumi 로딩", en: "While the AI works — Lumi loading" },
        title: {
          ko: "기다림을 캐릭터의 이야기로: 읽고, 쓰고, 그리고, 연출하는 Lumi.",
          en: "Turning waits into a character's story — Lumi reads, writes, draws and directs.",
        },
        body: [
          {
            ko: "AI가 일하는 동안에는 화면 전체가 잠기기 때문에, 그 몇 초에서 몇 분을 사용자가 '멈췄다'고 느끼지 않게 만드는 것이 중요했습니다. 단계마다 Lumi가 그 일을 직접 하는 모습으로 보여 주고, 진행률과 지금 하는 일을 체크리스트로 함께 띄웠습니다. 아래는 실제 Lumi 렌더러로 다시 만든 로딩 화면입니다.",
            en: "The whole screen locks while the AI works, so the real job was making those seconds-to-minutes never feel frozen. Each stage shows Lumi doing that very work, alongside progress and a live checklist. Below are the loading screens rebuilt with the actual Lumi renderer.",
          },
        ],
        widget: "lumi-loading",
      },
      {
        id: "flowchart",
        label: { ko: "단계별 프로세스 · 플로우 차트", en: "Per-stage process — flow charts" },
        title: {
          ko: "화면보다 흐름을 먼저: 정상 · 분기 · 오류 · 롤백까지.",
          en: "Flow before screens — happy path, branches, errors and rollbacks.",
        },
        body: [
          {
            ko: "단계마다 해피 패스뿐 아니라 예/아니오 분기에 따른 대안 흐름, 오류 시 예외 흐름, 롤백이 가능한 구간과 불가능한 구간을 플로우 차트로 먼저 설계했습니다. 화면 · 팝업 · 분기 · AI 작업 중 잠금 · 오류 · 새로 생김 · 롤백 · 잠기는 값을 범례로 구분해, 노드 하나만 봐도 그 화면의 성격을 알 수 있게 했습니다.",
            en: "For every stage I designed not just the happy path but alternate flows on each yes/no branch, exception flows on errors, and where rollback is or isn't possible. A legend separates screens, popups, branches, AI-lock states, errors, new screens, rollbacks and locked values, so any node reads at a glance.",
          },
        ],
        embed: { src: "/proto/tale-studio.html?tab=flow&embed=1", label: { ko: "플로우 차트", en: "Flow chart" }, height: 820 },
      },
      {
        id: "prototype",
        label: { ko: "단일 파일 프로토타입", en: "Single-file prototype" },
        title: {
          ko: "플로우와 화면이 서로를 가리키는 프로토타입.",
          en: "A prototype where the flow and the screens point at each other.",
        },
        body: [
          {
            ko: "프로토타입 · 플로우 · 내용 정리 세 탭을 하나의 HTML 파일에 담았습니다. 프로토타입에서 화면을 고르면 옆 플로우 차트의 해당 노드가 빨갛게 표시되고, 플로우의 노드를 누르면 그 화면으로 이동합니다. 1안(화면에서 고르기)과 2안(채팅으로 만들기)을 토글로 비교할 수 있습니다.",
            en: "Prototype, flow and spec tabs live in one HTML file. Picking a screen lights its node in the flow chart beside it; clicking a node jumps to that screen. Plan A (pick on screen) and Plan B (build by chat) toggle side by side.",
          },
        ],
        embed: { src: "/proto/tale-studio.html?tab=proto&embed=1", label: { ko: "프로토타입", en: "Prototype" }, height: 860 },
      },
      {
        id: "design",
        label: { ko: "UI 디자인 · Figma", en: "UI design — Figma" },
        title: {
          ko: "파운데이션부터 4단계 화면까지, 하나의 시스템으로.",
          en: "From foundations to all four stages, one system.",
        },
        body: [
          {
            ko: "브랜드 그라데이션과 TAil 로고, 단계 아이콘, 사이드바 내비게이션(완료 · 진행 중 · 예정), 모드 토글(화면 · 채팅), 선택 칩 · 옵션 카드, Lumi 채팅 말풍선, 로딩 카드까지 컴포넌트로 만들고, Producer · Writer · Artist · Storyboard의 모든 화면을 플로우의 화면 ID 그대로 디자인했습니다.",
            en: "Brand gradients and the TAil logo, stage icons, sidebar navigation (done · current · upcoming), a screen/chat mode toggle, choice chips and option cards, Lumi chat bubbles and loading cards became components — and every Producer, Writer, Artist and Storyboard screen was designed under the same screen IDs as the flow.",
          },
        ],
        columns: 2,
        images: [
          { src: "/media/home_work/talestudio/figma/p_e1.webp", caption: { ko: "E1 · Producer — 이야기 재료", en: "E1 · Producer — story material" } },
          { src: "/media/home_work/talestudio/figma/p_eb3.webp", caption: { ko: "EB3 · Producer 2안 — 채팅으로 장르 · 분위기 고르기", en: "EB3 · Producer plan B — genre & mood by chat" } },
          { src: "/media/home_work/talestudio/figma/w_w1.webp", caption: { ko: "W1 · Writer — 산문 작업공간", en: "W1 · Writer — prose workspace" } },
          { src: "/media/home_work/talestudio/figma/a_a5.webp", caption: { ko: "A5 · Artist — 인물 · 배경 결과 (버전 기록)", en: "A5 · Artist — cast & sets with versions" } },
          { src: "/media/home_work/talestudio/figma/a_a7.webp", caption: { ko: "A7 · Artist — 상세 팝업", en: "A7 · Artist — detail popup" } },
          { src: "/media/home_work/talestudio/figma/s_s1.webp", caption: { ko: "S1 · Storyboard — 러프 스토리보드", en: "S1 · Storyboard — rough board" } },
          { src: "/media/home_work/talestudio/figma/s_s2.webp", caption: { ko: "S2 · Storyboard — 샷 고치기 (조명 추가)", en: "S2 · Storyboard — shot editing with lighting" } },
          { src: "/media/home_work/talestudio/figma/c_nav.webp", caption: { ko: "컴포넌트 — 단계 내비게이션 · 모드 토글", en: "Components — stage navigation & mode toggle" } },
        ],
      },
      {
        id: "handoff",
        label: { ko: "개발 전달", en: "Dev handoff" },
        body: [
          {
            ko: "기능마다 기존 → 리뉴얼과 처리(보존 · 바뀜 · 이동 · 신규 · 기능 분리 · 삭제), 개발에 닿는 곳을 화면 ID와 함께 표로 정리했습니다. 명세의 화면 ID를 누르면 프로토타입의 해당 화면이 열리고, 프로토타입에서 화면을 고르면 그 화면의 변경 내용이 설명 아래 붙습니다.",
            en: "Every feature is tabled as before → after with its disposition (kept, changed, moved, new, split, removed) and where it touches the code, keyed by screen ID. Clicking an ID opens that prototype screen; picking a screen in the prototype pins its changes under the description.",
          },
        ],
        embed: { src: "/proto/tale-studio.html?tab=spec&embed=1", label: { ko: "개발 전달 명세", en: "Dev handoff spec" }, height: 760 },
      },
      {
        id: "lumi",
        label: { ko: "캐릭터 · Lumi 17종", en: "Character — Lumi, 17 states" },
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
        label: { ko: "캐릭터 크기별 설계", en: "Character, per size" },
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
    ],
  },
  {
    index: "10",
    isNew: true,
    title: { ko: "NAIL 로고 · AI 검색 챗봇", en: "NAIL Logo & AI Search Chatbot" },
    category: {
      ko: "국회 인공지능 도서관 BI · 의미기반 검색 챗봇 적용",
      en: "National Assembly AI Library identity — applied to a semantic-search chatbot",
    },
    tags: ["Brand & Identity", "Public"],
    stage: { ko: "제안", en: "Proposal" },
    skills: ["Logo Design", "Visual Identity", "Grid System", "Chatbot UI"],
    client: { ko: "국회 인공지능 도서관", en: "National Assembly AI Library" },
    roles: [
      { label: { ko: "로고 디자인", en: "Logo design" }, value: { ko: "TYPE-1 · TYPE-2 두 안", en: "Two directions — TYPE-1 · TYPE-2" } },
      { label: { ko: "적용 시안", en: "Application" }, value: { ko: "AI 의미기반 검색 챗봇 UI · 프로토타입", en: "AI semantic-search chatbot UI & prototype" } },
    ],
    description: {
      ko: "국회 인공지능 도서관(National Assembly AI Library)의 로고를 두 방향으로 제안했습니다. 공공기관의 신뢰감을 단단한 직선으로 담은 TYPE-1, 2025 타이포그래피 트렌드인 스크래치(절단) 기법과 그라데이션으로 AI의 유연함을 담은 TYPE-2. 두 안 모두 '책'과 'AI의 별'이라는 같은 상징에서 출발합니다. TYPE-1 로고는 국회전자도서관 AI 의미기반 검색 챗봇 화면에 적용해 동작하는 프로토타입으로 만들었습니다.",
      en: "Two logo directions for the National Assembly AI Library (NAIL). TYPE-1 carries public-sector trust in solid straight strokes; TYPE-2 uses 2025's scratch (cut) typography trend and a gradient for AI's flexibility. Both start from the same symbols: the book, and the AI star. TYPE-1 was then applied to the library's AI semantic-search chatbot, built as a working prototype.",
    },
    situation: {
      ko: "인공지능 도서관의 얼굴은 도서관이 가진 무게감과, '누구나 물어볼 수 있는 AI'라는 새로운 성격을 함께 담아야 했습니다.",
      en: "The face of an AI library had to hold both a library's weight and a new character — an AI anyone can ask.",
    },
    task: {
      ko: "책 · 북마크 · 별이라는 도서관과 AI의 상징을, 공공기관의 신뢰와 친근함 사이 두 방향으로 풀어내는 것.",
      en: "Express the library and AI symbols — book, bookmark, star — in two directions between public trust and approachability.",
    },
    cover: "/media/covers/10.webp",
    links: [{ label: { ko: "챗봇 프로토타입 열기", en: "Open chatbot prototype" }, url: "/proto/nail-search.html" }],
    story: [
      {
        id: "type1",
        label: { ko: "디자인 1 · TYPE-1", en: "Design 1 · TYPE-1" },
        title: {
          ko: "펼쳐진 책의 그림자 위로 떠오르는 별.",
          en: "A star rising over the shadow of an opened book.",
        },
        widget: "nail-type1",
        notes: [
          {
            heading: { ko: "컨셉", en: "Concept" },
            text: {
              ko: "직선적이고 두꺼운 형태를 통해 지식과 정보의 무게감, 공공기관으로서의 신뢰감을 전달하면서도, 단순하고 안정적인 구조로 국민 누구나 쉽게 접근할 수 있는 친근한 인공지능 도서관의 이미지를 표현했습니다. 전반적인 형태는 책, 북마크, 별 등의 상징을 담아내며, 미래지향적이면서도 따뜻한 인상을 주는 디자인을 지향합니다.",
              en: "Thick, straight forms carry the weight of knowledge and information and the trust of a public institution, while a simple, stable structure presents a friendly AI library that every citizen can approach easily. The overall form holds the symbols of the book, the bookmark and the star — aiming for a design that feels forward-looking yet warm.",
            },
          },
          {
            heading: { ko: "로고 의미", en: "What the mark means" },
            text: {
              ko: "‘A’는 책이 펼쳐지며 생기는 그림자와 그 위에 떠오른 별 형태를 통해, 인공지능(AI)이 제공하는 통찰과 미래지향성을 상징합니다. ‘I’는 북마크처럼 표현되어, 정보를 기억하고 저장하는 기능을 상징하며 도서관의 핵심 기능을 시각적으로 보여줍니다. 전체적으로는 정제된 정보, 국민을 위한 개방성, 미래 기술의 신뢰성을 동시에 담은 디자인입니다.",
              en: "The ‘A’ — the shadow cast as a book opens, with a star rising above it — stands for the insight and forward-looking vision AI brings. The ‘I’ is drawn as a bookmark, standing for remembering and storing information: the library's core function, made visible. Altogether it holds refined information, openness for the public, and the trustworthiness of future technology.",
            },
          },
        ],
        colors: [
          { hex: "#1F398D", name: { ko: "네이비 · 신뢰", en: "Navy · trust" } },
          { hex: "#2179F9", name: { ko: "블루 · 지식", en: "Blue · knowledge" } },
          { hex: "#0046E2", name: { ko: "딥 블루 · 그림자", en: "Deep blue · shadow" } },
        ],
      },
      {
        id: "type2",
        label: { ko: "디자인 2 · TYPE-2", en: "Design 2 · TYPE-2" },
        title: {
          ko: "세워진 책들 사이에 'AI'를 놓다.",
          en: "Setting 'AI' between books standing on a shelf.",
        },
        widget: "nail-type2",
        notes: [
          {
            heading: { ko: "컨셉", en: "Concept" },
            text: {
              ko: "2025년 로고 디자인 트렌드인 ‘스크래치(절단) 타이포그래피’를 활용해, ‘책’의 형태와 인공지능(AI)의 미래지향적 이미지를 결합한 디자인입니다. 곡선형 구조는 세워진 책을 연상시키며, 전체적으로 소문자 중심의 유연한 형태 안에 ‘AI’를 시각적으로 강조하여 기술성과 친근함을 동시에 표현했습니다. 그라데이션은 방대한 지식과 데이터를 시각화하며, 도서관의 정보 흐름을 현대적으로 해석합니다.",
              en: "Built on 2025's logo trend of ‘scratch (cut) typography’, the design combines the shape of a book with the forward-looking image of AI. Curved strokes recall books standing upright, and ‘AI’ is emphasised inside a flexible, lowercase-led form to express both technology and approachability. The gradient visualises vast knowledge and data — a modern reading of the library's flow of information.",
            },
          },
          {
            heading: { ko: "로고 의미", en: "What the mark means" },
            text: {
              ko: "‘n’과 ‘l’은 소문자 형태로 처리되어 부드럽고 누구나 접근하기 쉬운 지식 공간을 상징하며, 이 소문자 사이에 ‘AI’를 배치함으로써 인공지능이라는 핵심 가치를 시각적으로 강조하였습니다. 상단의 별 형태는 AI가 이끄는 미래, 그리고 창의적 인사이트를 상징합니다. 전반적으로 이 로고는 누구나 자유롭게 이용할 수 있는 개방형 지식 플랫폼이자, 기술과 정보가 유기적으로 연결되는 지식 생태계를 표현합니다.",
              en: "The lowercase ‘n’ and ‘l’ stand for a soft knowledge space anyone can enter, and placing ‘AI’ between them puts the core value — artificial intelligence — front and centre. The star at the top stands for an AI-led future and creative insight. Altogether the mark expresses an open knowledge platform anyone can use freely: an ecosystem where technology and information connect organically.",
            },
          },
        ],
        colors: [
          { hex: "#24B4F4", name: { ko: "스카이", en: "Sky" } },
          { hex: "#305ADA", name: { ko: "코발트", en: "Cobalt" } },
          { hex: "#9282F0", name: { ko: "라벤더", en: "Lavender" } },
        ],
      },
      {
        id: "chatbot",
        label: { ko: "적용 · AI 의미기반 검색 챗봇", en: "Applied — AI semantic-search chatbot" },
        title: {
          ko: "키워드 대신 문장으로 묻고, 근거와 함께 답을 받는 도서관.",
          en: "A library you ask in sentences — and that answers with its sources.",
        },
        body: [
          {
            ko: "TYPE-1 로고를 국회전자도서관 AI 의미기반 검색 화면에 적용했습니다. 로고 팔레트(네이비 · 로열 · 스카이)는 아껴 쓰고, 화면의 주인공은 질문과 답이 되도록 넓은 여백과 차분한 회색 위계를 잡았습니다.",
            en: "The TYPE-1 mark is applied to the National Assembly e-library's AI semantic search. The logo palette (navy, royal, sky) is used sparingly so the question and the answer stay the heroes, set on generous space and a quiet grey hierarchy.",
          },
        ],
        items: [
          {
            label: { ko: "추천 질문으로 시작", en: "Start from suggested questions" },
            note: { ko: "빈 검색창 앞에서 막막하지 않도록, 문장형 질문 예시 카드와 '질문 잘하는 법' 팁을 첫 화면에 둡니다.", en: "Sentence-style example cards and a 'how to ask' tip sit on the first screen so a blank box never stalls anyone." },
          },
          {
            label: { ko: "근거가 붙은 요약 답변", en: "Answers with numbered sources" },
            note: { ko: "요약의 각 문단에 번호를 달아, 누르면 그 근거가 된 원문 자료로 바로 이어집니다. AI 답변의 신뢰를 원문으로 확인하게 했습니다.", en: "Each paragraph of the summary carries numbers that open the source documents behind it — trust is checked against the originals." },
          },
          {
            label: { ko: "관련 자료 · 이어서 묻기", en: "Related material & follow-ups" },
            note: { ko: "답변 아래 자료 유형(연구보고서 · 학술논문 · 단행본) 카드와 이어서 물어볼 질문을 붙여 탐색이 끊기지 않게 했습니다.", en: "Typed source cards (reports, papers, books) and follow-up prompts under each answer keep exploration going." },
          },
          {
            label: { ko: "이용자별 자료 범위 안내", en: "Scope by user type" },
            note: { ko: "이용 가이드에서 일반 이용자와 국회 직원이 검색할 수 있는 자료 범위를 구분해 보여 줍니다.", en: "The guide separates what the public and Assembly staff can each search." },
          },
        ],
        embed: { src: "/proto/nail-search.html", label: { ko: "NAIL AI 검색", en: "NAIL AI search" }, height: 780 },
        columns: 2,
        images: [
          { src: "/media/home_work/nail/chatbot/n_home.webp", caption: { ko: "첫 화면 — 문장으로 묻는 검색창과 추천 질문", en: "Home — sentence search and suggested questions" } },
          { src: "/media/home_work/nail/chatbot/n_answer.webp", caption: { ko: "답변 — 번호로 근거가 연결된 요약 · 관련 자료", en: "Answer — summary with numbered sources, related items" } },
          { src: "/media/home_work/nail/chatbot/n_guide.webp", caption: { ko: "이용 가이드 — 시스템 소개 · 자료 유형 · 이용 방법", en: "Guide — about, source types, how to use" } },
          { src: "/media/home_work/nail/chatbot/n_mobile.webp", caption: { ko: "모바일", en: "Mobile" }, fit: "contain", bg: "#eef3fc" },
        ],
      },
    ],
  },
  {
    index: "11",
    isNew: true,
    title: { ko: "1AM VAPE", en: "1AM VAPE" },
    category: { ko: "캐나다 전자담배 도매 브랜드 · B2B 리테일러 사이트", en: "Canadian vape wholesale brand — B2B retailer site" },
    tags: ["Business", "Built by Me", "Brand & Identity"],
    skills: ["Brand Website", "AI Brand Film", "B2B Commerce", "Motion & Interaction", "Responsive", "Compliance UX"],
    client: { ko: "1AM (VANSKAI TRADING LTD.)", en: "1AM (VANSKAI TRADING LTD.)" },
    roles: [
      { label: { ko: "사이트 디자인 · 구축", en: "Site design & build" }, value: { ko: "브랜드 사이트 · 리테일러 주문 흐름", en: "Brand site & retailer ordering flow" } },
      { label: { ko: "브랜드 영상", en: "Brand film" }, value: { ko: "기획 · AI 영상 제작 · 편집", en: "Concept, AI generation & edit" } },
    ],
    video: "/media/home_work/1am/brand-film-loop.mp4",
    url: "https://1amvape.com/",
    cover: "/media/covers/11.webp",
    description: {
      ko: "캐나다의 라이선스 리테일러에게만 판매하는 전자담배 도매 브랜드 1AM의 사이트입니다. 소비자에게 직접 팔지 않는 B2B 구조라, '예쁜 쇼핑몰'보다 '믿고 입점할 수 있는 브랜드'로 보이는 것이 목표였습니다. 메인을 여는 브랜드 영상은 직접 기획하고 AI로 제작했고, 15가지 맛의 컬러를 그대로 브랜드 비주얼로 쓰고, 연령 인증 · 보건 경고 · 리테일러 가입과 주문 흐름까지 규제 안에서 설계했습니다.",
      en: "The site for 1AM, a vape wholesale brand that sells only to licensed Canadian retailers. Being B2B — never selling to consumers — the goal was to read as a brand retailers can trust, not just a pretty store. The brand film that opens the home page was concepted and produced with AI by me, the 15 flavour colours became the visual identity, and age gating, health warnings, retailer sign-up and ordering were all designed within the regulations.",
    },
    situation: {
      ko: "전자담배는 광고와 판매 방식이 엄격하게 규제되는 상품입니다. 19세 미만 접근을 막아야 하고, 모든 화면에 보건 경고가 보여야 하며, 일반 소비자가 아니라 라이선스를 가진 리테일러만 주문할 수 있어야 했습니다.",
      en: "Vapes are tightly regulated in how they're shown and sold: under-19s must be kept out, a health warning must be on every screen, and only licensed retailers — not consumers — may order.",
    },
    task: {
      ko: "규제를 지키면서도 리테일러가 '이 브랜드를 들이고 싶다'고 느끼게 만들고, 가입 → 승인 → 주문까지 막힘없이 안내하는 것.",
      en: "Stay compliant while making retailers want to carry the brand — and guide them smoothly from application to approval to ordering.",
    },
    story: [
      {
        id: "film",
        label: { ko: "브랜드 영상 · 기획 & AI 제작", en: "Brand film — concept & AI production" },
        title: {
          ko: "사이트의 첫 3초를 영상 한 편으로.",
          en: "The site's first three seconds, as one film.",
        },
        body: [
          {
            ko: "메인 히어로에서 재생되는 22초 브랜드 영상을 직접 기획하고 AI 영상 생성으로 제작했습니다. 크리스털 바디 클로즈업으로 제품의 질감을 먼저 보여 주고, 15가지 맛이 한 줄로 늘어선 라인업 → 핑크 구름 속으로 들어가는 전환 → 구름 위를 떠다니는 제품 → 맛별 컬러가 흩어진 플랫레이로 이어지는 흐름입니다.",
            en: "I concepted the 22-second brand film that plays in the home hero and produced it with AI video generation. It opens on a close-up of the crystal body for texture, then the 15-flavour lineup in a row → a dive into pink clouds → products floating above them → a flat-lay scattered with every flavour colour.",
          },
          {
            ko: "영상의 핑크 · 라벤더 톤과 무지갯빛 제품 컬러가 그대로 사이트 전체의 그라데이션 팔레트가 되도록, 영상과 화면 디자인을 하나의 비주얼 시스템으로 맞췄습니다.",
            en: "The film's pink-lavender tone and rainbow product colours were carried straight into the site's gradient palette, so film and interface read as one visual system.",
          },
        ],
        video: { src: "/media/home_work/1am/brand-film.mp4", poster: "/media/home_work/1am/brand-film-poster.webp", caption: { ko: "1AM 브랜드 영상 (22초) — 기획 · AI 제작 · 편집", en: "1AM brand film (22s) — concept, AI generation, edit" } },
      },
      {
        id: "identity",
        label: { ko: "비주얼 · 15가지 맛의 컬러", en: "Visual — 15 flavour colours" },
        title: { ko: "제품의 컬러가 곧 브랜드.", en: "The product's colours are the brand." },
        body: [
          {
            ko: "크리스털처럼 투명한 바디 안에 맛마다 다른 그라데이션 코어가 보이는 제품 특징을 그대로 사이트의 언어로 옮겼습니다. 첫 화면은 15가지 맛이 무지개처럼 펼쳐지고, 라인업 섹션은 제품마다 고유한 그라데이션 배경으로 바뀝니다.",
            en: "The product's clear crystal body with a gradient core per flavour became the site's language: the hero fans out all 15 flavours like a rainbow, and each lineup section switches to that product's own gradient.",
          },
        ],
        columns: 2,
        images: [
          { src: "/media/home_work/1am/hero.webp", caption: { ko: "히어로 — STOCKED FOR retail, 15가지 맛 라인업", en: "Hero — Stocked for retail, all 15 flavours" } },
          { src: "/media/home_work/1am/about.webp", caption: { ko: "BUILT FOR licensed retailers — B2B 브랜드임을 먼저 밝힘", en: "Built for licensed retailers — B2B stated up front" } },
          { src: "/media/home_work/1am/slim.webp", caption: { ko: "라인업 01 · SLIM HYBRID — 판매 중", en: "Lineup 01 · Slim Hybrid — available" } },
          { src: "/media/home_work/1am/lineup.webp", caption: { ko: "라인업 02 · 20ML MAX — 출시 예정, 알림 신청", en: "Lineup 02 · 20ml Max — coming soon, get notified" } },
          { src: "/media/home_work/1am/features.webp", caption: { ko: "SLIM OUTSIDE. Loud inside. — 제품 특징 콜아웃", en: "Slim outside, loud inside — feature callouts" } },
          { src: "/media/home_work/1am/stock.webp", caption: { ko: "STOCK 1AM — 리테일러 가입 유도", en: "Stock 1AM — retailer sign-up CTA" } },
        ],
      },
      {
        id: "compliance",
        label: { ko: "규제 안에서의 UX", en: "UX within regulation" },
        items: [
          { label: { ko: "19+ 연령 확인", en: "19+ age gate" }, note: { ko: "진입 시 연령 확인을 먼저 거치게 하고, 확인 전에는 콘텐츠가 보이지 않습니다.", en: "Age confirmation comes first; nothing shows until it's passed." } },
          { label: { ko: "모든 화면 상단 보건 경고", en: "Health warning on every screen" }, note: { ko: "Health Canada 니코틴 경고 문구를 고정 바로 두어 어떤 페이지에서도 사라지지 않게 했습니다.", en: "Health Canada's nicotine warning is a fixed bar that never leaves any page." } },
          { label: { ko: "소비자 직판 없음을 명시", en: "No direct-to-consumer, stated clearly" }, note: { ko: "히어로 · 소개 · 푸터에서 반복해 '라이선스 리테일러 전용'임을 알리고, 결제 수단(Interac e-Transfer · CAD)과 라이선스 번호를 푸터에 표기했습니다.", en: "Hero, about and footer repeat 'licensed retailers only'; payment (Interac e-Transfer, CAD) and the licence number sit in the footer." } },
        ],
      },
      {
        id: "retailer",
        label: { ko: "리테일러 여정", en: "Retailer journey" },
        body: [
          {
            ko: "Become a Retailer → 심사(영업일 1~2일) → 승인 메일 → 로그인 후 주문까지, 리테일러가 밟는 단계를 How to Order와 FAQ에서 순서대로 안내하고, 가입 폼은 사업자 정보 중심으로 짧게 구성했습니다.",
            en: "Become a retailer → review (1–2 business days) → approval email → log in and order: How to Order and the FAQ walk retailers through each step in order, and the application form stays short and business-focused.",
          },
        ],
        columns: 3,
        images: [
          { src: "/media/home_work/1am/page_order.webp", caption: { ko: "How to Order", en: "How to Order" } },
          { src: "/media/home_work/1am/page_retailer.webp", caption: { ko: "Become a Retailer — 가입 신청", en: "Become a Retailer — application" } },
          { src: "/media/home_work/1am/page_faq.webp", caption: { ko: "FAQ", en: "FAQ" } },
        ],
      },
      {
        id: "mobile",
        label: { ko: "반응형", en: "Responsive" },
        columns: 4,
        images: [
          { src: "/media/home_work/1am/m_home.webp", caption: { ko: "모바일 — 메인", en: "Mobile — home" } },
          { src: "/media/home_work/1am/m_slim.webp", caption: { ko: "모바일 — 제품", en: "Mobile — product" } },
          { src: "/media/home_work/1am/page_slim.webp", caption: { ko: "데스크톱 — 제품 상세 (맛 슬라이더)", en: "Desktop — product with flavour slider" } },
          { src: "/media/home_work/1am/page_about.webp", caption: { ko: "데스크톱 — About", en: "Desktop — About" } },
        ],
      },
    ],
  },
];
