import { breadcrumbs } from "@/lib/content/site-config";
import { pointsToParagraph } from "@/lib/utils/prose";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { EditorialImageHero } from "@/components/shared/editorial-image-hero";
import { TrainingProcessStrip } from "@/components/training/training-process-strip";
import { safeImageSrcOrFallback } from "@/lib/utils/image-src";
import type { SitePage, TrainingProcessStep } from "@/types/content";

type TrainingHowItWorksPageProps = {
  page: SitePage;
};

function toProcessSteps(sections: SitePage["sections"]): TrainingProcessStep[] {
  return sections.slice(0, 4).map((section, index) => ({
    number: String(index + 1).padStart(2, "0"),
    title: section.title,
    description: section.body,
    // Unread since the de-iconing pass; kept because the content types and
    // admin forms that would populate this field were deliberately out of scope.
    icon: "",
  }));
}

export function TrainingHowItWorksPage({ page }: TrainingHowItWorksPageProps) {
  const processSteps = toProcessSteps(page.sections);
  const timelineSections = page.sections.slice(4, 8);
  const checklist = page.sections.flatMap((section) => section.bullets ?? []).slice(0, 6);

  return (
    <div className="bg-white">
      <EditorialImageHero imageSrc={safeImageSrcOrFallback(page.heroImage, "/images/randomPictures/studentslisteningfrontal.JPG")} imageAlt="Learners listening during orientation and onboarding" eyebrow={page.eyebrow} title={page.title} description={page.description} supportingText={[page.intro, page.principlesHeroTitle].filter((value): value is string => Boolean(value?.trim())).join(" ") || null} breadcrumbs={[{ label: breadcrumbs.home, href: "/" }, { label: breadcrumbs.apply.root, href: "/apply-for-training" }, { label: breadcrumbs.apply.howItWorks }]} priority />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <TrainingProcessStrip
          eyebrow="Apply process"
          title={page.overviewTitle ?? "Four steps, one clearer journey"}
          description={
            page.overviewDescription ??
            "The process below mirrors the same logic used on the course listing page, but gives learners a fuller explanation of what each stage is meant to do."
          }
          steps={processSteps}
        />
      </section>

      <section className="bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              {page.operatingEyebrow ?? "Timeline"}
            </p>
            <h2 className="font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
              {page.operatingTitle ??
                "What the process usually looks like in practice"}
            </h2>
            <p className="text-base leading-8 text-slate-600">
              {page.operatingDescription ??
                "Exact dates shift by cohort, but the overall sequence stays consistent enough that learners can plan with confidence."}
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-4">
            {timelineSections.map((item) => (
              <div
                key={item.title}
                className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm"
              >
                <h3 className="font-heading text-2xl font-bold text-brand-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] bg-brand-navy p-8 text-white">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              {page.principlesEyebrow ?? "Prepare well"}
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold">
              {page.principlesTitle ?? "Small preparation steps make the process smoother"}
            </h2>
            <p className="mt-4 text-base leading-8 text-white/78">
              {page.principlesDescription ??
                "Most friction in application flows comes from uncertainty. These simple preparation steps help learners submit with more confidence and fewer surprises."}
            </p>
          </div>

          {checklist.length ? (
            <div className="rounded-[26px] border border-brand-border bg-white px-6 py-6 shadow-sm">
              <p className="text-sm leading-7 text-slate-700">{pointsToParagraph(checklist)}</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              {page.exploreEyebrow ?? "Next steps"}
            </p>
            <h2 className="font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
              {page.exploreTitle ?? "Keep moving while the decision is still fresh"}
            </h2>
            <p className="text-base leading-8 text-slate-600">
              {page.exploreDescription ??
                "Once the process makes sense, the next useful move is either choosing a pathway or checking whether the fit is right before you apply."}
            </p>
          </div>

          <RouteCardGrid cards={page.related} />
        </div>
      </section>
    </div>
  );
}
