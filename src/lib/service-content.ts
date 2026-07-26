export interface ServiceCardData {
  index: string;
  title: { ko: string; en: string };
  description: { ko: string; en: string };
}

export const SERVICE_INTRO = {
  title: { ko: "서비스", en: "Service" },
  description: {
    ko: "우리는 전문적인 서비스를 제공합니다. 마이그레이션부터 프론트엔드 개발, 제품 컨설팅까지 — 아이디어가 실제로 작동하는 제품이 되기까지 전 과정을 함께합니다.",
    en: "We provide professional services — from migration to frontend development and product consulting, partnering with you through the entire journey from idea to a fully working product.",
  },
};

export const SERVICES: ServiceCardData[] = [
  {
    index: "01",
    title: { ko: "웹 기획 및 개발", en: "Web Development" },
    description: {
      ko: "비즈니스 로직에 맞춘 탄탄한 백엔드 설계와 최신 기술을 활용하여, 빠르고 안정적인 시스템을 구축합니다.",
      en: "We build fast and stable systems using robust architecture and the latest web technologies aligned with your business logic.",
    },
  },
  {
    index: "02",
    title: { ko: "반응형 웹 구현", en: "Responsive Web" },
    description: {
      ko: "스마트폰, 태블릿, PC 등 모든 기기 화면에 완벽하게 맞춰지는 최적화된 웹 환경을 제공합니다.",
      en: "We create fully optimized web environments that provide a seamless viewing experience across desktops, tablets, and smartphones.",
    },
  },
  {
    index: "03",
    title: { ko: "프로덕트 컨설팅", en: "Product Consulting" },
    description: {
      ko: "성공적인 론칭을 위해 시장을 분석하고, 비즈니스 방향성과 웹 서비스 전략을 함께 기획합니다.",
      en: "We offer strategic planning, market analysis, and directional guidance to ensure the successful launch of your service.",
    },
  },
  {
    index: "04",
    title: { ko: "UI/UX 디자인", en: "UI/UX Design" },
    description: {
      ko: "브랜드의 매력을 돋보이게 하는 세련된 시각 디자인(UI)과, 방문자가 쉽고 편하게 탐색할 수 있는 최적의 동선(UX)을 설계합니다.",
      en: "We craft trendy visual designs (UI) and intuitive user journeys (UX) that make your website both beautiful and easy to navigate.",
    },
  },
  {
    index: "05",
    title: { ko: "유지보수 및 SEO", en: "Maintenance & SEO" },
    description: {
      ko: "론칭 후 안정적인 사이트 관리와 함께 검색 엔진 최적화(SEO)를 적용하여 고객의 접근성을 높입니다.",
      en: "We provide continuous, stable website management alongside Search Engine Optimization (SEO) strategies to improve online visibility.",
    },
  },
];
