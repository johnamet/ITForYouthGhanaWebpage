"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

import type { InitiativeGalleryImage } from "@/types/content";

type InitiativeGalleryProps = {
  images: InitiativeGalleryImage[];
};

export function InitiativeGallery({ images }: InitiativeGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
        {images.map((image, index) => {
          const spanClass =
            index % 5 === 0
              ? "lg:col-span-7 lg:row-span-2"
              : index % 3 === 0
                ? "lg:col-span-5"
                : "lg:col-span-4";

          return (
            <button
              key={`${image.src}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`group relative min-h-[16rem] overflow-hidden rounded-[28px] bg-brand-mist text-left ${spanClass}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 33vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/55 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 right-4 text-sm font-medium text-white">
                {image.alt}
              </span>
            </button>
          );
        })}
      </div>

      {activeIndex !== null ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label={images[activeIndex]?.alt}
          onClick={() => setActiveIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-[30px] bg-black"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="Close gallery image"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white transition hover:bg-black/75"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative aspect-[4/3]">
              <Image
                src={images[activeIndex].src}
                alt={images[activeIndex].alt}
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
