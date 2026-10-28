import { Gnb } from "@/components/site-header/gnb";
import { Hero } from "@/components/cyber/hero";
import { OperatorSection } from "@/components/cyber/operator-section";
import { MissionsSection } from "@/components/cyber/missions-section";
import { TransmissionSection } from "@/components/cyber/transmission-section";
import { SiteFooter } from "@/components/footer/site-footer";

export default function Home() {
  return (
    <>
      <Gnb />
      <main>
        <Hero />
        <OperatorSection />
        <MissionsSection />
        <TransmissionSection />
      </main>
      <SiteFooter />
    </>
  );
}
