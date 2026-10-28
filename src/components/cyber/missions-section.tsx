"use client";

import { useLocale } from "@/components/site-header/locale-context";
import { LatestCarousel } from "./latest-carousel";
import { SectionHeader, useRevealChildren } from "./primitives";
import { SectorMap } from "./sector-map";
import { InfectedGlobe } from "./infected-globe";

const COPY = {
  lead: {
    ko: "각 섹터는 실제로 진행한 프로젝트입니다. 미션 파일을 열면 그 섹터가 복구되고, 모든 섹터를 복구하면 세계를 구하게 됩니다.",
    en: "Every sector is a real project. Opening a mission file restores that sector — restore them all and the world is saved.",
  },
};

export function MissionsSection() {
  const { locale } = useLocale();
  const ref = useRevealChildren<HTMLElement>();

  return (
    <section ref={ref} id="missions" className="relative scroll-mt-20 py-24 md:py-28">
      <div className="wrap">
        <SectionHeader
          index="02"
          label="Missions"
          title={
            <>
              Infected <span className="text-alert">sectors</span>
            </>
          }
        />
        <div className="mb-14 grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-20">
          <div data-reveal className="flex flex-col gap-8">
            <p className="text-[15px] leading-relaxed text-white/60">{COPY.lead[locale]}</p>
            <InfectedGlobe />
          </div>
          <div data-reveal>
            <SectorMap />
          </div>
        </div>
        <LatestCarousel />
      </div>
    </section>
  );
}
