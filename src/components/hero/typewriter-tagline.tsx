"use client";

import { useTypewriter } from "@/lib/use-typewriter";

interface Segment {
  text: string;
  point?: boolean;
}

// Always English regardless of locale — this line is a stylized rhetorical
// flourish, not translated UI copy.
const LINES: Segment[][] = [
  [{ text: "who is the " }, { text: "best", point: true }, { text: "?" }],
  [{ text: "what's so " }, { text: "creative", point: true }, { text: "?" }],
  [{ text: "what's actually " }, { text: "reasonable", point: true }, { text: "?" }],
  [{ text: "{Code} · Desk" }],
];

const PHRASES = LINES.map((segments) => segments.map((s) => s.text).join(""));

function sliceSegments(segments: Segment[], length: number) {
  let remaining = length;
  const out: Segment[] = [];
  for (const seg of segments) {
    if (remaining <= 0) break;
    const take = Math.min(seg.text.length, remaining);
    out.push({ text: seg.text.slice(0, take), point: seg.point });
    remaining -= take;
  }
  return out;
}

export function TypewriterTagline() {
  const { text, index } = useTypewriter(PHRASES);
  const visible = sliceSegments(LINES[index], text.length);

  return (
    <p className="text-center text-lg leading-none text-ink md:text-2xl">
      {visible.map((seg, i) => (
        <span
          key={i}
          className={seg.point ? "font-display italic" : "font-sans"}
        >
          {seg.text}
        </span>
      ))}
      <span className="typewriter-caret ml-1 inline-block w-[2px] translate-y-[0.05em] bg-ink align-middle h-[0.75em]" />
    </p>
  );
}
