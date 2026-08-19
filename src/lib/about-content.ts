export interface AboutSlide {
  title: { ko: string; en: string };
  desc: { ko: string; en: string };
}

export const ABOUT_SLIDES: AboutSlide[] = [
  {
    title: { ko: "공감, 표현, 연결", en: "Empathize, Express, Connect" },
    desc: {
      ko: "UI/UX는 이 세 단계의 끊임없는 반복입니다. 사용자의 목적과 불편함에 공감하고, 누구나 이해할 수 있는 직관적인 화면으로 표현하여, 결국 사용자와 서비스를 매끄럽게 연결하는 것. 이 중 하나라도 빠지면 예쁘지만 쓰이지 않거나, 기능이 있어도 발견되지 않는 프로덕트가 됩니다.",
      en: "UI/UX is a continuous loop of these three principles. It means empathizing with the user's goals and frustrations, translating them into intuitive interfaces, and ultimately bridging the gap between the service and the user. Skip one, and you're left with a beautiful product nobody uses, or functional features nobody finds.",
    },
  },
  {
    title: { ko: "장식보다 사용성이 먼저입니다", en: "Usability Before Decoration" },
    desc: {
      ko: "심미성이 목적이 되는 순간, 정작 필요한 정보는 길을 잃습니다. 저는 무엇을 더할지보다 '무엇을 덜어낼지'를 먼저 고민합니다. 화면에서 불필요한 색과 장식을 걷어냈을 때, 비로소 콘텐츠가 본연의 힘을 발휘하고 사용자 경험이 선명해지는 것을 수없이 경험했습니다.",
      en: "When aesthetics become the primary goal, core information gets lost. I decide what to subtract before considering what to add. More often than not, stripping away excess color and ornamentation is exactly what makes the content readable and the user journey clear.",
    },
  },
  {
    title: { ko: "문화적 맥락을 읽는 디자인", en: "Reading Across Cultures" },
    desc: {
      ko: "서울과 밴쿠버를 오가며 작업하면서, 같은 기능이라도 문화권에 따라 사용자가 기대하는 흐름이 다르다는 것을 배웠습니다. 한국 공공기관 및 엔터프라이즈의 높은 정보 밀도와 북미 소상공인 비즈니스의 간결함, 그 사이의 간극을 오가며 각 타깃 유저에게 가장 '익숙하고 편안한' 방식을 짚어내는 감각을 길렀습니다.",
      en: "Working as a freelance designer between Seoul and Vancouver has taught me that user expectations shift across borders. Navigating the high information density of Korean public institutions and the streamlined directness of North American small businesses has sharpened my ability to design interfaces that feel native and intuitive to any target audience.",
    },
  },
];

const IMAGE_COUNT = 24;

export const ABOUT_IMAGES: string[] = Array.from(
  { length: IMAGE_COUNT },
  (_, i) => `/media/home_about/about_${i + 1}.png`
);
