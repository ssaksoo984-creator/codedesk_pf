"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

/** Muted looping clip that only downloads and plays while it's on screen,
 * and pauses when it scrolls away — many of these sit on one page. */
export function MotionVideo({
  src,
  poster,
  className,
  rootMargin = "200px",
}: {
  src: string;
  poster?: string;
  className?: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (v.preload !== "auto") v.preload = "auto";
          v.play().catch(() => {});
        } else v.pause();
      },
      { rootMargin }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      className={clsx("block h-full w-full object-cover", className)}
    />
  );
}
