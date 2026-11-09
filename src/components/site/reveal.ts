"use client";

import { useEffect, useRef } from "react";

/** Adds data-reveal="in" to every [data-reveal] descendant as it scrolls
 * into view — one observer per subtree. */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.reveal = "in";
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-reveal='in'])").forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
  return ref;
}
