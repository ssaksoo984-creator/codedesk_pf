import type { ImageShowcase } from "@/lib/work-content";

export const KARTS_IMAGE_SHOWCASE: ImageShowcase = {
  main: {
    title: { ko: "메인 화면", en: "Main Screen" },
    desktop: { light: "/media/home_work/karts/00_main_light.png", dark: "/media/home_work/karts/00_main_dark.png" },
    mobile: { light: "/media/home_work/karts/00_main_mo_light.png", dark: "/media/home_work/karts/00_main_mo_dark.png" },
  },
  groups: [
    {
      label: { ko: "학생", en: "Students" },
      caption: {
        ko: "특정 시기에 몰리는 이용 — 학기 초 등록, 학기 말 성적 조회",
        en: "Concentrated at specific times — registration at the start of term, grades at the end.",
      },
      cards: [
        {
          title: { ko: "학적관리", en: "Academic Records" },
          desktop: { light: "/media/home_work/karts/01_학생_01_학적관리_light.png", dark: "/media/home_work/karts/01_학생_01_학적관리_dark.png" },
          mobile: { light: "/media/home_work/karts/01_학생_01_학적관리_mo_light.png", dark: "/media/home_work/karts/01_학생_01_학적관리_mo_dark.png" },
        },
        {
          title: { ko: "등록금고지", en: "Tuition Notice" },
          desktop: { light: "/media/home_work/karts/01_학생_02_등록금고지_light.png", dark: "/media/home_work/karts/01_학생_02_등록금고지_dark.png" },
          mobile: { light: "/media/home_work/karts/01_학생_02_등록금고지_mo_light.png", dark: "/media/home_work/karts/01_학생_02_등록금고지_mo_dark.png" },
        },
      ],
    },
    {
      label: { ko: "교강사", en: "Faculty" },
      caption: {
        ko: "상시 이용 — 조회와 정정을 반복",
        en: "Constant use — repeated lookups and edits.",
      },
      cards: [
        {
          title: { ko: "국외활동결과보고 · 목록", en: "Overseas Activity Report · List" },
          desktop: { light: "/media/home_work/karts/02_교강사_01_국외활동결과보고_01_목록_light.png", dark: "/media/home_work/karts/02_교강사_01_국외활동결과보고_01_목록_dark.png" },
          mobile: { light: "/media/home_work/karts/02_교강사_01_국외활동결과보고_01_목록_mo_light.png", dark: "/media/home_work/karts/02_교강사_01_국외활동결과보고_01_목록_mo_dark.png" },
        },
        {
          title: { ko: "국외활동결과보고 · 상세", en: "Overseas Activity Report · Detail" },
          desktop: { light: "/media/home_work/karts/02_교강사_01_국외활동결과보고_02_상세_light.png", dark: "/media/home_work/karts/02_교강사_01_국외활동결과보고_02_상세_dark.png" },
          mobile: { light: "/media/home_work/karts/02_교강사_01_국외활동결과보고_02_상세_mo_light.png", dark: "/media/home_work/karts/02_교강사_01_국외활동결과보고_02_상세_mo_dark.png" },
        },
        {
          title: { ko: "연구업적관리 · 목록", en: "Research Records · List" },
          desktop: { light: "/media/home_work/karts/02_교강사_02_연구업적관리_01_목록_light.png", dark: "/media/home_work/karts/02_교강사_02_연구업적관리_01_목록_dark.png" },
          mobile: { light: "/media/home_work/karts/02_교강사_02_연구업적관리_01_목록_mo_light.png", dark: "/media/home_work/karts/02_교강사_02_연구업적관리_01_목록_mo_dark.png" },
        },
        {
          title: { ko: "연구업적관리 · 상세", en: "Research Records · Detail" },
          desktop: { light: "/media/home_work/karts/02_교강사_02_연구업적관리_02_상세_light.png", dark: "/media/home_work/karts/02_교강사_02_연구업적관리_02_상세_dark.png" },
          mobile: { light: "/media/home_work/karts/02_교강사_02_연구업적관리_02_상세_mo_light.png", dark: "/media/home_work/karts/02_교강사_02_연구업적관리_02_상세_mo_dark.png" },
        },
      ],
    },
  ],
};
