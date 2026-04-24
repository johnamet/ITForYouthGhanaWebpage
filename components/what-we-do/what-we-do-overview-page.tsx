import Image from "next/image";
import Link from "next/link";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import type { InitiativePage, RouteCard } from "@/types/content";

type WhatWeDoOverviewPageProps = {
  initiatives: InitiativePage[];
};

const anchorLinks = [
  { id: "overview", label: "Overview" },
  { id: "initiatives", label: "Initiatives" },
  { id: "pathways", label: "Pathways" },
  { id: "next-steps", label: "Next Steps" },
];

const ecosystemCards = [
  {
    eyebrow: "Access",
    title: "We widen the front door into digital opportunity",
    description:
      "Community outreach, school clubs, and regional activation work help more young people encounter technology in ways that feel relevant and reachable.",
  },
  {
    eyebrow: "Training",
    title: "We turn curiosity into practical capability",
    description:
      "Structured learning pathways, challenge formats, and focused inclusion initiatives help participants move from first contact to real competence.",
  },
  {
    eyebrow: "Transition",
    title: "We connect learning to longer-term outcomes",
    description:
      "Entrepreneurship, employability, partner routes, and advocacy work help carry the impact of training into communities, institutions, and careers.",
  },
];

const pathwayCards = [
  {
    title: "Discover",
    description:
      "Community Outreach, Rural Tech Connect, and Tech Clubs bring more learners into the ecosystem early and repeatedly.",
  },
  {
    title: "Develop",
    description:
      "Girls in Tech and Youth Tech Academy create the confidence, discipline, and practical skill needed for deeper progress.",
  },
  {
    title: "Apply",
    description:
      "Code Impact Challenge and Entrepreneurship Hub help learners test their skills in public, collaborative, and venture-facing formats.",
  },
  {
    title: "Amplify",
    description:
      "Advocacy and partner-facing work help ensure the wider ecosystem keeps making youth digital opportunity more possible.",
  },
];

const nextStepCards: RouteCard[] = [
  {
    href: "/apply-for-training",
    eyebrow: "Apply",
    title: "Apply for Training",
    description:
      "Move from exploration into the right learning route for your stage, interests, and goals.",
  },
  {
    href: "/partner-with-us",
    eyebrow: "Partner",
    title: "Partner With Us",
    description:
      "Support delivery, mentoring, sponsorship, and expansion across the initiative ecosystem.",
  },
  {
    href: "/our-impact/reports",
    eyebrow: "Impact",
    title: "See Our Impact",
    description:
      "Explore how the initiative portfolio connects to measurable outcomes and wider mission credibility.",
  },
];

export function WhatWeDoOverviewPage({ initiatives }: WhatWeDoOverviewPageProps) {
  const liveRoutes = initiatives.length;
  const totalGalleryImages = initiatives.reduce(
    (count, initiative) => count + initiative.gallery.length,
    0,
  );
  const totalTestimonials = initiatives.reduce(
    (count, initiative) => count + initiative.testimonials.length,
    0,
  );
  const totalPartners = initiatives.reduce(
    (count, initiative) => count + initiative.partners.length,
    0,
  );

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/randomPictures/groupworkstudents.jpg"
            alt="IT For Youth Ghana initiative overview"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(12,45,90,0.92)_0%,rgba(12,45,90,0.78)_42%,rgba(12,45,90,0.45)_100%)]" />
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
            <span className="text-white">What We Do</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                What we do
              </p>
              <h1 className="max-w-4xl font-heading text-5xl font-bold leading-tight sm:text-6xl">
                Eight initiatives, one connected mission to expand youth digital opportunity
              </h1>
              <p className="max-w-3xl text-xl leading-8 text-slate-100">
                Our work is designed as an ecosystem, not a set of isolated projects. Each
                initiative supports a different stage of the journey from first exposure to
                long-term opportunity.
              </p>
              <p className="max-w-3xl text-base leading-8 text-white/80">
                This page is the public overview of that ecosystem. It helps learners,
                funders, schools, employers, and partners understand how the initiatives fit
                together and where they can enter the work.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/apply-for-training"
                  className="rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Apply for training
                </Link>
                <Link
                  href="/partner-with-us"
                  className="rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/15"
                >
                  Partner with us
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  value: String(liveRoutes),
                  label: "Live initiative routes",
                  description: "Dedicated public pages now structured for deeper storytelling.",
                },
                {
                  value: String(totalGalleryImages),
                  label: "Seeded gallery images",
                  description: "Local visuals already mapped into the initiative experience.",
                },
                {
                  value: String(totalTestimonials),
                  label: "Initiative testimonials",
                  description: "Learner, facilitator, and partner voices across the portfolio.",
                },
                {
                  value: String(totalPartners),
                  label: "Partner references",
                  description: "Examples of the organisations and routes that support this work.",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[28px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm"
                >
                  <p className="font-heading text-4xl font-bold text-white">{stat.value}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{stat.label}</p>
                  <p className="mt-2 text-sm leading-7 text-white/65">{stat.description}</p>
                </div>
              ))}
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
            eyebrow="Overview"
            title="The work is designed as a connected system"
            description="We do not treat access, training, entrepreneurship, and advocacy as separate silos. The strongest outcomes happen when these pieces reinforce each other."
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {ecosystemCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
              >
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
                  {card.eyebrow}
                </p>
                <h2 className="mt-4 font-heading text-2xl font-bold text-brand-ink">
                  {card.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="initiatives"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeading
            eyebrow="Initiatives"
            title="Explore each initiative in more depth"
            description="Every initiative page now has a dedicated structure with galleries, FAQs, testimonials, partner references, and a stronger narrative arc."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {initiatives.map((initiative) => (
              <Link
                key={initiative.slug}
                href={`/what-we-do/${initiative.slug}`}
                className="group overflow-hidden rounded-[32px] border border-brand-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-panel"
              >
                <div className="grid md:grid-cols-[0.42fr_0.58fr]">
                  <div className="relative min-h-[18rem] bg-brand-mist">
                    <Image
                      src={initiative.heroImage}
                      alt={initiative.title}
                      fill
                      sizes="(max-width: 767px) 100vw, 35vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
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
            ))}
          </div>
        </div>
      </section>

      <section id="pathways" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-10">
          <SectionHeading
            eyebrow="Pathways"
            title="From first exposure to longer-term opportunity"
            description="The strongest version of this work helps a learner move forward over time, not just attend one moment. These pathways show how the portfolio supports that progression."
          />

          <div className="grid gap-5 lg:grid-cols-4">
            {pathwayCards.map((card, index) => (
              <div
                key={card.title}
                className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
              >
                <p className="font-heading text-4xl font-bold text-brand-gold/70">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 font-heading text-2xl font-bold text-brand-ink">
                  {card.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="next-steps" className="scroll-mt-36 bg-brand-navy px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="space-y-3">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              Next steps
            </p>
            <h2 className="max-w-3xl font-heading text-3xl font-bold leading-snug text-white sm:text-4xl">
              Choose the right entry point into the work
            </h2>
            <p className="max-w-3xl text-[0.95rem] leading-[1.8] text-white/70">
              Whether you are a learner, partner, or supporter, the next move should
              feel clear from here.
            </p>
          </div>
          <RouteCardGrid cards={nextStepCards} />
        </div>
      </section>
    </div>
  );
}
