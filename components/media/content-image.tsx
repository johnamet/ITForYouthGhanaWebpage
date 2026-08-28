import Image from "next/image";

import { cn } from "@/lib/utils/cn";
import { safeImageSrc } from "@/lib/utils/image-src";

type ContentImageProps = {
  src?: string | null;
  alt: string;
  aspectRatio?: "landscape" | "portrait" | "square" | "wide";
  priority?: boolean;
  className?: string;
  /**
   * Extra classes for the `<Image>` element. Never put an object-fit utility
   * here — use `fit` instead. `lib/utils/cn.ts` is plain clsx with no
   * tailwind-merge, so an object-fit class passed through here lands
   * alongside the one `fit` selects, and whichever comes later in the
   * stylesheet wins rather than whichever the caller intended.
   */
  imageClassName?: string;
  overlay?: boolean;
  sizes?: string;
  /**
   * `cover` (default) crops to fill, right for photographs. `contain` fits
   * the whole image inside the box without cropping, right for icon
   * artwork. Selects exactly one object-fit class at source, rather than
   * layering one on top of `imageClassName` — `lib/utils/cn.ts` is plain
   * clsx (no tailwind-merge), so both classes would otherwise land on the
   * element and CSS source order, not prop intent, would decide the result.
   */
  fit?: "cover" | "contain";
};

const aspectClasses = {
  landscape: "aspect-[4/3]",
  portrait: "aspect-[4/5]",
  square: "aspect-square",
  wide: "aspect-[16/9]",
};

/** Consistent editorial media treatment, including a deliberate empty-media state. */
export function ContentImage({
  src,
  alt,
  aspectRatio = "landscape",
  priority = false,
  className,
  imageClassName,
  overlay = false,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  fit = "cover",
}: ContentImageProps) {
  const resolvedSrc = safeImageSrc(src);
  return (
    <div className={cn("relative overflow-hidden rounded-media bg-brand-mist", aspectClasses[aspectRatio], className)}>
      {resolvedSrc ? (
        <Image
          src={resolvedSrc}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn(fit === "contain" ? "object-contain" : "object-cover", "transition duration-700", imageClassName)}
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-primary-light),var(--color-bg-alt))]" aria-hidden="true" />
      )}
      {overlay ? <div className="absolute inset-0 bg-brand-navy/20" aria-hidden="true" /> : null}
    </div>
  );
}
