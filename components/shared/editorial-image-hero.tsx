import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils/cn";

export type EditorialHeroBreadcrumb = {
  label: string;
  href?: string;
};

export type EditorialHeroCta = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

export type EditorialImageHeroProps = {
  imageSrc?: string | null;
  imageAlt: string;
  eyebrow?: string | null;
  title?: string | null;
  description?: string | null;
  supportingText?: string | null;
  breadcrumbs?: EditorialHeroBreadcrumb[];
  ctas?: EditorialHeroCta[];
  imagePosition?: string;
  priority?: boolean;
  className?: string;
};

const hasText = (value?: string | null): value is string => Boolean(value?.trim());

/**
 * A reusable, image-led page hero with an editorial content card anchored to
 * the bottom-left corner of the photograph. Empty optional content is
 * removed along with its wrapper so CMS deletions never leave decorative
 * boxes behind.
 */
export function EditorialImageHero({
  imageSrc,
  imageAlt,
  eyebrow,
  title,
  description,
  supportingText,
  breadcrumbs = [],
  ctas = [],
  imagePosition = "center",
  priority = false,
  className,
}: EditorialImageHeroProps) {
  const visibleImage = hasText(imageSrc) ? imageSrc : null;
  const visibleBreadcrumbs = breadcrumbs.filter((crumb) => hasText(crumb.label));
  const visibleCtas = ctas.filter((cta) => hasText(cta.label) && hasText(cta.href));
  const hasPanel =
    hasText(eyebrow) ||
    hasText(title) ||
    hasText(description) ||
    hasText(supportingText) ||
    visibleCtas.length > 0;

  return (
    <section className={cn("relative overflow-hidden bg-white", className)}>
      <div
        className={cn(
          "relative",
          visibleImage
            ? "min-h-[30rem] sm:min-h-[35rem] lg:min-h-[42rem]"
            : "min-h-[18rem] bg-brand-navy sm:min-h-[22rem]",
        )}
      >
        {visibleImage ? (
          <Image
            src={visibleImage}
            alt={imageAlt}
            fill
            priority={priority}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
        ) : null}
        <div
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,20,39,0.38)_0%,rgba(7,20,39,0.08)_42%,rgba(7,20,39,0.58)_100%)]"
          aria-hidden="true"
        />

        {visibleBreadcrumbs.length > 0 ? (
          <div className="absolute inset-x-0 top-0 z-10">
            <nav
              aria-label="Breadcrumb"
              className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-1 px-4 pt-7 text-sm font-medium text-white sm:px-6 lg:px-8 lg:pt-9"
            >
              {visibleBreadcrumbs.map((crumb, index) => (
                <span key={`${crumb.label}-${index}`} className="inline-flex items-center gap-2">
                  {index > 0 ? <span className="text-white/55">/</span> : null}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="rounded-sm text-white/80 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white">
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </nav>
          </div>
        ) : null}

        {hasPanel ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 sm:bottom-6 lg:bottom-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="pointer-events-auto w-full sm:max-w-md">
                <div className="rounded-3xl border border-white/15 bg-brand-navy/90 px-6 py-6 text-white shadow-[0_12px_40px_rgba(7,20,39,0.65)] backdrop-blur-xl backdrop-saturate-150 sm:px-7 sm:py-7">
                  {hasText(eyebrow) ? (
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
                      {eyebrow}
                    </p>
                  ) : null}

                  {hasText(title) ? (
                    <h1 className="font-heading text-2xl font-bold leading-[1.1] text-white sm:text-3xl">
                      {title}
                    </h1>
                  ) : null}

                  {hasText(description) ? (
                    <p className={cn("text-base leading-7 text-white", hasText(title) && "mt-3")}>
                      {description}
                    </p>
                  ) : null}

                  {hasText(supportingText) ? (
                    <p className="mt-3 text-sm leading-6 text-white/75">{supportingText}</p>
                  ) : null}

                  {visibleCtas.length > 0 ? (
                    <div className="mt-5 flex flex-wrap gap-3">
                      {visibleCtas.map((cta) => (
                        <Link
                          key={`${cta.href}-${cta.label}`}
                          href={cta.href}
                          className={cn(
                            "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy",
                            cta.variant === "secondary"
                              ? "border border-white/35 bg-white/5 text-white hover:bg-white/15"
                              : "bg-brand-gold text-brand-ink hover:-translate-y-0.5 hover:shadow-lg",
                          )}
                        >
                          {cta.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
