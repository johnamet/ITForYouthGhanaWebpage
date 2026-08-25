import Image from "next/image";

import { cn } from "@/lib/utils/cn";

type StageImage = {
  id: string;
  src: string;
};

type SlideshowStageProps = {
  images: StageImage[];
  activeIndex?: number;
  /** Per-slide wash, from the slide's overlayFrom and overlayTo values. */
  overlayFrom: string;
  overlayTo: string;
  /** Identity colour for the bloom. */
  accent?: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * The photographic ground a capsule floats on.
 *
 * The blurred duplicate is carried over from the previous hero, where it
 * existed to fill the dead space left by object-contain. Here it does more: it
 * is the atmosphere the capsule sits in, and it remains the layer that shows
 * every photograph in full, uncropped, behind the circular lens.
 */
export function SlideshowStage({
  images,
  activeIndex = 0,
  overlayFrom,
  overlayTo,
  accent = "#1E72BA",
  className,
  children,
}: SlideshowStageProps) {
  return (
    <div
      className={cn(
        "relative isolate grid min-h-[100svh] place-items-center overflow-hidden bg-[#05070f]",
        "px-[clamp(16px,4vw,56px)] pb-[clamp(72px,10vh,110px)] pt-[clamp(32px,6vh,72px)]",
        className,
      )}
    >
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {images.map((image, index) => (
          <div key={image.id} className="itfy-stage__layer" data-active={index === activeIndex}>
            <Image
              src={image.src}
              alt=""
              fill
              quality={40}
              sizes="100vw"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Per-slide wash. Carries slide identity across the whole scene, so
            the capsule and its ground read as one image rather than a card on
            a background. */}
        <div
          className="absolute inset-0 z-[1] transition-[background] duration-[900ms] ease-out"
          style={{
            background: `radial-gradient(ellipse at 22% 42%, transparent 0%, rgba(3,6,14,0.72) 72%), linear-gradient(145deg, ${overlayFrom} 0%, ${overlayTo} 46%, rgba(3,6,14,0.97) 100%)`,
          }}
        />

        <div className="itfy-stage__grid absolute inset-0 z-[2] opacity-[0.022]" />

        <div
          className="itfy-animate-bloom absolute -left-[140px] top-[16%] z-[2] size-[420px] rounded-full opacity-[0.16] blur-[120px] transition-[background-color] duration-[900ms] ease-out"
          style={{ backgroundColor: accent }}
        />
        <div className="itfy-animate-bloom-rev absolute -right-[120px] bottom-[12%] z-[2] size-[340px] rounded-full bg-white opacity-[0.05] blur-[120px]" />
      </div>

      {children}
    </div>
  );
}
