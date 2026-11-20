import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ALL_PROJECTS } from "@/components/portfolio/db-data";
import { projectImages } from "@/lib/project-images";
import { TaleCase } from "@/components/case/tale-case";

export function generateStaticParams() {
  return ALL_PROJECTS.map((x) => ({ id: x.project.index }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = ALL_PROJECTS.find((x) => x.project.index === id)?.project;
  return p ? { title: p.title.en, description: p.description?.en } : {};
}

/** A project, opened from its database: one plain layout and one palette for
 * every project, so the work itself is the only colour on the page. */
export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const i = ALL_PROJECTS.findIndex((x) => x.project.index === id);
  if (i === -1) notFound();
  // Tale Studio has its own long-form case page.
  if (id === "09") return <TaleCase />;
  const { project: p, stack } = ALL_PROJECTS[i];
  const next = ALL_PROJECTS[(i + 1) % ALL_PROJECTS.length].project;
  const images = projectImages(p).slice(0, 10);
  const links = [
    ...(p.url ? [{ label: "Visit the site", href: p.url }] : []),
    ...(p.links ?? []).map((l) => ({ label: l.label.en, href: l.urlEn ?? l.url })),
  ];

  return (
    <main className="min-h-svh bg-[#0b0b10] text-[#ecebf2]">
      <div className="mx-auto max-w-[1120px] px-5 pb-24 pt-6 md:px-8 md:pt-8">
        <nav className="flex items-center justify-between gap-4 font-mono text-[12px] text-[#8d8aa6]">
          <Link href="/#portfolio" className="rounded-xl border border-white/10 px-3 py-2 text-[#ecebf2] hover:border-white/40">
            ← Database
          </Link>
          <span className="truncate">
            work.db / {stack.name.toLowerCase()} / {p.index}
          </span>
        </nav>

        <header className="mt-14 md:mt-20">
          <p className="font-mono text-[12px] text-[#8d8aa6]">{p.category.en}</p>
          <h1 className="mt-3 text-[44px] font-medium leading-[1] tracking-[-0.045em] md:text-[76px]">{p.title.en}</h1>
          {p.description && <p className="mt-6 max-w-[64ch] text-[17px] leading-[1.7] text-[#b9b7c8]">{p.description.en}</p>}
        </header>

        <dl className="mt-10 grid gap-6 border-y border-white/10 py-6 text-[14px] sm:grid-cols-2 md:grid-cols-4">
          {p.client && (
            <div>
              <dt className="font-mono text-[11px] text-[#8d8aa6]">Client</dt>
              <dd className="mt-1">{p.client.en}</dd>
            </div>
          )}
          {(p.year || p.stage) && (
            <div>
              <dt className="font-mono text-[11px] text-[#8d8aa6]">Status</dt>
              <dd className="mt-1">{[p.stage?.en, p.year].filter(Boolean).join(" · ")}</dd>
            </div>
          )}
          {p.roles?.length ? (
            <div className="md:col-span-2">
              <dt className="font-mono text-[11px] text-[#8d8aa6]">Role</dt>
              <dd className="mt-1">
                <ul className="space-y-0.5">
                  {p.roles.map((r) => (
                    <li key={r.label.en}>
                      {r.label.en} <span className="text-[#8d8aa6]">— {r.value.en}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ) : null}
        </dl>

        {links.length > 0 && (
          <p className="mt-6 flex flex-wrap gap-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-[#8b6cff] px-4 py-2.5 text-[14px] font-medium text-white hover:bg-[#9d84ff]"
              >
                {l.label} ↗
              </a>
            ))}
          </p>
        )}

        {(p.cover ?? p.image) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.cover ?? p.image} alt="" className="mt-12 block w-full rounded-2xl border border-white/10" />
        )}

        <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
          {p.situation && (
            <section>
              <h2 className="font-mono text-[12px] text-[#8d8aa6]">The problem</h2>
              <p className="mt-3 text-[17px] leading-[1.75]">{p.situation.en}</p>
            </section>
          )}
          {p.task && (
            <section>
              <h2 className="font-mono text-[12px] text-[#8d8aa6]">The goal</h2>
              <p className="mt-3 text-[17px] leading-[1.75]">{p.task.en}</p>
            </section>
          )}
        </div>

        {images.length > 0 && (
          <section className="mt-20">
            <h2 className="font-mono text-[12px] text-[#8d8aa6]">Screens</h2>
            <div className="mt-6 grid gap-x-6 gap-y-10 md:grid-cols-2">
              {images.map((im, k) => (
                <figure key={im.src} className={k === 0 ? "md:col-span-2" : undefined}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={im.src} alt={im.caption ?? ""} loading="lazy" className="block max-h-[900px] w-full rounded-xl border border-white/10 bg-white/5 object-contain object-top" />
                  {im.caption && <figcaption className="mt-2 font-mono text-[11.5px] text-[#8d8aa6]">{im.caption}</figcaption>}
                </figure>
              ))}
            </div>
          </section>
        )}

        {p.reflection && (
          <section className="mt-20 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-10">
            <h2 className="font-mono text-[12px] text-[#8d8aa6]">Looking back</h2>
            <p className="mt-3 text-[20px] leading-[1.55] tracking-[-0.01em] md:text-[24px]">{p.reflection.en}</p>
          </section>
        )}

        <nav className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
          <Link href="/#portfolio" className="font-mono text-[12px] text-[#8d8aa6] hover:text-white">
            ← Back to the database
          </Link>
          <Link href={`/work/${next.index}/`} className="text-right">
            <span className="block font-mono text-[11px] text-[#8d8aa6]">Next project</span>
            <span className="text-[22px] font-medium tracking-[-0.03em] hover:underline">{next.title.en} →</span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
