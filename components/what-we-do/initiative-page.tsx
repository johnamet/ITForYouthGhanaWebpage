import Image from "next/image";
import Link from "next/link";

import { InitiativeGallery } from "@/components/what-we-do/initiative-gallery";
import { emojiToIconImage } from "@/lib/utils/icon-map";
import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import type { InitiativePage } from "@/types/content";
import { AlternatingFeatureRow } from "@/components/shared/alternating-feature-row";

type InitiativePageTemplateProps = {
  page: InitiativePage;
};

const hasText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

function buildShareLinks(page: InitiativePage) {
  const url = `https://itforyouthghana.org/what-we-do/${page.slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(page.title);

  return [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: "Twitter/X",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: "Email",
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
  ];
}

export function InitiativePageTemplate({ page }: InitiativePageTemplateProps) {
  const section = page.sectionContent;
  const shareLinks = buildShareLinks(page);
  const objectives = page.objectives.filter(hasText);
  const howItWorks = page.howItWorks.filter(
    (step) => hasText(step.title) || hasText(step.description),
  );
  const impactStats = page.impactStats.filter(
    (stat) => hasText(stat.value) || hasText(stat.label) || hasText(stat.description),
  );
  const audienceGroups = page.audience.groups.filter(hasText);
  const eligibility = page.audience.eligibility.filter(hasText);
  const gallery = page.gallery.filter((image) => hasText(image.src));
  const testimonials = page.testimonials.filter(
    (testimonial) =>
      hasText(testimonial.quote) || hasText(testimonial.name) || hasText(testimonial.role),
  );
  const partners = page.partners.filter(
    (partner) => hasText(partner.name) || hasText(partner.description),
  );
  const faqs = page.faqs.filter((faq) => hasText(faq.question) || hasText(faq.answer));
  const hasOverview =
    hasText(page.intro) || hasText(page.mission) || objectives.length > 0 || hasText(page.overviewImage);
  const hasAudience =
    hasText(page.audience.summary) || audienceGroups.length > 0 || eligibility.length > 0;
  const hasApplyCta =
    hasText(page.applyCta.heading) ||
    hasText(page.applyCta.description) ||
    (hasText(page.applyCta.primary.label) && hasText(page.applyCta.primary.href)) ||
    (hasText(page.applyCta.secondary.label) && hasText(page.applyCta.secondary.href));
  const anchorLinks = [
    hasOverview && hasText(section.overviewEyebrow) ? { id: "overview", label: section.overviewEyebrow } : null,
    howItWorks.length && hasText(section.howItWorksEyebrow) ? { id: "how-it-works", label: section.howItWorksEyebrow } : null,
    impactStats.length && hasText(section.impactEyebrow) ? { id: "impact", label: section.impactEyebrow } : null,
    hasAudience && hasText(section.audienceEyebrow) ? { id: "who-its-for", label: section.audienceEyebrow } : null,
    gallery.length && hasText(section.galleryEyebrow) ? { id: "gallery", label: section.galleryEyebrow } : null,
    testimonials.length && hasText(section.testimonialsEyebrow) ? { id: "testimonials", label: section.testimonialsEyebrow } : null,
    faqs.length && hasText(section.faqsEyebrow) ? { id: "faqs", label: section.faqsEyebrow } : null,
  ].filter((link): link is { id: string; label: string } => link !== null);

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
          { label: "Home", href: "/" },
          { label: "What We Do", href: "/what-we-do" },
          { label: page.title },
        ]}
        ctas={page.ctas.map((cta, index) => ({
          ...cta,
          variant: index === 0 ? "primary" as const : "secondary" as const,
        }))}
        priority
      />

      {anchorLinks.length ? <div className="sticky top-[72px] z-30 border-y border-brand-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-4 [scrollbar-width:none] sm:px-6 lg:px-8">
          {anchorLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="whitespace-nowrap rounded-full border border-brand-border px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-accent hover:text-brand-ink"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div> : null}

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_18rem] lg:px-8">
        <div className="space-y-14">
          {hasOverview ? <section id="overview" className="scroll-mt-36">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div className="space-y-6">
                {hasText(page.intro) ? <SectionHeading
                  eyebrow={section.overviewEyebrow}
                  title={section.overviewTitle}
                  description={page.intro}
                /> : null}
                {hasText(page.mission) ? <p className="text-base leading-8 text-slate-700">{page.mission}</p> : null}
                {objectives.length ? <div className="grid gap-3">
                  {objectives.map((objective) => (
                    <div
                      key={objective}
                      className="rounded-[22px] border border-brand-border bg-brand-mist/60 px-5 py-4 text-sm leading-7 text-slate-700"
                    >
                      {objective}
                    </div>
                  ))}
                </div> : null}
              </div>

              {hasText(page.overviewImage) ? <div className="relative min-h-[24rem] overflow-hidden rounded-[32px] bg-brand-mist">
                <Image
                  src={page.overviewImage}
                  alt={section.overviewImageAlt || page.title}
                  fill
                  sizes="(max-width: 1023px) 100vw, 45vw"
                  className="object-cover"
                />
              </div> : null}
            </div>
          </section> : null}

          {howItWorks.length ? <section id="how-it-works" className="scroll-mt-36">
            <SectionHeading
              eyebrow={section.howItWorksEyebrow}
              title={section.howItWorksTitle}
              description={section.howItWorksDescription}
            />
            <div className="mt-8">
              <AlternatingFeatureRow
                items={howItWorks.map((step) => ({
                  title: step.title,
                  description: step.description,
                  number: step.number,
                  // Prefer a richer image if provided on the step; else fallback to iconImage, else emoji-derived image
                  image: undefined,
                  iconImage: step.iconImage ?? (emojiToIconImage(step.icon) || undefined),
                  icon: step.icon,
                  imageAlt: step.title,
                }))}
              />
            </div>
          </section> : null}

          {impactStats.length ? <section id="impact" className="scroll-mt-36">
            <SectionHeading
              eyebrow={section.impactEyebrow}
              title={section.impactTitle}
              description={section.impactDescription}
            />
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {impactStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[30px] border border-brand-border bg-brand-mist/45 p-6"
                >
                  {(() => stat.iconImage ?? emojiToIconImage(stat.icon))() ? (
                    <span className="inline-flex items-center justify-center" aria-hidden="true">
                      <Image src={(stat.iconImage ?? emojiToIconImage(stat.icon)) as string} alt={stat.label} width={28} height={28} className="h-7 w-7 object-contain" />
                    </span>
                  ) : stat.icon ? (
                    <span className="text-2xl" aria-hidden="true">
                      {stat.icon}
                    </span>
                  ) : null}
                  {hasText(stat.value) ? <p className="mt-4 font-heading text-4xl font-bold text-brand-deep">
                    {stat.value}
                  </p> : null}
                  {hasText(stat.label) ? <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand-ink">
                    {stat.label}
                  </p> : null}
                  {stat.description ? (
                    <p className="mt-3 text-sm leading-7 text-slate-600">{stat.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section> : null}

          {hasAudience ? <section id="who-its-for" className="scroll-mt-36">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              {hasText(page.audience.summary) || audienceGroups.length ? <div className="rounded-[32px] bg-brand-deep p-8 text-white">
                {hasText(section.audienceEyebrow) ? <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-accent">
                  {section.audienceEyebrow}
                </p> : null}
                {hasText(page.audience.summary) ? <p className="mt-5 text-lg leading-8 text-white/85">{page.audience.summary}</p> : null}
                {audienceGroups.length ? <div className="mt-8 grid gap-3">
                  {audienceGroups.map((group) => (
                    <div
                      key={group}
                      className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4 text-sm leading-7 text-white/82"
                    >
                      {group}
                    </div>
                  ))}
                </div> : null}
              </div> : null}

              {eligibility.length ? <div className="rounded-[32px] border border-brand-border bg-white p-8 shadow-sm">
                {hasText(section.eligibilityEyebrow) ? <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-accent">
                  {section.eligibilityEyebrow}
                </p> : null}
                <div className="mt-6 space-y-4">
                  {eligibility.map((item) => (
                    <div
                      key={item}
                      className="rounded-[22px] border border-brand-border bg-brand-mist/45 px-4 py-4 text-sm leading-7 text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div> : null}
            </div>
          </section> : null}

          {gallery.length ? <section id="gallery" className="scroll-mt-36 space-y-8">
            <SectionHeading
              eyebrow={section.galleryEyebrow}
              title={section.galleryTitle}
              description={section.galleryDescription}
            />
            <InitiativeGallery images={gallery} />
          </section> : null}

          {testimonials.length ? <section id="testimonials" className="scroll-mt-36 space-y-8">
            <SectionHeading
              eyebrow={section.testimonialsEyebrow}
              title={section.testimonialsTitle}
              description={section.testimonialsDescription}
            />
            <div className="grid gap-5 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={`${testimonial.name}-${testimonial.role}`}
                  className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm"
                >
                  <p className="font-heading text-4xl leading-none text-brand-accent/35">&ldquo;</p>
                  {hasText(testimonial.quote) ? <blockquote className="mt-3 text-sm leading-8 text-slate-700">
                    {testimonial.quote}
                  </blockquote> : null}
                  {hasText(testimonial.name) || hasText(testimonial.role) || hasText(testimonial.avatar) ? <div className="mt-6 flex items-center gap-4">
                    {hasText(testimonial.avatar) ? <div className="relative h-14 w-14 overflow-hidden rounded-full bg-brand-mist">
                      {(
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      )}
                    </div> : null}
                    <div>
                      {hasText(testimonial.name) ? <p className="font-semibold text-brand-ink">{testimonial.name}</p> : null}
                      {hasText(testimonial.role) ? <p className="text-sm text-slate-500">{testimonial.role}</p> : null}
                    </div>
                  </div> : null}
                </div>
              ))}
            </div>
          </section> : null}

          {partners.length ? <section className="space-y-8">
            <SectionHeading
              eyebrow={section.partnersEyebrow}
              title={section.partnersTitle}
              description={section.partnersDescription}
            />
            <div className="grid gap-5 md:grid-cols-2">
              {partners.map((partner) => (
                <div
                  key={partner.name}
                  className="flex gap-4 rounded-[28px] border border-brand-border bg-white p-6 shadow-sm"
                >
                  {hasText(partner.logo) || hasText(partner.name) ? <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-mist text-sm font-bold text-brand-deep">
                    {hasText(partner.logo) ? (
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        width={44}
                        height={44}
                        className="h-11 w-11 object-contain"
                      />
                    ) : (
                      partner.name.slice(0, 2).toUpperCase()
                    )}
                  </div> : null}
                  <div>
                    {hasText(partner.name) ? <p className="font-semibold text-brand-ink">{partner.name}</p> : null}
                    {hasText(partner.description) ? <p className="mt-2 text-sm leading-7 text-slate-600">
                      {partner.description}
                    </p> : null}
                    {hasText(partner.href) && hasText(section.partnerLinkLabel) ? (
                      <Link
                        href={partner.href}
                        className="mt-3 inline-flex text-sm font-semibold text-brand-deep"
                      >
                        {section.partnerLinkLabel}
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section> : null}

          {faqs.length ? <section id="faqs" className="scroll-mt-36 space-y-8">
            <SectionHeading
              eyebrow={section.faqsEyebrow}
              title={section.faqsTitle}
              description={section.faqsDescription}
            />
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-[26px] border border-brand-border bg-white px-6 py-5 shadow-sm"
                >
                  {hasText(faq.question) ? <summary className="cursor-pointer list-none pr-8 font-semibold text-brand-ink">
                    {faq.question}
                  </summary> : null}
                  {hasText(faq.answer) ? <p className="mt-4 text-sm leading-7 text-slate-600">{faq.answer}</p> : null}
                </details>
              ))}
            </div>
          </section> : null}

          {hasApplyCta ? <section className="overflow-hidden rounded-[36px] bg-brand-deep px-8 py-10 text-white">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                {hasText(section.applyCtaEyebrow) ? <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-accent">
                  {section.applyCtaEyebrow}
                </p> : null}
                {hasText(page.applyCta.heading) ? <h2 className="mt-4 font-heading text-3xl font-bold leading-tight">
                  {page.applyCta.heading}
                </h2> : null}
                {hasText(page.applyCta.description) ? <p className="mt-4 max-w-2xl text-base leading-8 text-white/75">
                  {page.applyCta.description}
                </p> : null}
              </div>
              <div className="flex flex-wrap gap-3">
                {hasText(page.applyCta.primary.label) && hasText(page.applyCta.primary.href) ? <Link
                  href={page.applyCta.primary.href}
                  className="rounded-full bg-brand-accent px-6 py-3.5 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {page.applyCta.primary.label}
                </Link> : null}
                {hasText(page.applyCta.secondary.label) && hasText(page.applyCta.secondary.href) ? <Link
                  href={page.applyCta.secondary.href}
                  className="rounded-full border border-white/18 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  {page.applyCta.secondary.label}
                </Link> : null}
              </div>
            </div>
          </section> : null}

          {page.related.length ? (
            <section className="space-y-8">
              <SectionHeading
                eyebrow={section.relatedEyebrow}
                title={section.relatedTitle}
                description={section.relatedDescription}
              />
              <RouteCardGrid cards={page.related} />
            </section>
          ) : null}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-36 space-y-6 rounded-[30px] border border-brand-border bg-brand-mist/35 p-6">
            <div>
              {hasText(section.shareEyebrow) ? <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-accent">
                {section.shareEyebrow}
              </p> : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {shareLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-brand-border bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-accent hover:text-brand-ink"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {page.quickLinks.length ? <div>
              {hasText(section.quickLinksEyebrow) ? <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-accent">
                {section.quickLinksEyebrow}
              </p> : null}
              <div className="mt-4 space-y-3">
                {page.quickLinks.filter((link) => hasText(link.label) && hasText(link.href)).map((link) => (
                  <Link key={`${link.href}-${link.label}`} href={link.href} className="block text-sm font-medium text-brand-deep">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div> : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
