import Link from "next/link";
import { breadcrumbs } from "@/lib/content/site-config";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { ProseMediaCardGrid } from "@/components/shared/prose-media-card-grid";
import {
  OrganisationEnquiryForm,
  type OrganisationEnquiryKind,
} from "@/components/organisations/organisation-enquiry-form";
import type { OrganisationServicePage as OrganisationServicePageType } from "@/types/content";

type OrganisationServicePageProps = {
  page: OrganisationServicePageType;
};

function getEnquiryKind(slug: string): OrganisationEnquiryKind | undefined {
  if (slug === "hire-graduates") {
    return "job-vacancy";
  }

  if (slug === "staff-volunteering") {
    return "staff-volunteering";
  }

  return undefined;
}

function getEnquiryCta(kind?: OrganisationEnquiryKind) {
  if (kind === "job-vacancy") {
    return { label: "Submit a vacancy", href: "#submit-vacancy" };
  }

  if (kind === "staff-volunteering") {
    return { label: "Plan staff volunteering", href: "#staff-volunteering-enquiry" };
  }

  return undefined;
}

function buildAnchorLinks(page: OrganisationServicePageType, enquiryKind?: OrganisationEnquiryKind) {
  const links = [
    { id: "overview", label: "Overview" },
    { id: "how-it-works", label: "How It Works" },
    { id: "case-studies", label: "Case Studies" },
  ];

  if (page.packages?.length) {
    links.push({ id: "pricing", label: "Packages" });
  }

  links.push({ id: "faqs", label: "FAQs" });

  if (enquiryKind === "job-vacancy") {
    links.push({ id: "submit-vacancy", label: "Submit a Vacancy" });
  } else if (enquiryKind === "staff-volunteering") {
    links.push({ id: "staff-volunteering-enquiry", label: "Volunteer With Us" });
  }

  links.push({ id: "contact", label: "Contact" });

  return links;
}

export function OrganisationServicePage({ page }: OrganisationServicePageProps) {
  const enquiryKind = getEnquiryKind(page.slug);
  const enquiryCta = getEnquiryCta(enquiryKind);
  const primaryCta = enquiryCta ?? page.contactCta.primary;
  const anchorLinks = buildAnchorLinks(page, enquiryKind);

  return (
    <div className="bg-white">
      <EditorialImageHero
        imageSrc={page.heroImage}
        imageAlt={page.title}
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.tagline}
        supportingText={page.description}
        breadcrumbs={[
          { label: breadcrumbs.home, href: "/" },
          { label: breadcrumbs.organisations.root, href: "/for-organisations" },
          { label: page.title },
        ]}
        ctas={[
          { label: primaryCta.label, href: primaryCta.href },
          { label: "Learn more", href: "#overview", variant: "secondary" },
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
            eyebrow={page.overviewSectionEyebrow ?? "Service overview"}
            title={
              page.overviewSectionTitle ?? "What this route can look like in practice"
            }
            description={
              page.overviewSectionDescription ??
              "The cards below outline the kinds of support, structure, and value this service can create when it is designed around the organisation’s real context."
            }
          />

          <ProseMediaCardGrid
            theme="corporate"
            columns={2}
            breakpoint="md"
            gap="5"
            cards={page.overviewCards
              .filter((card) => card.title?.trim() || card.description?.trim())
              .map((card) => ({
                eyebrow: page.overviewCardBadgeLabel ?? "Service area",
                title: card.title,
                body: card.description,
                points: card.bullets,
                mediaKey: `for-organisations:${page.slug}:ov:${card.title}`,
                media: { iconImage: card.iconImage },
              }))}
          />
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeading
            eyebrow={page.howItWorksSectionEyebrow ?? "How it works"}
            title={
              page.howItWorksSectionTitle ??
              "A clearer engagement sequence helps both sides move faster"
            }
            description={
              page.howItWorksSectionDescription ??
              "Most organisational conversations go better when the steps are explicit early: clarify fit, scope the work, deliver the experience, then decide what the next layer of collaboration should be."
            }
          />

          <ProseMediaCardGrid
            theme="coding"
            columns={4}
            breakpoint="lg"
            gap="5"
            cards={page.howItWorks
              .filter((step) => step.title?.trim() || step.description?.trim())
              .map((step) => ({
                title: step.title,
                body: step.description,
                mediaKey: `for-organisations:${page.slug}:hiw:${step.title}`,
                media: { iconImage: step.iconImage },
              }))}
          />
        </div>
      </section>

      <section
        id="case-studies"
        className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="space-y-8">
          <SectionHeading
            eyebrow={page.caseStudiesSectionEyebrow ?? "Case studies"}
            title={
              page.caseStudiesSectionTitle ??
              "Representative examples of how the engagement can create value"
            }
            description={
              page.caseStudiesSectionDescription ??
              "These are seeded example patterns to show what a strong collaboration can look like in practice even before live case-study publishing is wired into the CMS."
            }
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {page.caseStudies.filter((study) => study.title?.trim() || study.summary?.trim() || study.outcome?.trim()).map((study) => (
              <div
                key={study.title}
                className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
              >
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
                  {study.organisationType}
                </p>
                <h3 className="mt-4 font-heading text-2xl font-bold text-brand-ink">
                  {study.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{study.summary}</p>

                <div className="mt-5 rounded-[24px] bg-brand-mist/55 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Outcome
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{study.outcome}</p>
                </div>

                <p className="mt-5 text-sm font-medium leading-7 text-brand-navy">
                  {study.highlight}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {page.packages?.length ? (
        <section
          id="pricing"
          className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl space-y-8">
            <SectionHeading
              eyebrow={page.packagesSectionEyebrow ?? "Packages"}
              title={page.pricingHeadline ?? "Example package structures"}
              description={
                page.pricingDescription ??
                "These package frames are illustrative and can be refined based on scope, audience, and delivery needs."
              }
            />

            <ProseMediaCardGrid
              theme="entrepreneurship"
              columns={2}
              breakpoint="md"
              gap="5"
              cards={page.packages
                .filter((item) => item.name?.trim() || item.description?.trim())
                .map((item) => {
                  // Tags, not prose points — comma-joined for the same reason as the
                  // instructor roster in course-detail-card.tsx. Passed as `aside`
                  // (not `points`, which would punctuate each 1-3 word tag as its
                  // own sentence) so the feature line keeps its own gold-rule
                  // treatment instead of folding into the prose. Price goes in
                  // `badge`, which gets the navy price-block treatment instead of
                  // reading as a category label the way `eyebrow` would.
                  const featureLine = item.features
                    .map((feature) => feature.trim())
                    .filter(Boolean)
                    .join(", ");

                  return {
                    title: item.name,
                    body: item.description,
                    badge: item.price?.trim() ? { label: "Pricing", value: item.price } : undefined,
                    aside: featureLine || undefined,
                    footnote: item.note?.trim() || undefined,
                    mediaKey: `for-organisations:${page.slug}:pk:${item.name}`,
                  };
                })}
            />
          </div>
        </section>
      ) : null}

      <section id="faqs" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <SectionHeading
            eyebrow={page.faqsSectionEyebrow ?? "FAQs"}
            title={
              page.faqsSectionTitle ??
              "Questions organisations often need answered before moving"
            }
            description={
              page.faqsSectionDescription ??
              "A clear answer early can save a lot of unnecessary back-and-forth. These FAQs cover the most common starting uncertainties."
            }
          />

          <div className="space-y-4">
            {page.faqs.filter((faq) => faq.question?.trim() || faq.answer?.trim()).map((faq) => (
              <details
                key={faq.question}
                className="group rounded-[28px] border border-brand-border bg-white p-6 shadow-sm"
              >
                <summary className="cursor-pointer list-none font-heading text-2xl font-bold text-brand-ink">
                  {faq.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {enquiryKind ? <OrganisationEnquiryForm kind={enquiryKind} /> : null}

      <section
        id="contact"
        className="scroll-mt-36 bg-brand-navy px-4 py-16 text-white sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="space-y-4">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              {page.contactSectionEyebrow ?? "Contact CTA"}
            </p>
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              {page.contactCta.heading}
            </h2>
            <p className="max-w-3xl text-base leading-8 text-white/75">
              {page.contactCta.description}
            </p>
            <a
              href={`mailto:${page.contactCta.email}`}
              className="inline-flex text-sm font-semibold text-brand-gold transition hover:text-white"
            >
              {page.contactCta.email}
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={primaryCta.href}
              className="rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              {primaryCta.label}
            </Link>
            <Link
              href={page.contactCta.secondary.href}
              className="rounded-full border border-white/18 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/15"
            >
              {page.contactCta.secondary.label}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <SectionHeading
            eyebrow={page.relatedSectionEyebrow ?? "Related routes"}
            title={page.relatedSectionTitle ?? "Keep the collaboration moving"}
            description={
              page.relatedSectionDescription ??
              "These adjacent routes often become the next useful conversation once the first collaboration shape is clear."
            }
          />

          <RouteCardGrid cards={page.related} />
        </div>
      </section>
    </div>
  );
}
