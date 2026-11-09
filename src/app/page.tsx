import { Hero } from "@/components/site/hero";
import { Showreel } from "@/components/site/showreel";
import { WorkStack } from "@/components/site/work-stack";
import { About } from "@/components/site/about";
import { ProjectIndex } from "@/components/site/project-index";
import { Contact } from "@/components/site/contact";

export default function Home() {
  return (
    <main className="bg-paper">
      <Hero />
      <Showreel />
      <WorkStack />
      <About />
      <ProjectIndex />
      <Contact />
    </main>
  );
}
