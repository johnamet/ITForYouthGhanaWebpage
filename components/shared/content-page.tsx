import Link from "next/link";

import type { SitePage } from "@/types/content";
import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { StatList } from "@/components/shared/stat-list";

type ContentPageProps = {
  page: SitePage;
};

export function ContentPage({ page }: ContentPageProps) {
  return (
    <div className="bg-brand-mist">
      <section className="bg-hero-grid text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-28">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
              {page.eyebrow}
            </p>
            <h1 className="max-w-3xl font-heading text-5xl font-semibold leading-tight sm:text-6xl">
              {page.title}
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-200">{page.description}</p>
            <p className="max-w-prose text-base leading-8 text-slate-200/90">{page.intro}</p>
            <div className="flex flex-wrap gap-3">
              {page.ctas.map((cta) => (
                <Link
                  key={cta.href}
                  href={cta.href}
                  className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-brand-navy transition hover:-translate-y-0.5"
                >
                  {cta.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/15 bg-white/10 p-8 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.24em] text-brand-gold">Page highlights</p>
            <ul className="mt-6 grid gap-4 text-sm leading-7 text-slate-100">
              {page.stats.slice(0, 3).map((stat) => (
                <li key={`${stat.value}-${stat.label}`}>
                  <span className="font-semibold text-white">{stat.value}</span> {stat.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <StatList stats={page.stats} />
      </section>

      <section className="mx-auto max-w-7xl space-y-10 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        {page.sections.map((section) => (
          <div key={section.title} className="rounded-[32px] border border-brand-border bg-white p-8 shadow-sm">
            <h2 className="font-heading text-2xl font-semibold text-brand-ink">{section.title}</h2>
            <p className="mt-4 max-w-prose text-base leading-8 text-slate-600">{section.body}</p>
            {section.bullets ? (
              <ul className="mt-5 grid gap-3 text-sm leading-7 text-slate-600">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </section>

      {page.related.length ? (
        <section className="mx-auto max-w-7xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Related routes"
            title="Continue through the new architecture"
            description="These links are already live inside the shared App Router foundation."
          />
          <RouteCardGrid cards={page.related} />
        </section>
      ) : null}
    </div>
  );
}
