"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { LumiLive } from "@/components/lumi/lumi-live";
import { useLocale } from "@/components/site-header/locale-context";

const BG = "/media/home_work/talestudio/figma";

interface Scene {
  id: string;
  state: string;
  stage: string;
  bg: string;
  seconds: number;
  title: { ko: string; en: string };
  sub: { ko: string; en: string };
  steps: { ko: string; en: string }[];
}

// Copy mirrors the loading screens in the Figma file (E2 · E5 · A4 · S0).
const SCENES: Scene[] = [
  {
    id: "E2", state: "reading", stage: "Producer", bg: `${BG}/l_e2.webp`, seconds: 10,
    title: { ko: "글을 읽고 있어요", en: "Reading your story" },
    sub: { ko: "‘자판기’, ‘코미디’… 어떤 이야기인지 살펴보는 중이에요", en: "“Vending machine”, “comedy”… working out what kind of story this is" },
    steps: [
      { ko: "글 읽기", en: "Read the text" },
      { ko: "이야기 종류 판단", en: "Judge the story type" },
      { ko: "추천 설정 만들기", en: "Build recommended settings" },
    ],
  },
  {
    id: "E5", state: "writing", stage: "Producer → Writer", bg: `${BG}/l_e5.webp`, seconds: 40,
    title: { ko: "산문 초안을 쓰고 있어요", en: "Writing the prose draft" },
    sub: { ko: "민호를 자판기 앞에 세우는 중이에요…", en: "Putting Minho in front of the vending machine…" },
    steps: [
      { ko: "자료 정리", en: "Sort the material" },
      { ko: "이야기 뼈대", en: "Story skeleton" },
      { ko: "씬 스토리 쓰기", en: "Write scene stories" },
    ],
  },
  {
    id: "A4", state: "drawing", stage: "Artist", bg: `${BG}/l_a4.webp`, seconds: 60,
    title: { ko: "그림을 만들고 있어요", en: "Drawing your cast" },
    sub: { ko: "민호의 흰 셔츠를 다리는 중이에요…", en: "Ironing Minho's white shirt…" },
    steps: [
      { ko: "민호", en: "Minho" },
      { ko: "팀장", en: "Team lead" },
      { ko: "인턴", en: "Intern" },
      { ko: "회사 복도 자판기 앞", en: "Office hallway, by the vending machine" },
    ],
  },
  {
    id: "S0", state: "directing", stage: "Storyboard", bg: `${BG}/l_s0.webp`, seconds: 90,
    title: { ko: "Storyboard로 넘어가는 중이에요", en: "Moving on to Storyboard" },
    sub: { ko: "씬 · 샷을 나누고 러프를 그려요. 한 샷씩 보여 드릴게요.", en: "Splitting scenes and shots, sketching roughs — shown one shot at a time." },
    steps: [
      { ko: "산문 2씬을 한 컷씩 읽기", en: "Read both scenes, beat by beat" },
      { ko: "씬 2개로 나누기", en: "Split into 2 scenes" },
      { ko: "S1에 민호, S2에 민호 · 팀장 세우기", en: "Place Minho in S1, Minho & lead in S2" },
      { ko: "카메라 자리 잡기 · 샷 6개", en: "Set cameras — 6 shots" },
    ],
  },
];

const SCENE_MS = 9000;

/** The four long-wait screens from the Figma file, rebuilt live: the real
 * Lumi renderer plays each "making" state while the progress and step list
 * advance — the loading moment as it actually feels in the product. */
export function LumiLoadingScenes() {
  const { locale } = useLocale();
  const [i, setI] = useState(0);
  const [t, setT] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const scene = SCENES[i];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const start = performance.now() - t * SCENE_MS;
    let raf = 0;
    const tick = (now: number) => {
      const p = (now - start) / SCENE_MS;
      if (p >= 1) {
        setI((v) => (v + 1) % SCENES.length);
        setT(0);
        return;
      }
      setT(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, visible]);

  const done = Math.min(scene.steps.length, Math.floor(t * (scene.steps.length + 0.6)));

  return (
    <div ref={ref} className="flex flex-col gap-4">
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {SCENES.map((s, k) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setI(k);
              setT(0);
            }}
            className={clsx(
              "ko-safe shrink-0 border px-3 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors",
              k === i ? "border-neon bg-neon text-ink" : "border-white/15 text-white/55 hover:border-neon/60 hover:text-neon"
            )}
          >
            {s.id} · {s.stage}
          </button>
        ))}
      </div>

      <div className="brackets relative aspect-[16/10] w-full overflow-hidden border border-white/10 bg-[#0b0b0e]">
        {/* The real screen behind, dimmed the way the product dims it while the AI works */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={scene.bg} alt="" className="absolute inset-0 h-full w-full scale-[1.02] object-cover opacity-60 blur-[1.5px]" />
        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute left-1/2 top-1/2 w-[min(78%,400px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#1a1a1f]/95 px-5 pb-5 pt-2 text-center shadow-[0_30px_80px_rgba(0,0,0,0.6)] md:px-7 md:pb-7">
          <LumiLive state={scene.state} hidden={!visible} className="mx-auto -mb-2 max-w-[220px]" alt={`Lumi — ${scene.state}`} />
          <p className="text-[15px] font-semibold text-white md:text-lg">{scene.title[locale]}</p>
          <p className="mt-1 text-[11px] leading-snug text-white/55 md:text-xs">{scene.sub[locale]}</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-[#f0506a] to-[#b46bf0]" style={{ width: `${Math.min(100, t * 108)}%` }} />
            </div>
            <span className="font-mono text-[10px] text-white/45">
              {locale === "ko" ? `약 ${scene.seconds}초` : `~${scene.seconds}s`}
            </span>
          </div>
          <ul className="mt-3 hidden space-y-1.5 text-left text-xs sm:block">
            {scene.steps.map((st, k) => (
              <li key={k} className={clsx("flex items-center gap-2", k < done ? "text-white/70" : k === done ? "font-semibold text-white" : "text-white/30")}>
                <span
                  className={clsx(
                    "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[9px]",
                    k < done ? "text-[#f0506a]" : k === done ? "bg-[#f0506a] shadow-[0_0_10px_#f0506a]" : "border border-white/20"
                  )}
                >
                  {k < done ? "✓" : ""}
                </span>
                {st[locale]}
              </li>
            ))}
          </ul>
        </div>

        <div className="ko-safe absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">
          {scene.id} · Lumi “{scene.state}”
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/5">
          <div className="h-full bg-neon" style={{ width: `${t * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
