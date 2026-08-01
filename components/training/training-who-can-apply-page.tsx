import { breadcrumbs } from "@/lib/content/site-config";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import type { SitePage } from "@/types/content";

type TrainingWhoCanApplyPageProps = {
  page: SitePage;
};

export function TrainingWhoCanApplyPage({ page }: TrainingWhoCanApplyPageProps) {
  const audienceSections = page.sections.slice(0, 3);
  const readinessSection = page.sections[3] ?? page.sections[0];
  const practiceSection = readinessSection;

  return (
    <div className="bg-white">
      <EditorialImageHero imageSrc={page.heroImage ?? "/images/randomPictures/studentsblueclothing.jpg"} imageAlt="Learners gathering for an ITFY training session" eyebrow={page.eyebrow} title={page.title} description={page.description} supportingText={[page.intro, practiceSection?.body, ...(practiceSection?.bullets ?? [])].filter((value): value is string => Boolean(value?.trim())).join(" • ") || null} breadcrumbs={[{ label: breadcrumbs.home, href: "/" }, { label: breadcrumbs.apply.root, href: "/apply-for-training" }, { label: breadcrumbs.apply.whoCanApply }]} priority />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-3">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
            Overview
          </p>
          <h2 className="font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
            {page.overviewTitle ?? "Different routes suit different starting points"}
          </h2>
          <p className="text-base leading-8 text-slate-600">
            {page.overviewDescription ??
              "Eligibility is not only about what a learner already knows. It is also about timing, commitment, and whether the course level matches what they need right now."}
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {audienceSections.map((card) => (
            <div
              key={card.title}
              className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
            >
              <h3 className="font-heading text-2xl font-bold text-brand-ink">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{card.body}</p>
              <div className="mt-6 space-y-3">
                {(card.bullets ?? []).map((bullet) => (
                  <div
                    key={bullet}
                    className="rounded-[22px] border border-brand-border bg-brand-mist/55 px-4 py-4 text-sm leading-7 text-slate-700"
                  >
                    {bullet}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] bg-brand-navy p-8 text-white">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              {page.operatingEyebrow ?? "What helps"}
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold">
              {page.operatingTitle ?? "Readiness matters more than polish"}
            </h2>
            <p className="mt-4 text-base leading-8 text-white/78">
              {page.operatingDescription ??
                "Learners do not need to arrive with a perfect story. What matters more is whether they can engage honestly with the process and commit to showing up for the cohort."}
            </p>
          </div>

          <div className="space-y-4">
            {(readinessSection?.bullets ?? []).map((point) => (
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

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              {page.exploreEyebrow ?? "Next steps"}
            </p>
            <h2 className="font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
              {page.exploreTitle ?? "Once the fit feels clearer, keep moving"}
            </h2>
            <p className="text-base leading-8 text-slate-600">
              {page.exploreDescription ??
                "The next best step is usually to browse the course catalog or understand the application sequence for Cohort 8."}
            </p>
          </div>

          <RouteCardGrid cards={page.related} />
        </div>
      </section>
    </div>
  );
}
