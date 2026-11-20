import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Notes" };

/** The flower by the window opens this plain page: short notes Soomin wrote
 * at the end of each project. Plain on purpose — no room, no effects. */
const NOTES = [
  {
    title: "Draw the branches before the screens",
    project: "Tale Studio",
    text: "Drawing only the happy path gets you screens fast — but this product’s difficulty lived in branches, errors and rollbacks. Setting the architecture and flows first meant the Figma screens, the prototype and the dev spec all share one set of screen IDs — one language for everyone.",
  },
  {
    title: "Don’t show all of it",
    project: "MOFA Treaty Search",
    text: "The most common failure in a service handling this much material is trying to show all of it. The more material there is, the more narrowly you have to define what the user is actually trying to do right now — this project confirmed that.",
  },
  {
    title: "Hierarchy, not subtraction",
    project: "K-ARTS Academic Portal",
    text: "“Organized, but never oversimplified.” That was the goal. In a system carrying this many functions, simplifying isn’t the answer — what it needed was hierarchy, not subtraction. The frequent things up front; the occasional things exactly where you’d look for them.",
  },
  {
    title: "Beauty is mostly removal",
    project: "National Museum of Korea",
    text: "Once you decide what to cut, information access and visual polish turn out to point the same way. Beauty isn’t built by adding — it’s closer to removing what gets in the way and letting what was already there come through.",
  },
];

export default function Blog() {
  return (
    <main className="min-h-svh bg-[#f6f4ef] text-[#1d1c19]">
      <div className="mx-auto max-w-[720px] px-5 pb-24 pt-8 md:pt-12">
        <nav className="flex items-center justify-between text-[14px]">
          <Link href="/" className="underline-offset-4 hover:underline">
            ← Back to the room
          </Link>
          <span className="font-mono text-[12px] text-[#6b665c]">CodeDesk · Notes</span>
        </nav>
        <header className="mt-16 md:mt-24">
          <p className="font-mono text-[12px] text-[#6b665c]">by the window</p>
          <h1 className="mt-3 text-[44px] font-medium leading-[1] tracking-[-0.045em] md:text-[64px]">Notes</h1>
          <p className="mt-5 max-w-[46ch] text-[17px] leading-[1.6] text-[#6b665c]">
            Short things I wrote down at the end of projects. More to come.
          </p>
        </header>
        <ol className="mt-14 divide-y divide-[#1d1c19]/12 border-y border-[#1d1c19]/12">
          {NOTES.map((n, i) => (
            <li key={n.title} className="py-9">
              <article>
                <p className="font-mono text-[12px] text-[#6b665c]">
                  {String(i + 1).padStart(2, "0")} · {n.project}
                </p>
                <h2 className="mt-2 text-[24px] font-medium leading-tight tracking-[-0.03em] md:text-[28px]">{n.title}</h2>
                <p className="mt-4 text-[17px] leading-[1.7]">{n.text}</p>
              </article>
            </li>
          ))}
        </ol>
        <footer className="mt-12 text-[14px] text-[#6b665c]">
          <a href="mailto:ssssssu984@gmail.com" className="underline underline-offset-4">
            ssssssu984@gmail.com
          </a>
        </footer>
      </div>
    </main>
  );
}
