import { DataField } from "./data-field";

/** Fixed, site-wide backdrop: blueprint grid, two neon light spills, CRT
 * scanlines and one slow scan bar. Pure CSS so it costs nothing per frame —
 * the expensive canvas work stays inside the hero only. */
export function CyberBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink [contain:strict] [will-change:transform]">
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_85%)]" />
      <DataField />
      {/* Light spills as plain radial gradients — a filter: blur() this
          size forces phones to re-rasterise the backdrop while scrolling. */}
      <div className="absolute -left-[30vw] -top-[35vh] h-[100vh] w-[100vw] bg-[radial-gradient(closest-side,rgba(255,43,214,0.10),transparent)]" />
      <div className="absolute -bottom-[40vh] -right-[25vw] h-[110vh] w-[100vw] bg-[radial-gradient(closest-side,rgba(0,240,255,0.09),transparent)]" />
      <div className="scanlines absolute inset-0 opacity-60" />
      <div className="scan-sweep absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-neon/[0.04] to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.65)_100%)]" />
    </div>
  );
}
