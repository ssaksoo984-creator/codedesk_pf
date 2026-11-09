"use client";

import { useState } from "react";
import clsx from "clsx";
import { useLocale } from "@/components/site-header/locale-context";
import { MotionVideo } from "./motion-video";

const LOGO = [
  { n: "Gold Orange", h: "#FFA600" },
  { n: "Rose Red", h: "#FF3D5A" },
  { n: "Violet", h: "#7B2FFF" },
  { n: "Deep Blue", h: "#2F45FF" },
  { n: "Azure", h: "#0096FF" },
  { n: "Mint Teal", h: "#00C9A7" },
];
const NEUTRAL = [
  { n: "Ink", h: "#141312" },
  { n: "Surface", h: "#1F1E1D" },
  { n: "Workspace", h: "#262624" },
  { n: "Stone", h: "#8E8B82" },
  { n: "Cream", h: "#EDEAE0" },
  { n: "Paper", h: "#F5F4EE" },
];
const STAGES = [
  { id: "producer", n: "Producer", h: "#F2A33A", d: { ko: "아이디어 · 조건", en: "Idea & terms" } },
  { id: "writer", n: "Writer", h: "#E8606F", d: { ko: "산문 · 씬", en: "Prose & scenes" } },
  { id: "artist", n: "Artist", h: "#8B63E8", d: { ko: "캐릭터 · 배경", en: "Characters & sets" } },
  { id: "storyboard", n: "Storyboard", h: "#5A6AE6", d: { ko: "샷 · 콘티", en: "Shots & boards" } },
  { id: "director", n: "Director", h: "#3E9BE0", d: { ko: "영상 생성", en: "Video generation" } },
  { id: "editor", n: "Editor", h: "#2DB39A", d: { ko: "편집 · 출력", en: "Edit & export" } },
];
const MOCKS = [
  { src: "card-letterpress", t: { ko: "명함", en: "Business cards" } },
  { src: "letterhead", t: { ko: "레터헤드", en: "Letterhead" } },
  { src: "app-icon", t: { ko: "앱 아이콘", en: "App icon" } },
  { src: "mobile", t: { ko: "모바일", en: "Mobile" } },
  { src: "goods-1", t: { ko: "굿즈", en: "Goods" } },
  { src: "sign-lobby", t: { ko: "로비 사인", en: "Lobby sign" } },
  { src: "subway", t: { ko: "지하철 광고", en: "Subway ad" } },
  { src: "billboard", t: { ko: "빌보드", en: "Billboard" } },
  { src: "desktop", t: { ko: "데스크톱", en: "Desktop" } },
  { src: "tags", t: { ko: "택", en: "Tags" } },
];

const COPY = {
  lead: {
    ko: "Tale은 ‘이야기(tale)’이자 ‘꼬리(tail)’. 한 줄의 아이디어가 꼬리를 물고 영상이 되는 과정을 하나의 심볼에 담았습니다. 꼬리의 형태는 어떤 상황에서도 바뀌지 않고, 색만 단계에 따라 움직입니다.",
    en: "Tale reads as a story and as a tail — one line of an idea that keeps trailing until it becomes a film. The tail’s shape never changes; only its colour moves with the stage you are in.",
  },
  tagline: { ko: "이야기를 쓰면, 영상이 돼요.", en: "Your Tale Deserves a Take." },
  logo: { ko: "로고 컬러", en: "Logo colours" },
  neutral: { ko: "뉴트럴 — 작업 화면용", en: "Neutrals — for the workspace" },
  stages: { ko: "단계 컬러 · Lumi", en: "Stage colours · Lumi" },
  stagesD: {
    ko: "에이전트 캐릭터 Lumi는 지금 어느 단계에서 일하고 있는지 색으로 알려 줍니다. 단계를 눌러 보세요.",
    en: "The agent, Lumi, tells you which stage it is working in by colour alone. Tap a stage.",
  },
  apps: { ko: "적용 예시", en: "Applications" },
};

/** Tale Studio 2026 BI: symbol, palettes, stage-coloured Lumi and mockups. */
export function TaleBrand() {
  const { locale } = useLocale();
  const [stage, setStage] = useState(0);
  const s = STAGES[stage];

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Symbol + Lumi loop */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex aspect-square flex-col justify-between rounded-[24px] bg-paper p-6 text-ink md:p-10">
          <span className="font-mono text-[12px] text-stone">Symbol · A-03</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/tale/tale-symbol.svg" alt="Tale Studio symbol" className="tale-float mx-auto w-[58%]" />
          <span className="text-[clamp(1.4rem,2.6vw,2.2rem)] font-bold tracking-[-0.03em]">{COPY.tagline[locale]}</span>
        </div>
        <div className="relative aspect-square overflow-hidden rounded-[24px] bg-[#0f0e0d]">
          <MotionVideo src="/media/tale/lumi-complete.mp4" poster="/media/tale/lumi-complete.webp" />
          <span className="absolute bottom-4 left-4 rounded-full bg-black/45 px-3 py-1.5 font-mono text-[11px] text-white/85">● Lumi — complete</span>
        </div>
      </div>
      <p className="max-w-3xl text-[17px] leading-[1.8] text-paper/70 md:text-xl">{COPY.lead[locale]}</p>

      {/* Palettes */}
      <div className="space-y-10">
        {[
          { label: COPY.logo[locale], list: LOGO },
          { label: COPY.neutral[locale], list: NEUTRAL },
        ].map((g) => (
          <div key={g.label}>
            <p className="mb-4 font-mono text-[12px] text-paper/45">{g.label}</p>
            <div className="grid grid-cols-3 gap-2 md:grid-cols-6">
              {g.list.map((c) => (
                <div key={c.h} className="group overflow-hidden rounded-[16px] border border-paper/10">
                  <div className="h-24 transition-[height] duration-500 [transition-timing-function:var(--ease)] group-hover:h-32 md:h-32 md:group-hover:h-40" style={{ background: c.h }} />
                  <div className="p-3">
                    <div className="text-[13px] font-semibold">{c.n}</div>
                    <div className="font-mono text-[11px] text-paper/45">{c.h}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Stage picker with Lumi */}
      <div>
        <p className="font-mono text-[12px] text-paper/45">{COPY.stages[locale]}</p>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-paper/60">{COPY.stagesD[locale]}</p>
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1.1fr]">
          <div
            className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[24px] transition-colors duration-700"
            style={{ background: `radial-gradient(circle at 50% 60%, ${s.h}55, #161514 70%)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={s.id} src={`/media/tale/lumi/${s.id}-xl.webp`} alt={`Lumi — ${s.n}`} className="tale-pop tale-float w-[72%] object-contain" />
            <span className="absolute left-5 top-5 font-mono text-[12px] text-white/70">
              0{stage + 1} / {s.n}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {STAGES.map((x, i) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setStage(i)}
                onMouseEnter={() => setStage(i)}
                className={clsx(
                  "flex flex-col justify-between rounded-[18px] border p-4 text-left transition-colors md:p-5",
                  i === stage ? "border-transparent text-ink" : "border-paper/10 text-paper hover:border-paper/30"
                )}
                style={i === stage ? { background: x.h } : undefined}
              >
                <span className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/media/tale/lumi/${x.id}.webp`} alt="" className="h-9 w-9 object-contain" loading="lazy" />
                  <span className="font-mono text-[11px] opacity-60">{x.h}</span>
                </span>
                <span className="mt-6">
                  <span className="block text-lg font-bold tracking-[-0.02em]">{x.n}</span>
                  <span className="block text-[13px] opacity-65">{x.d[locale]}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications — horizontal drag rail */}
      <div>
        <p className="mb-4 font-mono text-[12px] text-paper/45">{COPY.apps[locale]}</p>
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
          {MOCKS.map((m) => (
            <figure key={m.src} className="group w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[38%]">
              <div className="aspect-[4/3] overflow-hidden rounded-[20px] bg-ink-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/media/tale/bi/${m.src}.webp`} alt={m.t.en} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.2s] [transition-timing-function:var(--ease)] group-hover:scale-105" />
              </div>
              <figcaption className="mt-3 text-[14px] text-paper/60">{m.t[locale]}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
