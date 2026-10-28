"use client";

import { useLocale } from "@/components/site-header/locale-context";

const SVG = "/media/home_work/nail/svg";

const COPY = {
  primary: { ko: "메인 로고", en: "Primary mark" },
  grid: { ko: "그리드", en: "Construction grid" },
  outline: { ko: "아웃라인", en: "Outline" },
  symbol: { ko: "심볼 구조", en: "Symbol anatomy" },
  book: { ko: "펼쳐진 책이 바닥에 세워져 있는 모습", en: "An open book standing on its edge" },
  shadow: { ko: "그림자", en: "Shadow" },
  star: { ko: "그림자 형태로 나타나는 별 문양", en: "A star that appears as the shadow's negative space" },
};

function Panel({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <figure className={`flex flex-col ${className ?? ""}`}>
      <div className="relative flex min-h-[160px] flex-1 items-center justify-center overflow-hidden border border-white/10 bg-white p-6 md:p-10">
        {children}
      </div>
      <figcaption className="ko-safe mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">{label}</figcaption>
    </figure>
  );
}

/** TYPE-1's ‘A’ on its own, with the board's three callouts. Paths are the
 * symbol from the delivered SVG (cropped to the A). */
function Type1Anatomy() {
  const { locale } = useLocale();
  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <svg viewBox="78 -8 110 98" className="mx-auto block w-[46%]" aria-hidden>
        <path fill="#0046e2" d="M92.78,79.91h34.36l-1.16-2.31c-1.72-3.42-4.49-6.2-7.92-7.91l-12.85-6.43,.68-.34h-13.12v16.99Z" />
        <path fill="#0046e2" d="M158.95,62.91l.68,.34-12.85,6.43c-3.42,1.72-6.2,4.49-7.92,7.91l-1.16,2.31h34.36v-16.99h-13.12Z" />
        <path fill="#2179f9" d="M172.07,54.19h0v-.1h-.07L132.42,0l-39.58,54.09h-.07v.09h0s0,.01,0,.01v8.72h13.12l12.17-6.09c3.42-1.72,6.2-4.49,7.92-7.91l6.44-12.84,6.44,12.84c1.72,3.42,4.49,6.2,7.92,7.91l12.17,6.09h13.12v-8.72Z" />
      </svg>
      {/* callouts */}
      <div className="ko-safe pointer-events-none absolute right-0 top-[4%] flex items-center gap-2 text-[11px] text-[#e5007e] md:text-xs">
        <span className="h-px w-10 bg-[#e5007e] md:w-16" />
        <span className="max-w-[9rem] leading-snug md:max-w-none">{COPY.book[locale]}</span>
      </div>
      <div className="ko-safe pointer-events-none absolute right-0 top-[78%] flex items-center gap-2 text-[11px] text-[#e5007e] md:text-xs">
        <span className="h-px w-16 bg-[#e5007e] md:w-24" />
        <span>{COPY.shadow[locale]}</span>
      </div>
      <div className="ko-safe pointer-events-none mt-3 flex flex-col items-center text-[11px] text-[#e5007e] md:text-xs">
        <span className="h-5 w-px bg-[#e5007e]" />
        <span className="mt-1 text-center">{COPY.star[locale]}</span>
      </div>
    </div>
  );
}

/** Rebuilds the logo presentation board from the original vector files —
 * crisp at any size — instead of showing a low-res export of the board. */
export function NailLogoSheet({ type }: { type: 1 | 2 }) {
  const { locale } = useLocale();
  const t = `type${type}`;
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
        <Panel label={COPY.primary[locale]}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${SVG}/${t}-logo.svg`} alt={`NAIL TYPE-${type}`} className="w-full max-w-[460px]" />
        </Panel>
        <Panel label={COPY.grid[locale]}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${SVG}/${t}-grid.svg`} alt="" className="w-full max-w-[420px]" />
        </Panel>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Panel label={COPY.outline[locale]}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`${SVG}/${t}-outline.svg`} alt="" className="w-full max-w-[360px]" />
        </Panel>
        {type === 1 ? (
          <Panel label={COPY.symbol[locale]}>
            <Type1Anatomy />
          </Panel>
        ) : (
          <Panel label={locale === "ko" ? "다크 배경" : "On dark"} className="[&>div]:bg-[#0b1020]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${SVG}/${t}-logo.svg`} alt="" className="w-full max-w-[360px]" />
          </Panel>
        )}
      </div>
    </div>
  );
}
