import { Gnb } from "@/components/site-header/gnb";
import { BackToTop } from "@/components/site-header/back-to-top";
import { LocaleToggle } from "@/components/site-header/locale-toggle";
import { Hero } from "@/components/hero/hero";
import { AboutSection } from "@/components/about/about-section";
import { WorkSection } from "@/components/work/work-section";
import { SiteFooter } from "@/components/footer/site-footer";

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
      <LocaleToggle />
      <BackToTop />
    </>
  );
}
