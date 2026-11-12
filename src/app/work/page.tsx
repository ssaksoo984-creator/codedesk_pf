import type { Metadata } from "next";
import Link from "next/link";
import { CASES } from "@/lib/studio";
import { ShotImage } from "@/components/studio/shot-image";
import { ContactSection, Footer } from "@/components/studio/studio-contact";
import { Reveals } from "@/components/studio/reveals";

export const metadata: Metadata = { title: "Work" };

export default function WorkIndex() {
  return (
    <>
      <main id="main" className="pt-32 md:pt-44">
        <div className="wrap">
          <h1 className="title">
            All work
          </h1>
          <ol className="mt-14 border-t border-rule md:mt-20">
            {CASES.map((c) => (
              <li key={c.id} id={`p-${c.id}`} data-in className="scroll-mt-10 border-b border-rule">
                <Link
                  href={`/work/${c.id}/`}
                  className="group grid grid-cols-[96px_1fr] items-center gap-5 py-5 md:grid-cols-[200px_1fr_auto] md:gap-8 md:py-7"
                >
                  <span className="relative block aspect-[16/10] overflow-hidden bg-rule/40">
                    <ShotImage shot={{ ...c.hero, contain: false }} sizes="200px" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[22px] font-medium leading-tight tracking-[-0.03em] group-hover:underline md:text-[32px]">
                      {c.title}
                    </span>
                    <span className="label mt-1 block">{c.field}</span>
                  </span>
                  <span className="label hidden md:block">{[c.status, c.year].filter(Boolean).join(" · ")}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-24">
          <ContactSection />
        </div>
      </main>
      <Footer />
      <Reveals />
    </>
  );
}
