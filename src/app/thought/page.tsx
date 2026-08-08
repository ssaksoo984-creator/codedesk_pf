import { Gnb } from "@/components/site-header/gnb";
import { BackToTop } from "@/components/site-header/back-to-top";
import { LocaleToggle } from "@/components/site-header/locale-toggle";
import { SiteFooter } from "@/components/footer/site-footer";
import { NoScrollSnap } from "@/components/ui/no-scroll-snap";
import { ThoughtSection } from "@/components/thought/thought-section";

export default function ThoughtPage() {
  return (
    <>
      <NoScrollSnap />
      <Gnb />
      <main>
        <ThoughtSection />
      </main>
      <SiteFooter />
      <LocaleToggle />
      <BackToTop />
    </>
  );
}
