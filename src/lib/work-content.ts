interface Copy {
  ko: string;
  en: string;
}

interface IANode {
  label: Copy;
  children?: Copy[];
}

interface ColorSwatch {
  hex: string;
  name: Copy;
  role: Copy;
}

interface GuideImage {
  src: string;
  caption: Copy;
  /** When set (on 2+ images in the same panel), shows a Dark/Light toggle
   * instead of stacking every image. */
  theme?: "dark" | "light";
  /** "mobile" renders inside a phone-shaped frame instead of a flat image. */
  device?: "desktop" | "mobile";
  /** When set, plays as a looping muted clip instead of the static `src` —
   * `src` still serves as the poster frame. */
  video?: string;
}

interface GuideListItem {
  label: Copy;
  note?: Copy;
}

interface DeviceShot {
  src: string;
  caption: Copy;
}

/** One toggle-able tab in a project's Design Guide. Only the fields that
 * apply to that tab need to be set — a panel can mix e.g. images + list. */
interface GuidePanel {
  id: string;
  label: Copy;
  intro?: Copy;
  list?: GuideListItem[];
  tree?: IANode[];
  /** Relative-rank bars — qualitative order, not a precise metric. Labeled as
   * such in the UI so it never reads as invented hard analytics. */
  ranking?: GuideListItem[];
  /** Real, sourced percentages — bar width is the literal value, unlike
   * `ranking`'s qualitative order. `source` is shown so a hard number never
   * reads as invented. */
  percentBars?: {
    label: Copy;
    value: number;
    note?: Copy;
  }[];
  percentBarsSource?: Copy;
  /** Ranked hypotheses (e.g. drop-off causes), rendered as a plain numbered list. */
  causes?: GuideListItem[];
  /** "How I solved it" callout, shown after ranking/causes. */
  resolution?: Copy;
  colors?: ColorSwatch[];
  images?: GuideImage[];
  /** A PC/Mobile toggle showing one full-page capture at a time, scrollable
   * inside a fixed-height device frame — for showcasing a tall responsive
   * screen where a single flat screenshot can't show the whole page. */
  responsive?: {
    desktop: DeviceShot;
    mobile: DeviceShot;
  };
  /** Two captures shown side by side at once (not a toggle) — for making a
   * contrast visible in a single glance, e.g. "the info bar's color follows
   * whichever exhibition is on." A toggle would hide the very comparison
   * this is meant to show. */
  compare?: {
    left: DeviceShot;
    right: DeviceShot;
  };
  /** A numbered process timeline (01 → 02 → 03…), connected by a line and
   * revealed step by step with a staggered animation on mount — for a
   * sequence that IS the point (an argument order, a pipeline), as opposed
   * to `list`'s plain numbered rundown of otherwise-parallel items. */
  steps?: GuideListItem[];
  /** Hex color for `steps`' connecting line and node border — falls back to
   * a neutral white if a project doesn't have a single accent to match. */
  stepsAccent?: string;
  /** Side-by-side comparison cards (e.g. two user types) — distinct from
   * `list`'s stacked numbered rows, for a 2–3-way contrast meant to be
   * scanned at a glance rather than read top to bottom. */
  compareCards?: { label: Copy; note: Copy }[];
  /** A feature ↔ reason two-column table, for "what it does / why it's
   * there" pairs — e.g. a viewer's feature list against the reading
   * situation each one solves. */
  featureTable?: { feature: Copy; reason: Copy }[];
  /** Zone callouts shown alongside a screenshot (e.g. "left: summary card,
   * right: input form") — a legend next to the image rather than labels
   * pixel-positioned on top of it, which would break the moment the
   * screenshot itself changes. */
  zones?: { label: Copy; note: Copy }[];
}

/** Design breakdown shown on a project's detail page — the specific tabs
 * vary per project (a marketing site documents layout/IA/colors; a SaaS
 * design piece might document IA/design-system/responsive instead).
 * Optional: only projects actually documented this way carry it. */
export interface DesignGuide {
  panels: GuidePanel[];
}

export interface WorkProject {
  index: string;
  title: { ko: string; en: string };
  category: { ko: string; en: string };
  tags?: string[];
  /** Build stage — e.g. "Proposal" for design-only work with no live
   * deployment. Shown as its own badge next to `tags` rather than folded
   * into them, since it's a different axis (stage, not category/sector). */
  stage?: Copy;
  description?: { ko: string; en: string };
  /** Longer designer's-note paragraph — the thinking behind the work, not
   * just what it is. Shown under the short description. */
  process?: Copy;
  /** Tools/skills used, shown as pills near the tags. */
  skills?: string[];
  /** What was actually mine on this project, stated as a percentage per
   * area rather than one blanket credit — e.g. "UI Design 100%" next to
   * "IA — contributed (worked from a planner's draft)". A flat "involved
   * in IA" reads as vague; naming exactly what was 100% mine and where the
   * line sits on shared work reads as more honest, not less impressive. */
  roles?: { label: Copy; value: Copy }[];
  /** Who commissioned it — shown in the header meta block. */
  client?: Copy;
  /** Sticky preview panel shows a video when set, otherwise falls back to image. */
  image?: string;
  video?: string;
  /** Omitted for design-only work with no live deployment — the "Visit site" CTA hides itself. */
  url?: string;
  designGuide?: DesignGuide;
  /** STAR case-study framing — Situation & Task / (Action == designGuide,
   * nested as its own sub-tabs) / Reflection, shown as top-level tabs on
   * the detail page. Optional: only set for projects documented this way;
   * everything else keeps the plain single-level Design Guide. */
  situation?: Copy;
  task?: Copy;
  reflection?: Copy;
  /** Pulled from public listings/nav (grid, list, prev/next) without deleting
   * the entry — use VISIBLE_WORK_PROJECTS, not WORK_PROJECTS, anywhere the
   * site actually renders a link a visitor could reach. */
  hidden?: boolean;
}

// Only real, shipped projects go here — the list grows as more come in, so
// keep it short rather than padding it out with placeholders.
export const WORK_PROJECTS: WorkProject[] = [
  {
    index: "01",
    title: { ko: "Bloom Soft", en: "Bloom Soft" },
    category: {
      ko: "테크 기업 사이트",
      en: "Technology Company Website",
    },
    tags: ["Built by Me", "Business"],
    skills: ["Next.js", "Motion & Interaction", "Visual Identity", "Vibe Coding (Claude Code)"],
    description: {
      ko: "IT 융합·디지털 혁신을 표방하는 기술 기업 블룸소프트의 브랜드 사이트입니다. 어두운 배경 위에 레드 포인트 컬러 하나로 존재감을 만들고, 스크롤을 따라 진행되는 인트로 애니메이션으로 첫인상을 설계했습니다.",
      en: "A brand site for Bloom Soft, an IT-convergence and digital-innovation company. Presence comes from one red accent against a near-black base, with a scroll-driven intro sequence setting the first impression.",
    },
    process: {
      ko: "기획·디자인·프론트엔드 개발을 전부 혼자 진행했고, 코드 구현은 Claude Code와의 바이브 코딩으로 완성했습니다. 이런 유형의 IT 기업 소개 사이트는 서비스 라인업이 많고 다루는 숫자와 조직 정보도 많아, 자칫하면 텍스트로 빽빽한 소개 자료처럼 보이기 쉽습니다. 색을 레드 하나로 제한하고, 진입 순간부터 하나의 애니메이션 시퀀스로 시작해 스크롤을 따라 콘텐츠가 차례로 드러나게 함으로써, 정보량이 많은 사이트도 처음부터 끝까지 하나의 이야기처럼 읽히도록 만드는 것이 과제였습니다.",
      en: "I ran planning, design, and frontend development solo, building the code itself through vibe coding with Claude Code. A B2B IT-company site like this carries a lot of service lines, numbers, and org information — the kind of content that easily reads as a dense corporate binder. The challenge was keeping color down to one red accent and opening with a single animated sequence, so scrolling reveals content in order and the whole thing reads as one continuous story instead of a stack of separate sections.",
    },
    image: "/media/home_work/work_05_company.png",
    url: "https://bloomcompany-xgvi.vercel.app/",
    designGuide: {
      panels: [
        {
          id: "intro",
          label: { ko: "인트로 애니메이션", en: "Intro Animation" },
          intro: {
            ko: "페이지에 접속하면 회전하는 다이아몬드 윤곽선이 화면을 가득 채우고, 그 선이 한 점으로 모였다가 리플처럼 번지며 'BLOOMing Innovation / SOFTening Complexity' 헤드라인이 드러납니다. 영상이나 GIF 없이 전부 코드로 짠 애니메이션입니다.",
            en: "On load, a rotating diamond outline fills the screen, collapses to a point, and ripples outward to reveal the headline — \"BLOOMing Innovation / SOFTening Complexity.\" No video, no GIF — the whole sequence is built in code.",
          },
          images: [
            {
              src: "/media/home_work/bloomsoft/intro-02-headline.png",
              video: "/media/home_work/bloomsoft/bloomsoft_ani.mp4",
              caption: {
                ko: "다이아몬드 윤곽선이 리플로 번지며 헤드라인이 드러나는 시퀀스",
                en: "The diamond outline ripples outward into the headline reveal",
              },
              device: "desktop",
            },
          ],
          resolution: {
            ko: "회사 이름 자체가 'Bloom(피어나다)'과 'Soft(부드럽다)'의 합성어입니다. 이 의미를 그대로 타이핑해서 보여주는 대신, 무언가 응축되었다가 펼쳐지는 움직임으로 표현하고 싶었습니다. 로딩을 그냥 흘려보내는 몇 초 대신, 그 몇 초 자체를 브랜드를 각인시키는 장치로 썼습니다.",
            en: "The company name itself is a blend of Bloom and Soft. Rather than just typing that meaning out, I wanted to express it as motion — something condensing, then unfolding. Instead of letting the first few seconds pass as dead loading time, I used that window itself as the device that plants the brand.",
          },
        },
        {
          id: "flow",
          label: { ko: "콘텐츠 흐름", en: "Content Flow" },
          intro: {
            ko: "Solution(기술 역량) → Portfolio(수행 이력) → Client & Partner(신뢰 지표) → Value & Vision(핵심 가치) → Department(조직) → Contact 순서로, '무엇을 잘하는가 → 무엇을 해왔는가 → 왜 믿을 수 있는가 → 어떤 회사인가'로 이어지는 설득의 순서를 그대로 스크롤 순서에 앉혔습니다.",
            en: "Solution (capabilities) leads to Portfolio (track record), then Client & Partner (trust signals), Value & Vision (what the company stands for), Department (org), and Contact. The scroll order mirrors an argument: what we're good at, what we've done, why that's credible, who we are.",
          },
          stepsAccent: "#E85141",
          steps: [
            {
              label: { ko: "Solution", en: "Solution" },
              note: {
                ko: "AI·데이터, UI·UX 설계, 보안 최적화, 클라우드·DevOps 4개 역량을 번호를 매겨 나열.",
                en: "Four capabilities — AI & Data, UI/UX, Security, Cloud & DevOps — laid out as a numbered set.",
              },
            },
            {
              label: { ko: "Portfolio", en: "Portfolio" },
              note: {
                ko: "SM·SI·Database·AI·Security·Cloud로 태그를 달아, 같은 팀이 여러 유형의 프로젝트를 소화한다는 걸 한눈에 보여줌.",
                en: "Each project tagged SM, SI, Database, AI, Security, or Cloud — showing at a glance that one team covers every project type.",
              },
            },
            {
              label: { ko: "Client & Partner", en: "Client & Partner" },
              note: {
                ko: "PROJECT·CLIENT·PARTNER 숫자가 화면에 들어오는 시점에 0에서 실제 값까지 올라가는 카운트업으로, 정지된 숫자보다 훨씬 눈에 들어옵니다.",
                en: "PROJECT, CLIENT, and PARTNER counts count up from zero the moment they scroll into view — far more noticeable than a static number.",
              },
            },
            {
              label: { ko: "Value & Vision", en: "Value & Vision" },
              note: {
                ko: "핵심 가치 4개를 레드 글로우가 번지는 원 안에 하나씩 배치.",
                en: "Four core values, each set inside a circle with a red glow radiating outward.",
              },
            },
          ],
          resolution: {
            ko: "IT 기업 소개 사이트는 보여줘야 할 정보가 많아서, 순서를 잘못 잡으면 그냥 자료 나열이 됩니다. 이 회사를 처음 알게 된 사람이 신뢰하기까지 필요한 순서를 기준으로 섹션을 배치했고, 그 순서를 그대로 스크롤 순서로 옮겼습니다.",
            en: "A company site like this has a lot to show, and get the order wrong and it just becomes a stack of facts. I sequenced the sections around what a first-time visitor needs, in order, to end up trusting the company — and mapped that sequence directly onto the scroll.",
          },
        },
        {
          id: "tone",
          label: { ko: "톤 앤 매너", en: "Tone & Manner" },
          intro: {
            ko: "배경은 거의 검은색에 가까운 다크 톤 하나로 고정하고, 포인트 컬러도 레드 하나만 씁니다. 로고의 'BLOOM' 안 동그라미 하나를 레드 점으로 바꿔, 로고 자체에도 같은 포인트 컬러가 들어가도록 했습니다.",
            en: "The background stays fixed to one near-black dark tone, and there's exactly one accent color: red. Even the logo carries it — one of the O's in \"BLOOM\" is recolored into a red dot.",
          },
          colors: [
            {
              hex: "#08080A",
              name: { ko: "베이스 다크", en: "Base Dark" },
              role: { ko: "전체 배경", en: "Overall background" },
            },
            {
              hex: "#E85141",
              name: { ko: "레드 포인트", en: "Red Accent" },
              role: { ko: "로고 · 라벨 · CTA · 통계 숫자", en: "Logo mark, labels, CTAs & stat highlights" },
            },
            {
              hex: "#FFFFFF",
              name: { ko: "화이트", en: "White" },
              role: { ko: "본문 텍스트 · 헤드라인", en: "Body text & headlines" },
            },
          ],
          resolution: {
            ko: "기술 기업이라는 인상은 컬러 수를 늘려서 만들어지지 않습니다. 오히려 색을 하나로 좁히고, 그 하나를 로고부터 통계 숫자, CTA 버튼까지 반복해서 등장시키는 쪽이 훨씬 정돈되고 신뢰가 가는 인상을 만듭니다. 정보량이 많은 사이트일수록 색은 적을수록 나은 경우가 많다는 걸 이 프로젝트에서 다시 확인했습니다.",
            en: "Looking technical doesn't come from adding more colors — it comes from narrowing to one and repeating it consistently, from the logo to the stat numbers to the CTA buttons. That reads as more composed and more credible than a wider palette would. The more information-dense a site is, the more often fewer colors serve it better — this project reconfirmed that.",
          },
        },
      ],
    },
  },
  {
    index: "02",
    title: { ko: "외교부 조약정보 검색시스템", en: "MOFA Treaty Search System" },
    category: {
      ko: "공공기관 조약정보 검색 시스템 UI/UX 디자인",
      en: "Public-Sector Treaty Search System UI/UX Design",
    },
    tags: ["Systems & Tools", "Public"],
    skills: ["Public Sector", "Search UX", "Document Viewer", "Responsive", "Data-Heavy"],
    client: { ko: "외교부", en: "Ministry of Foreign Affairs" },
    description: {
      ko: "대한민국이 체결한 3,000건 이상의 조약을 검색하고 원문까지 열람하는 공공기관 검색 시스템입니다.",
      en: "A public-sector search system for browsing more than 3,000 treaties the Republic of Korea has signed, down to the original scanned documents.",
    },
    situation: {
      ko: "조약 자료는 하나의 형태로 정리되지 않습니다. 양자조약과 다자조약에 따라 필요한 정보가 다르고, 협정·협약·의정서·교환각서 등 자료의 유형도 다양했습니다. 또한 한국어·몽골어·영어 원문을 나란히 대조하거나, 다른 조약과 조문을 비교하거나, 수백 페이지에 달하는 스캔 원문을 직접 확인해야 하는 경우도 있었습니다. 정보량이 방대하고 자료의 형태와 열람 방식까지 제각각인 만큼, 이를 정부기관 서비스에 요구되는 신뢰감과 가독성을 유지하면서 하나의 일관된 경험으로 제공하는 것이 필요했습니다.",
      en: "Treaty material doesn't fit one shape. Bilateral and multilateral treaties need different information on display, and the material itself varies — agreements, conventions, protocols, exchange notes. Some need their Korean, Mongolian, and English texts checked side by side; some need their articles compared against another treaty; some run hundreds of pages of scanned originals that have to be checked directly. With this much material, in that many different shapes and ways of being read, the challenge was to hold it all together as one consistent experience — without losing the trust and readability a government service requires.",
    },
    task: {
      ko: "서로 다른 형태와 열람 방식을 가진 조약 자료를 하나의 일관된 탐색 흐름 안에 담고, 사용자가 원하는 조약과 조문에 최소한의 이동으로 도달할 수 있도록 검색 결과 화면과 원문 뷰어를 설계했습니다. 다국어 원문 비교, 조문 비교, 대용량 스캔 문서 열람 등 각 자료의 특성을 고려하면서도 일관된 정보 구조와 UI 경험을 유지하고, 데스크톱부터 모바일까지 자연스럽게 이어지는 반응형 UI를 구축하는 것을 목표로 했습니다.",
      en: "Fit treaty material of every different shape and reading pattern into one consistent way of navigating, and design a search-results screen and document viewer that get visitors to the treaty and article they want in as few moves as possible. The goal was to hold a consistent information structure and UI across very different needs — multilingual comparison, cross-treaty comparison, large scanned documents — and build a responsive UI that carries through naturally from desktop to mobile.",
    },
    reflection: {
      ko: "방대한 자료를 다루는 서비스에서 가장 흔한 실패는 모든 것을 다 보여주려는 것입니다. 자료가 많을수록 '사용자가 지금 무엇을 하려는가'를 좁게 정의해야 한다는 것을 이 프로젝트에서 확인했습니다.",
      en: "The most common failure in a service handling this much material is trying to show all of it. The more material there is, the more narrowly you have to define what the user is actually trying to do right now — this project confirmed that.",
    },
    roles: [
      {
        label: { ko: "검색 결과 화면 설계", en: "Search Results Design" },
        value: { ko: "100%", en: "100%" },
      },
      {
        label: { ko: "원문 뷰어 설계", en: "Document Viewer Design" },
        value: { ko: "100%", en: "100%" },
      },
      { label: { ko: "UI 디자인", en: "UI Design" }, value: { ko: "100%", en: "100%" } },
      { label: { ko: "반응형 대응", en: "Responsive" }, value: { ko: "100%", en: "100%" } },
    ],
    image: "/media/home_work/Foreign%20Affairs/Foreign-Affairs_thum.png",
    designGuide: {
      panels: [
        {
          id: "users",
          label: { ko: "사용자 & 패턴", en: "Users & Patterns" },
          intro: {
            ko: "이 시스템을 찾는 사람은 대부분 특정 조문 하나를 확인하러 옵니다. 조약 전체를 처음부터 읽는 경우는 드뭅니다.",
            en: "Most people who come to this system are checking one specific article. Reading a treaty start to finish is rare.",
          },
          compareCards: [
            {
              label: { ko: "실무 담당자", en: "Case Officers" },
              note: {
                ko: "특정 조약의 특정 조문을 정확히 찾아야 함. 원문 대조가 필요.",
                en: "Need to find one exact article in one exact treaty, and check it against the original.",
              },
            },
            {
              label: { ko: "연구자", en: "Researchers" },
              note: {
                ko: "여러 조약을 비교하거나 언어별 표현 차이를 확인.",
                en: "Compare multiple treaties, or check how wording differs across languages.",
              },
            },
            {
              label: { ko: "일반 국민", en: "General Public" },
              note: {
                ko: "어떤 조약이 체결되었는지 확인하는 수준.",
                en: "Just checking what treaties exist.",
              },
            },
          ],
          resolution: {
            ko: "세 집단의 공통점은 '필요한 부분만 빠르게 도달하고 싶다'는 것이었습니다. 이 진단이 이후 모든 화면 설계의 기준이 되었습니다.",
            en: "What all three groups shared was wanting to reach exactly the part they needed, fast. That diagnosis became the standard behind every screen that followed.",
          },
        },
        {
          id: "search-results",
          label: { ko: "검색 결과", en: "Search Results" },
          intro: {
            ko: "조약은 종류마다 표시해야 할 항목이 다릅니다. 양자조약과 다자조약이 다르고, 협정·협약·의정서·교환각서가 각각 다른 정보를 담습니다. 결과를 단순 나열로 두면 조약 하나를 확인할 때마다 상세 페이지를 오가야 합니다. 필터·통계·목록·하위 목차를 한 화면에 배치하고, 목록을 클릭하면 그 자리에서 조문 목차가 펼쳐지도록 설계했습니다. 각 조문 옆에는 원문 페이지 범위와 원문보기 링크를 함께 두었습니다.",
            en: "Every treaty type needs different fields on display — bilateral and multilateral treaties differ, and agreements, conventions, protocols, and exchange notes each carry different information. Left as a flat list, checking a single treaty means leaving for a detail page and coming back. I placed filters, stats, the list, and article contents on one screen, so clicking a result expands its article table of contents right there — with the original-document page range and a direct viewer link next to each article.",
          },
          images: [
            {
              src: "/media/home_work/Foreign%20Affairs/02_검색결과_01_결과화면.png",
              caption: {
                ko: "결과 목록 — 조문 목차가 그 자리에서 펼쳐진 상태",
                en: "Result list — article contents expanded in place",
              },
              device: "desktop",
            },
          ],
          resolution: {
            ko: "조약을 찾는 사람은 대부분 특정 조문 하나를 확인하러 옵니다. 전체를 처음부터 읽는 경우는 드뭅니다. 그래서 목록에서 조문 단위까지 바로 내려가는 경로를 우선했습니다. 왼쪽 필터에는 각 항목 옆에 건수를 표시해, 필터를 적용하기 전에 결과 규모를 먼저 가늠할 수 있게 했습니다.",
            en: "Most people searching for a treaty are checking one specific article, not reading the whole thing from the start. So I prioritized a path that goes straight from the list down to article level. Each filter option shows its result count up front, so visitors can gauge the size of a result before they even apply it.",
          },
        },
        {
          id: "advanced-search",
          label: { ko: "상세검색", en: "Advanced Search" },
          intro: {
            ko: "조약 검색은 조건이 많습니다 — 조약 구분(양자/다자), 조약 번호 범위, 8종의 조약 유형, 5종의 날짜 기준, 대륙과 국가까지. 세로로 늘어놓으면 스크롤이 길어지고 무엇을 선택했는지 잊게 됩니다. 성격이 다른 조건을 좌우로 나눠 한 화면에 담았습니다. 왼쪽은 조약 자체의 속성(구분·번호·유형·기간), 오른쪽은 상대국 조건(대륙·국가)입니다.",
            en: "Treaty search carries a lot of conditions — bilateral/multilateral, a treaty-number range, 8 treaty types, 5 date criteria, plus continent and country. Stacked vertically, the scroll gets long and it's easy to forget what's already selected. I split conditions by kind across two columns instead: the left holds the treaty's own attributes (type, number, category, date range), the right holds the counterpart-country conditions (continent, country).",
          },
          images: [
            {
              src: "/media/home_work/Foreign%20Affairs/01_검색결과_02_상세검색팝업.png",
              caption: {
                ko: "상세검색 팝업 — 조약 속성과 상대국 조건을 좌우로 분리",
                en: "Advanced search modal — treaty attributes and counterpart-country conditions split left/right",
              },
              device: "desktop",
            },
          ],
          resolution: {
            ko: "서로 다른 축의 조건이 섞이지 않아야 지금 무엇을 좁히고 있는지 파악할 수 있습니다. 초기화와 검색 버튼은 하단에 고정해, 조건을 아무리 많이 선택해도 실행 지점을 찾아 헤매지 않도록 했습니다.",
            en: "Keeping unrelated axes of a condition from mixing is what makes it clear what's actually being narrowed down. Reset and Search stay pinned at the bottom, so no matter how many conditions get selected, the action point never gets lost.",
          },
        },
        {
          id: "compare",
          label: { ko: "비교 보기", en: "Compare View" },
          intro: {
            ko: "같은 조약을 한국어·몽골어·영어로 대조해야 할 때가 있고, 서로 다른 두 조약의 조문을 나란히 비교해야 할 때가 있습니다. 완전히 다른 두 작업이지만 사용자에게는 모두 '비교'입니다. 하나의 모달 안에서 탭으로 전환하도록 묶었습니다.",
            en: "Sometimes the same treaty needs to be checked against its Korean, Mongolian, and English texts side by side. Sometimes two different treaties' articles need to be compared instead. Technically unrelated tasks, but to the visitor both are just \"comparing\" — so I grouped them into one modal, switched by tabs.",
          },
          images: [
            {
              src: "/media/home_work/Foreign%20Affairs/01_검색결과_03_조약보기_다국어.png",
              caption: {
                ko: "동일 조약 언어 비교 — 한국어·몽골어·영어를 나란히",
                en: "Same-treaty language comparison — Korean, Mongolian, and English side by side",
              },
              device: "desktop",
            },
            {
              src: "/media/home_work/Foreign%20Affairs/01_검색결과_04_조약보기_조약비교.png",
              caption: {
                ko: "조약간 내용 비교 — 서로 다른 두 조약을 나란히",
                en: "Cross-treaty comparison — two different treaties side by side",
              },
              device: "desktop",
            },
            {
              src: "/media/home_work/Foreign%20Affairs/01_검색결과_05_조약보기_링크보기.png",
              caption: {
                ko: "본문 속 관련 협약 링크 — 팝업으로 열어 읽던 자리를 유지",
                en: "A related-treaty link inside the body — opens in its own popup so the reading position stays put",
              },
              device: "desktop",
            },
          ],
          resolution: {
            ko: "세 언어를 세로로 이어붙이면 대조가 불가능합니다. 같은 조문이 항상 같은 높이에서 시작하도록 다단 그리드로 고정하고, 조문 번호를 포인트 컬러로 표시해 해당 언어를 몰라도 위치를 따라갈 수 있게 했습니다. 왼쪽 사이드바에는 상태·체결대상국·서명일 같은 메타 정보를 접을 수 있는 형태로 두어, 본문에 집중할 때는 화면을 넓게 쓸 수 있도록 했습니다. 본문 안에 링크된 관련 협약은 별도 팝업으로 띄워, 읽던 자리를 잃지 않게 했습니다.",
            en: "Stacking three languages vertically makes comparison impossible. I locked the same article to always start at the same height across a multi-column grid, and marked article numbers in the accent color so the position stays trackable even without reading the language. The left sidebar holds metadata — status, counterpart country, signing date — as a collapsible panel, so the reading area can go full-width when that's what matters. A related treaty linked inside the body opens in its own popup instead, so the reading position never gets lost.",
          },
        },
        {
          id: "viewer",
          label: { ko: "원문 뷰어", en: "Document Viewer" },
          intro: {
            ko: "이 프로젝트에서 가장 큰 설계 과제였습니다. 조약 원문은 스캔 이미지입니다. 단순히 나열해 보여주는 방식으로는 실제로 읽을 수 없습니다. 조약은 처음부터 끝까지 순서대로 읽는 문서가 아니라, 특정 조문을 찾아 들어가고 앞뒤를 오가며 대조하고 나중에 다시 돌아와야 하는 문서이기 때문입니다. 그래서 검색 시스템의 한 화면이 아니라 독립된 문서 열람 도구로 접근했습니다. 종이 문서를 읽는 행위 자체를 화면 안에서 재현하는 것이 목표였습니다.",
            en: "This was the single biggest design challenge on this project. Treaty originals are scanned images, and simply listing them out isn't actually readable — a treaty isn't read start to finish in order, it's a document you jump into at a specific article, flip back and forth to cross-check, and return to later. So I approached this not as one screen inside the search system, but as a standalone document-reading tool. The goal was to reproduce the physical act of reading paper, inside the screen.",
          },
          featureTable: [
            {
              feature: { ko: "한 면 / 두 면 보기 전환", en: "Single / spread page toggle" },
              reason: {
                ko: "조문을 앞뒤로 대조하며 읽는 상황을 위해 책을 펼친 형태를 지원.",
                en: "Supports a book-spread layout for cross-checking adjacent pages.",
              },
            },
            {
              feature: { ko: "페이지 회전", en: "Page rotation" },
              reason: {
                ko: "가로로 서명되었거나 표가 들어간 페이지가 원문에 섞여 있음.",
                en: "Originals mix in landscape-signed pages and table pages.",
              },
            },
            {
              feature: { ko: "화면 배율 및 전체화면", en: "Zoom & fullscreen" },
              reason: {
                ko: "스캔 문서의 작은 글자를 읽어야 하는 상황에 대응.",
                en: "For reading the small print on a scanned page.",
              },
            },
            {
              feature: { ko: "배경색 전환", en: "Background toggle" },
              reason: {
                ko: "장시간 열람 시 눈의 피로를 줄이기 위한 다크 배경 제공.",
                en: "A dark-background option to ease eye strain on long reads.",
              },
            },
            {
              feature: { ko: "목차 보기", en: "Table of contents" },
              reason: {
                ko: "조문 단위로 바로 이동 — 순서대로 넘기지 않아도 되게 하는 핵심 기능.",
                en: "Jumps straight to an article — the core feature that removes the need to page through in order.",
              },
            },
            {
              feature: { ko: "책갈피", en: "Bookmarks" },
              reason: {
                ko: "참조하던 위치를 저장해 다시 돌아올 수 있게.",
                en: "Saves a position so you can come back to it later.",
              },
            },
            {
              feature: { ko: "자동 넘김", en: "Auto page-turn" },
              reason: {
                ko: "통독이 필요한 경우를 위한 보조 기능.",
                en: "A secondary feature for reading straight through.",
              },
            },
            {
              feature: {
                ko: "페이지 슬라이더 · 처음/이전/다음/마지막 · 미리보기 · 전체이미지",
                en: "Page slider, first/prev/next/last, thumbnail preview, full-image grid",
              },
              reason: {
                ko: "분량이 큰 문서에서 원하는 위치로 빠르게 이동하는 여러 경로.",
                en: "Several ways to jump quickly to a spot in a long document.",
              },
            },
            {
              feature: { ko: "국문/영문 전환, 서명 위치로 이동", en: "KO/EN switch, jump to signature page" },
              reason: {
                ko: "조약 문서 특유의 열람 패턴을 반영.",
                en: "Reflects reading patterns specific to treaty documents.",
              },
            },
          ],
          images: [
            {
              src: "/media/home_work/Foreign%20Affairs/01_검색결과_06_조약보기_조약원문보기.png",
              caption: {
                ko: "원문 뷰어 — 상단 툴바와 하단 페이지 컨트롤",
                en: "Document viewer — toolbar on top, page controls at the bottom",
              },
              device: "desktop",
            },
          ],
          resolution: {
            ko: "기능을 많이 넣되, 사용 빈도에 따라 배치를 나눴습니다. 화면 설정과 보기 방식은 상단 툴바에, 페이지 이동 컨트롤은 하단에 고정했습니다. 자주 쓰는 것이 손에 먼저 닿고, 가끔 쓰는 것은 찾으면 있는 위치에 두는 것이 원칙이었습니다. 오류신고·도움말·FAQ를 뷰어 안에서 바로 접근할 수 있게 한 것도, 원문을 보다 문제가 생겼을 때 화면을 떠나지 않게 하기 위해서였습니다.",
            en: "I packed in a lot of functionality, but split the placement by frequency of use. Display settings and view mode live in the top toolbar; page navigation stays fixed at the bottom. The rule was: what's used often should be within reach first, and what's used occasionally should still be there when you go looking for it. Error reporting, help, and FAQ are all reachable straight from inside the viewer too, so hitting a problem while reading the original never means leaving the screen.",
          },
        },
        {
          id: "responsive",
          label: { ko: "반응형", en: "Responsive" },
          intro: {
            ko: "메인 화면은 조약 체결 통계 차트, 이번달 체결 현황, 발행물 캐러셀, 최신 조약정보가 좌우로 배치됩니다. 모바일에서는 이 구조를 세로로 재배열하되, 검색창과 핵심 통계(FTA 추진 현황, 발효 조약 건수)는 상단에 그대로 유지했습니다.",
            en: "The main screen lays the treaty-signing stats chart, this month's signings, a publications carousel, and the latest treaty info side by side. On mobile this reflows vertically, while the search bar and the key stats — FTA progress, in-force treaty count — stay pinned at the top exactly as on desktop.",
          },
          responsive: {
            desktop: {
              src: "/media/home_work/Foreign%20Affairs/00_main_02_변형.png",
              caption: { ko: "메인 화면 (PC)", en: "Main screen (Desktop)" },
            },
            mobile: {
              src: "/media/home_work/Foreign%20Affairs/00_main_02_변형_mo.png",
              caption: { ko: "메인 화면 (모바일)", en: "Main screen (Mobile)" },
            },
          },
          resolution: {
            ko: "좌우 2단 구조를 그대로 축소하면 차트 수치를 읽을 수 없습니다. 섹션을 세로로 완전히 분리하고 각 카드가 화면 폭을 온전히 쓰도록 재배치했습니다. 발행물 캐러셀처럼 가로 스크롤이 자연스러운 요소만 스와이프 형태로 유지했습니다.",
            en: "Simply shrinking a two-column layout makes the chart numbers unreadable. I split the sections fully into a vertical stack and let each card use the full screen width. Only elements where horizontal scroll already feels natural — like the publications carousel — kept their swipe behavior.",
          },
        },
        {
          id: "tone",
          label: { ko: "톤 앤 매너", en: "Tone & Manner" },
          intro: {
            ko: "외교부라는 기관의 성격상 정적이고 신뢰감 있는 인상이 필요했습니다. 네이비를 기본으로, 강조가 필요한 지점에만 골드와 블루를 사용했습니다. 통계는 차트로만 표현하고 불필요한 장식 요소를 배제했습니다. 화면이 화려해질수록 정보의 신뢰도가 떨어지는 종류의 서비스였습니다.",
            en: "As a Ministry of Foreign Affairs service, the impression had to read as composed and trustworthy. Navy carries the base, with gold and blue reserved only for points that actually need emphasis. Stats are shown as charts and nothing else — no decorative filler. This was the kind of service where a flashier screen would have read as less credible, not more.",
          },
          colors: [
            {
              hex: "#193553",
              name: { ko: "네이비", en: "Navy" },
              role: { ko: "기본 배경 · 헤더 · 카드", en: "Base background, header & cards" },
            },
            {
              hex: "#916C29",
              name: { ko: "골드", en: "Gold" },
              role: { ko: "선택된 상태 · 강조 배지", en: "Active states & accent badges" },
            },
            {
              hex: "#4682C6",
              name: { ko: "블루", en: "Blue" },
              role: { ko: "주요 액션 버튼", en: "Primary action buttons" },
            },
          ],
        },
      ],
    },
  },
  {
    index: "03",
    title: { ko: "Lookback", en: "Lookback" },
    category: {
      ko: "미술 아카이브 사이트",
      en: "Art Archive Website",
    },
    tags: ["Built by Me", "Business"],
    skills: ["Next.js", "Archive UX", "Motion & Interaction", "Visual Identity"],
    description: {
      ko: "역사 속에 흩어진 인물과 기록을 다시 조명하는 가상의 아카이브 기관 'Aura Art Center'를 위한 아트 아카이브 데모 사이트입니다.",
      en: "An art-archive demo site for a fictional institution, Aura Art Center — built to spotlight historical figures and records that time has scattered.",
    },
    process: {
      ko: "저작권 없는 퍼블릭 도메인 아카이브(PICRYL) 이미지를 소재로, 실제 서비스 가능한 아트 아카이브 사이트를 기획부터 디자인, 개발까지 혼자 진행한 프로젝트입니다. 아카이브가 다루는 자료는 시대도 형태도 화질도 제각각입니다 — 유화부터 스케치, 흑백 인물사진, 색 바랜 포스터까지. 이 이질적인 자료들을 한 사이트 안에 묶으면서도 각각이 가진 분위기를 지우지 않는 것이 과제였습니다. IA 설계부터 메인 히어로 연출, 반응형 구현까지 전 과정을 담당했습니다.",
      en: "Built solo end to end — planning, design, and development — as a working demo of an art-archive site, using public-domain images from PICRYL. What the archive holds varies wildly: oil paintings, sketches, black-and-white portraits, faded old posters, spanning different eras and image quality. The challenge was binding that mismatched material into one site without flattening what makes each piece feel the way it does. I handled everything from the IA to the main hero's staging to the responsive build.",
    },
    image: "/media/home_work/work_04_artl.png",
    url: "https://lookback-dusky.vercel.app/",
    designGuide: {
      panels: [
        {
          id: "hero",
          label: { ko: "메인 히어로", en: "Main Hero" },
          intro: {
            ko: "화면 중앙엔 그 순간 조명되는 한 작품을 크게 걸고, 오른쪽엔 다음 차례의 작품들을 카드처럼 살짝씩 겹쳐 부채꼴로 늘어놓았습니다. 왼쪽 하단엔 작가·연도·크기·재질 같은 메타 정보를 어두운 카드에 담아 겹쳐 얹었습니다.",
            en: "The current spotlighted work sits large in the center, with the next works in line fanned out behind it as slightly overlapping cards. A dark info card overlaid at the bottom-left carries the artist, year, dimensions, and medium.",
          },
          images: [
            {
              src: "/media/home_work/lookback/hero.png",
              caption: {
                ko: "메인 히어로 — 조명된 작품, 대기 중인 다음 작품들, 메타 정보 카드",
                en: "Main hero — the spotlighted work, the works waiting in line, and the metadata card",
              },
              device: "desktop",
            },
          ],
          resolution: {
            ko: "미술관에서 한 작품 앞에 조명이 켜지고, 다음 전시품은 어둠 속에 살짝 걸쳐 보이는 느낌을 화면 안에서 재현하고 싶었습니다. 배경은 지금 걸린 작품의 색을 그대로 크게 확대해 흐리게 깔아둡니다 — 정해진 배경색이 아니라 작품이 바뀔 때마다 배경도 함께 바뀌는 방식이라, 매번 그 작품만의 무드로 진입하게 됩니다.",
            en: "I wanted to recreate, on screen, the feeling of a spotlight hitting one piece in a gallery while the next one waits just visible in the dark. The backdrop is the current work's own image, blown up and blurred — not a fixed background color, so it shifts with every work and drops you into that specific piece's mood each time.",
          },
        },
        {
          id: "ia",
          label: { ko: "IA", en: "IA" },
          intro: {
            ko: "상단 내비게이션에 마우스를 올리면 Browse·Explore·About 세 갈래가 한 번에 펼쳐지는 메가 메뉴 구조입니다. 어느 하나에 커서를 올려도 전체 사이트맵이 같이 드러나, 지금 있는 위치 말고 사이트 전체의 규모를 먼저 가늠할 수 있습니다.",
            en: "Hovering any top-nav item opens a mega menu that reveals all three branches — Browse, Explore, About — at once. Point at just one, and the whole sitemap surfaces with it, so visitors get a sense of the archive's full scope before they ever pick a path.",
          },
          tree: [
            {
              label: { ko: "Browse", en: "Browse" },
              children: [
                { ko: "Artists", en: "Artists" },
                { ko: "Works", en: "Works" },
                { ko: "Featured Themes", en: "Featured Themes" },
                { ko: "Popular Places", en: "Popular Places" },
                { ko: "Popular Topics", en: "Popular Topics" },
                { ko: "Timeline", en: "Timeline" },
              ],
            },
            {
              label: { ko: "Explore", en: "Explore" },
              children: [
                { ko: "By Type", en: "By Type" },
                { ko: "By Category", en: "By Category" },
                { ko: "Image Search", en: "Image Search" },
              ],
            },
            {
              label: { ko: "About", en: "About" },
              children: [
                { ko: "About Us", en: "About Us" },
                { ko: "Team", en: "Team" },
                { ko: "How to Use", en: "How to Use" },
                { ko: "Notices", en: "Notices" },
                { ko: "Contact", en: "Contact" },
              ],
            },
          ],
          images: [
            {
              src: "/media/home_work/lookback/mega-menu.png",
              caption: {
                ko: "메가 메뉴 — Browse·Explore·About 전체 구조가 한 번에 펼쳐짐",
                en: "Mega menu — Browse, Explore, and About all surface at once",
              },
              device: "desktop",
            },
          ],
          resolution: {
            ko: "아카이브형 사이트는 탐색 경로가 하나가 아니라는 게 특징입니다. 작가로 찾을 수도, 주제로 찾을 수도, 시대로 찾을 수도 있어야 합니다. 이걸 메뉴 하나에 다 눌러 담기보다 Browse(둘러보기)·Explore(조건 검색)·About(기관 정보)로 성격을 나눠, 각자의 진입 방식을 분명히 했습니다.",
            en: "An archive site's defining trait is that there's no single correct path through it — visitors need to find their way in by artist, by topic, or by era. Rather than cramming all of that into one menu, I split it by intent: Browse (wander), Explore (search by condition), and About (who's behind this) — each with its own clear way in.",
          },
        },
        {
          id: "interaction",
          label: { ko: "인터랙션", en: "Interactions" },
          intro: {
            ko: "한 사이트 안에서도 콘텐츠마다 원하는 태도가 다르다고 보고, 인터랙션을 하나로 통일하지 않았습니다. 우연히 발견하는 재미가 중요한 영역엔 장치를 하나씩 얹었고, 목적이 이미 분명한 영역은 최대한 덜어냈습니다.",
            en: "I treated different content as wanting different postures, rather than giving the whole site one interaction language. Where the point is stumbling onto something, I layered in a device or two; where the visitor already knows what they want, I stripped things back instead.",
          },
          images: [
            {
              src: "/media/home_work/lookback/browse-by-era.png",
              caption: {
                ko: "Browse by Era — 연도를 맞추면 실제 티켓처럼 생긴 카드가 나타남",
                en: "Browse by Era — dial in a year range and it prints onto a card styled like an admission ticket",
              },
              device: "desktop",
            },
            {
              src: "/media/home_work/lookback/new-works.png",
              caption: {
                ko: "New Works — 사진이 격자가 아니라 흩어진 채로 ALL WORKS 버튼을 둘러쌈",
                en: "New Works — photos scatter around the ALL WORKS button instead of lining up in a grid",
              },
              device: "desktop",
            },
            {
              src: "/media/home_work/lookback/popular-topics.png",
              caption: {
                ko: "Popular Topics — 좌우 화살표로 넘기는 가로 캐러셀",
                en: "Popular Topics — a horizontal carousel paged with arrow controls",
              },
              device: "desktop",
            },
          ],
          list: [
            {
              label: { ko: "연도 탐색 (Browse by Era)", en: "Browse by Era" },
              note: {
                ko: "위아래 화살표로 시작·끝 연도를 직접 맞추면, 그 구간이 실제 티켓처럼 생긴 카드에 담겨 나타납니다. 드롭다운으로 날짜 범위를 고르는 게 아니라, 그 시대로 들어가는 입장권을 끊는 느낌을 주려는 장치입니다.",
                en: "Nudge the start and end year up or down, and the range prints onto a card styled like an actual admission ticket. It's meant to feel like punching a ticket into that era, not picking a date range from a dropdown.",
              },
            },
            {
              label: { ko: "신규 등록 작품 (New Works)", en: "New Works" },
              note: {
                ko: "사진들을 격자에 가지런히 두는 대신 각기 다른 각도로 흩어놓아, 책상 위에 쏟아놓은 사진 더미처럼 보이게 했습니다. 시선은 중앙의 'ALL WORKS' 버튼으로 모이면서도, 한 화면에 훨씬 많은 자료를 자연스럽게 보여줄 수 있습니다.",
                en: "Instead of lining photos up in a grid, I scattered them at different angles — like a pile of prints spilled across a desk. Attention still gathers on the central ALL WORKS button, but the scatter lets one screen show far more material than a grid would without feeling crowded.",
              },
            },
            {
              label: { ko: "Popular Topics · Popular Places", en: "Popular Topics · Popular Places" },
              note: {
                ko: "찾는 게 이미 분명한 사람들을 위한 영역이라 연출을 더 얹지 않았습니다. 화살표로 한 벌씩 넘기는 깔끔한 가로 캐러셀로, 목적지까지 가장 짧게 데려다주는 쪽을 택했습니다.",
                en: "This is for visitors who already know what they're after, so I didn't dress it up further — a clean horizontal carousel, paged a set at a time with arrows, built to get someone to their destination as directly as possible.",
              },
            },
          ],
          resolution: {
            ko: "시대를 넘나드는 탐색이나 신규 자료 발견처럼 '우연히 마주치는' 경험이 중요한 곳엔 티켓·콜라주 같은 장치로 머무를 이유를 만들었고, 이미 목적이 뚜렷한 인기 주제·장소 탐색은 군더더기를 걷어내고 가장 빠른 길을 냈습니다. 인터랙션이 전부 같은 톤일 필요는 없다는 걸 이 프로젝트에서 확인했습니다.",
            en: "Where the point is stumbling onto something — browsing across eras, discovering new material — I added devices like the ticket and the scattered collage to make that feel worth lingering on. Where the visitor already knows exactly what they want, like popular topics or places, I stripped the flourish and built the shortest path instead. Interactions don't all have to share one tone — that's what this project confirmed.",
          },
        },
        {
          id: "tone",
          label: { ko: "톤 앤 매너", en: "Tone & Manner" },
          intro: {
            ko: "UI 자체는 거의 검은색에 가까운 어두운 톤으로 통일했습니다. 대신 배경은 항상 그 순간 걸린 작품의 색을 확대·블러해 깔아, 화면이 완전히 무채색으로 죽지 않고 은은하게 그 작품의 색을 머금습니다. 카드나 썸네일 속 이미지 자체는 원래 색을 그대로 두었습니다 — 유화의 짙은 색, 흑백 사진의 무채색, 바랜 포스터의 색 빠진 톤까지, 각 자료가 원래 갖고 있던 질감이 최대한 보존되도록 했습니다.",
            en: "The UI itself stays in a near-black dark tone throughout. The backdrop, though, is always the current work's own image, enlarged and blurred, so the screen never goes fully achromatic — it quietly carries a hint of whatever's on display. The images inside the cards and thumbnails keep their original color untouched: an oil painting's saturated pigment, a black-and-white photo's grayscale, a faded poster's washed-out tone — whatever texture the source material actually has.",
          },
          resolution: {
            ko: "아카이브가 다루는 자료는 색감도 화질도 시대도 다 다릅니다. 여기에 UI가 별도의 색을 강하게 얹으면 자료 고유의 질감이 묻힙니다. 그래서 UI는 어두운 무채색 하나로 통일해 뒤로 물러서게 하고, 화면에 드러나는 색은 전부 자료 자체에서 나오게 했습니다. 정해진 팔레트를 쓰는 대신 그때그때 걸리는 작품이 배경색을 정하는 구조라, 어떤 자료가 오더라도 UI가 그 분위기와 부딪히지 않습니다.",
            en: "What the archive holds differs in color, image quality, and era, piece to piece. Layer a strong UI color on top of that and the source material's own texture gets buried. So I kept the UI to one dark, achromatic tone and let every color on screen come from the material itself. Instead of a fixed palette, whatever's currently on display sets the backdrop color — so no matter what comes through the archive next, the UI never clashes with it.",
          },
        },
      ],
    },
  },
  {
    index: "04",
    title: { ko: "한예종 학사시스템", en: "K-ARTS Academic Portal" },
    category: {
      ko: "대학 학사행정 시스템 UI/UX 디자인",
      en: "University Academic System UI/UX Design",
    },
    tags: ["Systems & Tools", "Public"],
    stage: { ko: "제안", en: "Proposal" },
    client: { ko: "한국예술종합학교", en: "Korea National University of Arts" },
    description: {
      ko: "한국예술종합학교 학사행정시스템 UI/UX 리디자인 프로젝트입니다. 매일 접속하는 재학생과 교직원을 위해, 흩어져 있던 기능을 이용 빈도 기준으로 재배치하고 라이트/다크 테마를 지원하는 디자인 시스템을 구축했습니다.",
      en: "A UI/UX redesign for Korea National University of Arts' academic administration portal. For the students and staff who log in daily, I reorganized scattered functions around how often they're actually used, and built a design system that fully supports light and dark themes.",
    },
    situation: {
      ko: "학사행정시스템은 수강신청, 성적 조회, 학적 변동, 등록금 납부, 증명서 발급 등 대학생활의 거의 모든 행정 업무가 이루어지는 서비스입니다. 하지만 기능이 많아질수록 시스템이 학교의 조직 구조를 따라 나뉘어 있어, 사용자는 자신이 하려는 업무가 어느 부서의 소관인지부터 파악해야 원하는 메뉴를 찾을 수 있었습니다. 또한 기능이 많은 시스템 특성상 메뉴를 단순히 줄이는 것만으로는 문제를 해결하기 어려웠습니다. 자주 사용하는 기능과 가끔 사용하는 기능의 우선순위를 구분하고, 필요한 기능은 쉽게 찾을 수 있는 위치에 유지하면서도 반복적으로 사용하는 화면의 인지 부담을 낮출 필요가 있었습니다.",
      en: "The academic administration portal is the service where nearly all of campus life's administrative work happens — course registration, grade checks, academic-status changes, tuition payment, certificate issuance. But the more functions it accumulated, the more the system split along the university's own org chart, so a user had to work out which department owned what they wanted to do before they could even find the right menu. And given how many functions a system like this carries, simply trimming the menu down wasn't enough to fix it. What it needed was to separate the frequent functions from the occasional ones by priority, keep the ones people needed within easy reach, and still lower the cognitive load on a screen used over and over.",
    },
    task: {
      ko: "학교의 조직 구조가 아닌 사용자의 이용 목적을 기준으로 메뉴의 위계를 재편하고, 기능의 중요도와 사용 빈도에 따라 정보를 구조화해 매일 사용하는 화면의 인지 부하를 낮추는 것.",
      en: "Rebuild the menu hierarchy around what people actually came to do, not the org chart — and structure information by how important and how often each function gets used, to lower the cognitive load on a screen people open every day.",
    },
    roles: [
      { label: { ko: "UI 디자인", en: "UI Design" }, value: { ko: "100%", en: "100%" } },
      { label: { ko: "디자인 시스템 구축", en: "Design System" }, value: { ko: "100%", en: "100%" } },
      { label: { ko: "반응형 대응", en: "Responsive" }, value: { ko: "100%", en: "100%" } },
      {
        label: { ko: "IA 설계", en: "IA" },
        value: { ko: "기여 (기획자와 협업)", en: "Contributed (with the planner)" },
      },
    ],
    reflection: {
      ko: "\"잘 정돈되어 있지만 결코 단순하지는 않은 화면.\" 이것이 이 프로젝트의 목표였습니다. 기능이 많은 시스템에서 단순화는 답이 아닙니다. 필요한 것은 덜어내기가 아니라 위계 세우기였습니다. 자주 쓰는 것을 앞에, 가끔 쓰는 것은 찾으면 있는 자리에.",
      en: "\"Organized, but never oversimplified.\" That was the goal. In a system carrying this many functions, simplifying isn't the answer — what it needed was hierarchy, not subtraction. The frequent things up front; the occasional things exactly where you'd look for them.",
    },
    image: "/media/home_work/karts/thumb.png",
    designGuide: {
      panels: [
        {
          id: "users",
          label: { ko: "사용자 & 패턴", en: "Users & Patterns" },
          intro: {
            ko: "이 시스템의 주 사용자는 재학생과 교직원입니다. 두 집단의 이용 방식은 완전히 다릅니다.",
            en: "The primary users are students and staff — and they use the system in completely different ways.",
          },
          compareCards: [
            {
              label: { ko: "재학생", en: "Students" },
              note: {
                ko: "특정 시기에 집중적으로 몰림. 학기 초 수강신청, 학기 말 성적 조회. 목적이 명확하고 빠르게 처리하고 나감.",
                en: "Concentrated at specific times — course registration at the start of term, grades at the end. Comes in with a clear goal, handles it fast, leaves.",
              },
            },
            {
              label: { ko: "교직원", en: "Staff" },
              note: {
                ko: "상시 이용. 조회와 정정을 반복. 한 화면에서 여러 정보를 동시에 확인해야 함.",
                en: "Uses it constantly — repeated lookups and edits, often needing several pieces of information on screen at once.",
              },
            },
          ],
          ranking: [
            {
              label: { ko: "학적", en: "Academic Records" },
              note: {
                ko: "조회·정정 등 학적 관련 기능 전반",
                en: "Records lookup, edits, and related actions",
              },
            },
            {
              label: { ko: "수강", en: "Course Registration" },
              note: {
                ko: "학기 초 접속이 몰리는 기능",
                en: "Heaviest traffic at the start of each term",
              },
            },
            { label: { ko: "성적", en: "Grades" } },
            { label: { ko: "등록", en: "Tuition & Registration" } },
            { label: { ko: "인터넷증명", en: "Online Certificates" } },
            { label: { ko: "자산", en: "Assets" } },
          ],
          causes: [
            {
              label: { ko: "원하는 기능을 찾지 못함", en: "Couldn't find the feature they needed" },
            },
            { label: { ko: "UI가 복잡하게 느껴짐", en: "UI felt too complex" } },
            { label: { ko: "정보 위계가 불명확함", en: "Information hierarchy wasn't clear" } },
          ],
          resolution: {
            ko: "실제 로그 데이터에 접근할 수 없는 조건에서, 학사시스템에서 공통적으로 발생하는 문제 유형을 기준으로 이탈 원인을 정의했습니다. 세 가지 모두 '기능이 없어서'가 아니라 '있는 기능을 못 찾아서' 생기는 문제였습니다. 기능 추가가 아니라 배치와 위계의 문제로 접근했습니다.",
            en: "Without access to real log data, I defined these drop-off causes based on problems that show up consistently across academic systems like this one. None of the three came from a missing feature — all three came from an existing feature nobody could find. I treated it as a placement and hierarchy problem, not a case for adding more.",
          },
        },
        {
          id: "ia",
          label: { ko: "IA", en: "IA" },
          intro: {
            ko: "정보 구조는 기획자가 수립한 안을 바탕으로, 화면에서 실제로 어떻게 읽히는지를 검토하며 함께 조정했습니다. 사이드바는 메인·K온누리·정보마당·참여마당·안내마당·커뮤니티 6개로 구성됩니다 — 부서 단위가 아니라 '무엇을 하러 왔는가' 기준입니다. 학적관리처럼 하위 기능이 많은 화면은 상단 탭 7개로 나눠, 한 사람의 학적 정보를 한 화면 안에서 오갈 수 있게 구성했습니다.",
            en: "The information architecture builds on a draft the project's planner put together — I reviewed and adjusted it from the screen-design side, checking how it would actually read as a real interface. The sidebar holds 6 items — Main, K-Onnuri, Info Hub, Participation, Guide, Community — organized around what someone came to do, not which department owns it. Academic Records, which carries a lot of sub-functions, splits into 7 top tabs so one student's academic information can be navigated within a single screen.",
          },
          tree: [
            {
              label: { ko: "메인 사이드바", en: "Primary sidebar" },
              children: [
                { ko: "메인", en: "Main" },
                { ko: "K온누리", en: "K-Onnuri" },
                { ko: "정보마당", en: "Info Hub" },
                { ko: "참여마당", en: "Participation" },
                { ko: "안내마당", en: "Guide" },
                { ko: "커뮤니티", en: "Community" },
              ],
            },
            {
              label: { ko: "학적관리 상단 탭", en: "Academic Records tabs" },
              children: [
                { ko: "신상정보", en: "Personal info" },
                { ko: "보호자정보", en: "Guardian info" },
                { ko: "휴복학", en: "Leave / return" },
                { ko: "전과/전공변경", en: "Transfer / major change" },
                { ko: "부전공", en: "Minor" },
                { ko: "재입학/복적", en: "Readmission" },
                { ko: "조기졸업", en: "Early graduation" },
              ],
            },
          ],
          resolution: {
            ko: "여기에 더해, 이용 빈도가 가장 높은 학적·수강신청을 사이드바 안쪽에 묻어두지 않고 메인 화면 최상단에 아이콘으로 별도 노출하는 배치를 제안했습니다. 매번 메뉴를 열고 찾아 들어가는 단계 자체를 없애기 위해서였습니다 — 이 부분은 화면 설계 관점에서 제가 직접 낸 제안입니다.",
            en: "On top of that, I proposed surfacing the highest-frequency actions — Academic Records, Course Registration — as icons at the very top of the main screen instead of leaving them buried in the sidebar, to remove the step of opening a menu and hunting for them at all. That specific move was my own proposal, from the screen-design side.",
          },
        },
        {
          id: "design-system",
          label: { ko: "Design System", en: "Design System" },
          intro: {
            ko: "라이트/다크 테마를 전면 지원하도록 설계했습니다. 버튼은 primary(수정)·secondary(취소) 두 단계로, 인풋은 기본 상태와 포커스 상태(자택전화 필드처럼 강조 테두리)를 구분했습니다.",
            en: "Designed to fully support both light and dark themes. Buttons split into primary (edit) and secondary (cancel); inputs distinguish a default state from a focus state — an accent-colored border, as on the phone-number field.",
          },
          images: [
            {
              src: "/media/home_work/karts/main-dark.png",
              caption: { ko: "메인 화면", en: "Main screen" },
              theme: "dark",
              device: "desktop",
            },
            {
              src: "/media/home_work/karts/sub-dark.png",
              caption: { ko: "학적관리 화면 — 인풋 상태", en: "Academic Records — input states" },
              theme: "dark",
              device: "desktop",
            },
            {
              src: "/media/home_work/karts/main-light.png",
              caption: { ko: "메인 화면", en: "Main screen" },
              theme: "light",
              device: "desktop",
            },
            {
              src: "/media/home_work/karts/sub-light.png",
              caption: { ko: "학적관리 화면 — 인풋 상태", en: "Academic Records — input states" },
              theme: "light",
              device: "desktop",
            },
          ],
          resolution: {
            ko: "낱장 디자인이 아니라 재사용 가능한 컴포넌트 단위로 정리했기 때문에, 이후 기능이 추가되어도 같은 규칙 안에서 확장할 수 있습니다.",
            en: "Organized as reusable components rather than one-off screens, so any function added later can extend the system within the same rules instead of starting from scratch.",
          },
        },
        {
          id: "responsive",
          label: { ko: "Responsive", en: "Responsive" },
          intro: {
            ko: "실제 반응형 스크린샷입니다. 데스크톱의 6개 아이콘 내비게이션은 모바일에서 가로 스크롤 캐러셀로, 2단 그리드 정보는 1단으로 재배열됩니다.",
            en: "Real responsive screenshots. The desktop's 6-icon nav collapses into a horizontally-scrolling carousel on mobile, and two-column content reflows into one.",
          },
          images: [
            {
              src: "/media/home_work/karts/main-dark-mobile.png",
              video: "/media/home_work/karts/mobile_koreaart.mp4",
              caption: { ko: "메인 화면 (모바일)", en: "Main screen (mobile)" },
              theme: "dark",
              device: "mobile",
            },
            {
              src: "/media/home_work/karts/main-light-mobile.png",
              caption: { ko: "메인 화면 (모바일)", en: "Main screen (mobile)" },
              theme: "light",
              device: "mobile",
            },
          ],
        },
        {
          id: "data-dense",
          label: { ko: "Data-Dense", en: "Data-Dense" },
          intro: {
            ko: "학적관리 화면 하나에 학생 프로필, 편집 가능한 기본정보 폼, 개인정보 처리 고지문까지 담아야 했습니다. 좌측엔 요약 카드, 우측 상단엔 입력 폼, 하단엔 법적 고지를 배치해 훑어보는 흐름과 실제로 조작하는 영역을 분리했습니다.",
            en: "One Academic Records screen had to hold a student profile, an editable info form, and a personal-data notice all at once. I placed the summary card on the left, the editable form top-right, and the legal notice at the bottom — separating what you scan from what you act on.",
          },
          images: [
            {
              src: "/media/home_work/karts/sub-light.png",
              caption: { ko: "학적관리(학생) 화면", en: "Academic Records screen" },
              device: "desktop",
            },
          ],
          zones: [
            {
              label: { ko: "좌측", en: "Left" },
              note: {
                ko: "조회 전용 요약 카드 — 사진·학번·학적상태",
                en: "Read-only summary card — photo, student ID, academic status",
              },
            },
            {
              label: { ko: "우측 상단", en: "Top right" },
              note: { ko: "값을 바꾸는 입력 폼", en: "The editable input form" },
            },
            {
              label: { ko: "하단", en: "Bottom" },
              note: {
                ko: "약관·고지문 (스크롤 영역)",
                en: "Terms & notices (a scrollable area)",
              },
            },
          ],
          resolution: {
            ko: "학적관리처럼 정보량이 많은 화면은 좌측 요약 카드·우측 입력 폼·하단 법적 고지로 나눠, 훑어보는 흐름과 실제로 조작하는 영역을 분리했습니다. 조회만 되는 항목(한문성명, 주민번호)은 회색 텍스트로 조용히 두고, 지금 편집 중인 필드만 강조 테두리로 표시해 현재 상태를 시각적으로 구분했습니다.",
            en: "For information-dense screens like Academic Records, I split the layout into a left summary card, a right input form, and a bottom legal notice — separating what you scan from what you act on. Read-only fields (legal name, resident ID) sit quietly in gray text, while only the field actually being edited gets an accent border, so the current state is visually unambiguous.",
          },
        },
      ],
    },
  },
  {
    index: "05",
    title: { ko: "ARTE", en: "ARTE" },
    category: {
      ko: "성형외과 홈페이지 디자인 개발",
      en: "Plastic Surgery Clinic Website Design & Development",
    },
    tags: ["Built by Me", "Business"],
    description: {
      ko: "의료 기관을 위한 디자인 및 프론트엔드 개발 프로젝트입니다.",
      en: "Design and frontend development for a medical clinic.",
    },
    process: {
      ko: "IA 설계부터 브랜드 컬러 선정, 레이아웃 설계, 코드 구현까지 — 전 과정을 혼자 진행했습니다. 성형외과 사이트는 신뢰감과 고급스러움을 동시에 전달해야 합니다. 과도한 홍보 문구보다 시술 정보와 의료진 이력이 명확히 정리되어 있어야 방문자가 안심하고 상담을 예약합니다. 이 원칙 아래 정보구조를 먼저 짜고, 사용자가 가장 궁금해할 순서로 내비게이션을 구성했습니다.",
      en: "From IA design and brand color selection to layout and code — I ran the entire process solo. A plastic surgery site has to read as trustworthy and upscale at the same time. Visitors book a consultation with confidence not from promotional copy, but from procedure details and staff credentials laid out clearly. Working from that principle, I mapped the information architecture first, then ordered the navigation around what visitors actually want to know.",
    },
    image: "/media/home_work/work_01_Arte.png",
    url: "https://note-clinic-portfolio.vercel.app/",
    designGuide: {
      panels: [
        {
          id: "layout",
          label: { ko: "레이아웃", en: "Layout" },
          intro: {
            ko: "인물 사진과 다크 섹션을 번갈아 배치해 리듬을 만들고, 상담 유도 지점을 스크롤 흐름 곳곳에 배치한 싱글 페이지 구조입니다.",
            en: "A single-page flow that alternates full-bleed portraits with dark sections for rhythm, dropping consultation CTAs at several points along the scroll.",
          },
          list: [
          {
            label: { ko: "히어로", en: "Hero" },
            note: {
              ko: "풀블리드 인물 사진 위에 헤드카피와 CTA를 얹은 도입부.",
              en: "Full-bleed portrait photo with headline copy and CTA overlaid.",
            },
          },
          {
            label: { ko: "진료분야 그리드", en: "Treatments grid" },
            note: {
              ko: "4단 이미지 카드로 안면윤곽·가슴·눈·코 진료 분야를 소개.",
              en: "A 4-column image-card grid introducing each specialty area.",
            },
          },
          {
            label: { ko: "진행 과정", en: "Process" },
            note: {
              ko: "다크 배경 위 넘버링된 스텝 리스트와 중앙 사진, 대형 고스트 넘버.",
              en: "Numbered step list on a dark background with a centered photo and an oversized ghost numeral.",
            },
          },
          {
            label: { ko: "전후사진 비교", en: "Before & after" },
            note: {
              ko: "비교 슬라이더 이미지와 후기 카피 카드.",
              en: "A before/after comparison slider paired with a testimonial copy card.",
            },
          },
          {
            label: { ko: "약속 (신뢰 포인트)", en: "Trust pillars" },
            note: {
              ko: "대형 마퀴 텍스트 배경 위에 3가지 신뢰 포인트를 나열.",
              en: "Three trust pillars laid over a large horizontally-scrolling marquee-text background.",
            },
          },
          {
            label: { ko: "병원 갤러리", en: "Hospital gallery" },
            note: {
              ko: "인테리어 전경을 담은 단일 대형 이미지.",
              en: "A single large photograph of the clinic interior.",
            },
          },
          {
            label: { ko: "오시는 길", en: "Location & contact" },
            note: {
              ko: "주소·운영시간 정보와 지도 임베드의 2단 구성.",
              en: "Two-column layout: address/hours info alongside an embedded map.",
            },
          },
          {
            label: { ko: "상담 신청 CTA", en: "Consultation CTA" },
            note: {
              ko: "페이지 하단, 상담 신청을 유도하는 배너.",
              en: "A closing banner driving toward the consultation form.",
            },
          },
          {
            label: { ko: "푸터", en: "Footer" },
            note: {
              ko: "사이트맵과 병원 정보를 다단으로 정리.",
              en: "Sitemap and clinic info organized into columns.",
            },
          },
          ],
        },
        {
          id: "ia",
          label: { ko: "IA", en: "IA" },
          intro: {
            ko: "진료 분야별로 3단계 깊이의 하위 메뉴를 두어, 시술을 구체적으로 찾아 들어갈 수 있게 설계한 정보 구조입니다.",
            en: "A three-level IA that lets visitors drill from a specialty area down to a specific procedure.",
          },
          tree: [
          { label: { ko: "홈", en: "Home" } },
          {
            label: { ko: "병원소개", en: "About" },
            children: [
              { ko: "의료진 소개", en: "Doctors" },
              { ko: "시설 안내", en: "Facility" },
              { ko: "오시는 길", en: "Location" },
            ],
          },
          {
            label: { ko: "눈성형", en: "Eye" },
            children: [
              { ko: "쌍꺼풀 매몰법", en: "Non-incision" },
              { ko: "쌍꺼풀 절개법", en: "Incision" },
              { ko: "눈매교정", en: "Ptosis correction" },
            ],
          },
          {
            label: { ko: "코성형", en: "Nose" },
            children: [
              { ko: "융비술 (콧대 성형)", en: "Bridge augmentation" },
              { ko: "코끝 성형", en: "Tip plasty" },
              { ko: "매부리코 교정", en: "Hump nose" },
            ],
          },
          {
            label: { ko: "안면윤곽", en: "Facial contouring" },
            children: [
              { ko: "광대축소술", en: "Cheekbone" },
              { ko: "사각턱수술", en: "Square jaw" },
              { ko: "턱끝수술", en: "Chin" },
            ],
          },
          {
            label: { ko: "가슴성형", en: "Breast" },
            children: [
              { ko: "가슴확대술 (보형물)", en: "Augmentation" },
              { ko: "지방이식 가슴성형", en: "Fat graft" },
              { ko: "가슴 리프팅", en: "Lifting" },
            ],
          },
          { label: { ko: "전후사진", en: "Before / After" } },
          { label: { ko: "이벤트", en: "Event" } },
          { label: { ko: "상담 신청", en: "Contact" } },
          ],
        },
        {
          id: "colors",
          label: { ko: "컬러 가이드", en: "Color Guide" },
          colors: [
            {
              hex: "#FFFFFF",
              name: { ko: "페이퍼", en: "Paper" },
              role: { ko: "기본 배경", en: "Base background" },
            },
            {
              hex: "#111111",
              name: { ko: "잉크", en: "Ink" },
              role: { ko: "본문 텍스트", en: "Body text" },
            },
            {
              hex: "#000000",
              name: { ko: "블랙", en: "Black" },
              role: { ko: "헤더 · 공지 바 오버레이", en: "Header & announcement bar" },
            },
            {
              hex: "#181818",
              name: { ko: "차콜", en: "Charcoal" },
              role: { ko: "다크 섹션 배경", en: "Dark section background" },
            },
            {
              hex: "#C9A96E",
              name: { ko: "골드", en: "Gold" },
              role: { ko: "포인트 · 강조 컬러", en: "Accent / highlight" },
            },
            {
              hex: "#E5E5E5",
              name: { ko: "라이트 그레이", en: "Light gray" },
              role: { ko: "서브 배경 · 디바이더", en: "Subtle panels & dividers" },
            },
          ],
        },
      ],
    },
  },
  {
    index: "06",
    title: { ko: "국립중앙박물관 대표 홈페이지", en: "National Museum of Korea — Main Site Renewal" },
    category: {
      ko: "공공기관 홈페이지 리뉴얼 디자인 제안",
      en: "Public Institution Website Renewal (Design Proposal)",
    },
    tags: ["Public"],
    stage: { ko: "제안", en: "Proposal" },
    skills: ["Public Sector", "Benchmarking", "GNB Design", "Visual Identity", "Interactive Demo"],
    client: { ko: "국립중앙박물관", en: "National Museum of Korea" },
    description: {
      ko: "국립중앙박물관 대표 홈페이지의 메인 화면과 GNB를 개선한 리뉴얼 제안입니다.",
      en: "A renewal proposal improving the National Museum of Korea's main site — its home screen and GNB.",
    },
    situation: {
      ko: "사람들이 박물관 홈페이지를 찾는 이유는 크게 두 가지였습니다. 관람시간·관람료 같은 방문 정보를 확인하거나, 현재 진행 중인 전시와 교육 프로그램을 확인하기 위해서입니다. 하지만 기존 화면에서는 이러한 정보가 여러 메뉴에 흩어져 있어 원하는 답을 얻기까지 여러 번의 이동이 필요했습니다. 동시에 박물관 홈페이지는 단순히 정보를 전달하는 것을 넘어, 기관이 다루는 유물과 전시가 가진 시각적 정체성까지 보여줘야 했습니다. 정보를 우선하면 관공서 게시판처럼 보이고, 비주얼을 강조하면 필요한 정보를 찾기 어려워지는 상황에서 정보 접근성과 시각적 완성도 사이의 균형을 잡는 것이 중요한 과제였습니다.",
      en: "There were, broadly, two reasons people came to the museum's homepage: to check visit info like hours and admission, or to see what exhibitions and education programs were currently running. On the existing site, both were scattered across several menus, so getting either answer took multiple trips through the navigation. At the same time, a museum homepage has to do more than deliver information — it has to carry the visual identity in the artifacts and exhibitions the institution actually holds. Lean on information alone and it reads like a government bulletin board; lean on visuals and the information people need goes missing. Striking a balance between access to information and visual polish was the real challenge.",
    },
    task: {
      ko: "흩어진 전시·행사·교육 정보를 통합하고 GNB의 복잡도를 낮추면서도, 박물관이 가진 시각적 정체성과 전시의 미감을 함께 전달하는 것. 이를 위해 벤치마킹을 통해 정보 구조와 주요 콘텐츠를 분석하고 GNB와 메인 화면을 설계했습니다. 또한 정적인 시안에 그치지 않고 실제 동작하는 데모 사이트까지 제작해, 메인 비주얼에 따라 정보 바의 색상이 전환되는 등의 인터랙션을 직접 확인할 수 있도록 했습니다. 이를 통해 디자인 의도를 시각적으로 공유하고, 실제 사용 흐름을 기준으로 빠르게 합의할 수 있도록 했습니다.",
      en: "Bring the scattered exhibition, event, and education info together and simplify the GNB, while still carrying the museum's own visual identity and the beauty of its exhibitions. To do that, I analyzed the information structure and key content through benchmarking, then designed the GNB and main screen. Rather than stopping at static comps, I built an actual working demo site, so interactions — like the info bar's color shifting with the main visual — could be checked directly. That made the design intent visible at a glance and let us reach agreement fast, grounded in the real flow instead of a still image.",
    },
    roles: [
      { label: { ko: "벤치마킹 분석", en: "Benchmarking" }, value: { ko: "100%", en: "100%" } },
      { label: { ko: "GNB 설계", en: "GNB Design" }, value: { ko: "100%", en: "100%" } },
      {
        label: { ko: "메인 화면 디자인", en: "Main Screen Design" },
        value: { ko: "100%", en: "100%" },
      },
      { label: { ko: "데모 사이트 제작", en: "Demo Site Build" }, value: { ko: "100%", en: "100%" } },
      { label: { ko: "IA", en: "IA" }, value: { ko: "기획팀 수립", en: "Established by the planning team" } },
    ],
    reflection: {
      ko: "무엇을 덜어낼지 결정하고 나면 정보 접근성과 시각적 완성도가 같은 방향을 향한다는 것을 확인했습니다. 미감은 더해서 만드는 것이 아니라, 방해 요소를 걷어내면 이미 그 자리에 있던 것이 드러나는 것에 가까웠습니다.",
      en: "Once you decide what to cut, information access and visual polish turn out to point the same way. Beauty isn't built by adding — it's closer to removing what gets in the way and letting what was already there come through.",
    },
    image: "/media/home_work/national-museum/national_museum_thum.png",
    url: "https://nmk-next.vercel.app/",
    designGuide: {
      panels: [
        {
          id: "benchmark",
          label: { ko: "벤치마킹", en: "Benchmarking" },
          intro: {
            ko: "개선안을 만들기 전에 국내외 6개 기관의 홈페이지를 분석했습니다 — 국내는 국립공주박물관·경기문화재단·국립현대미술관, 국외는 루브르 박물관·메트로폴리탄 미술관·영국 박물관. 전시·문화행사·교육 서비스를 어떻게 묶어서 보여주는지, GNB를 몇 개로 압축했는지, 콘텐츠를 어떤 형태로 배치하는지 세 가지를 살폈습니다.",
            en: "Before drafting the redesign, I analyzed six institutions' homepages — three domestic (Gongju National Museum, Gyeonggi Cultural Foundation, MMCA) and three international (the Louvre, the Met, the British Museum). I looked at three things: how each groups exhibitions, cultural events, and education together, how far each compresses its GNB, and what form its content takes.",
          },
          list: [
            {
              label: { ko: "GNB 압축", en: "GNB compression" },
              note: {
                ko: "국내외 모두 이용자 인지 부하를 줄이기 위해 1레벨 메뉴를 5개 내외로 운영합니다. 루브르는 VISIT / EXHIBITIONS AND EVENTS / EXPLORE, 단 3개로 압축했습니다.",
                en: "Both domestic and international sites keep top-level menus to around 5 items to reduce cognitive load. The Louvre compresses to just three: VISIT / EXHIBITIONS AND EVENTS / EXPLORE.",
              },
            },
            {
              label: { ko: "탭 통합", en: "Tab consolidation" },
              note: {
                ko: "전시·교육·행사를 별개 메뉴로 분리하지 않고 하나의 영역 안에서 탭으로 전환하는 방식이 가독성 면에서 유리했습니다. 물리적으로 메뉴를 나누는 것보다 효율적입니다.",
                en: "Rather than splitting exhibitions, education, and events into separate menus, switching between them as tabs inside one area read more clearly — more efficient than dividing the menu physically.",
              },
            },
            {
              label: { ko: "카드형 UI", en: "Card-based UI" },
              note: {
                ko: "텍스트 나열 대신 고해상도 이미지 카드로 콘텐츠 식별력을 높이고, 카드마다 진행 상태(진행중·접수중·유무료)를 명확히 표기합니다.",
                en: "High-resolution image cards, not text lists, make content easier to tell apart at a glance — and each card marks its own status (running, open for registration, free/paid) clearly.",
              },
            },
          ],
          resolution: {
            ko: "\"메뉴가 복잡하니 줄이자\"는 판단은 누구나 할 수 있습니다. 하지만 몇 개까지 줄일지, 무엇을 기준으로 묶을지는 근거가 필요합니다. 6개 기관에서 반복적으로 확인되는 패턴을 정리하고 나서야, 제안하는 개선안에 설득력이 생겼습니다.",
            en: "Anyone can decide \"the menu is too complex, cut it down.\" But how far to cut, and what principle to group by, needs evidence. Only after mapping the patterns that kept repeating across all six institutions did the proposed redesign actually become persuasive.",
          },
        },
        {
          id: "gnb",
          label: { ko: "GNB 개편", en: "GNB Redesign" },
          intro: {
            ko: "기획팀이 수립한 정보 구조를 바탕으로, GNB 구조는 직접 설계했습니다. 기존 메뉴가 기관의 조직 구조를 반영해 여러 갈래로 나뉘어 있던 것을, '이용자가 무엇을 하러 왔는가' 기준으로 재편한 안입니다 — 관람정보·전시·문화·교육·행사·소장품·학술행사·출판·박물관이야기, 6개입니다. 각 대메뉴는 클릭 시 하위 항목이 좌우 2단으로 펼쳐지며, 왼쪽에서 중분류를 고르면 오른쪽에 소분류가 나타납니다.",
            en: "Working from the information structure the planning team put together, I designed the GNB structure directly. The existing menu had been split into several branches that mirrored the institution's own org chart; this reorganizes it around what a visitor actually came to do instead — Visit Info, Exhibitions & Culture, Education & Events, Collection, Academic & Publications, Museum Stories: six items. Each opens into a two-column dropdown — pick a mid-level category on the left, and its sub-items appear on the right.",
          },
          tree: [
            {
              label: { ko: "1뎁스 메뉴 (6개)", en: "Top-level menu (6)" },
              children: [
                { ko: "관람정보", en: "Visit Info" },
                { ko: "전시·문화", en: "Exhibitions & Culture" },
                { ko: "교육·행사", en: "Education & Events" },
                { ko: "소장품", en: "Collection" },
                { ko: "학술행사·출판", en: "Academic & Publications" },
                { ko: "박물관이야기", en: "Museum Stories" },
              ],
            },
            {
              label: {
                ko: "햄버거 메뉴 — 외부 연계 사이트 (별도 영역)",
                en: "Hamburger menu — external sites (separate area)",
              },
              children: [
                { ko: "어린이박물관", en: "Children's Museum" },
                { ko: "e뮤지엄", en: "e-Museum" },
                { ko: "박물관신문", en: "Museum Newspaper" },
                { ko: "그 외 산하·연계 사이트", en: "Other affiliated sites" },
              ],
            },
          ],
          images: [
            {
              src: "/media/home_work/national-museum/gnb-dropdown.png",
              caption: {
                ko: "관람정보 드롭다운 — 좌우 2단 구조",
                en: "Visit Info dropdown — two-column layout",
              },
              device: "desktop",
            },
            {
              src: "/media/home_work/national-museum/hamburger-menu.png",
              caption: {
                ko: "햄버거 메뉴 — 전체 사이트맵과 외부 연계 사이트",
                en: "Hamburger menu — full sitemap and external sites",
              },
              device: "desktop",
            },
          ],
          resolution: {
            ko: "박물관은 산하 사이트와 외부 플랫폼이 많습니다. 이것을 GNB 안에 섞으면 메뉴가 다시 복잡해지고, 사용자는 지금 어느 사이트에 있는지 혼란스러워집니다. 내부 콘텐츠와 외부 링크를 시각적으로 분리해, 클릭했을 때 사이트를 벗어난다는 것을 미리 인지할 수 있게 했습니다.",
            en: "A museum has a lot of affiliated sites and external platforms. Mixing those into the GNB makes it complex again, and visitors lose track of which site they're actually on. I separated internal content from external links visually, so it's clear before the click that it'll take you off-site.",
          },
        },
        {
          id: "main",
          label: { ko: "메인 화면", en: "Main Screen" },
          intro: {
            ko: "메인 비주얼 바로 아래, 스크롤하지 않아도 보이는 위치에 관람시간·관람료·오시는길·예약하기를 고정 배치했습니다. 메인 비주얼은 전시 포스터를 화면 가득 채우되, 좌우에 전시명과 기간을 정돈된 타이포그래피로 배치했습니다. 오른쪽 썸네일로 다른 전시를 미리 볼 수 있고, 상하 화살표로 전환됩니다.",
            en: "Right below the main visual, in the space visible without scrolling, I fixed hours, admission, directions, and booking in place. The main visual fills the screen with the exhibition poster itself, with the title and dates set in clean typography on either side. A thumbnail on the right previews other exhibitions, switched with up/down arrows.",
          },
          list: [
            {
              label: { ko: "방문 정보 확인", en: "Checking visit info" },
              note: {
                ko: "오늘 마감 시간, 관람료, 예약 필요 여부처럼 방문 전에 확인하는 정보.",
                en: "Closing time today, admission cost, whether booking is required — what people check before a visit.",
              },
            },
            {
              label: { ko: "현재 운영 콘텐츠 확인", en: "Checking what's currently on" },
              note: {
                ko: "지금 열리는 전시, 주말에 아이와 갈 만한 프로그램처럼 방문 시점에 무엇이 진행 중인지 확인하는 정보.",
                en: "What's showing right now, or a program worth bringing the kids to this weekend — what's currently running.",
              },
            },
          ],
          images: [
            {
              src: "/media/home_work/national-museum/main-default.png",
              caption: {
                ko: "메인 화면 — 관람 정보가 최상단 접힘 없이 노출",
                en: "Main screen — visit info fully visible above the fold",
              },
              device: "desktop",
            },
          ],
          resolution: {
            ko: "박물관 홈페이지 방문자의 상당수는 '오늘 몇 시까지 하나', '얼마인가', '예약이 필요한가'를 확인하러 옵니다. 이 정보가 하단이나 별도 메뉴에 있으면 매번 찾아 들어가야 합니다. 가장 자주 찾는 정보를 가장 먼저 보이는 자리에 두면, 반복되는 작업일수록 클릭 수가 줄어듭니다.",
            en: "A large share of museum-site visitors come to check exactly three things: what time it closes, how much it costs, and whether they need to book. If that information lives at the bottom of the page or behind a separate menu, it has to be hunted down every single time. Put the most frequently needed information in the first place people look, and the more a task repeats, the fewer clicks it takes.",
          },
        },
        {
          id: "content",
          label: { ko: "콘텐츠 섹션", en: "Content Sections" },
          intro: {
            ko: "전시 섹션은 포스터 이미지를 그대로 살린 카드형 그리드로 배치했습니다. 각 카드 상단에는 진행 상태(진행중)와 분류(특별전·테마전)를 배지로 표시해, 이미지를 보기 전에도 성격을 알 수 있게 했습니다. 교육·행사 섹션은 벤치마킹 결론을 그대로 적용해, 교육과 행사를 하나의 영역 안에서 탭으로 전환하도록 구성했습니다.",
            en: "The exhibitions section is a card grid that keeps the poster image intact. Each card carries a status badge (running) and a category badge (special/themed) up top, so its nature reads before the image even registers. Education & Events applies the benchmarking finding directly — education and events switch as tabs inside one area instead of living on separate screens.",
          },
          list: [
            {
              label: { ko: "전시", en: "Exhibitions" },
              note: {
                ko: "포스터를 그대로 살린 카드 그리드, 상태·분류 배지.",
                en: "A card grid that preserves the poster, with status & category badges.",
              },
            },
            {
              label: { ko: "교육·행사", en: "Education & Events" },
              note: {
                ko: "탭으로 전환, 접수중·공연예정·지난공연 및 비대면·대면 표시.",
                en: "Switches via tabs; marks registration/upcoming/past status and online/in-person format.",
              },
            },
            {
              label: { ko: "공지사항", en: "Notices" },
              note: {
                ko: "알림·고시공고·채용안내·보도자료를 탭 하나로 통합.",
                en: "Announcements, official notices, hiring, and press folded into one tabbed list.",
              },
            },
            {
              label: { ko: "온라인전시관 · 팝업존", en: "Online Exhibition Hall & Pop-up Zone" },
              note: {
                ko: "별도 캐러셀로 배치.",
                en: "Placed as their own carousels.",
              },
            },
          ],
          resolution: {
            ko: "박물관 콘텐츠는 포스터 자체가 이미 완성된 시각물입니다. 카드 디자인을 화려하게 만들면 포스터와 경쟁하게 되어 둘 다 죽습니다. 카드는 최소한의 테두리와 여백만 두고, 상태 배지와 제목·기간만 남겨 포스터가 주인공이 되도록 했습니다.",
            en: "Museum content already comes with a finished piece of visual design built in — the poster. Make the card itself flashy, and it competes with the poster; both lose. I kept the card down to a minimal border and margin, leaving only the status badge, title, and dates, so the poster stays the lead.",
          },
        },
        {
          id: "tone",
          label: { ko: "톤 앤 매너", en: "Tone & Manner" },
          intro: {
            ko: "배경은 흰색과 옅은 그레이만 사용하고, 장식 요소를 배제했습니다. 색은 콘텐츠 이미지에서만 나오게 하고, UI 자체는 검정·회색·흰색으로 제한했습니다. 메인 비주얼 하단의 정보 바는 히어로 이미지 위에 얹힌 딤·블러 레이어입니다. 정해진 색으로 전환되는 게 아니라, 그 순간 걸린 이미지의 색감을 그대로 투과해 자연스럽게 따라가는 방식이라 정보 영역이 비주얼과 분리된 별개의 띠처럼 보이지 않습니다.",
            en: "The background uses only white and a pale gray, with no decorative elements. Color comes only from the content images; the UI itself is limited to black, gray, and white. The info bar beneath the main visual is a dim/blur layer sitting directly on the hero image, not a fixed tone it switches between — it just lets whatever color is behind it show through naturally, so the info area never reads as a separate strip glued on top of the visual.",
          },
          compare: {
            left: {
              src: "/media/home_work/national-museum/main-default.png",
              caption: {
                ko: "청자·백자 전시 — 정보 바가 히어로 색감에 맞춰 흐려짐",
                en: "Celadon & white porcelain exhibit — the info bar dims to the hero's own color",
              },
            },
            right: {
              src: "/media/home_work/national-museum/main-hover.png",
              caption: {
                ko: "서화 전시 — 어두운 히어로 위에서 자연스럽게 딤 처리",
                en: "Calligraphy & painting exhibit — dims naturally over the darker hero",
              },
            },
          },
          resolution: {
            ko: "'심플하지만 정보를 제공하고, 미감도 있었으면 좋겠다'가 이 프로젝트의 요구였습니다. 디자이너가 미감을 더하려고 UI에 장식을 넣으면 오히려 실패합니다. 박물관이 가진 유물과 전시 포스터가 이미 충분히 아름답기 때문에, UI는 그것을 방해하지 않고 담아내는 그릇이 되어야 했습니다. 화면에서 색을 빼고 여백을 늘리는 방향이 결과적으로 더 미감 있는 화면을 만들었습니다.",
            en: "\"Simple, but still informative, and still beautiful\" was the brief. Add decoration to the UI to chase that beauty, and it backfires — the museum's own artifacts and exhibition posters are already beautiful enough. The UI's job was to be a container that carries that without getting in the way. Taking color out of the interface and giving it more room, in the end, is what made the screen read as more beautiful, not less.",
          },
        },
      ],
    },
  },
  {
    index: "07",
    title: { ko: "리브한의원", en: "Reeve" },
    category: {
      ko: "한의원 홈페이지 디자인 개발",
      en: "Korean Medicine Clinic Website Design & Development",
    },
    tags: ["Built by Me", "Business"],
    skills: ["Next.js", "Framer Motion", "Interactive UX", "Responsive"],
    description: {
      ko: "전통 한의원의 딱딱한 인상 대신, 사상체질 자가진단을 중심에 둔 모던한 웰니스 클리닉 웹사이트입니다.",
      en: "A modern wellness-clinic site for a traditional Korean medicine practice, built around a Sasang constitutional-type self-check instead of the usual clinical brochure feel.",
    },
    process: {
      ko: "한의원은 진입장벽이 있는 업종입니다. 젊은 세대일수록 '한약', '침'이라는 단어에서 올드하고 어려운 이미지를 먼저 떠올립니다. 이 장벽을 낮추는 방법으로 설명이 아니라 체험을 택했습니다 — 홈 화면에 '1분 체질 자가진단'을 두어, 방문자가 정보를 읽기 전에 먼저 참여하게 만들었습니다. 진료 과목은 한의학 용어 그대로 나열하지 않고 DIET·BEAUTY·POSTURE처럼 영문 라벨과 함께 재배치해 어떤 병원인지 한눈에 읽히게 했고, 원장의 소개는 자격이 아니라 태도로 이야기하도록 문구를 다듬었습니다. 기획부터 디자인, 프론트엔드 구현까지 전 과정을 진행했습니다.",
      en: "A Korean medicine clinic carries a real barrier to entry — the words \"herbal medicine\" and \"acupuncture\" read as old-fashioned and hard to approach, especially to a younger audience. Rather than explain that away, I chose to let visitors experience it: a \"1-minute constitution check\" sits right on the home screen, so a visitor participates before they've read a single line of copy. Treatment categories aren't listed in clinical terms — DIET, BEAUTY, POSTURE and the like sit alongside the Korean labels so what kind of clinic this is reads at a glance — and the doctor's introduction is written around his manner with patients, not his credentials. I ran the whole process: planning, design, and frontend build.",
    },
    image: "/media/home_work/work_03_medical.png",
    url: "https://hanbang-taupe.vercel.app/",
    designGuide: {
      panels: [
        {
          id: "layout",
          label: { ko: "레이아웃 & 톤", en: "Layout & Tone" },
          intro: {
            ko: "히어로는 웜 우드톤 인테리어로 열고, 진료분야 섹션은 반대로 짙은 네이비를 깔아 화면에 리듬을 줍니다. 두 톤이 번갈아 배치되며 스크롤할 때마다 분위기가 한 번씩 전환됩니다.",
            en: "The hero opens on a warm wood-toned interior, and the treatments section flips to a deep navy right after it, giving the scroll a rhythm where the mood resets with every section.",
          },
          colors: [
            {
              hex: "#FFFDF9",
              name: { ko: "크림", en: "Cream" },
              role: { ko: "기본 배경", en: "Base background" },
            },
            {
              hex: "#3C2F22",
              name: { ko: "초콜릿", en: "Chocolate" },
              role: { ko: "신뢰 섹션 배경 (원장 소개)", en: "Trust section background (doctor's intro)" },
            },
            {
              hex: "#152036",
              name: { ko: "딥 네이비", en: "Deep Navy" },
              role: { ko: "진료분야 섹션 배경", en: "Treatments section background" },
            },
            {
              hex: "#DFC4A2",
              name: { ko: "머스터드 골드", en: "Muted Gold" },
              role: { ko: "진행률 바 · 선택 상태 강조", en: "Progress bar & selected-state accent" },
            },
          ],
          resolution: {
            ko: "웜 우드톤은 한방이라는 업의 정체성을 잃지 않으면서도 스파처럼 편안하게 읽히도록 고른 색입니다. 반대로 정보를 나열하는 진료분야 섹션엔 짙은 네이비를 넣었는데, 장식이 아니라 그 구간을 고급스럽고 신뢰감 있게 보이도록 누르는 포인트로 쓴 색입니다. 웜톤이 업의 정체성을 맡고, 네이비가 신뢰의 무게를 맡는 식으로 역할을 나눴습니다.",
            en: "The warm wood tone keeps the identity of a Korean medicine clinic intact while still reading as relaxed as a spa. The treatments section, by contrast, runs on a deep navy — not decoration, but a deliberate point of restraint that makes an information-heavy section read as upscale and trustworthy. The warm palette carries the clinic's identity; the navy carries the weight of trust.",
          },
        },
        {
          id: "constitution",
          label: { ko: "체질 자가진단", en: "Constitution Check" },
          intro: {
            ko: "구글 트렌드 기준, 한국은 2018년부터 전 세계 'MBTI' 검색 관심도에서 압도적 1위입니다 — 2위인 홍콩과도 격차가 6배 가까이 벌어져 있습니다. 이 열기는 유형 테스트라는 형식 자체보다, 나에게 맞는 답을 원하는 '개인 맞춤화' 욕구에 더 가깝습니다. 실제로 글로벌 개인 맞춤 의료 시장도 2025년 약 6,545억 달러에서 2035년 약 1조 3,976억 달러 규모로, 연평균 7.88%씩 계속 커지고 있습니다. 한의학 안에서 이 흐름과 가장 정확히 맞아떨어지는 개념이 사상체질입니다 — 태음인·소양인·소음인·태양인 넷으로 나눠 사람마다 다른 처방을 내리는 한국 고유의 이론이니까요. 그래서 홈 화면 중간, 진료분야 바로 다음 자리에 '1분 체질 자가진단'을 배치했습니다.",
            en: "Per Google Trends, Korea has held the #1 spot worldwide in search interest for \"MBTI\" since 2018 — nearly 6x ahead of Hong Kong in 2nd place. That intensity isn't really about the type-quiz format itself; it's closer to a demand for an answer tailored to you specifically. The global personalized-medicine market backs that up too, growing from roughly $654.5B in 2025 toward $1.4T by 2035, a 7.88% CAGR. Within Korean medicine, the concept that lines up most precisely with that appetite is Sasang constitutional theory — a native Korean framework sorting people into four types (Taeeum, Soyang, Soeum, Taeyang) and prescribing differently for each. So right after the treatments grid, the home screen drops into a \"1-minute constitution check.\"",
          },
          images: [
            {
              src: "/media/home_work/hanbang/constitution-test.png",
              caption: {
                ko: "체질 자가진단 — Q1/10, 진행률 바와 선택지",
                en: "Constitution check — question 1 of 10, with a progress bar",
              },
              device: "desktop",
            },
          ],
          percentBars: [
            {
              label: { ko: "한국", en: "South Korea" },
              value: 100,
            },
            {
              label: { ko: "홍콩", en: "Hong Kong" },
              value: 17,
            },
            {
              label: { ko: "필리핀", en: "Philippines" },
              value: 16,
              note: {
                ko: "2·3위 국가도 한국의 1/6 수준입니다.",
                en: "Even the #2 and #3 countries sit at roughly 1/6 of Korea's level.",
              },
            },
          ],
          percentBarsSource: {
            ko: "출처: 구글 트렌드, 국가별 'MBTI' 검색 관심도(2018년 이후, 한국=100 기준 상대값). 유형 테스트 포맷을 메인 콘텐츠로 올릴 수 있다고 판단한 근거입니다.",
            en: "Source: Google Trends, relative search interest for \"MBTI\" by country since 2018 (Korea indexed at 100) — the basis for betting on a type-quiz format as main content.",
          },
          resolution: {
            ko: "MBTI 열풍이 유형 테스트라는 포맷에 대한 신뢰를, 개인 맞춤 헬스케어 트렌드가 '나에게 맞는 답'이라는 콘텐츠에 대한 수요를 각각 검증해주고 있었습니다. 사상체질은 이 두 흐름이 정확히 만나는 지점이라 판단해 메인 콘텐츠로 올렸습니다. 형식은 사지선다·진행률 바·1분이라는 짧은 소요시간처럼 이미 익숙한 문법을 그대로 따랐고, 테스트는 참여 자체가 목적이 아니라 상담 예약으로 이어지는 입구이므로 결과 화면이 곧장 상담 신청과 연결되도록 흐름을 짰습니다. 다만 '참고용 간이 테스트'라는 문구를 결과 위에 항상 노출해, 실제 진단은 대면 진료가 필요하다는 걸 분명히 했습니다.",
            en: "The MBTI craze validated trust in the type-quiz format itself; the personalized-healthcare trend validated demand for \"an answer tailored to me\" as content. Sasang constitution sits exactly where those two lines cross, which is why it went front and center. The format follows grammar people already know — multiple choice, a progress bar, a promised one-minute length — and since the quiz is an entry point into booking rather than the destination, the result screen flows straight into that. A disclaimer stays visible right above it too, since a quiz isn't a diagnosis and an actual reading still needs an in-person visit.",
          },
        },
        {
          id: "treatments",
          label: { ko: "진료분야 IA", en: "Treatment IA" },
          intro: {
            ko: "6개 진료 과목을 한의학 전문 용어 대신 DIET·BEAUTY·POSTURE·SPINE & JOINT·ACCIDENT·WELLNESS라는 영문 카테고리 라벨과 함께 2x3 카드 그리드로 재배치했습니다. 카드마다 한 줄 설명을 붙여, 클릭해서 들어가지 않아도 그 과목이 다루는 범위를 짐작할 수 있게 했습니다.",
            en: "The six treatment areas sit in a 2×3 card grid, each tagged with an English category label — DIET, BEAUTY, POSTURE, SPINE & JOINT, ACCIDENT, WELLNESS — instead of clinical terminology. A one-line description on each card means a visitor can guess what it covers without clicking in.",
          },
          list: [
            {
              label: { ko: "DIET · 다이어트 클리닉", en: "DIET · Diet Clinic" },
              note: {
                ko: "체질 맞춤·산후·성장기 다이어트",
                en: "Constitution-matched, postpartum, and adolescent weight programs",
              },
            },
            {
              label: { ko: "BEAUTY · 미용 클리닉", en: "BEAUTY · Beauty Clinic" },
              note: {
                ko: "한방 동안침·약침 리프팅",
                en: "Traditional facial acupuncture and herbal-injection lifting",
              },
            },
            {
              label: { ko: "POSTURE · 체형교정 클리닉", en: "POSTURE · Posture Clinic" },
              note: {
                ko: "추나요법·거북목·성장판 검사",
                en: "Chuna manual therapy, forward-head posture, and growth-plate checks",
              },
            },
            {
              label: { ko: "SPINE & JOINT · 척추관절 클리닉", en: "SPINE & JOINT Clinic" },
              note: {
                ko: "허리·목 디스크, 어깨·관절 통증",
                en: "Lumbar/cervical disc issues, shoulder and joint pain",
              },
            },
            {
              label: { ko: "ACCIDENT · 교통사고 클리닉", en: "ACCIDENT · Accident Clinic" },
              note: {
                ko: "자동차보험 처리·입원 치료 가능",
                en: "Auto-insurance claims handled, inpatient care available",
              },
            },
            {
              label: { ko: "WELLNESS · 보양 클리닉", en: "WELLNESS Clinic" },
              note: {
                ko: "공진단·경옥고, 체질 맞춤 보약",
                en: "Gongjin-dan, Gyeongok-go, and constitution-matched tonics",
              },
            },
          ],
          resolution: {
            ko: "환자는 자기 증상을 한의학 용어로 정리해서 오지 않습니다. '다이어트 하고 싶다', '자세가 안 좋다' 같은 일상어로 찾아옵니다. 카드 라벨을 영문 카테고리로 한 번 더 감싼 건 장식이 아니라, 클리닉을 서비스 단위로 인식하게 만들려는 의도입니다 — 마치 스파나 피트니스 클럽의 프로그램 목록처럼요.",
            en: "Patients don't arrive with their symptoms already sorted into clinical categories — they come in with \"I want to lose weight\" or \"my posture is bad.\" Wrapping each card in an English category label isn't decoration; it's meant to make each clinic read as a service, the way a program list at a spa or a fitness studio would.",
          },
        },
        {
          id: "responsive",
          label: { ko: "반응형", en: "Responsive" },
          intro: {
            ko: "모바일에서는 상단 내비게이션이 햄버거 메뉴로 접히고, 히어로의 사진·타이포그래피 구성은 그대로 세로로 눌러 담았습니다. 카카오톡 상담·전화·TOP 버튼은 데스크톱과 동일하게 화면 우측에 고정되어, 기기와 관계없이 상담까지 가는 경로가 같습니다.",
            en: "On mobile, the top nav folds into a hamburger menu, and the hero's photo-plus-typography composition compresses straight down rather than being redesigned. The KakaoTalk, phone, and TOP buttons stay fixed on the right exactly as on desktop, so the path to booking a consultation doesn't change by device.",
          },
          responsive: {
            desktop: {
              src: "/media/home_work/hanbang/hero.png",
              caption: { ko: "히어로 (PC)", en: "Hero (Desktop)" },
            },
            mobile: {
              src: "/media/home_work/hanbang/mobile-hero.png",
              caption: { ko: "히어로 (모바일)", en: "Hero (Mobile)" },
            },
          },
        },
      ],
    },
  },
  {
    index: "08",
    title: { ko: "Reboot Camp", en: "Reboot Camp" },
    category: {
      ko: "헬스 홈페이지 디자인 개발",
      en: "Fitness Website Design & Development",
    },
    tags: ["Built by Me", "Business"],
    description: {
      ko: "헬스 및 피트니스 관련 웹 프로젝트 디자인과 개발을 포함합니다.",
      en: "Design and development for a fitness website.",
    },
    image: "/media/home_work/work_02_reboot.png",
    url: "https://reboot-camp-liard.vercel.app/",
    hidden: true,
  },
];

/** Everything the public site should ever link to — grid, list, prev/next,
 * static params. WORK_PROJECTS itself stays the full authored list so a
 * hidden entry's data (and its `hidden` flag) is easy to flip back later. */
export const VISIBLE_WORK_PROJECTS = WORK_PROJECTS.filter((p) => !p.hidden);
