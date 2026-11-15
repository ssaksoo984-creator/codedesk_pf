"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The loading film: hallway → door → she sits → typing as the sun sets → the
 * room turns digital and she fades away. Its last frame is the night room
 * render, so fading the film out reveals the same picture, now interactive.
 * Plays muted (browsers block sound until a tap); sound can be turned on.
 */
export function IntroFilm({ onDone }: { onDone: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);

  const finish = () => {
    if (leaving) return;
    setLeaving(true);
    try {
      sessionStorage.setItem("intro", "seen");
    } catch {}
    setTimeout(onDone, 900);
  };

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.play().catch(() => {});
    const onTime = () => setProgress(v.duration ? v.currentTime / v.duration : 0);
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, []);

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => {});
  };

  return (
    <div
      className="intro-film fixed inset-0 z-50 bg-[#2a2620] bg-cover bg-center transition-opacity duration-[900ms]"
      // The first frame sits underneath, so nothing flashes black while the
      // video loads.
      style={{
        opacity: leaving ? 0 : 1,
        pointerEvents: leaving ? "none" : undefined,
        // full first frame, over a tiny inline copy that is there instantly
        backgroundImage: "url(/media/room/intro-v6-poster.webp), url(data:image/webp;base64,UklGRp4AAABXRUJQVlA4IJIAAADwBACdASogABIAPrVIoEunI6MhsBgIAOAWiWMAuwAMeRMPTNnXZb8RT4UyY9080LAA/rorUTFpuNJoo0zV8i6CmQgYiRmygoybdxbsC2RF0AaQPi7BVKGa28yf9kBPHp/Msiv34Kx8350vSbfgOJmbHrG1TSC/Y4H8dByMydUPMKb8te58yT0rz2JJ5h7QRX4AAA==)",
      }}
      role="region"
      aria-label="Intro film"
    >
      <video
        ref={video}
        className="h-full w-full object-cover transition-opacity duration-200"
        style={{ opacity: playing ? 1 : 0 }}
        autoPlay
        muted
        playsInline
        preload="auto"
        onPlaying={() => setPlaying(true)}
        onEnded={finish}
      >
        {/* Phones get the lighter cut; chosen by the browser, no swap in JS. */}
        <source src="/media/room/intro-v6-960.mp4" type="video/mp4" media="(max-width: 1024px)" />
        <source src="/media/room/intro-v6.mp4" type="video/mp4" onError={finish} />
      </video>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 md:p-6">
        <button type="button" onClick={toggleSound} className="glass h-11 rounded-2xl px-4 text-[14px] font-medium text-white" style={{ ["--fg" as string]: "#fff" }}>
          {muted ? "Sound on" : "Sound off"}
        </button>
        <button type="button" onClick={finish} className="glass h-11 rounded-2xl px-4 text-[14px] font-medium text-white">
          Skip intro →
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10" aria-hidden>
        <div className="h-full bg-white/70" style={{ width: `${progress * 100}%` }} />
      </div>
    </div>
  );
}
