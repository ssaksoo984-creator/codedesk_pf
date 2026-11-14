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
    // Phones get the lighter cut.
    v.src = Math.max(screen.width, screen.height) <= 1024 ? "/media/room/intro-960.mp4" : "/media/room/intro.mp4";
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
      className="intro-film fixed inset-0 z-50 bg-black transition-opacity duration-[900ms]"
      style={{ opacity: leaving ? 0 : 1, pointerEvents: leaving ? "none" : undefined }}
      role="region"
      aria-label="Intro film"
    >
      <video
        ref={video}
        className="h-full w-full object-cover"
        poster="/media/room/intro-poster.webp"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish}
      />
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
