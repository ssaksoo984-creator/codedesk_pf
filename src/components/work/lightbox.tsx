"use client";

import clsx from "clsx";
import { createContext, useContext, useEffect, useState } from "react";

export interface LightboxItem {
  src: string;
  alt: string;
}

/** Lets any image nested arbitrarily deep under a LightboxProvider open the
 * one shared full-size viewer, without threading an `onOpen` prop through
 * every intermediate component. Shared by WorkDesignGuide and ImageShowcase
 * so both feel like one system rather than two separate viewers. */
const LightboxContext = createContext<((item: LightboxItem) => void) | null>(null);

export function useLightbox() {
  const open = useContext(LightboxContext);
  if (!open) throw new Error("useLightbox must be used within a LightboxProvider");
  return open;
}

/** Wraps an image/video preview so it's clickable and keyboard-operable
 * (a plain onClick on <img> isn't focusable). Visual look is untouched aside
 * from the zoom cursor — the click affordance is discoverable, not shouty. */
export function Zoomable({
  item,
  className,
  children,
}: {
  item: LightboxItem;
  className?: string;
  children: React.ReactNode;
}) {
  const open = useLightbox();
  return (
    <button
      type="button"
      onClick={() => open(item)}
      className={clsx("block cursor-zoom-in text-left", className)}
    >
      {children}
    </button>
  );
}

/** Provides the click-to-open context for any nested Zoomable, and renders
 * the full-size viewer itself — constrained to a max width rather than the
 * viewport height, so a tall full-page capture stays large and readable and
 * simply scrolls, instead of being squeezed down to fit. */
export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [item, setItem] = useState<LightboxItem | null>(null);

  useEffect(() => {
    if (!item) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setItem(null);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item]);

  return (
    <LightboxContext.Provider value={setItem}>
      {children}

      {item && (
        <div
          className="fixed inset-0 z-[100] overflow-y-auto bg-ink/95 p-4 py-12 md:p-10"
          onClick={() => setItem(null)}
        >
          <button
            type="button"
            onClick={() => setItem(null)}
            aria-label="Close"
            className="fixed right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-paper transition-colors duration-200 hover:bg-white/20 md:right-8 md:top-8"
          >
            <CloseIcon />
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.src}
            alt={item.alt}
            className="mx-auto w-full max-w-[1100px] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </LightboxContext.Provider>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 4l16 16M20 4 4 20" />
    </svg>
  );
}
