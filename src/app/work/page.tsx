"use client";

import { Gnb } from "@/components/site-header/gnb";
import { SiteFooter } from "@/components/footer/site-footer";
import { MissionBrowser } from "@/components/cyber/mission-browser";
import { SectionHeader, useRevealChildren } from "@/components/cyber/primitives";
import { SectorMap } from "@/components/cyber/sector-map";

export default function WorkPage() {
  const ref = useRevealChildren<HTMLElement>();
  return (
    <>
      <Gnb />
      <main ref={ref} className="min-h-screen pb-28 pt-32 md:pt-40">
        <div className="wrap">
          <SectionHeader index="02" label="Mission archive" title={<>All <span className="text-neon">sectors</span></>} />
          <div data-reveal className="mb-14">
            <SectorMap collapsible />
          </div>
          <MissionBrowser />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
