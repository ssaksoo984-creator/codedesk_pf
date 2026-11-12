import clsx from "clsx";
import type { Shot } from "@/lib/studio";

/** A screenshot or artwork at its own colours. Contained artwork sits on its
 * own background; screenshots fill their box. */
export function ShotImage({
  shot,
  className,
  eager,
  sizes,
}: {
  shot: Shot;
  className?: string;
  eager?: boolean;
  sizes?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={shot.src}
      alt={shot.alt}
      width={shot.w}
      height={shot.h}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={clsx("block h-full w-full", shot.contain ? "object-contain" : "object-cover", className)}
      style={shot.bg ? { background: shot.bg } : undefined}
    />
  );
}
