import { Gnb } from "@/components/site-header/gnb";
import { Hero } from "@/components/hero/hero";
import { AboutSection } from "@/components/about/about-section";
import { WorkSection } from "@/components/work/work-section";
import { SiteFooter } from "@/components/footer/site-footer";
import { GameAlertBadge } from "@/components/game/game-alert-badge";

export default function Home() {
  return (
    <>
      <Gnb />
      <main>
        <Hero />
        <AboutSection />
        <WorkSection />
      </main>
      <SiteFooter />
      <GameAlertBadge />
    </>
  );
}
