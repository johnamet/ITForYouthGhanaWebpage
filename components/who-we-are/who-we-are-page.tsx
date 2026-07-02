import Image from "next/image";
import Link from "next/link";
import { breadcrumbs } from "@/lib/content/site-config";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  HeartHandshake,
  Layers3,
  Quote,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import type { SitePage } from "@/types/content";

type WhoWeArePageProps = {
  page: SitePage;
};

const anchorLinks = [
  { id: "overview", label: "Overview" },
  { id: "model", label: "Operating Model" },
  { id: "principles", label: "Principles" },
  { id: "routes", label: "Explore" },
];

const heroImage = "/images/randomPictures/groupworkstudents.jpg";
const storyImage = "/images/randomPictures/studentpresenting.jpg";
const principlesImage = "/images/randomPictures/mireiotalking.jpg";

const operatingIcons = [Layers3, Compass, HeartHandshake];

function isPresent<T>(value: T | null | undefined): value is T {
  return Boolean(value);
}

export function WhoWeArePage({ page }: WhoWeArePageProps) {
  const [primaryCta, secondaryCta] = page.ctas;
  const [
    leadSection,
    deliverySection,
    transparencySection,
    partnershipSection,
    principlesLeadSection,
    ...remainingSections
  ] = page.sections;
  const operatingSections = [deliverySection, transparencySection, partnershipSection].filter(
    isPresent,
  );
  const principleSections = [principlesLeadSection, ...remainingSections].filter(isPresent);
  const statCards = page.stats.slice(0, 4);

  return (
    <div className="overflow-hidden bg-white text-brand-ink">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="IT For Youth Ghana learners collaborating during a training session"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,23,42,0.96)_0%,rgba(37,99,235,0.84)_48%,rgba(15,23,42,0.42)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(245,158,11,0.26),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.16),transparent_24%)]" />
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
            <span className="text-white">{breadcrumbs.whoWeAre?.root ?? "Who We Are"}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div className="space-y-7">
              <p className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-brand-gold backdrop-blur-sm">
                {page.eyebrow}
              </p>
              <div className="space-y-5">
                <h1 className="max-w-4xl font-heading text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">
                  {page.title}
                </h1>
                <p className="max-w-3xl text-xl leading-9 text-slate-100">
                  {page.description}
                </p>
                <p className="max-w-3xl text-base leading-8 text-white/76">{page.intro}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {primaryCta ? (
                  <Link
                    href={primaryCta.href}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-gold px-6 py-3.5 text-sm font-bold text-brand-ink transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    {primaryCta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}
                {secondaryCta ? (
                  <Link
                    href={secondaryCta.href}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/15"
                  >
                    {secondaryCta.label}
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-brand-gold/25 blur-3xl" />
              <div className="relative overflow-hidden rounded-[36px] border border-white/14 bg-white/10 shadow-[0_28px_80px_rgba(0,0,0,0.32)] backdrop-blur-md">
                <div className="relative min-h-[18rem] bg-brand-mist sm:min-h-[22rem]">
                  <Image
                    src={storyImage}
                    alt="An IT For Youth Ghana learner presenting work to peers"
                    fill
                    sizes="(max-width: 1023px) 100vw, 42vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/12 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 rounded-[26px] border border-white/14 bg-white/12 p-5 backdrop-blur-md">
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
                          Mission shape
                        </p>
                        <h2 className="mt-3 font-heading text-3xl font-bold text-white">
                          Practical, recurring, measurable.
                        </h2>
                      </div>
                      <Sparkles className="h-8 w-8 text-brand-gold" />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
                  {statCards.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-[24px] border border-white/12 bg-white/10 p-5"
                    >
                      <p className="font-heading text-3xl font-bold text-white">{stat.value}</p>
                      <p className="mt-2 text-sm font-semibold text-white">{stat.label}</p>
                      {stat.description ? (
                        <p className="mt-2 text-xs leading-6 text-white/65">{stat.description}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
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
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="space-y-7">
            <SectionHeading
              eyebrow={leadSection?.title ?? "Our story"}
                title={page.overviewTitle ?? "Built around access, confidence, and visible outcomes"}
              description={
                page.overviewDescription ??
                leadSection?.body ??
                "IT For Youth Ghana exists to make digital opportunity practical, welcoming, and measurable for young people who are ready to build."
              }
            />

            <div className="rounded-[32px] border border-brand-border bg-brand-mist/55 p-7">
              <Quote className="h-9 w-9 text-brand-gold" />
              <p className="mt-5 text-lg leading-9 text-slate-700">{page.intro}</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {page.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
              >
                <p className="font-heading text-4xl font-bold text-brand-navy">{stat.value}</p>
                <p className="mt-3 text-base font-bold text-brand-ink">{stat.label}</p>
                {stat.description ? (
                  <p className="mt-3 text-sm leading-7 text-slate-500">{stat.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {operatingSections.length ? (
        <section
          id="model"
          className="scroll-mt-36 bg-brand-mist/60 px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
        >
          <div className="mx-auto max-w-7xl space-y-10">
            <SectionHeading
              eyebrow={page.operatingEyebrow ?? "Operating model"}
              title={page.operatingTitle ?? "The way we turn mission into repeatable delivery"}
              description={
                page.operatingDescription ??
                "These CMS-managed sections describe how ITFY moves from intent to learning environments, evidence, and partner trust."
              }
              align="center"
            />

            <div className="grid gap-5 lg:grid-cols-3">
              {operatingSections.map((section, index) => {
                const Icon = operatingIcons[index] ?? Compass;

                return (
                  <article
                    key={section.title}
                    className="group rounded-[32px] border border-brand-border bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-panel"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-navy text-brand-gold transition group-hover:scale-105">
                        <Icon className="h-6 w-6" />
                      </div>
                      <p className="font-heading text-4xl font-bold text-brand-gold/55">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                    </div>
                    <h2 className="mt-6 font-heading text-2xl font-bold text-brand-ink">
                      {section.title}
                    </h2>
                    <p className="mt-4 text-sm leading-8 text-slate-600">{section.body}</p>
                    {section.bullets?.length ? (
                      <div className="mt-6 grid gap-3">
                        {section.bullets.map((bullet) => (
                          <p key={bullet} className="flex gap-3 text-sm leading-7 text-slate-600">
                            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand-gold" />
                            <span>{bullet}</span>
                          </p>
                        ))}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {principleSections.length ? (
        <section id="principles" className="scroll-mt-36 bg-brand-navy px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="relative overflow-hidden rounded-[36px] border border-white/12 bg-white/10 shadow-[0_28px_80px_rgba(0,0,0,0.28)]">
              <div className="relative min-h-[26rem]">
                <Image
                  src={principlesImage}
                  alt="IT For Youth Ghana facilitator speaking with learners"
                  fill
                  sizes="(max-width: 1023px) 100vw, 42vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/86 via-brand-navy/16 to-transparent" />
              </div>
              <div className="absolute bottom-5 left-5 right-5 rounded-[28px] border border-white/14 bg-white/12 p-6 backdrop-blur-md">
                <div className="flex items-start gap-4">
                  <ShieldCheck className="mt-1 h-7 w-7 shrink-0 text-brand-gold" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-gold">
                      {page.principlesHeroEyebrow ?? "What we protect"}
                    </p>
                    <h2 className="mt-2 font-heading text-3xl font-bold text-white">
                      {page.principlesHeroTitle ?? "Trust, inclusion, and accountability as the work grows."}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-7">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">
                  {page.principlesEyebrow ?? "Principles"}
                </p>
                <h2 className="max-w-3xl font-heading text-4xl font-bold leading-snug text-white">
                  {page.principlesTitle ?? "A strong organisation is more than programmes on a calendar"}
                </h2>
                <p className="max-w-3xl text-base leading-8 text-white/70">
                  {page.principlesDescription ??
                    "The Who We Are story should show how decisions are made, what standards matter, and why partners can trust the delivery model."}
                </p>
              </div>

              <div className="grid gap-4">
                {principleSections.map((section, index) => (
                  <article
                    key={section.title}
                    className="rounded-[28px] border border-white/12 bg-white/8 p-6"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-gold text-brand-ink">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-heading text-2xl font-bold text-white">
                          {section.title}
                        </h3>
                        <p className="mt-3 text-sm leading-8 text-white/68">{section.body}</p>
                        {section.bullets?.length ? (
                          <div className="mt-4 grid gap-2">
                            {section.bullets.map((bullet) => (
                              <p
                                key={bullet}
                                className="flex gap-3 text-sm leading-7 text-white/72"
                              >
                                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-brand-gold" />
                                <span>{bullet}</span>
                              </p>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {page.related.length ? (
        <section id="routes" className="scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-7xl space-y-10">
            <SectionHeading
              eyebrow={page.exploreEyebrow ?? "Keep exploring"}
              title={
                page.exploreTitle ??
                "Meet the people, partners, and opportunities behind the mission"
              }
              description={
                page.exploreDescription ??
                "These connected routes make the Who We Are page a hub, not a dead end."
              }
            />
            <RouteCardGrid cards={page.related} />
          </div>
        </section>
      ) : null}

      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="overflow-hidden rounded-[36px] bg-brand-gold">
            <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-ink/70">
                  Next move
                </p>
                <h2 className="max-w-3xl font-heading text-4xl font-bold leading-tight text-brand-ink">
                  Start with the route that matches how you want to join the mission.
                </h2>
                <p className="max-w-2xl text-base leading-8 text-brand-ink/75">
                  Whether you want to meet the team, partner with delivery, or support the next
                  cohort, the page now gives visitors a clear next step.
                </p>
              </div>

              <div className="grid gap-3">
                {page.ctas.map((cta) => (
                  <Link
                    key={cta.href}
                    href={cta.href}
                    className="group flex items-center justify-between gap-4 rounded-full bg-white px-5 py-4 text-sm font-bold text-brand-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <span>{cta.label}</span>
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
