import Image from "next/image";
import Link from "next/link";

import { InitiativeGallery } from "@/components/what-we-do/initiative-gallery";
import { emojiToIconImage } from "@/lib/utils/icon-map";
import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import type { InitiativePage } from "@/types/content";

type InitiativePageTemplateProps = {
  page: InitiativePage;
};

const anchorLinks = [
  { id: "overview", label: "Overview" },
  { id: "how-it-works", label: "How It Works" },
  { id: "impact", label: "Impact" },
  { id: "who-its-for", label: "Who It's For" },
  { id: "gallery", label: "Gallery" },
  { id: "testimonials", label: "Testimonials" },
  { id: "faqs", label: "FAQs" },
];

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
  const shareLinks = buildShareLinks(page);

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
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,45,90,0.9)_0%,rgba(12,45,90,0.75)_42%,rgba(12,45,90,0.38)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <nav
            aria-label="Breadcrumb"
            className="mb-10 flex flex-wrap items-center gap-2 text-sm text-white/70"
          >
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/what-we-do" className="transition hover:text-white">
              What We Do
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
                  href="/apply-for-training"
                  className="rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Apply now
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
                Initiative snapshot
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

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_18rem] lg:px-8">
        <div className="space-y-14">
          <section id="overview" className="scroll-mt-36">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
              <div className="space-y-6">
                <SectionHeading
                  eyebrow="Overview"
                  title="A focused pathway with clear outcomes"
                  description={page.intro}
                />
                <p className="text-base leading-8 text-slate-700">{page.mission}</p>
                <div className="grid gap-3">
                  {page.objectives.map((objective) => (
                    <div
                      key={objective}
                      className="rounded-[22px] border border-brand-border bg-brand-mist/60 px-5 py-4 text-sm leading-7 text-slate-700"
                    >
                      {objective}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[24rem] overflow-hidden rounded-[32px] bg-brand-mist">
                <Image
                  src={page.overviewImage}
                  alt={`${page.title} overview`}
                  fill
                  sizes="(max-width: 1023px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>
          </section>

          <section id="how-it-works" className="scroll-mt-36">
            <SectionHeading
              eyebrow="How it works"
              title="A programme journey that moves from access to confidence"
              description="Each initiative uses a clear process so participants and partners know what to expect from first contact to measurable outcomes."
            />
            <div className="mt-8 grid gap-5 lg:grid-cols-4">
              {page.howItWorks.map((step) => (
                <div
                  key={step.number}
                  className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    {(() => step.iconImage ?? emojiToIconImage(step.icon))() ? (
                      <span className="inline-flex items-center justify-center" aria-hidden="true">
                        <Image src={(step.iconImage ?? emojiToIconImage(step.icon)) as string} alt={step.title} width={28} height={28} className="h-7 w-7 object-contain" />
                      </span>
                    ) : (
                      <span className="text-3xl" aria-hidden="true">
                        {step.icon}
                      </span>
                    )}
                    <span className="font-heading text-3xl font-bold text-brand-gold/70">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-5 font-heading text-2xl font-bold text-brand-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="impact" className="scroll-mt-36">
            <SectionHeading
              eyebrow="Impact stats"
              title="Proof that the model is translating into real opportunity"
              description="These indicators help show who the initiative is reaching, how consistently it is delivering, and why it matters."
            />
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {page.impactStats.map((stat) => (
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
                  <p className="mt-4 font-heading text-4xl font-bold text-brand-navy">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand-ink">
                    {stat.label}
                  </p>
                  {stat.description ? (
                    <p className="mt-3 text-sm leading-7 text-slate-600">{stat.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section id="who-its-for" className="scroll-mt-36">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[32px] bg-brand-navy p-8 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                  Who it&apos;s for
                </p>
                <p className="mt-5 text-lg leading-8 text-white/85">{page.audience.summary}</p>
                <div className="mt-8 grid gap-3">
                  {page.audience.groups.map((group) => (
                    <div
                      key={group}
                      className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4 text-sm leading-7 text-white/82"
                    >
                      {group}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-brand-border bg-white p-8 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                  Eligibility
                </p>
                <div className="mt-6 space-y-4">
                  {page.audience.eligibility.map((item) => (
                    <div
                      key={item}
                      className="rounded-[22px] border border-brand-border bg-brand-mist/45 px-4 py-4 text-sm leading-7 text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="gallery" className="scroll-mt-36 space-y-8">
            <SectionHeading
              eyebrow="Gallery"
              title="Scenes from the classrooms, workshops, and communities behind the work"
              description="The gallery is seeded with local images now and is ready for a future CMS-backed upload and reordering flow."
            />
            <InitiativeGallery images={page.gallery} />
          </section>

          <section id="testimonials" className="scroll-mt-36 space-y-8">
            <SectionHeading
              eyebrow="Testimonials"
              title="Stories that show what this initiative feels like from the inside"
              description="Participant and partner voices add the context that numbers alone cannot carry."
            />
            <div className="grid gap-5 lg:grid-cols-3">
              {page.testimonials.map((testimonial) => (
                <div
                  key={`${testimonial.name}-${testimonial.role}`}
                  className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm"
                >
                  <p className="font-heading text-4xl leading-none text-brand-gold/35">&ldquo;</p>
                  <blockquote className="mt-3 text-sm leading-8 text-slate-700">
                    {testimonial.quote}
                  </blockquote>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full bg-brand-mist">
                      {testimonial.avatar ? (
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="font-semibold text-brand-ink">{testimonial.name}</p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <SectionHeading
              eyebrow="Partners & sponsors"
              title="Organisations that help this initiative reach further"
              description="These partnership routes are represented with seeded data now and can later connect to a richer partner CMS."
            />
            <div className="grid gap-5 md:grid-cols-2">
              {page.partners.map((partner) => (
                <div
                  key={partner.name}
                  className="flex gap-4 rounded-[28px] border border-brand-border bg-white p-6 shadow-sm"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-mist text-sm font-bold text-brand-navy">
                    {partner.logo ? (
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
                  </div>
                  <div>
                    <p className="font-semibold text-brand-ink">{partner.name}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {partner.description}
                    </p>
                    {partner.href ? (
                      <Link
                        href={partner.href}
                        className="mt-3 inline-flex text-sm font-semibold text-brand-navy"
                      >
                        Learn more
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="faqs" className="scroll-mt-36 space-y-8">
            <SectionHeading
              eyebrow="FAQs"
              title="Answers to common questions about the initiative"
              description="These are seeded FAQs for the rebuild phase and map cleanly to the future CMS model."
            />
            <div className="space-y-4">
              {page.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-[26px] border border-brand-border bg-white px-6 py-5 shadow-sm"
                >
                  <summary className="cursor-pointer list-none pr-8 font-semibold text-brand-ink">
                    {faq.question}
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-[36px] bg-brand-navy px-8 py-10 text-white">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                  Apply CTA
                </p>
                <h2 className="mt-4 font-heading text-3xl font-bold leading-tight">
                  {page.applyCta.heading}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-white/75">
                  {page.applyCta.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={page.applyCta.primary.href}
                  className="rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  {page.applyCta.primary.label}
                </Link>
                <Link
                  href={page.applyCta.secondary.href}
                  className="rounded-full border border-white/18 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  {page.applyCta.secondary.label}
                </Link>
              </div>
            </div>
          </section>

          {page.related.length ? (
            <section className="space-y-8">
              <SectionHeading
                eyebrow="Related routes"
                title="Keep exploring the wider work around this initiative"
                description="These next links help visitors move into training, partnership, and impact routes without losing context."
              />
              <RouteCardGrid cards={page.related} />
            </section>
          ) : null}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-36 space-y-6 rounded-[30px] border border-brand-border bg-brand-mist/35 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                Share this page
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {shareLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-brand-border bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-gold hover:text-brand-ink"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                Quick routes
              </p>
              <div className="mt-4 space-y-3">
                <Link href="/apply-for-training" className="block text-sm font-medium text-brand-navy">
                  Apply for training
                </Link>
                <Link href="/partner-with-us" className="block text-sm font-medium text-brand-navy">
                  Partner with us
                </Link>
                <Link href="/our-impact/reports" className="block text-sm font-medium text-brand-navy">
                  See our impact
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
