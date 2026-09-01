import { ContentImage } from "@/components/media/content-image";
import { cn } from "@/lib/utils/cn";
import type { Donor } from "@/types/laptop-bank";

type DonorLogoGridProps = {
  donors: Donor[];
  className?: string;
};

/**
 * C9 — donor logo grid.
 *
 * Spec §3: "Reads Donor content type. Renders only records where display
 * consent = 'named with logo'."
 *
 * THIS COMPONENT DOES NOT FILTER, and that is deliberate.
 * getLogoConsentingDonors() in lib/cms/laptop-bank.ts already did, because
 * spec §4 DATA requires consent to be enforced "in the query, not the
 * template". If a non-consenting donor ever reaches this component the bug is
 * in that query, and adding a defensive check here would hide it while
 * splitting the rule across two files. Do not add one.
 *
 * Spec 5.1 block 7's "hide when fewer than 4 records" threshold belongs to the
 * page, not here — page 5.1 counts, this renders whatever it is given.
 *
 * Logos use `fit="contain"`: cropping a partner organisation's mark is not an
 * option.
 */
export function DonorLogoGrid({ donors, className }: DonorLogoGridProps) {
  if (!donors.length) return null;

  return (
    <div className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {donors.map((donor) => (
        <div
          key={donor.name}
          className="flex flex-col gap-4 rounded-[24px] border border-brand-border bg-white p-5 shadow-sm"
        >
          <ContentImage
            src={donor.logo}
            alt={donor.name}
            aspectRatio="landscape"
            fit="contain"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
          <div>
            <p className="font-heading text-lg font-bold text-brand-ink">{donor.name}</p>
            {donor.sector?.trim() || donor.country?.trim() ? (
              <p className="mt-1 text-sm leading-7 text-slate-500">
                {[donor.sector?.trim(), donor.country?.trim()].filter(Boolean).join(" · ")}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Quote cards for donors who supplied one (page 5.12). Same no-filtering rule:
 * getQuotableDonors() has already applied consent.
 */
export function DonorQuoteCards({ donors, className }: DonorLogoGridProps) {
  if (!donors.length) return null;

  return (
    <div className={cn("grid gap-5 lg:grid-cols-2", className)}>
      {donors.map((donor) => (
        <figure
          key={`${donor.name}-quote`}
          className="rounded-[28px] border-l-4 border-brand-gold bg-white p-6 shadow-sm"
        >
          <blockquote className="text-base leading-8 text-brand-ink">{donor.quote}</blockquote>
          <figcaption className="mt-4 text-sm font-bold text-slate-600">
            {donor.quote_attribution?.trim() || donor.name}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
