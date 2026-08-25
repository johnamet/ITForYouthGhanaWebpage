import Image from "next/image";

type GroundImage = {
  id: string;
  src: string;
};

type CapsuleGroundProps = {
  images: GroundImage[];
  activeIndex?: number;
  /** Per-slide wash, from the slide's overlayFrom and overlayTo values. */
  overlayFrom: string;
  overlayTo: string;
};

/**
 * The capsule's own fill: the same photograph as the lens, blurred.
 *
 * This is where the blurred duplicate lives. It began as a way to fill the dead
 * space left by object-contain, then became the atmosphere behind a floating
 * capsule. Now that the capsule fills the hero there is no "behind" left, so it
 * moved inside: soft as the ground, sharp in the circle, one image doing both
 * jobs.
 *
 * It also keeps the original guarantee. The lens crops to a circle, but the
 * complete uncropped frame is still on screen here, filling the shell.
 */
export function CapsuleGround({
  images,
  activeIndex = 0,
  overlayFrom,
  overlayTo,
}: CapsuleGroundProps) {
  if (!images.length) return null;

  return (
    <div className="itfy-capsule__ground" aria-hidden="true">
      {images.map((image, index) => (
        <div
          key={image.id}
          className="itfy-capsule__ground-shot"
          data-active={index === activeIndex}
        >
          <Image src={image.src} alt="" fill quality={40} sizes="100vw" priority={index === 0} />
        </div>
      ))}

      <div
        className="itfy-capsule__wash"
        style={{
          background: `radial-gradient(ellipse at 24% 46%, transparent 0%, rgba(3,6,14,0.58) 74%), linear-gradient(118deg, ${overlayFrom} 0%, ${overlayTo} 44%, rgba(3,6,14,0.94) 100%)`,
        }}
      />
    </div>
  );
}
