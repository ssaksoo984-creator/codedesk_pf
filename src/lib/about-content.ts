export interface AboutSlide {
  title: { ko: string; en: string };
  desc: { ko: string; en: string };
}

export const ABOUT_SLIDES: AboutSlide[] = [
  {
    title: { ko: "공감, 표현, 연결", en: "Empathize, Express, Connect" },
    desc: {
      ko: "UI/UX는 이 세 단계의 끊임없는 반복입니다. 사용자의 목적과 불편함에 공감하고, 누구나 이해할 수 있는 직관적인 화면으로 표현하여, 결국 사용자와 서비스를 매끄럽게 연결하는 것.",
      en: "UI/UX is a continuous loop of these three principles. It means empathizing with the user's goals and frustrations, translating them into intuitive interfaces, and ultimately bridging the gap between the service and the user.",
    },
  },
  {
    title: { ko: "장식보다 사용성이 먼저입니다", en: "Usability Before Decoration" },
    desc: {
      ko: "화면에서 불필요한 색과 장식을 걷어냈을 때, 비로소 콘텐츠가 본연의 힘을 발휘하고 사용자 경험이 선명해지는 것을 수없이 경험했습니다.",
      en: "More often than not, stripping away excess color and ornamentation is exactly what makes the content readable and the user journey clear.",
    },
  },
  {
    title: { ko: "문화적 맥락을 읽는 디자인", en: "Reading Across Cultures" },
    desc: {
      ko: "서울과 밴쿠버의 서로 다른 문화와 트렌드를 경험하며, 다양한 관점으로 더 나은 사용자 경험을 디자인해왔습니다. 서로 다른 환경을 이해하고 연결하며, 누구나 직관적으로 사용할 수 있는 디자인을 고민합니다.",
      en: "Having experienced the different cultures and trends of Seoul and Vancouver, I've designed better user experiences through a range of perspectives. I focus on understanding and connecting different environments, crafting design that anyone can use intuitively.",
    },
  },
];

const IMAGE_COUNT = 24;

export const ABOUT_IMAGES: string[] = Array.from(
  { length: IMAGE_COUNT },
  (_, i) => `/media/home_about/about_${i + 1}.png`
);
