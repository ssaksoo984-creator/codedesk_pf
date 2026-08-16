import { ThemeSection } from "@/components/site-header/theme-section";
import { VideoSlot } from "@/components/media/video-slot";
import { HeroCityTeaser } from "@/components/game/hero-city-teaser";
import { RollingCode } from "./rolling-code";
import { TypewriterTagline } from "./typewriter-tagline";

export function Hero() {
  return (
    <ThemeSection theme="light" id="top" snap>
      <section className="wrap flex h-screen flex-col justify-center gap-6 overflow-hidden pt-28 pb-8 md:gap-8 md:pt-36 md:pb-10">
        <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-2 gap-4 md:grid-cols-2 md:grid-rows-1 md:gap-6">
          <div className="h-full">
            <VideoSlot basename="typing-hands" label="타이핑하는 손 영상 자리" />
          </div>

          <div className="flex h-full flex-col gap-4 md:gap-6">
            <div className="h-1/2 shrink-0 md:h-[55%]">
              <RollingCode />
            </div>
            <div className="min-h-0 flex-1">
              <HeroCityTeaser />
            </div>
          </div>
        </div>

        <TypewriterTagline />
      </section>
    </ThemeSection>
  );
}
