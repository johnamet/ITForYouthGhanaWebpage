import Link from "next/link";
import type { ReactNode } from "react";

import { CapsuleActions } from "@/components/capsule/capsule-actions";
import { CapsuleContent } from "@/components/capsule/capsule-content";
import { CapsuleMedia } from "@/components/capsule/capsule-media";
import { CapsuleShell } from "@/components/capsule/capsule-shell";
import { safeCssColor } from "@/lib/utils/css-color";

type Crumb = {
  label: string;
  href?: string;
};

type Action = {
  label: string;
  href: string;
};

type CapsulePageHeroProps = {
  eyebrow?: string;
  title: string;
  /** The lead paragraph inside the capsule. */
  description?: string;
  /** A second paragraph, set off by an accent rule. */
  supportingText?: string | null;
  imageSrc: string;
  imageAlt: string;
  breadcrumbs?: Crumb[];
  primaryAction?: Action;
  secondaryAction?: Action;
  /** Identity colour for the eyebrow rule and the supporting rule. */
  accent?: string;
  children?: ReactNode;
};

const FALLBACK_ACCENT = "#1E72BA";

/**
 * The standard hero for an interior page: the capsule at rest.
 *
 * The same CapsuleShell the homepage hero uses, in its static paper form with a
 * single photograph and no slideshow. It reads as a different object from the
 * homepage because the tone is paper rather than dark and the shape does not
 * move, so the language carries across without the pill being reproduced
 * literally.
 *
 * The paper capsule needs a tinted ground to read against, which is why the
 * band around it is part of the component rather than left to each page.
 */
export function CapsulePageHero({
  eyebrow,
  title,
  description,
  supportingText,
  imageSrc,
  imageAlt,
  breadcrumbs,
  primaryAction,
  secondaryAction,
  accent,
  children,
}: CapsulePageHeroProps) {
  const resolvedAccent = safeCssColor(accent, FALLBACK_ACCENT);

  return (
    <section className="border-b border-brand-border bg-brand-mist/40 px-[clamp(16px,4vw,56px)] py-[clamp(40px,7vh,88px)]">
      {breadcrumbs?.length ? (
        <nav aria-label="Breadcrumb" className="mx-auto mb-8 max-w-[1180px]">
          <p className="text-sm text-slate-500">
            {breadcrumbs.map((crumb, index) => (
              <span key={`${crumb.label}-${index}`}>
                {index > 0 ? (
                  <span aria-hidden="true" className="px-2 text-brand-border">/</span>
                ) : null}
                {crumb.href ? (
                  <Link href={crumb.href} className="transition hover:text-brand-ink">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-brand-ink">{crumb.label}</span>
                )}
              </span>
            ))}
          </p>
        </nav>
      ) : null}

      <CapsuleShell
        tone="paper"
        animateIn={false}
        className="mx-auto max-w-[1180px]"
        media={
          <CapsuleMedia
            images={[{ id: imageSrc, src: imageSrc, alt: imageAlt }]}
            accent={resolvedAccent}
            priority
          />
        }
      >
        <CapsuleContent
          as="h1"
          tone="paper"
          eyebrow={eyebrow}
          heading={title}
          body={description}
          accent={resolvedAccent}
        >
          {supportingText?.trim() ? (
            <p
              className="mt-5 border-l-2 pl-5 text-sm leading-7 text-slate-600 max-[820px]:border-l-0 max-[820px]:pl-0"
              style={{ borderColor: resolvedAccent }}
            >
              {supportingText}
            </p>
          ) : null}

          {primaryAction ? (
            <CapsuleActions tone="paper" primary={primaryAction} secondary={secondaryAction} />
          ) : null}

          {children}
        </CapsuleContent>
      </CapsuleShell>
    </section>
  );
}
