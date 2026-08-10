"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/thoughts";

function ViewTrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const qs = searchParams.toString();
    trackPageView(qs ? `${pathname}?${qs}` : pathname, document.referrer || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams.toString()]);

  return null;
}

/** Logs one page view per route change (with referrer). Skips /admin so the
 * owner's own visits don't inflate stats. Query string is kept so distinct
 * Thought posts (`/thought/view?id=...`) can be told apart in stats. */
export function ViewTracker() {
  return (
    <Suspense fallback={null}>
      <ViewTrackerInner />
    </Suspense>
  );
}
