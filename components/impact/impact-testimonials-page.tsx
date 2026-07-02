import Image from "next/image";
import Link from "next/link";
import { breadcrumbs } from "@/lib/content/site-config";

import { FeaturedStoryVideo } from "@/components/home/featured-story-video";
import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import type { ImpactTestimonialsContent } from "@/types/content";

type ImpactTestimonialsPageProps = {
  content: ImpactTestimonialsContent;
};

const formatBadgeStyles = {
  written: "border-brand-border bg-brand-mist/70 text-brand-navy",
  video: "border-rose-200 bg-rose-50 text-rose-700",
  partner: "border-emerald-200 bg-emerald-50 text-emerald-700",
} as const;

export function ImpactTestimonialsPage({
  content,
}: ImpactTestimonialsPageProps) {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <Image
            src={content.heroImage}
            alt="Learner stories and testimonials"
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
              {breadcrumbs.home}
            </Link>
            <span>/</span>
            <Link href="/our-impact" className="transition hover:text-white">
              {breadcrumbs.impact.root}
            </Link>
            <span>/</span>
            <span className="text-white">{breadcrumbs.impact.testimonials}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
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
                {content.heroAsideEyebrow ?? "Story themes"}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {content.themes.map((theme) => (
                  <span
                    key={theme}
                    className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/82"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedStoryVideo
        story={{
          id: "impact-featured-story",
          label: content.featuredStory.label,
          headline: content.featuredStory.headline,
          quote: content.featuredStory.quote,
          name: content.featuredStory.name,
          role: content.featuredStory.role,
          programme: content.featuredStory.programme,
          backgroundImage: content.featuredStory.backgroundImage,
          videoUrl: content.featuredStory.videoUrl,
          primaryCtaLabel: content.featuredStory.primaryCtaLabel,
          secondaryCta: content.featuredStory.secondaryCta,
        }}
      />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <SectionHeading
            eyebrow={content.listSectionEyebrow ?? "Written and partner voices"}
            title={
              content.listSectionTitle ??
              "Different angles on what meaningful change feels like"
            }
            description={
              content.listSectionDescription ??
              "These stories are seeded to show the structure of the future testimonial system: learner progression, gender inclusion, partner trust, and transition into work."
            }
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {content.stories.map((story) => (
              <article
                key={story.id}
                className="overflow-hidden rounded-[30px] border border-brand-border bg-white shadow-sm"
              >
                <div className="grid md:grid-cols-[0.38fr_0.62fr]">
                  <div className="relative min-h-[16rem] bg-brand-mist">
                    {story.image ? (
                      <Image
                        src={story.image}
                        alt={story.name}
                        fill
                        sizes="(max-width: 767px) 100vw, 35vw"
                        className="object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="p-7">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${formatBadgeStyles[story.format]}`}
                      >
                        {story.format}
                      </span>
                      <span className="rounded-full border border-brand-border px-3 py-1 text-xs font-semibold text-slate-600">
                        {story.theme}
                      </span>
                    </div>

                    <h2 className="mt-4 font-heading text-2xl font-bold text-brand-ink">
                      {story.title}
                    </h2>
                    <blockquote className="mt-4 text-sm leading-8 text-slate-700">
                      &ldquo;{story.quote}&rdquo;
                    </blockquote>

                    <div className="mt-6 border-l-2 border-brand-gold pl-4">
                      <p className="font-semibold text-brand-ink">{story.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{story.role}</p>
                      <p className="mt-1 text-sm text-brand-navy">
                        {story.programme} · {story.year}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <SectionHeading
            eyebrow={content.nextStepsSectionEyebrow ?? "Next steps"}
            title={
              content.nextStepsSectionTitle ??
              "Use the wider impact system to add context around the stories"
            }
            description={
              content.nextStepsSectionDescription ??
              "Stories become more persuasive when they sit alongside the evidence base and the programme ecosystem they came from."
            }
          />
          <RouteCardGrid cards={content.related} />
        </div>
      </section>
    </div>
  );
}
