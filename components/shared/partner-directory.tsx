import Image from "next/image";

import type { Partner } from "@/components/home/patrners-strip";

type PartnerDirectoryProps = {
  partners: Partner[];
};

export function PartnerDirectory({ partners }: PartnerDirectoryProps) {
  const visiblePartners = partners.filter((partner) => partner.active !== false);

  if (!visiblePartners.length) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-brand-border bg-white p-8 text-center shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-brand-ink">Partners will appear here soon</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            We are currently curating partner profiles and collaboration highlights.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">Partner network</p>
          <h2 className="mt-2 font-heading text-4xl font-semibold text-brand-ink">Organisations helping shape youth outcomes</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            These organisations support delivery, mentorship, placements, and ecosystem growth across IT For Youth Ghana programmes.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visiblePartners.map((partner) => (
            <article key={partner.id} className="rounded-[26px] border border-brand-border bg-white p-6 shadow-sm">
              <div className="mb-4 flex h-16 items-center">
                {partner.logo ? (
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={160}
                    height={56}
                    className="max-h-14 w-auto object-contain"
                  />
                ) : (
                  <div className="rounded-full border border-brand-border bg-brand-mist px-4 py-2 text-sm font-semibold text-brand-ink">
                    {partner.name}
                  </div>
                )}
              </div>

              <h3 className="font-heading text-xl font-semibold text-brand-ink">{partner.name}</h3>

              {partner.href ? (
                <a
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex rounded-full border border-brand-border px-4 py-2 text-xs font-semibold text-brand-ink transition hover:bg-brand-mist"
                >
                  Visit organisation
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
