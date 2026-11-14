"use client";

import { useState } from "react";
import { Sheet } from "./sheet";

/** Bookshelf → a shelf of short "books" about Soomin. Facts come from her
 * résumé only. */
const BOOKS: { id: string; title: string; color: string; body: React.ReactNode }[] = [
  {
    id: "about",
    title: "About",
    color: "#2f6fb5",
    body: (
      <p>
        Soomin Park is a UI/UX designer with seven years of work across public-sector, commerce and small-business
        projects in Korea and Canada. Her focus is information architecture and interface design — how features are
        grouped, where they sit on the screen and in what order people meet them. Based in Burnaby, BC; works in
        Korean and English.
      </p>
    ),
  },
  {
    id: "work",
    title: "Experience",
    color: "#c8462f",
    body: (
      <ul className="space-y-3">
        <li>
          <b className="font-medium">Freelance UI/UX & brand designer</b> · Vancouver, 2023 –
          <br />
          <span className="text-muted">Tale Studio renewal, website builds (1AM VAPE and more), brochures, branding.</span>
        </li>
        <li>
          <b className="font-medium">UI/UX Design Team Lead, Landsoft</b> · Seoul, 2020 – 2022
          <br />
          <span className="text-muted">Led a team of four on 4–5+ large public-sector and enterprise web projects a year, proposal to launch.</span>
        </li>
        <li>
          <b className="font-medium">UI/UX & marketing designer, Red Rocket (Campus Fund)</b>
        </li>
        <li>
          <b className="font-medium">Visual & marketing designer, KstarAD</b>
        </li>
      </ul>
    ),
  },
  {
    id: "projects",
    title: "Projects",
    color: "#e0a92e",
    body: (
      <ul className="space-y-2">
        <li>Tale Studio — AI video service renewal: architecture, flows, UI, prototype</li>
        <li>Ministry of Foreign Affairs — treaty search system (3,000+ treaties)</li>
        <li>Korea National University of Arts — academic admin system</li>
        <li>National Museum of Korea — main site renewal proposal</li>
        <li>NAIL — National Assembly AI Library logo and search chatbot</li>
        <li>1AM VAPE — brand site and AI brand film</li>
      </ul>
    ),
  },
  {
    id: "skills",
    title: "Skills & tools",
    color: "#3f8f6b",
    body: (
      <>
        <p>Information architecture · user flows · interface design · design systems · prototyping · branding.</p>
        <p className="mt-3 text-muted">
          Figma, Photoshop, Illustrator, WordPress, Shopify — and working prototypes built with Claude Code, VS Code
          and Codex, with an understanding of HTML, CSS, JS and React structure.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    color: "#6b4bb8",
    body: (
      <p>
        <a href="mailto:ssssssu984@gmail.com" className="underline underline-offset-4">
          ssssssu984@gmail.com
        </a>
        <br />
        <a href="https://www.linkedin.com/in/soomin-park-codedesk" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
          LinkedIn ↗
        </a>
      </p>
    ),
  },
];

export function LibraryPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [book, setBook] = useState("about");
  const current = BOOKS.find((b) => b.id === book)!;
  return (
    <Sheet open={open} onClose={onClose} label="Library">
      <div className="grid gap-5 p-5 md:grid-cols-[150px_1fr] md:p-6">
        {/* Spines */}
        <div className="flex gap-1.5 overflow-x-auto md:h-[300px] md:flex-col md:overflow-visible" role="tablist" aria-label="Books">
          {BOOKS.map((b) => (
            <button
              key={b.id}
              type="button"
              role="tab"
              aria-selected={b.id === book}
              onClick={() => setBook(b.id)}
              className="flex min-w-[96px] items-center rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-white transition-transform md:min-w-0 md:flex-1"
              style={{ background: b.color, transform: b.id === book ? "translateX(6px)" : undefined, opacity: b.id === book ? 1 : 0.72 }}
            >
              {b.title}
            </button>
          ))}
        </div>
        <div role="tabpanel" className="min-h-[220px] text-[15px] leading-[1.7]">
          <p className="font-mono text-[11px] uppercase tracking-wide text-muted">{current.title}</p>
          <div className="mt-3">{current.body}</div>
        </div>
      </div>
    </Sheet>
  );
}
