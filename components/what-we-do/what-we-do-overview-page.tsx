import Image from "next/image";
import Link from "next/link";
import { breadcrumbs } from "@/lib/content/site-config";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { ProseMediaCardGrid } from "@/components/shared/prose-media-card-grid";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { WhatWeDoGallery } from "@/components/what-we-do/what-we-do-gallery";
import { safeImageSrc } from "@/lib/utils/image-src";
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

export function WhatWeDoOverviewPage({ content, initiatives }: WhatWeDoOverviewPageProps) {
  return (
    <div className="bg-white">
      <EditorialImageHero
        imageSrc={content.heroImage}
        imageAlt="IT For Youth Ghana initiatives in action"
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        supportingText={content.overviewSectionDescription}
        breadcrumbs={[
          { label: breadcrumbs.home, href: "/" },
          { label: breadcrumbs.whatWeDo.root },
        ]}
        ctas={[
          { label: "Apply for training", href: "/apply-for-training" },
          { label: "Partner with us", href: "/partner-with-us", variant: "secondary" },
        ]}
        priority
      />

      <div className="sticky top-[72px] z-30 border-y border-brand-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-4 [scrollbar-width:none] sm:px-6 lg:px-8">
          {anchorLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="whitespace-nowrap rounded-full border border-brand-border px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-gold hover:text-brand-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <section id="overview" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <SectionHeading
            eyebrow={content.overviewSectionEyebrow ?? "Overview"}
            title={
              content.overviewSectionTitle ?? "The work is designed as a connected system"
            }
            description={
              content.overviewSectionDescription ??
              "We do not treat access, training, entrepreneurship, and advocacy as separate silos. The strongest outcomes happen when these pieces reinforce each other."
            }
          />

          <ProseMediaCardGrid
            theme="mentoring"
            columns={3}
            breakpoint="lg"
            gap="5"
            cards={content.ecosystemCards.map((card) => ({
              variant: "spotlight" as const,
              eyebrow: card.eyebrow,
              title: card.title,
              body: card.description,
              media: { image: card.image, imageAlt: card.imageAlt },
              mediaKey: `what-we-do:eco:${card.title}`,
            }))}
          />
        </div>
      </section>

      <section
        id="initiatives"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeading
            eyebrow={content.initiativesSectionEyebrow ?? "Initiatives"}
            title={
              content.initiativesSectionTitle ??
              "Explore each initiative in more depth"
            }
            description={
              content.initiativesSectionDescription ??
              "Every initiative page now has a dedicated structure with galleries, FAQs, testimonials, partner references, and a stronger narrative arc."
            }
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {initiatives.map((initiative) => {
              const heroImageSrc = safeImageSrc(initiative.heroImage);
              return (
              <Link
                key={initiative.slug}
                href={`/what-we-do/${initiative.slug}`}
                className="group overflow-hidden rounded-[32px] border border-brand-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-panel"
              >
                <div className="grid md:grid-cols-[0.42fr_0.58fr]">
                  <div className="relative min-h-[18rem] bg-brand-mist">
                    {heroImageSrc ? (
                    <Image
                      src={heroImageSrc}
                      alt={initiative.title}
                      fill
                      sizes="(max-width: 767px) 100vw, 35vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/45 via-transparent to-transparent" />
                  </div>

                  <div className="flex flex-col justify-between p-7">
                    <div className="space-y-3">
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
                        {initiative.eyebrow}
                      </p>
                      <h3 className="font-heading text-3xl font-bold text-brand-ink">
                        {initiative.title}
                      </h3>
                      <p className="text-sm font-medium leading-7 text-brand-navy">
                        {initiative.tagline}
                      </p>
                      <p className="text-sm leading-7 text-slate-600">
                        {initiative.description}
                      </p>
                    </div>

                    <div className="mt-6 space-y-5">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {initiative.impactStats.slice(0, 2).map((stat) => (
                          <div
                            key={stat.label}
                            className="rounded-[22px] border border-brand-border bg-brand-mist/45 px-4 py-4"
                          >
                            <p className="font-heading text-2xl font-bold text-brand-navy">
                              {stat.value}
                            </p>
                            <p className="mt-1 text-sm font-semibold text-brand-ink">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>

                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy">
                        Explore initiative
                        <span className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {content.galleryItems.length > 0 ? (
        <section id="gallery" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
          <div className="space-y-10">
            <SectionHeading
              eyebrow={content.gallerySectionEyebrow ?? "In action"}
              title={content.gallerySectionTitle ?? "See the work in action"}
              description={content.gallerySectionDescription ?? "A closer look at the learning, collaboration, and community moments behind our initiatives."}
            />
            <WhatWeDoGallery items={content.galleryItems} />
          </div>
        </section>
      ) : null}

      <section id="pathways" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <SectionHeading
            eyebrow={content.pathwaysSectionEyebrow ?? "Pathways"}
            title={
              content.pathwaysSectionTitle ??
              "From first exposure to longer-term opportunity"
            }
            description={
              content.pathwaysSectionDescription ??
              "The strongest version of this work helps a learner move forward over time, not just attend one moment. These pathways show how the portfolio supports that progression."
            }
          />

          <ProseMediaCardGrid
            theme="coding"
            columns={4}
            breakpoint="lg"
            gap="5"
            cards={content.pathwayCards.map((card) => ({
              title: card.title,
              body: card.description,
              mediaKey: `what-we-do:path:${card.title}`,
            }))}
          />
        </div>
      </section>

      <section id="next-steps" className="scroll-mt-36 bg-brand-navy px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="space-y-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
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
