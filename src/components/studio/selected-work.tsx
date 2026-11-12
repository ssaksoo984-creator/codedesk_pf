import Link from "next/link";
import clsx from "clsx";
import { CASES, SELECTED, getCase } from "@/lib/studio";
import { ShotImage } from "./shot-image";

/** Wide and tall pieces, alternating; one column on phones. Each piece is
 * cropped at a different distance: close-up type, a symbol, one task. */
export function SelectedWork() {
  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-6 pb-28 pt-24 md:pb-40 md:pt-36">
      <div className="wrap">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-x-8">
          <h2 id="work-title" className="title lg:col-span-7">
            Selected
            <br />
            work
          </h2>
          <p data-in className="max-w-[34ch] self-end text-[17px] leading-[1.6] text-muted lg:col-span-4 lg:col-start-9">
            Public-sector systems, product interfaces and identities. Each one planned, designed and, most of the time,
            built by the studio.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-y-16 md:mt-24 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-28">
          {SELECTED.map((s, i) => {
            const c = getCase(s.id)!;
            const wide = s.shape === "wide";
            const href = `/work/${c.id}/`;
            return (
              <article
                key={c.id}
                id={`p-${c.id}`}
                data-in
                className={clsx(
                  "scroll-mt-10",
                  wide ? "lg:col-span-8" : "lg:col-span-4",
                  i === 1 && "lg:mt-56",
                  i === 3 && "lg:mt-40"
                )}
              >
                <Link href={href} tabIndex={-1} aria-hidden className="group block overflow-hidden">
                  <div
                    className={clsx(
                      "relative overflow-hidden",
                      wide ? "aspect-[16/9]" : "aspect-[4/5]"
                    )}
                    style={s.image.bg ? { background: s.image.bg } : undefined}
                  >
                    <ShotImage
                      shot={s.image}
                      sizes={wide ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
                      className={clsx(
                        "transition-transform duration-700 [transition-timing-function:var(--ease)] group-hover:scale-[1.025]",
                        s.image.contain && "p-[14%]"
                      )}
                    />
                  </div>
                </Link>
                <h3 className="mt-5 text-[24px] font-medium leading-tight tracking-[-0.03em] md:text-[28px]">
                  <Link href={href} className="link no-underline hover:underline">
                    {c.title}
                  </Link>
                </h3>
                <p className="label mt-1.5">{c.field}</p>
              </article>
            );
          })}
        </div>

        <p data-in className="mt-20 md:mt-28">
          <Link href="/work/" className="link text-[18px] font-medium text-cobalt">
            All work ({CASES.length}) →
          </Link>
        </p>
      </div>
    </section>
  );
}
