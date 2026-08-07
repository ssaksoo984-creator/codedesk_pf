"use client";

import { useEffect } from "react";

/**
 * The homepage relies on `scroll-snap-type: y mandatory` (globals.css) for its
 * section-by-section scroll story. Standalone pages (articles, forms) don't
 * have snap points of their own, but still inherit that global setting — and
 * when their content grows asynchronously (e.g. a fetch resolving), the
 * browser's snap engine re-settles scroll position and yanks the page.
 * Mount this once on any non-homepage route to opt out.
 */
export function NoScrollSnap() {
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollSnapType;
    html.style.scrollSnapType = "none";
    return () => {
      html.style.scrollSnapType = prev;
    };
  }, []);

  return null;
}
