import Image from "next/image";
import { emojiToIconImage } from "@/lib/utils/icon-map";
import Link from "next/link";
import { breadcrumbs } from "@/lib/content/site-config";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import type {
  OrganisationOverviewContent,
  OrganisationServicePage,
} from "@/types/content";

type ForOrganisationsOverviewPageProps = {
  content: OrganisationOverviewContent;
  services: OrganisationServicePage[];
};

const anchorLinks = [
  { id: "overview", label: "Overview" },
  { id: "services", label: "Services" },
  { id: "engagement", label: "Engagement" },
  { id: "next-steps", label: "Next Steps" },
];

export function ForOrganisationsOverviewPage({
  content,
  services,
}: ForOrganisationsOverviewPageProps) {
  return (
    <div className="bg-white">
      <EditorialImageHero
        imageSrc={content.heroImage}
        imageAlt="Team and learner engagement across ITFY organisation partnerships"
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        breadcrumbs={[
          { label: breadcrumbs.home, href: "/" },
          { label: breadcrumbs.organisations.root },
        ]}
        ctas={[
          { label: "Start the conversation", href: "/contact" },
          { label: "Explore partnership routes", href: "/partner-with-us", variant: "secondary" },
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
              content.overviewSectionTitle ??
              "A partner route should match the decision the organisation is actually making"
            }
            description={
              content.overviewSectionDescription ??
              "Some teams want internal training. Others want visible mission support, early-career talent, or a meaningful volunteering pathway. The section below helps organisations choose the right starting point instead of flattening everything into one generic partnership pitch."
            }
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {content.valueCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
              >
                <h2 className="font-heading text-2xl font-bold text-brand-ink">
                  {card.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="services"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeading
            eyebrow={content.servicesSectionEyebrow ?? "Service routes"}
            title={
              content.servicesSectionTitle ??
              "Choose the collaboration model that fits your organisation best"
            }
            description={
              content.servicesSectionDescription ??
              "Each service route has a dedicated page with a clearer offer, delivery model, examples, FAQs, and next-step CTA."
            }
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/for-organisations/${service.slug}`}
                className="group overflow-hidden rounded-[32px] border border-brand-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-panel"
              >
                <div className="grid md:grid-cols-[0.42fr_0.58fr]">
                  <div className="relative min-h-[18rem] bg-brand-mist">
                    <Image
                      src={service.heroImage}
                      alt={service.title}
                      fill
                      sizes="(max-width: 767px) 100vw, 35vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/45 via-transparent to-transparent" />
                  </div>

                  <div className="flex flex-col justify-between p-7">
                    <div className="space-y-3">
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
                        {service.eyebrow}
                      </p>
                      <h3 className="font-heading text-3xl font-bold text-brand-ink">
                        {service.title}
                      </h3>
                      <p className="text-sm font-medium leading-7 text-brand-navy">
                        {service.tagline}
                      </p>
                      <p className="text-sm leading-7 text-slate-600">{service.description}</p>
                    </div>

                    <div className="mt-6 space-y-5">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {service.stats.slice(0, 2).map((stat) => (
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
                        Explore service
                        <span className="transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="engagement"
        className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] bg-brand-navy p-8 text-white">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              {content.engagementSectionEyebrow ?? "Engagement model"}
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold sm:text-4xl">
              {content.engagementSectionTitle ??
                "The strongest collaboration is specific, scoped, and easy to act on"}
            </h2>
            <p className="mt-4 text-base leading-8 text-white/78">
              {content.engagementSectionDescription ??
                "Organisations usually move faster when the collaboration route is framed around one immediate decision first. The relationship can still deepen afterwards."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {content.engagementCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[28px] border border-brand-border bg-white p-6 shadow-sm"
              >
                <h3 className="font-heading text-2xl font-bold text-brand-ink">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="next-steps"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeading
            eyebrow={content.nextStepsSectionEyebrow ?? "Next steps"}
            title={
              content.nextStepsSectionTitle ?? "Start with the route that feels most immediate"
            }
            description={
              content.nextStepsSectionDescription ??
              "If you already know the type of collaboration you want, jump into that service page. If you still need help choosing, the contact route is the best next move."
            }
          />

          <RouteCardGrid cards={content.nextSteps} />
        </div>
      </section>
    </div>
  );
}
