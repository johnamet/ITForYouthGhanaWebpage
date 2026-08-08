import Image from "next/image";

import { cn } from "@/lib/utils/cn";

type ContentImageProps = {
  src?: string | null;
  alt: string;
  aspectRatio?: "landscape" | "portrait" | "square" | "wide";
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  overlay?: boolean;
  sizes?: string;
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
}: ContentImageProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-media bg-brand-mist", aspectClasses[aspectRatio], className)}>
      {src?.trim() ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover transition duration-700", imageClassName)}
        />
      ) : (
        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-primary-light),var(--color-bg-alt))]" aria-hidden="true" />
      )}
      {overlay ? <div className="absolute inset-0 bg-brand-navy/20" aria-hidden="true" /> : null}
    </div>
  );
}
