export interface ServiceCardData {
  index: string;
  title: { ko: string; en: string };
  description: { ko: string; en: string };
}

export const SERVICE_INTRO = {
  title: { ko: "작업 방식", en: "How I Work" },
  description: {
    ko: "매번 다른 산업, 다른 사용자, 다른 예산 환경에서 작업해 왔습니다. 그럼에도 제가 흔들림 없이 지켜온 다섯 가지 설계 기준이 있습니다.",
    en: "Every project brings a different industry, user base, and budget. Yet I consistently rely on these five core principles.",
  },
};

export const SERVICES: ServiceCardData[] = [
  {
    index: "01",
    title: { ko: "직감이 아닌 근거로 구조화합니다", en: "Evidence Over Intuition" },
    description: {
      ko: "감에 의존하지 않습니다. 시장의 유사 서비스를 분석해 검증된 패턴을 찾고, 확실한 데이터와 근거 위에서 정보 구조(IA)를 설계합니다. 디자이너의 개인적 취향이 아닌, 확인된 사실이 모든 설계의 출발점입니다.",
      en: "I don't rely on intuition. I analyze proven patterns across similar services to build a solid, evidence-based information architecture. Facts, not personal preferences, are the starting point of every design decision.",
    },
  },
  {
    index: "02",
    title: { ko: "비즈니스 목적에 맞는 핏을 찾습니다", en: "Fit to the Goal" },
    description: {
      ko: "공공기관은 신뢰와 접근성, 커머스는 탐색과 전환율, B2B 소프트웨어는 반복 작업의 효율이 최우선입니다. 모든 프로젝트에 같은 공식을 대입하지 않고, 해당 서비스의 성공 지표에 맞춘 잣대로 설계합니다.",
      en: "Public institutions need trust and accessibility. E-commerce relies on discovery and conversion rate. B2B software demands efficiency in repeated tasks. I don't use a single playbook — I define what makes each specific service succeed and design toward that standard.",
    },
  },
  {
    index: "03",
    title: { ko: "사용자가 남긴 데이터에서 출발합니다", en: "Start from the Data" },
    description: {
      ko: "가장 많이 누르는 버튼, 이탈이 발생하는 구간, CS로 접수되는 불만 등 사용자는 이미 수많은 힌트를 남겨두었습니다. 추측으로 화면을 고치기 전에 데이터와 기록을 먼저 살피고 진짜 문제를 찾아냅니다.",
      en: "The most-clicked button, the point where users drop off, the complaints that land in support — users always leave clues. I dig through analytics and usage history before assuming what actually needs fixing.",
    },
  },
  {
    index: "04",
    title: { ko: "실사용자의 눈높이에 맞춥니다", en: "Design for the User" },
    description: {
      ko: "연령대가 다양한 퍼블릭 서비스는 글자를 키우고 동선을 단순하게, 실무자가 매일 쓰는 대시보드는 정보 밀도를 높이고 클릭을 최소화합니다. 프로덕트를 실제로 쓰는 사람이 누구인지 정의하는 것이 모든 디자인의 첫 단추입니다.",
      en: "A public service for a broad demographic needs larger type and a simpler path. A dashboard used daily by professionals needs higher data density and fewer clicks. Defining exactly who's behind the screen is the first step of every design.",
    },
  },
  {
    index: "05",
    title: { ko: "도구의 진화와 함께 성장합니다", en: "Grow with the Tools" },
    description: {
      ko: "도구도 사용자의 기대도 빠르게 바뀝니다. AI 툴을 적극적으로 활용해 프로토타입을 빠르게 검증하고, 프론트엔드 구현 환경을 고려하며 새로운 기술이 사용자 경험을 어떻게 확장할 수 있는지 끊임없이 탐구합니다. 멈춰 있는 디자인은 금방 낡기 마련입니다.",
      en: "Tools and expectations move fast. I fold AI into my own workflow to validate prototypes quickly, design with the frontend build in mind, and keep exploring how new technology can extend the user experience. Design that stands still goes stale fast.",
    },
  },
];
