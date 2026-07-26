export interface AboutSlide {
  title: { ko: string; en: string };
  desc: { ko: string; en: string };
}

export const ABOUT_SLIDES: AboutSlide[] = [
  {
    title: { ko: "올인원 웹 솔루션", en: "All-in-One Web Solution" },
    desc: {
      ko: "웹사이트의 뼈대를 잡는 기획부터 안정적인 개발까지 전 과정을 아우르는 원스톱 서비스를 제공합니다.",
      en: "We provide a comprehensive one-stop service, covering everything from foundational planning to stable development.",
    },
  },
  {
    title: { ko: "맞춤형 비즈니스 최적화", en: "Custom Business Optimization" },
    desc: {
      ko: "고객의 브랜드 정체성과 비즈니스 목표를 깊이 이해하고, 실질적인 결과를 만들어내는 맞춤형 웹을 구축합니다.",
      en: "By deeply understanding your brand identity and goals, we build customized websites that deliver real results.",
    },
  },
  {
    title: { ko: "합리적이고 확실한 서비스", en: "Budget-Friendly & Reliable" },
    desc: {
      ko: "프로젝트 규모와 예산에 맞춰 가장 효율적인 솔루션을 제안하며, 투자 대비 확실한 퀄리티를 보장합니다.",
      en: "We offer efficient solutions tailored to your budget, guaranteeing absolute quality that exceeds your investment.",
    },
  },
];

const IMAGE_COUNT = 24;

export const ABOUT_IMAGES: string[] = Array.from(
  { length: IMAGE_COUNT },
  (_, i) => `/media/home_about/about_${i + 1}.png`
);
