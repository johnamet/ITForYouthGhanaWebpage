import Image from "next/image";
import Link from "next/link";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatList } from "@/components/shared/stat-list";
import type { ImpactSdgsContent } from "@/types/content";

type ImpactSdgsPageProps = {
  content: ImpactSdgsContent;
};

const anchorLinks = [
  { id: "snapshot", label: "Snapshot" },
  { id: "goals", label: "Goals" },
  { id: "principles", label: "Principles" },
  { id: "next-steps", label: "Next Steps" },
];

export function ImpactSdgsPage({ content }: ImpactSdgsPageProps) {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <Image
            src={content.heroImage}
            alt="UN SDG alignment across IT For Youth Ghana impact areas"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,27,52,0.92)_0%,rgba(10,27,52,0.78)_45%,rgba(10,27,52,0.38)_100%)]" />
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
            <Link href="/our-impact" className="transition hover:text-white">
              Our Impact
            </Link>
            <span>/</span>
            <span className="text-white">UN SDGs</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                {content.eyebrow}
              </p>
              <h1 className="max-w-4xl font-heading text-5xl font-bold leading-tight sm:text-6xl">
                {content.title}
              </h1>
              <p className="max-w-3xl text-xl leading-8 text-slate-100">
                {content.description}
              </p>
            </div>

            <div className="rounded-[32px] border border-white/12 bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
                Alignment note
              </p>
              <div className="mt-5 space-y-3">
                {content.alignmentPrinciples.slice(0, 3).map((point) => (
                  <div
                    key={point}
                    className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4 text-sm leading-7 text-white/82"
                  >
                    {point}
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

      <section id="snapshot" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Impact snapshot"
            title="The same headline evidence can be read through a development lens"
            description="These top-line metrics help anchor the SDG conversation in the same real programme evidence used elsewhere on the site."
          />
          <StatList stats={content.stats} />
        </div>
      </section>

      <section
        id="goals"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeading
            eyebrow="Goal mapping"
            title="The work contributes across education, inclusion, opportunity, innovation, and partnership goals"
            description="The mapping below is meant to help partners and funders understand relevance without flattening the local programme logic that actually drives the work."
          />

          <div className="space-y-6">
            {content.goals.map((goal) => (
              <div
                key={goal.goal}
                className="grid gap-6 rounded-[32px] border border-brand-border bg-white p-7 shadow-sm lg:grid-cols-[0.38fr_0.62fr]"
              >
                <div className="space-y-4 rounded-[28px] bg-brand-navy p-6 text-white">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl" aria-hidden="true">
                      {goal.icon}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-gold">
                      {goal.goal}
                    </span>
                  </div>
                  <h2 className="font-heading text-3xl font-bold">{goal.title}</h2>
                  <p className="text-sm leading-7 text-white/78">{goal.summary}</p>
                </div>

                <div className="space-y-5">
                  <div className="space-y-3">
                    {goal.contributions.map((item) => (
                      <div
                        key={item}
                        className="rounded-[22px] border border-brand-border bg-brand-mist/45 px-4 py-4 text-sm leading-7 text-slate-700"
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {goal.linkedRoutes.map((route) => (
                      <Link
                        key={`${goal.goal}-${route.href}`}
                        href={route.href}
                        className="rounded-[24px] border border-brand-border bg-white p-5 transition hover:-translate-y-1 hover:shadow-sm"
                      >
                        <p className="text-[0.62rem] font-bold uppercase tracking-[0.26em] text-brand-gold">
                          {route.eyebrow}
                        </p>
                        <h3 className="mt-3 font-heading text-2xl font-bold text-brand-ink">
                          {route.title}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">
                          {route.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="principles" className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Alignment principles"
            title="How the SDG lens is meant to be used here"
            description="The goal mapping helps translate the work for development audiences, but it should always stay anchored in the lived local reality of the programmes."
          />

          <div className="grid gap-4">
            {content.alignmentPrinciples.map((point) => (
              <div
                key={point}
                className="rounded-[26px] border border-brand-border bg-white px-5 py-5 shadow-sm"
              >
                <p className="text-sm leading-7 text-slate-700">{point}</p>
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
            eyebrow="Next steps"
            title="Move into the route that adds the next layer of context"
            description="If the development lens is useful, the routes below help connect it to the partnership and evidence pages that support deeper conversations."
          />
          <RouteCardGrid cards={content.related} />
        </div>
      </section>
    </div>
  );
}
