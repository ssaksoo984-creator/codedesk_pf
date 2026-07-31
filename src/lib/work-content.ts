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
    title: { ko: "리브한의원", en: "Reeve" },
    category: {
      ko: "한의원 홈페이지 디자인 개발",
      en: "Korean Medicine Clinic Website Design & Development",
    },
    image: "/media/home_work/work_03_medical.png",
    url: "https://hanbang-wzgf.vercel.app/",
  },
  {
    index: "04",
    title: { ko: "Lookback", en: "Lookback" },
    category: {
      ko: "미술 아카이브 사이트",
      en: "Art Archive Website",
    },
    image: "/media/home_work/work_04_artl.png",
    url: "https://lookback-dusky.vercel.app/",
  },
  {
    index: "05",
    title: { ko: "Bloom Soft", en: "Bloom Soft" },
    category: {
      ko: "테크 기업 사이트",
      en: "Technology Company Website",
    },
    image: "/media/home_work/work_05_company.png",
    url: "https://bloomcompany-xgvi.vercel.app/",
  },
];
