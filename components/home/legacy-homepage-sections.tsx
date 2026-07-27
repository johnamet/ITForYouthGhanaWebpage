import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

export type ChallengeSectionContent = {
  title: string;
  headline: string;
  description: string;
  stats: Array<{ label: string; value: string; description: string }>;
  comparisonTitle: string;
  problemTitle: string;
  problemItems: string[];
  solutionTitle: string;
  solutionItems: string[];
  ctaText: string;
  ctaLabel: string;
  ctaHref: string;
  active?: boolean;
};

export type MissionSectionContent = {
  title: string;
  headline: string;
  description: string;
  image: string;
  imageAlt: string;
  imageLabel: string;
  imageCaption: string;
  missionTitle: string;
  missionHeadline: string;
  missionDescription: string;
  ctaLabel: string;
  ctaHref: string;
  active?: boolean;
};

function QuickOverview() {
  return (
    <section className="bg-white px-6 py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="font-heading text-5xl font-bold leading-none text-brand-navy sm:text-6xl lg:text-7xl">
            Digital opportunity
          </h2>
          <p className="mt-5 font-heading text-3xl font-bold leading-tight text-brand-navy sm:text-4xl">
            Skills that move young people forward
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            IT For Youth Ghana helps young people build practical digital skills,
            confidence, and clear pathways into work, further study, and enterprise.
          </p>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="font-heading text-4xl font-bold leading-tight text-brand-navy sm:text-5xl">
              Why we exist
            </h3>
            <p className="mt-4 font-heading text-2xl font-bold leading-tight text-brand-navy sm:text-3xl">
              Ghana’s digital growth should include every young person.
            </p>
            <p className="mt-6 leading-8 text-slate-600">
              Ghana’s digital economy is creating new possibilities, but access to quality
              training, devices, and career guidance remains uneven. We close that gap with
              structured learning built around the skills young people can use.
            </p>
            <div className="mt-6 rounded-xl border border-brand-border bg-brand-mist/50 p-6">
              <p className="leading-8 text-slate-600">
                Our programmes prioritise{" "}
                <span className="font-semibold text-brand-navy">
                  young women and underserved communities
                </span>
                . Each cohort combines hands-on training, mentorship, and real projects so
                participants leave with evidence of what they can do and a practical next step.
              </p>
            </div>
            <Link
              href="/apply-for-training"
              className="itfy-button-blue mt-7 px-6 py-3.5 text-sm"
            >
              Find your training pathway
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="relative h-80 overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/images/randomPictures/studentslistening.jpg"
              alt="Students learning technology"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-brand-navy/20" />
            <div className="absolute bottom-4 left-4 rounded-lg bg-brand-navy/95 p-4 text-white">
              <p className="text-sm font-semibold text-white">Learning by doing</p>
              <p className="mt-1 text-xs text-white/90">
                Practical training, projects, and mentorship
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Challenge({ content }: { content: ChallengeSectionContent }) {
  if (content.active === false) return null;

  return (
    <section className="bg-brand-navy px-6 py-20 text-white lg:px-10 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="font-heading text-5xl font-bold leading-none text-white sm:text-6xl lg:text-7xl">
            {content.title}
          </h2>
          <p className="mx-auto mt-5 max-w-5xl font-heading text-3xl font-bold leading-tight text-white/90 sm:text-4xl">
            {content.headline}
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/90">
            {content.description}
          </p>
        </div>

        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {content.stats.map((item) => (
            <article
              key={item.label}
              className="rounded-xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm transition-colors hover:bg-white/15"
            >
              <p className="font-heading text-4xl font-bold text-white md:text-5xl">
                {item.value}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">{item.label}</h3>
              <p className="mt-2 text-sm text-white/80">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="mx-auto max-w-4xl rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
          <h3 className="text-center font-heading text-2xl font-bold text-white sm:text-3xl">
            {content.comparisonTitle}
          </h3>
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div>
              <h4 className="mb-4 text-xl font-semibold text-white">
                {content.problemTitle}
              </h4>
              <ul className="space-y-3">
                {content.problemItems.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/90">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xl font-semibold text-white">
                {content.solutionTitle}
              </h4>
              <ul className="space-y-3">
                {content.solutionItems.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/90">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-white" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="mb-6 text-lg text-white/90">
            {content.ctaText}
          </p>
          <Link
            href={content.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full border-2 border-white bg-white px-8 py-4 font-semibold text-brand-navy shadow-lg transition-transform hover:-translate-y-0.5 hover:scale-[1.02]"
          >
            <Heart className="h-5 w-5" aria-hidden="true" />
            {content.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Vision({ content }: { content: MissionSectionContent }) {
  if (content.active === false) return null;

  return (
    <section className="bg-white px-6 py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-16 max-w-4xl text-center">
          <h2 className="font-heading text-5xl font-bold leading-none text-brand-navy sm:text-6xl lg:text-7xl">
            {content.title}
          </h2>
          <p className="mt-5 font-heading text-3xl font-bold leading-tight text-brand-navy sm:text-4xl">
            {content.headline}
          </p>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
            {content.description}
          </p>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-16">
          <div className="relative h-80 overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={content.image}
              alt={content.imageAlt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-brand-navy/20" />
            <div className="absolute bottom-4 left-4 rounded-lg bg-brand-navy/95 p-4 text-white">
              <p className="text-sm font-semibold text-white">{content.imageLabel}</p>
              <p className="mt-1 text-xs text-white/90">
                {content.imageCaption}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-heading text-4xl font-bold leading-tight text-brand-navy sm:text-5xl">
              {content.missionTitle}
            </h3>
            <p className="mt-4 font-heading text-2xl font-bold leading-tight text-brand-navy sm:text-3xl">
              {content.missionHeadline}
            </p>
            <p className="mt-6 leading-8 text-slate-600">
              {content.missionDescription}
            </p>
            <Link
              href={content.ctaHref}
              className="itfy-button-outline-blue mt-7 px-6 py-3.5 text-sm"
            >
              {content.ctaLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LegacyHomepageSections({
  challenge,
  mission,
}: {
  challenge: ChallengeSectionContent;
  mission: MissionSectionContent;
}) {
  return (
    <>
      <QuickOverview />
      <Challenge content={challenge} />
      <Vision content={mission} />
    </>
  );
}
