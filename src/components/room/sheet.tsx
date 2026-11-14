"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";

/** Modal surface shared by the room's panels: centred dialog on desktop,
 * bottom sheet on phones. Focus moves in on open; Esc is handled by the room. */
export function Sheet({
  open,
  label,
  onClose,
  children,
  wide,
}: {
  open: boolean;
  label: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);
  return (
    <div
      className={clsx(
        "fixed inset-0 z-40 flex items-end justify-center transition-opacity duration-500 md:items-center",
        open ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <button type="button" aria-label="Close" tabIndex={-1} className="absolute inset-0 cursor-default" onClick={onClose} />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={clsx(
          "glass relative flex max-h-[88svh] w-full flex-col overflow-hidden rounded-t-3xl text-fg shadow-2xl outline-none transition-transform duration-500 md:rounded-3xl",
          wide ? "md:w-[min(1080px,92vw)]" : "md:w-[min(560px,92vw)]",
          open ? "translate-y-0" : "translate-y-8"
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 md:px-6">
          <h2 className="text-[17px] font-medium">{label}</h2>
          <button type="button" onClick={onClose} className="h-9 rounded-xl px-3 text-[14px] text-muted hover:text-fg">
            Close ✕
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
