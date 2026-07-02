import Image from "next/image";
import Link from "next/link";
import { breadcrumbs } from "@/lib/content/site-config";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import type { PartnershipTrackPage as PartnershipTrackPageType } from "@/types/content";

type PartnershipTrackPageProps = {
  page: PartnershipTrackPageType;
};

const anchorLinks = [
  { id: "overview", label: "Overview" },
  { id: "how-it-works", label: "How It Works" },
  { id: "scenarios", label: "Examples" },
  { id: "faqs", label: "FAQs" },
  { id: "contact", label: "Contact" },
];

export function PartnershipTrackPage({ page }: PartnershipTrackPageProps) {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <Image
            src={page.heroImage}
            alt={page.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,27,52,0.9)_0%,rgba(10,27,52,0.76)_44%,rgba(10,27,52,0.4)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <nav
            aria-label="Breadcrumb"
            className="mb-10 flex flex-wrap items-center gap-2 text-sm text-white/70"
          >
            <Link href="/" className="transition hover:text-white">
              {breadcrumbs.home}
            </Link>
            <span>/</span>
            <Link href="/partner-with-us" className="transition hover:text-white">
              {breadcrumbs.partnerships.root}
            </Link>
            <span>/</span>
            <span className="text-white">{page.title}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                {page.eyebrow}
              </p>
              <h1 className="max-w-4xl font-heading text-5xl font-bold leading-tight sm:text-6xl">
                {page.title}
              </h1>
              <p className="max-w-3xl text-xl leading-8 text-slate-100">{page.tagline}</p>
              <p className="max-w-3xl text-base leading-8 text-white/80">{page.description}</p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href={page.contactCta.primary.href}
                  className="rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {page.contactCta.primary.label}
                </Link>
                <a
                  href="#overview"
                  className="rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/15"
                >
                  Learn more
                </a>
              </div>
            </div>

            <div className="rounded-[32px] border border-white/12 bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
                {page.snapshotEyebrow ?? "Partnership snapshot"}
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {page.stats.map((stat) => (
                  <div key={stat.label} className="rounded-[24px] bg-white/8 p-4">
                    <p className="font-heading text-3xl font-bold text-white">{stat.value}</p>
                    <p className="mt-2 text-sm font-semibold text-white">{stat.label}</p>
                    {stat.description ? (
                      <p className="mt-2 text-sm leading-6 text-white/65">{stat.description}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

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
            eyebrow={page.overviewSectionEyebrow ?? "Partnership overview"}
            title={
              page.overviewSectionTitle ??
              "Where this track creates the most practical value"
            }
            description={
              page.overviewSectionDescription ??
              "The cards below outline the strengths, collaboration models, and ecosystem value that tend to make this partner track especially useful."
            }
          />

          <div className="grid gap-5 md:grid-cols-2">
            {page.focusCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl" aria-hidden="true">
                    {card.icon}
                  </span>
                  <span className="rounded-full bg-brand-mist/70 px-3 py-1 text-xs font-semibold text-brand-navy">
                    {page.overviewCardBadgeLabel ?? "Focus area"}
                  </span>
                </div>
                <h2 className="mt-5 font-heading text-2xl font-bold text-brand-ink">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
                <div className="mt-5 space-y-3">
                  {card.bullets.map((bullet) => (
                    <div
                      key={bullet}
                      className="rounded-[22px] border border-brand-border bg-brand-mist/45 px-4 py-4 text-sm leading-7 text-slate-700"
                    >
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
              "A clearer partnership sequence helps both sides move with more confidence"
            }
            description={
              page.howItWorksSectionDescription ??
              "The strongest partnerships usually begin with fit and role clarity, then move into a scoped collaboration that can grow once trust and value are visible."
            }
          />

          <div className="grid gap-5 lg:grid-cols-4">
            {page.howItWorks.map((step) => (
              <div
                key={step.number}
                className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl" aria-hidden="true">
                    {step.icon}
                  </span>
                  <span className="font-heading text-3xl font-bold text-brand-gold/70">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-2xl font-bold text-brand-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="scenarios"
        className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="space-y-8">
          <SectionHeading
            eyebrow={page.scenariosSectionEyebrow ?? "Example scenarios"}
            title={
              page.scenariosSectionTitle ??
              "Representative patterns of how this track can work in practice"
            }
            description={
              page.scenariosSectionDescription ??
              "These are seeded examples that show the shape of a strong collaboration before live case-study publishing is wired into the CMS."
            }
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {page.scenarios.map((scenario) => (
              <div
                key={scenario.title}
                className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
              >
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
                  {scenario.partnerType}
                </p>
                <h3 className="mt-4 font-heading text-2xl font-bold text-brand-ink">
                  {scenario.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{scenario.summary}</p>

                <div className="mt-5 rounded-[24px] bg-brand-mist/55 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Outcome
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-700">{scenario.outcome}</p>
                </div>

                <p className="mt-5 text-sm font-medium leading-7 text-brand-navy">
                  {scenario.highlight}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faqs" className="bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeading
            eyebrow={page.faqsSectionEyebrow ?? "FAQs"}
            title={
              page.faqsSectionTitle ??
              "Questions partners often need answered before they commit"
            }
            description={
              page.faqsSectionDescription ??
              "A clearer answer early usually removes more friction than a longer generic pitch. These FAQs address the most common starting uncertainties."
            }
          />

          <div className="space-y-4">
            {page.faqs.map((faq) => (
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
              href={page.contactCta.primary.href}
              className="rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              {page.contactCta.primary.label}
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
            title={page.relatedSectionTitle ?? "Keep the partnership conversation moving"}
            description={
              page.relatedSectionDescription ??
              "These adjacent routes often become the next useful step once the first partnership shape is clearer."
            }
          />

          <RouteCardGrid cards={page.related} />
        </div>
      </section>
    </div>
  );
}
