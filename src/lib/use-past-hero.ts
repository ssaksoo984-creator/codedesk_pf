"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Floating HUD pieces (integrity meter, SYS-BOT) stay out of the home
 * hero, which already has its own HUD — they appear once the visitor has
 * scrolled most of the way past it. On every other page: always true. */
export function usePastHero() {
  const pathname = usePathname();
  const [past, setPast] = useState(false);

  useEffect(() => {
    if (pathname !== "/") {
      setTimeout(() => setPast(true), 0);
      return;
    }
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return past;
}
