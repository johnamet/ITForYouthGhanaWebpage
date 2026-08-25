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
 * The active lens photograph, blurred and clipped inside the hero shell.
 *
 * The approved concept uses one image in two treatments: sharp in the contained
 * circular lens and soft across the capsule background. Keeping both copies in
 * the capsule makes that relationship explicit and leaves the surrounding hero
 * stage quiet.
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
          <Image
            src={image.src}
            alt=""
            fill
            quality={40}
            sizes="(max-width: 472px) calc(100vw - 32px), (max-width: 820px) 440px, (max-width: 1370px) 92vw, 1240px"
            priority={index === 0}
          />
        </div>
      ))}

      <div
        className="itfy-capsule__wash"
        style={{
          background: `radial-gradient(ellipse at 22% 48%, rgba(3,6,14,0.18) 0%, rgba(3,6,14,0.48) 52%, rgba(3,6,14,0.82) 100%), linear-gradient(110deg, ${overlayFrom} 0%, ${overlayTo} 48%, rgba(3,6,14,0.92) 100%)`,
        }}
      />
    </div>
  );
}
