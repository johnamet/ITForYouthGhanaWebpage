import Image from "next/image";

export type Partner = {
  id: string;
  name: string;
  logo?: string;       // path to logo image
  href?: string;
};

type PartnersStripProps = {
  partners: Partner[];
  heading?: string;
};

export function PartnersStrip({
  partners,
  heading = "Trusted by organisations across Ghana and beyond",
}: PartnersStripProps) {
  // Duplicate list so the CSS marquee loops seamlessly
  const doubled = [...partners, ...partners];

  return (
    <section className="border-y border-brand-border bg-white px-6 py-14 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="mb-8 text-center text-[0.65rem] font-bold uppercase tracking-[0.28em] text-slate-400">
          {heading}
        </p>

        {/* Marquee track */}
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-10">
            {doubled.map((p, i) => (
              <div
                key={`${p.id}-${i}`}
                className="flex h-10 w-32 shrink-0 items-center justify-center"
                title={p.name}
              >
                {p.logo ? (
                  <Image
                    src={p.logo}
                    alt={p.name}
                    width={120}
                    height={40}
                    className="h-8 w-auto object-contain opacity-50 grayscale transition hover:opacity-80 hover:grayscale-0"
                  />
                ) : (
                  /* Fallback text pill when no logo */
                  <span className="rounded-full border border-brand-border px-4 py-1.5 text-[0.7rem] font-semibold text-slate-400">
                    {p.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/*
  Add to tailwind.config.ts → theme.extend:

  animation: {
    marquee: "marquee 30s linear infinite",
  },
  keyframes: {
    marquee: {
      from: { transform: "translateX(0)" },
      to:   { transform: "translateX(-50%)" },
    },
  },
*/