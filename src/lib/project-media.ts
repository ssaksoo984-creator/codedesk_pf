/** Motion for every project: real screen recordings of the live sites, a
 * recorded session of each prototype, or a slow pass over the delivered
 * screens (for work with no live deployment). Built into public/media/motion. */
export interface ProjectMotion {
  video: string;
  poster: string;
  /** What the clip actually is — shown as a small caption, so nothing reads as a mock. */
  kind: { ko: string; en: string };
}

const REC = { ko: "실제 사이트 화면 녹화", en: "Recorded from the live site" };
const PROTO = { ko: "프로토타입 사용 녹화", en: "Recorded from the working prototype" };
const SCREENS = { ko: "납품 화면", en: "Delivered screens" };

export const PROJECT_MOTION: Record<string, ProjectMotion> = {
  "01": { video: "/media/motion/01.mp4", poster: "/media/motion/01.webp", kind: REC },
  "02": { video: "/media/motion/02.mp4", poster: "/media/motion/02.webp", kind: SCREENS },
  "03": { video: "/media/motion/03.mp4", poster: "/media/motion/03.webp", kind: REC },
  "04": { video: "/media/motion/04.mp4", poster: "/media/motion/04.webp", kind: { ko: "다크 · 라이트 디자인 시스템", en: "Dark & light design system" } },
  "05": { video: "/media/motion/05.mp4", poster: "/media/motion/05.webp", kind: REC },
  "06": { video: "/media/motion/06.mp4", poster: "/media/motion/06.webp", kind: { ko: "작동하는 데모 사이트 녹화", en: "Recorded from the working demo site" } },
  "07": { video: "/media/motion/07.mp4", poster: "/media/motion/07.webp", kind: REC },
  "09": { video: "/media/motion/09.mp4", poster: "/media/motion/09.webp", kind: { ko: "v3 화면 시안", en: "v3 product screens" } },
  "10": { video: "/media/motion/10.mp4", poster: "/media/motion/10.webp", kind: PROTO },
  "11": { video: "/media/motion/11.mp4", poster: "/media/motion/11.webp", kind: REC },
};

export const SHOWREEL = { video: "/media/motion/showreel.mp4", poster: "/media/motion/showreel.webp" };
