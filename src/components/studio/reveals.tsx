"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Fades [data-in] blocks up as they enter. Elements are only hidden once
 * this has run, and only if they start below the fold — so without JS, or on
 * a restored scroll position, nothing is ever left invisible. */
export function Reveals() {
  const pathname = usePathname();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-in]:not([data-in='1'])"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.in = "1";
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    for (const el of els) {
      if (el.getBoundingClientRect().top > innerHeight) {
        el.dataset.in = "0";
        io.observe(el);
      } else {
        el.dataset.in = "1";
      }
    }
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
