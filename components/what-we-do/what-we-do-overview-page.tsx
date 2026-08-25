import Image from "next/image";
import Link from "next/link";

import { CapsuleActions, CapsuleContent, CapsuleMedia, CapsuleShell } from "@/components/capsule";
import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { InitiativeOrbit } from "@/components/what-we-do/initiative-orbit";
import { PathwayTree } from "@/components/what-we-do/pathway-tree";
import { WhatWeDoGallery } from "@/components/what-we-do/what-we-do-gallery";
import { breadcrumbs } from "@/lib/content/site-config";
import type { InitiativePage, WhatWeDoOverviewContent } from "@/types/content";

type WhatWeDoOverviewPageProps = {
  content: WhatWeDoOverviewContent;
  initiatives: InitiativePage[];
};

const anchorLinks = [
  { id: "overview", label: "Overview" },
  { id: "initiatives", label: "Initiatives" },
  { id: "gallery", label: "Gallery" },
  { id: "pathways", label: "Pathways" },
  { id: "next-steps", label: "Next Steps" },
];

/**
 * The What We Do hub.
 *
 * Two deliberate choices about where the capsule belongs. The hero uses it, in
 * the same static paper form as an initiative page. The initiative row uses it
 * at a much smaller scale, where a circle grows into a named capsule. The
 * pathway tree deliberately does not: eight more capsules directly beneath the
 * orbit would be a rerun, and a genuinely branching structure wants a tree.
 */
export function WhatWeDoOverviewPage({ content, initiatives }: WhatWeDoOverviewPageProps) {
  /* Present the row in pathway order where the pathway defines one, so the
     orbit and the tree tell the same story in the same sequence. */
  const pathwayOrder = content.pathwayCards.flatMap((stage) => stage.initiativeSlugs ?? []);
  const ordered = [
    ...pathwayOrder
      .map((slug) => initiatives.find((initiative) => initiative.slug === slug))
      .filter((initiative): initiative is InitiativePage => Boolean(initiative)),
    ...initiatives.filter((initiative) => !pathwayOrder.includes(initiative.slug)),
  ];

  return (
    <div className="bg-white">
      {/* ── Capsule hero ─────────────────────────────────────────────── */}
      <section className="border-b border-brand-border bg-brand-mist/40 px-[clamp(16px,4vw,56px)] py-[clamp(40px,7vh,88px)]">
        <nav aria-label="Breadcrumb" className="mx-auto mb-8 max-w-[1180px]">
          <p className="text-sm text-slate-500">
            <Link href="/" className="transition hover:text-brand-ink">{breadcrumbs.home}</Link>
            <span aria-hidden="true" className="px-2 text-brand-border">/</span>
            <span className="font-semibold text-brand-ink">{breadcrumbs.whatWeDo.root}</span>
          </p>
        </nav>

        <CapsuleShell
          tone="paper"
          animateIn={false}
          className="mx-auto max-w-[1180px]"
          media={
            <CapsuleMedia
              images={[
                {
                  id: "what-we-do-hero",
                  src: content.heroImage,
                  alt: "IT For Youth Ghana initiatives in action",
                },
              ]}
              priority
            />
          }
        >
          <CapsuleContent
            as="h1"
            tone="paper"
            eyebrow={content.eyebrow}
            heading={content.title}
            body={content.description}
          >
            <CapsuleActions
              tone="paper"
              primary={{ label: "Apply for training", href: "/apply-for-training" }}
              secondary={{ label: "Partner with us", href: "/partner-with-us" }}
            />
          </CapsuleContent>
        </CapsuleShell>
      </section>

      <div className="sticky top-[72px] z-30 border-b border-brand-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-4 [scrollbar-width:none] sm:px-6 lg:px-8">
          {anchorLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="whitespace-nowrap rounded-capsule border border-brand-border px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-accent hover:text-brand-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* ── Overview: three peers with no inherent order, so a grid ──── */}
      <section id="overview" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <SectionHeading
            eyebrow={content.overviewSectionEyebrow ?? "Overview"}
            title={content.overviewSectionTitle ?? "The work is designed as a connected system"}
            description={
              content.overviewSectionDescription ??
              "We do not treat access, training, entrepreneurship, and advocacy as separate silos. The strongest outcomes happen when these pieces reinforce each other."
            }
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {content.ecosystemCards.map((card) => (
              <div
                key={card.title}
                className="overflow-hidden rounded-panel border border-brand-border bg-white shadow-sm"
              >
                {card.image ? (
                  <div className="relative aspect-[16/9] w-full">
                    <Image
                      src={card.image}
                      alt={card.imageAlt || card.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="p-7">
                  <p className="flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-ink">
                    <span aria-hidden="true" className="h-[2px] w-5 flex-none bg-brand-accent" />
                    {card.eyebrow}
                  </p>
                  <h2 className="mt-4 font-heading text-2xl font-bold text-brand-ink">{card.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The orbit: the capsule at a small scale ──────────────────── */}
      <section id="initiatives" className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <SectionHeading
            eyebrow={content.initiativesSectionEyebrow ?? "Initiatives"}
            title={content.initiativesSectionTitle ?? "Explore each initiative in more depth"}
            description={
              content.initiativesSectionDescription ??
              "Every initiative has its own page with a mission, objectives, impact figures, galleries, testimonials and partner references."
            }
          />

          <InitiativeOrbit
            initiatives={ordered.map((initiative) => ({
              slug: initiative.slug,
              name: initiative.title,
              tagline: initiative.tagline || initiative.description,
              image: initiative.heroImage,
              accent: initiative.accent,
            }))}
          />

          <p className="text-sm text-brand-muted">
            Move along the row to open an initiative, or select one to read it in full.
          </p>
        </div>
      </section>

      {content.galleryItems.length > 0 ? (
        <section id="gallery" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-10">
            <SectionHeading
              eyebrow={content.gallerySectionEyebrow ?? "In action"}
              title={content.gallerySectionTitle ?? "See the work in action"}
              description={
                content.gallerySectionDescription ??
                "A closer look at the learning, collaboration, and community moments behind our initiatives."
              }
            />
            <WhatWeDoGallery items={content.galleryItems} />
          </div>
        </section>
      ) : null}

      {/* ── The pathway: genuinely branching, so a tree, kept uneven ─── */}
      <section id="pathways" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <SectionHeading
            eyebrow={content.pathwaysSectionEyebrow ?? "Pathways"}
            title={content.pathwaysSectionTitle ?? "From first exposure to longer-term opportunity"}
            description={
              content.pathwaysSectionDescription ??
              "The strongest version of this work helps a learner move forward over time, not just attend one moment. These pathways show how the portfolio supports that progression."
            }
          />

          <PathwayTree stages={content.pathwayCards} initiatives={initiatives} />
        </div>
      </section>

      <section id="next-steps" className="scroll-mt-36 bg-brand-deep px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="space-y-3">
            <p className="flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.28em] text-white">
              <span aria-hidden="true" className="h-[2px] w-6 flex-none bg-brand-accent" />
              {content.nextStepsSectionEyebrow ?? "Next steps"}
            </p>
            <h2 className="max-w-3xl font-heading text-3xl font-bold leading-snug text-white sm:text-4xl">
              {content.nextStepsSectionTitle ?? "Choose the right entry point into the work"}
            </h2>
            <p className="max-w-3xl text-[0.95rem] leading-[1.8] text-white/70">
              {content.nextStepsSectionDescription ??
                "Whether you are a learner, partner, or supporter, the next move should feel clear from here."}
            </p>
          </div>
          <RouteCardGrid cards={content.nextSteps} />
        </div>
      </section>
    </div>
  );
}
