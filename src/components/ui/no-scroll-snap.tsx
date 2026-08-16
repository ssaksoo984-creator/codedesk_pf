"use client";

import { useLayoutEffect } from "react";

const DISABLE_SNAP_SCRIPT = "document.documentElement.style.scrollSnapType='none'";

/**
 * The homepage relies on `scroll-snap-type: y mandatory` (globals.css) for its
 * section-by-section scroll story. Standalone pages (articles, forms) don't
 * have snap points of their own, but still inherit that global setting — and
 * when their content grows asynchronously (e.g. an image finishing its load),
 * Chromium re-settles ("resnaps") scroll position onto whatever `.snap-section`
 * happens to exist on the page (e.g. the footer) and yanks the page down.
 *
 * The inline `<script>` runs synchronously during HTML parsing, before the
 * browser's first layout pass — the only way to guarantee snapping never
 * engages even once. The `useLayoutEffect` covers client-side (SPA) arrivals
 * at this route, where no fresh HTML parse happens for the script to run in.
 * Mount this once on any non-homepage route to opt out.
 */
export function NoScrollSnap() {
  useLayoutEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollSnapType;
    html.style.scrollSnapType = "none";
    return () => {
      html.style.scrollSnapType = prev;
    };
  }, []);

  return <script dangerouslySetInnerHTML={{ __html: DISABLE_SNAP_SCRIPT }} />;
}
