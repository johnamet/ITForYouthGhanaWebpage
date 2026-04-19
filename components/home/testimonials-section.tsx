"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;       // e.g. "Bootcamp Graduate, 2024"
  avatar?: string;    // optional photo path
  initials: string;   // fallback, e.g. "AK"
};

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = testimonials.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % total) + total) % total);
    },
    [total],
  );

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % total), 6000);
  }, [total]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  const handleDot = (i: number) => { goTo(i); startTimer(); };
  const t = testimonials[current];

  return (
    <section className="overflow-hidden bg-brand-navy px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-10 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
          Student voices
        </p>

        {/* Quote */}
        <div key={t.id} className="animate-hero-in">
          {/* Opening mark */}
          <span className="font-heading text-[5rem] leading-none text-brand-gold/20 select-none">
            &ldquo;
          </span>
          <blockquote className="-mt-6 font-heading text-xl font-semibold leading-[1.6] text-white sm:text-2xl lg:text-[1.65rem]">
            {t.quote}
          </blockquote>
        </div>

        {/* Avatar + name */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-brand-gold/40">
            {t.avatar ? (
              <Image src={t.avatar} alt={t.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-brand-gold/20 font-heading text-base font-bold text-brand-gold">
                {t.initials}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{t.name}</p>
            <p className="mt-0.5 text-xs text-white/45">{t.role}</p>
          </div>
        </div>

        {/* Dots */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDot(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-[3px] rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-brand-gold" : "w-4 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
