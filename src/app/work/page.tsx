"use client";

import { Gnb } from "@/components/site-header/gnb";
import { ThemeSection } from "@/components/site-header/theme-section";
import { SiteFooter } from "@/components/footer/site-footer";
import { NoScrollSnap } from "@/components/ui/no-scroll-snap";
import { Logo } from "@/components/logo";
import { WorkBrowser } from "@/components/work/work-browser";

export default function WorkPage() {
  return (
    <>
      <NoScrollSnap />
      <Gnb />
      <ThemeSection theme="dark">
        <main className="min-h-screen bg-ink pb-24 pt-[104px] md:pt-[132px]">
          <div className="wrap">
            <Logo tone="paper" size="small" className="mb-8 md:mb-10" />
            <p className="mb-10 font-display text-4xl italic text-paper md:mb-14 md:text-6xl">
              Work
            </p>
            <WorkBrowser />
          </div>
        </main>
      </ThemeSection>
      <SiteFooter />
    </>
  );
}
