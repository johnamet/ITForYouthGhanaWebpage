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
  className?: string;
  children: React.ReactNode;
};

/**
 * The hero: a blurred photograph, with the capsule inset on top of it.
 *
 * The blurred duplicate belongs here rather than inside the capsule. The
 * concept sketch labels it as the hero's background, and it has to be visible
 * around the shell for that to mean anything: the same photograph reads sharp
 * inside the circular lens and soft everywhere else.
 *
 * Sizing for the whole hero, the capsule included, comes from the custom
 * properties on .itfy-hero-stage in app/globals.css. They are defined there so
 * the capsule and the controls inherit one --capsule-h and cannot drift.
 */
export function SlideshowStage({
  images,
  activeIndex = 0,
  overlayFrom,
  overlayTo,
  className,
  children,
}: SlideshowStageProps) {
  return (
    <div
      className={cn(
        "itfy-hero-stage",
        "relative isolate grid min-h-[calc(100svh-65px)] place-items-center overflow-x-hidden bg-[#05070f]",
        className,
      )}
    >
      <div className="itfy-stage__bg" aria-hidden="true">
        {images.map((image, index) => (
          <div key={image.id} className="itfy-stage__shot" data-active={index === activeIndex}>
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

        <div
          className="itfy-stage__wash"
          style={{
            background: `radial-gradient(ellipse at 30% 45%, rgba(3,6,14,0.12) 0%, rgba(3,6,14,0.46) 58%, rgba(3,6,14,0.80) 100%), linear-gradient(145deg, ${overlayFrom} 0%, ${overlayTo} 48%, rgba(3,6,14,0.90) 100%)`,
          }}
        />
      </div>

      {children}
    </div>
  );
}
