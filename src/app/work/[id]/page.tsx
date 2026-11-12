import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CASES, SELECTED, getCase, type Shot } from "@/lib/studio";
import { ShotImage } from "@/components/studio/shot-image";
import { Footer } from "@/components/studio/studio-contact";
import { Reveals } from "@/components/studio/reveals";

export function generateStaticParams() {
  return CASES.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const c = getCase((await params).id);
  return c ? { title: c.title, description: c.problem.slice(0, 155) } : {};
}

function Figure({ shot, eager, sizes }: { shot: Shot; eager?: boolean; sizes?: string }) {
  return (
    <figure data-in={eager ? undefined : ""}>
      <div className="overflow-hidden" style={{ background: shot.bg ?? "#e9e8e2", aspectRatio: `${shot.w} / ${shot.h}` }}>
        <ShotImage shot={shot} eager={eager} sizes={sizes} />
      </div>
      {shot.caption && <figcaption className="label mt-3">{shot.caption}</figcaption>}
    </figure>
  );
}

export default async function CasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const i = CASES.findIndex((c) => c.id === id);
  if (i === -1) notFound();
  const c = CASES[i];
  const next = CASES[(i + 1) % CASES.length];
  // Back to where this project sits on the home page, or in the full list.
  const back = c.id === CASES[0].id ? "/" : SELECTED.some((s) => s.id === c.id) ? `/#p-${c.id}` : `/work/#p-${c.id}`;

  return (
    <>
      <main id="main" className="pt-28 md:pt-40">
        <article>
          <header className="wrap grid gap-10 lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-8">
              <p className="label">{c.field}</p>
              <h1 className="title mt-5">{c.title}</h1>
            </div>
            <dl className="grid content-end gap-5 text-[16px] lg:col-span-4">
              {c.client && (
                <div>
                  <dt className="label">Client</dt>
                  <dd className="mt-1">{c.client}</dd>
                </div>
              )}
              <div>
                <dt className="label">Role</dt>
                <dd className="mt-1">
                  <ul>
                    {c.role.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              {(c.status || c.year) && (
                <div>
                  <dt className="label">Status</dt>
                  <dd className="mt-1">{[c.status, c.year].filter(Boolean).join(" · ")}</dd>
                </div>
              )}
              {c.links.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {c.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="link w-fit font-medium text-cobalt">
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              )}
            </dl>
          </header>

          <div className="wrap mt-14 md:mt-20">
            <Figure shot={c.hero} eager sizes="100vw" />
          </div>

          {c.problem && (
            <section aria-labelledby="problem" className="wrap mt-24 grid gap-6 md:mt-36 lg:grid-cols-12 lg:gap-x-8">
              <h2 id="problem" className="label lg:col-span-3">
                The problem
              </h2>
              <p data-in className="text-[22px] leading-[1.45] tracking-[-0.015em] md:text-[28px] lg:col-span-8">
                {c.problem}
              </p>
            </section>
          )}

          {c.decision && (
            <section aria-labelledby="decision" className="mt-24 md:mt-36">
              <div className="wrap grid gap-6 lg:grid-cols-12 lg:gap-x-8">
                <h2 id="decision" className="label lg:col-span-3">
                  The key decision
                </h2>
                <div data-in className="lg:col-span-8">
                  <p className="text-[clamp(30px,4vw,52px)] font-medium leading-[1.05] tracking-[-0.045em]">{c.decision.title}</p>
                  {c.decision.text && <p className="mt-6 max-w-[62ch] text-[17px] leading-[1.65] text-muted md:text-[18px]">{c.decision.text}</p>}
                </div>
              </div>
              <div className="wrap mt-12 md:mt-16">
                <Figure shot={c.decision.shot} sizes="100vw" />
              </div>
            </section>
          )}

          {c.screens.length > 0 && (
            <section aria-labelledby="screens" className="wrap mt-24 md:mt-36">
              <h2 id="screens" className="label">
                Finished screens
              </h2>
              <div className="mt-8 grid gap-x-8 gap-y-14 md:grid-cols-2">
                {c.screens.map((s) => (
                  <div key={s.src} className={s.h > s.w * 1.4 ? "md:row-span-2" : undefined}>
                    <Figure shot={s} sizes="(min-width: 768px) 50vw, 100vw" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>

        <nav aria-label="More work" className="wrap mt-28 border-t border-rule pb-24 pt-10 md:mt-40">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <p className="label">Next project</p>
            <Link href={back} className="link text-[16px]">
              ← Back to work
            </Link>
          </div>
          <Link href={`/work/${next.id}/`} className="group mt-6 grid gap-6 md:grid-cols-12 md:items-end md:gap-8">
            <span className="title block group-hover:underline md:col-span-7">{next.title}</span>
            <span className="relative block aspect-[16/10] overflow-hidden md:col-span-5" style={{ background: "#e9e8e2" }}>
              <ShotImage shot={{ ...next.hero, contain: false }} sizes="(min-width: 768px) 40vw, 100vw" />
            </span>
          </Link>
        </nav>
      </main>
      <Footer />
      <Reveals />
    </>
  );
}
