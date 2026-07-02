import Image from "next/image";

export type Partner = {
  id: string;
  name: string;
  logo?: string;
  href?: string;
  active?: boolean;
  order?: number;
};

type PartnersStripProps = {
  partners: Partner[];
  heading?: string;
};

export function PartnersStrip({
  partners,
  heading = "Trusted by organisations across Ghana and beyond",
}: PartnersStripProps) {
  const visiblePartners = partners.filter((partner) => partner.active !== false);
  const doubled = [...visiblePartners, ...visiblePartners];

  return (
    <section className="border-y border-brand-border bg-[#f8f9fa] px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-center text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
          Partner logo strip
        </p>
        <p className="mb-10 text-center text-sm font-medium text-slate-500">
          {heading}
        </p>

        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max items-center gap-12 [animation:marquee_42s_linear_infinite]">
            {doubled.map((p, i) => (
              <a
                key={`${p.id}-${i}`}
                href={p.href || undefined}
                target={p.href ? "_blank" : undefined}
                rel={p.href ? "noopener noreferrer" : undefined}
                className="flex h-10 w-32 shrink-0 items-center justify-center"
                title={p.name}
              >
                {p.logo ? (
                  <Image
                    src={p.logo}
                    alt={p.name}
                    width={120}
                    height={40}
                    className="h-9 w-auto object-contain opacity-45 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                  />
                ) : (
                  <span className="rounded-full border border-brand-border bg-white px-4 py-1.5 text-[0.72rem] font-semibold text-slate-400 transition hover:border-brand-gold/35 hover:text-brand-ink">
                    {p.name}
                  </span>
                )}
              </a>
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
