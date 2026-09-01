import Link from "next/link";

import { cn } from "@/lib/utils/cn";

export type RelatedProgramme = {
  body: string;
  linkLabel: string;
  href: string;
};

type RelatedProgrammeBlockProps = RelatedProgramme & {
  className?: string;
};

/**
 * C13 — related programme block.
 *
 * Spec §3: "Body text, link label, destination. Placed on the 8 pathway pages."
 * Spec §8 places it "after the main body, before the footer" and makes it
 * CMS-editable per page, which is why all three strings arrive as props rather
 * than being switched on a slug inside this component.
 *
 * Kept visually quiet on purpose. It sits at the end of a pathway page that has
 * already made its own case, so it reads as a related route rather than
 * competing with that page's own call to action.
 */
export function RelatedProgrammeBlock({
  body,
  linkLabel,
  href,
  className,
}: RelatedProgrammeBlockProps) {
  if (!body.trim() || !linkLabel.trim() || !href.trim()) return null;

  return (
    <section
      className={cn(
        "rounded-[28px] border-l-4 border-brand-gold bg-brand-mist/50 px-6 py-7 sm:px-8",
        className,
      )}
    >
      <p className="max-w-2xl text-base leading-8 text-brand-ink">{body}</p>
      <Link
        href={href}
        className="mt-4 inline-flex text-sm font-bold text-brand-primary transition hover:text-brand-ink"
      >
        {linkLabel}
      </Link>
    </section>
  );
}
