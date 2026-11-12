import { PaperHero } from "@/components/studio/paper-hero";
import { SelectedWork } from "@/components/studio/selected-work";
import { ContactSection, Footer, StudioSection } from "@/components/studio/studio-contact";
import { Reveals } from "@/components/studio/reveals";
import { LEAD_ID, getCase } from "@/lib/studio";

export default function Home() {
  return (
    <>
      <main id="main">
        <PaperHero lead={getCase(LEAD_ID)!} />
        <SelectedWork />
        <StudioSection />
        <ContactSection />
      </main>
      <Footer />
      <Reveals />
    </>
  );
}
