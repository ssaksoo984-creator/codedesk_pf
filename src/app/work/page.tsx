"use client";

import { useLocale } from "@/components/site-header/locale-context";
import { ProjectIndex } from "@/components/site/project-index";
import { Footer } from "@/components/site/contact";
import { SHOWREEL } from "@/lib/project-media";
import { MotionVideo } from "@/components/site/motion-video";

export default function WorkPage() {
  const { locale } = useLocale();
  return (
    <>
      <main className="min-h-screen bg-ink text-paper">
        <div className="wrap pt-32 md:pt-44">
          <p className="font-mono text-[12px] text-paper/45">{locale === "ko" ? "작업" : "Work"}</p>
          <h1 key={locale} className="display mt-5 text-[clamp(3rem,11vw,10rem)]">
            <span className="word block">
              <span>{locale === "ko" ? "전체 작업" : "All the work"}</span>
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-paper/60">
            {locale === "ko"
              ? "공공 시스템, 커머스, 브랜드, 그리고 직접 만든 AI 제품까지. 마우스를 올리면 실제 화면이 재생돼요."
              : "Public systems, commerce, brands and the AI products I build myself. Hover a row to play the real screens."}
          </p>
          <div className="mt-12 aspect-[21/9] overflow-hidden rounded-[24px] bg-ink-2">
            <MotionVideo src={SHOWREEL.video} poster={SHOWREEL.poster} />
          </div>
        </div>
        <ProjectIndex withHeading={false} />
      </main>
      <Footer dark />
    </>
  );
}
