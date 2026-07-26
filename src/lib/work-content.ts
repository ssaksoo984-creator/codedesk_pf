export interface WorkProject {
  index: string;
  title: { ko: string; en: string };
  category: { ko: string; en: string };
  /** Sticky preview panel shows a video when set, otherwise falls back to image. */
  image?: string;
  video?: string;
  url: string;
}

// Only real, shipped projects go here — the list grows as more come in, so
// keep it short rather than padding it out with placeholders.
export const WORK_PROJECTS: WorkProject[] = [
  {
    index: "01",
    title: { ko: "ARTE", en: "ARTE" },
    category: {
      ko: "성형외과 홈페이지 디자인 개발",
      en: "Plastic Surgery Clinic Website Design & Development",
    },
    image: "/media/home_work/work_01_Arte.png",
    url: "https://note-clinic-portfolio.vercel.app/",
  },
  {
    index: "02",
    title: { ko: "Reboot Camp", en: "Reboot Camp" },
    category: {
      ko: "헬스 홈페이지 디자인 개발",
      en: "Fitness Website Design & Development",
    },
    image: "/media/home_work/work_02_reboot.png",
    url: "https://reboot-camp-liard.vercel.app/",
  },
  {
    index: "03",
    title: { ko: "국립중앙박물관", en: "National Museum of Korea" },
    category: {
      ko: "공공기관 디자인",
      en: "Public Institution Website Design",
    },
    video: "/media/home_work/work_03_koreannationalmuseum.mp4",
    url: "#",
  },
];
