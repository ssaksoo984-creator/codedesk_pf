import { STUDIO } from "@/lib/studio";

export function StudioSection() {
  return (
    <section id="studio" aria-labelledby="studio-title" className="scroll-mt-6 border-t border-rule">
      <div className="wrap grid gap-10 py-24 md:py-36 lg:grid-cols-12 lg:gap-x-8">
        <h2 id="studio-title" className="title lg:col-span-5">
          Studio
        </h2>
        <div data-in className="lg:col-span-6 lg:col-start-7">
          <p className="text-[22px] leading-[1.45] tracking-[-0.015em] md:text-[26px]">
            CodeDesk Studio is Soomin Park, a UI/UX designer in Vancouver with seven years of work on public-sector
            systems, commerce sites and AI products.
          </p>
          <p className="mt-6 text-[17px] leading-[1.65] text-muted md:text-[18px]">
            The studio takes on websites, product interfaces and brand identities. You work with the designer
            directly, in English or Korean — from how the content is organised, through the screens, to a working
            build you can click before anything ships.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-6 border-t border-rule">
      <div className="wrap py-24 md:py-36">
        <h2 id="contact-title" className="title">
          Have a project
          <br />
          in mind?
        </h2>
        <p data-in className="mt-10 md:mt-14">
          <a
            href={`mailto:${STUDIO.email}`}
            className="link break-all text-[clamp(26px,5.6vw,72px)] font-medium leading-[1.05] tracking-[-0.04em] text-cobalt"
          >
            {STUDIO.email}
          </a>
        </p>
        <p data-in className="mt-6 max-w-[40ch] text-[17px] text-muted">
          Tell me what you’re making and when you need it.
        </p>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="wrap flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 py-8 text-[15px] text-muted">
        <span>© {new Date().getFullYear()} CodeDesk Studio · {STUDIO.city}</span>
        <span className="flex gap-6">
          <a href={STUDIO.linkedin} target="_blank" rel="noopener noreferrer" className="link">
            LinkedIn
          </a>
          <a href={`mailto:${STUDIO.email}`} className="link">
            Email
          </a>
        </span>
      </div>
    </footer>
  );
}
