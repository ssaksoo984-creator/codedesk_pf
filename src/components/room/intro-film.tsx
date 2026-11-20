"use client";

import { useEffect, useRef, useState } from "react";

const POSTER = "/media/room/intro-v8-poster.webp";
// A 32px copy of the first frame, inline, so there is a picture from the first paint.
const POSTER_LQIP = "data:image/webp;base64,UklGRpIAAABXRUJQVlA4IIYAAADQBACdASogABIAPqlGnUmmJCMhMAwAwBUJQBYjbXA5Px8/rpkt3/iBC+dsErDcAAD+wIs++aNPPoed2RRFh8EeT+Y/Cwz7eGyAk3+BnJuLFagCXv2dUmk33lAWPzYvy5JmGtZNa/b7XdJZ8fx6/Ox7Xdh3c003TPspNpC+ffZhXVAw4XgAAA==";

/**
 * The loading film: she opens the door, walks in and sits, the sun sets, the
 * room turns digital and she dissolves. Its last frame is the room the site
 * opens on (monitor still off), and the film starts fading out a moment
 * before it ends, so the hand-over is one continuous move.
 * A small loading screen covers the wait until the film actually plays.
 */
export function IntroFilm({ onDone }: { onDone: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [stalled, setStalled] = useState(false);
  const done = useRef(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    setLeaving(true);
    try {
      sessionStorage.setItem("intro", "seen");
    } catch {}
    setTimeout(onDone, 1000);
  };

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.play().catch(() => {});
    const onTime = () => {
      if (!v.duration) return;
      setProgress(v.currentTime / v.duration);
      // Begin the cross-fade while the film is still moving.
      if (v.duration - v.currentTime < 0.9) finish();
    };
    const onProgress = () => {
      if (!v.duration || !v.buffered.length) return;
      setLoaded(Math.min(1, v.buffered.end(v.buffered.length - 1) / Math.min(v.duration, 4)));
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("progress", onProgress);
    // Autoplay can be refused (low-power mode); offer a tap instead of hanging.
    const t = setTimeout(() => {
      if (v.paused) setStalled(true);
    }, 6000);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("progress", onProgress);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = () => {
    setStalled(false);
    video.current?.play().catch(() => {});
  };

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (v.paused) v.play().catch(() => {});
  };

  return (
    <div
      className="intro-film fixed inset-0 z-50 bg-[#2a2620] bg-cover bg-center transition-opacity duration-1000 ease-out"
      style={{
        opacity: leaving ? 0 : 1,
        pointerEvents: leaving ? "none" : undefined,
        backgroundImage: `url(${POSTER}), url(${POSTER_LQIP})`,
      }}
      role="region"
      aria-label="Intro film"
    >
      <video
        ref={video}
        className="h-full w-full object-cover transition-opacity duration-300"
        style={{ opacity: playing ? 1 : 0 }}
        autoPlay
        muted
        playsInline
        preload="auto"
        poster={POSTER}
        onPlaying={() => setPlaying(true)}
        onEnded={finish}
      >
        {/* Phones get the lighter cut; chosen by the browser, no swap in JS. */}
        <source src="/media/room/intro-v8-960.mp4" type="video/mp4" media="(max-width: 1024px)" />
        <source src="/media/room/intro-v8.mp4" type="video/mp4" onError={finish} />
      </video>

      {/* Loading screen until the film is really playing */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[#07090d]/80 backdrop-blur-sm transition-opacity duration-500"
        style={{ opacity: playing ? 0 : 1, pointerEvents: playing ? "none" : undefined }}
        aria-hidden={playing}
      >
        <p className="font-mono text-[12px] uppercase tracking-[0.3em] text-white/60">CodeDesk</p>
        <div className="h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-[#5ef2d2] transition-[width] duration-300" style={{ width: `${Math.max(8, loaded * 100)}%` }} />
        </div>
        <p className="font-mono text-[11px] text-white/40">{stalled ? "" : "Opening the studio…"}</p>
        {stalled && (
          <button type="button" onClick={start} className="glass h-11 rounded-2xl px-5 text-[14px] font-medium text-white">
            Enter the studio →
          </button>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 md:p-6">
        <button type="button" onClick={toggleSound} className="glass h-11 rounded-2xl px-4 text-[14px] font-medium text-white">
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
