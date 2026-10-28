/** Preset Q&A for the SYS-BOT chat. Answers come only from Soomin's resume
 * (scripts/build-resume.py) — there's no AI behind it, so the bot can't
 * wander off-topic or invent facts. Keep the two in sync. */

type Copy = { ko: string; en: string };

export interface FaqItem {
  id: string;
  q: Copy;
  a: Copy;
  links?: { label: Copy; href: string }[];
}

export const RESUME_FAQ: FaqItem[] = [
  {
    id: "who",
    q: { ko: "어떤 디자이너예요?", en: "Who is Soomin?" },
    a: {
      ko: "7년 차 UI/UX 디자이너예요. 한국과 캐나다에서 공공기관·커머스·스몰비즈니스 프로젝트를 해왔고, 기능을 어떻게 묶고 화면 어디에 두고 어떤 순서로 보여줄지 — 정보 구조와 화면 설계가 주특기예요.",
      en: "A UI/UX designer with 7 years across public-sector, commerce and small-business work in Korea and Canada. Her specialty is information architecture and interface design — how features are grouped, where they sit on screen, and in what order people meet them.",
    },
  },
  {
    id: "now",
    q: { ko: "요즘 어떤 작업을 해요?", en: "What is she working on now?" },
    a: {
      ko: "2023년부터 밴쿠버에서 프리랜서 UI/UX · 브랜드 디자이너로 일하고 있어요. AI 영상 서비스 테일 스튜디오 리뉴얼을 맡았고, 그 외에도 1AM VAPE, Woo Commercial 등 다양한 웹사이트 제작, 브로슈어, 브랜딩, 콘텐츠 제작을 함께 하고 있어요.",
      en: "Since 2023 she's been a freelance UI/UX & brand designer in Vancouver — leading the Tale Studio (AI video) renewal, plus a steady mix of website builds (1AM VAPE, Woo Commercial and more), brochures, branding and content production.",
    },
    links: [{ label: { ko: "테일 스튜디오 보기", en: "See Tale Studio" }, href: "/work/09" }],
  },
  {
    id: "tale",
    q: { ko: "테일 스튜디오에서 뭘 했어요?", en: "What did she do on Tale Studio?" },
    a: {
      ko: "프로듀서 → 작가 → 아티스트 → 스토리보드로 이어지는 서비스 전체 구조를 다시 설계하고, 단계별 프로세스·플로우 차트를 작성했어요. 단일 파일 인터랙티브 프로토타입과 개발 핸드오프 문서를 만들고, Figma로 UI를 디자인하고, 가이드 캐릭터 ‘루미’를 17가지 상태로 제작했어요.",
      en: "She re-architected the whole pipeline (Producer → Writer → Artist → Storyboard), wrote the step-by-step process and flow charts, built a single-file interactive prototype with a dev handoff spec, designed the UI in Figma, and created the Lumi guide character in 17 animated states.",
    },
    links: [{ label: { ko: "미션 열기", en: "Open mission" }, href: "/work/09" }],
  },
  {
    id: "brand",
    q: { ko: "브랜딩·콘텐츠 작업도 해요?", en: "Does she do branding & content?" },
    a: {
      ko: "네! 로고·아이덴티티, 브로슈어 같은 인쇄물, 마케팅 콘텐츠를 만들어요. 국회 인공지능 도서관(NAIL) 로고 디자인, 1AM VAPE 브랜드 필름(기획부터 AI 생성·편집까지)이 대표 작업이에요.",
      en: "Yes — logos and identity, brochures and print, and marketing content. Highlights: the NAIL logo for the National Assembly AI Library, and the 1AM VAPE brand film, which she planned, generated with AI and edited.",
    },
    links: [
      { label: { ko: "NAIL 로고", en: "NAIL logo" }, href: "/work/10" },
      { label: { ko: "1AM VAPE 필름", en: "1AM VAPE film" }, href: "/work/11" },
    ],
  },
  {
    id: "career",
    q: { ko: "경력이 어떻게 돼요?", en: "What's her experience?" },
    a: {
      ko: "랜드소프트(서울)에서 2020–2022년 UI/UX 디자인 팀 리드로 4인 팀을 이끌며 연 4~5건 이상의 대형 공공·기업 웹 프로젝트를 제안부터 오픈까지 총괄했고, 2023년부터는 같은 프로젝트를 프리랜서로 이어가고 있어요. 그 전엔 레드로켓(캠퍼스펀드)에서 UI/UX·마케팅 디자이너, KstarAD에서 시각·마케팅 디자이너로 일했어요.",
      en: "At Landsoft (Seoul) she led a four-person team as UI/UX Design Team Lead (2020–2022), running 4–5+ large public-sector and enterprise web projects a year from proposal to launch — and has continued on them freelance since 2023. Before that: UI/UX & marketing designer at Red Rocket (Campus Fund), and visual & marketing designer at KstarAD.",
    },
  },
  {
    id: "public",
    q: { ko: "공공 프로젝트는 뭘 했어요?", en: "Which public-sector projects?" },
    a: {
      ko: "한국예술종합학교 학사행정시스템 개편, 외교부 조약정보 검색시스템(조약 3,000건+) UX 설계, 국립박물관문화재단 뮷즈(MU:DS) 커머스 리뉴얼, 국립중앙박물관 홈페이지 리뉴얼 제안이 있어요. 복잡한 시스템을 사용자 목적 중심으로 재편하는 게 공통점이에요.",
      en: "The Korea National University of Arts admin system, the Ministry of Foreign Affairs treaty search system (3,000+ treaties), the MU:DS museum-shop commerce renewal, and a National Museum of Korea site renewal proposal — each one reorganising a dense system around what users actually came to do.",
    },
    links: [{ label: { ko: "전체 미션", en: "All missions" }, href: "/work" }],
  },
  {
    id: "strength",
    q: { ko: "가장 큰 강점은요?", en: "What's her biggest strength?" },
    a: {
      ko: "정보 밀도가 높고 복잡한 서비스를 정리하는 일이에요. 학사행정이나 공공 데이터베이스처럼 메뉴가 부서 기준으로 흩어진 시스템을 사용자의 이용 목적 기준으로 다시 짜고, 조회 영역과 입력 폼을 분리해 인지 부하를 낮추는 식이죠.",
      en: "Untangling dense, complex systems. Think admin platforms and government databases organised by department — she regroups them around user intent, and splits read-only from editable areas so busy screens stay calm.",
    },
  },
  {
    id: "code",
    q: { ko: "개발도 할 줄 알아요?", en: "Can she code?" },
    a: {
      ko: "Claude Code, VS Code, Codex 같은 AI 도구로 직접 동작하는 프로토타입을 만들어요. HTML/CSS/JS/React 구조를 이해하고 있어서, 정적 화면이 아니라 실제로 동작하는 흐름으로 개발자에게 전달해요. 웹사이트는 WordPress, Shopify, Next.js로 구축해요.",
      en: "She builds working prototypes with AI tools (Claude Code, VS Code, Codex) and understands HTML/CSS/JS/React structure, so developers get working flows instead of static screens. Sites ship on WordPress, Shopify and Next.js.",
    },
  },
  {
    id: "tools",
    q: { ko: "주로 쓰는 툴은?", en: "Which tools does she use?" },
    a: {
      ko: "Figma, Photoshop, Illustrator, WordPress, Shopify — 그리고 AI 기반 프로토타이핑 도구(Claude Code, VS Code, Codex)를 써요.",
      en: "Figma, Photoshop, Illustrator, WordPress and Shopify — plus AI-assisted prototyping with Claude Code, VS Code and Codex.",
    },
  },
  {
    id: "where",
    q: { ko: "어디서, 언제부터 일할 수 있어요?", en: "Where is she, and when can she start?" },
    a: {
      ko: "캐나다 BC주 버나비에 사는 영주권자(PR)이고, 즉시 근무 가능해요. 한국어는 모국어, 영어는 비즈니스 회화가 가능해요.",
      en: "She's in Burnaby, BC, a Canadian permanent resident, and available immediately. Korean is her native language; English is professional working level.",
    },
  },
  {
    id: "contact",
    q: { ko: "연락하고 싶어요!", en: "How do I contact her?" },
    a: {
      ko: "이메일 ssssssu984@gmail.com 으로 연락 주세요. 이력서는 아래에서 바로 받을 수 있어요.",
      en: "Email ssssssu984@gmail.com — and you can grab her resume right here.",
    },
    links: [
      { label: { ko: "메일 보내기", en: "Send email" }, href: "mailto:ssssssu984@gmail.com" },
      { label: { ko: "이력서 (EN)", en: "Resume (EN)" }, href: "/media/Soomin_Park_Resume.pdf" },
      { label: { ko: "이력서 (KO)", en: "Resume (KO)" }, href: "/media/Soomin_Park_Resume_KO.pdf" },
    ],
  },
];
