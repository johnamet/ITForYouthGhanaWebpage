import Image from "next/image";

import { cn } from "@/lib/utils/cn";

type LensImage = {
  id: string;
  src: string;
  alt: string;
};

type CapsuleMediaProps = {
  /** One entry renders a static lens; several crossfade between them. */
  images: LensImage[];
  activeIndex?: number;
  /**
   * Autoplay progress, 0 to 100. Omit to hide the ring entirely, which is what
   * a static lens or a reduced-motion viewer should get.
   */
  progress?: number;
  /** Identity colour for the progress ring. A literal colour, never a var(). */
  accent?: string;
  /** Short caption shown across the lens. */
  caption?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * The circular lens.
 *
 * The photograph is cropped to a circle with object-cover, because a contained
 * photograph inside a circle reads as a mistake where a circular crop reads as
 * deliberate portraiture. The active photograph is also present as the
 * capsule-owned blurred background, so the crop remains visually grounded.
 */
export function CapsuleMedia({
  images,
  activeIndex = 0,
  progress,
  accent = "#1E72BA",
  caption,
  priority = false,
  sizes = "(min-width: 1280px) 460px, (min-width: 1024px) 400px, (min-width: 821px) 340px, 100vw",
  className,
}: CapsuleMediaProps) {
  if (!images.length) return null;

  const showRing = typeof progress === "number" && images.length > 1;

  return (
    <div className={cn("itfy-lens", className)}>
      <div className="itfy-lens__frame">
        {images.map((image, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={image.id}
              className="itfy-lens__shot"
              data-active={isActive}
              aria-hidden={!isActive}
            >
              <Image
                src={image.src}
                alt={isActive ? image.alt : ""}
                fill
                priority={priority && index === 0}
                quality={92}
                sizes={sizes}
              />
            </div>
          );
        })}
        <div className="itfy-lens__veil" aria-hidden="true" />
      </div>

      <div className="itfy-lens__rim" aria-hidden="true" />

      {showRing ? (
        /*
         * CSS custom properties do not resolve inside SVG presentation
         * attributes, so stroke takes a literal colour value.
         */
        <svg
          className="itfy-lens__progress"
          viewBox="0 0 100 100"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="50" cy="50" r="48.6" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
          <circle
            cx="50"
            cy="50"
            r="48.6"
            fill="none"
            stroke={accent}
            strokeWidth="1.6"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={100 - progress}
          />
        </svg>
      ) : null}

      {caption ? (
        <span
          className="
            absolute bottom-[5%] left-1/2 z-10 max-w-[82%] -translate-x-1/2
            truncate rounded-capsule border border-white/15 bg-black/55
            px-4 py-1.5 text-center text-[11.5px] font-semibold uppercase
            tracking-[0.09em] text-white backdrop-blur-md
            max-[820px]:hidden
          "
        >
          {caption}
        </span>
      ) : null}
    </div>
  );
}
