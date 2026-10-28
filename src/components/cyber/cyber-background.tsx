/** Fixed, site-wide backdrop: blueprint grid, two neon light spills, CRT
 * scanlines and one slow scan bar. Pure CSS so it costs nothing per frame —
 * the expensive canvas work stays inside the hero only. */
export function CyberBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_85%)]" />
      <div className="absolute -left-[20vw] -top-[25vh] h-[70vh] w-[70vw] rounded-full bg-magenta/10 blur-[120px]" />
      <div className="absolute -bottom-[30vh] -right-[15vw] h-[80vh] w-[70vw] rounded-full bg-neon/10 blur-[140px]" />
      <div className="scanlines absolute inset-0 opacity-60" />
      <div className="scan-sweep absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-neon/[0.04] to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.65)_100%)]" />
    </div>
  );
}
