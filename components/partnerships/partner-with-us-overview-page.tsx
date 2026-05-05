import Image from "next/image";
import Link from "next/link";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import type {
  PartnershipOverviewContent,
  PartnershipTrackPage,
} from "@/types/content";

type PartnerWithUsOverviewPageProps = {
  content: PartnershipOverviewContent;
  tracks: PartnershipTrackPage[];
};

const anchorLinks = [
  { id: "overview", label: "Overview" },
  { id: "tracks", label: "Tracks" },
  { id: "principles", label: "Partner Types" },
  { id: "next-steps", label: "Next Steps" },
];

export function PartnerWithUsOverviewPage({
  content,
  tracks,
}: PartnerWithUsOverviewPageProps) {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <Image
            src={content.heroImage}
            alt="Collaboration and partnership activity across IT For Youth Ghana"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,27,52,0.92)_0%,rgba(10,27,52,0.78)_45%,rgba(10,27,52,0.42)_100%)]" />
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
            <span className="text-white">Partner With Us</span>
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

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-ink transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Start a partnership conversation
                </Link>
                <Link
                  href="/our-impact/reports"
                  className="rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/35 hover:bg-white/15"
                >
                  See our impact
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {content.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[28px] border border-white/12 bg-white/10 p-5 backdrop-blur-sm"
                >
                  {stat.icon ? (
                    <span className="text-2xl" aria-hidden="true">
                      {stat.icon}
                    </span>
                  ) : null}
                  <p className="mt-3 font-heading text-3xl font-bold text-white">{stat.value}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{stat.label}</p>
                  {stat.description ? (
                    <p className="mt-2 text-sm leading-7 text-white/65">{stat.description}</p>
                  ) : null}
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
            title="The right partnership starts with the right collaboration logic"
            description="Each track below is built around a different type of institution and a different kind of decision. That makes it easier to move from interest into a practical, better-scoped relationship."
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {content.valueCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[30px] border border-brand-border bg-white p-7 shadow-sm"
              >
                <h2 className="font-heading text-2xl font-bold text-brand-ink">
                  {card.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="tracks"
        className="scroll-mt-36 bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl space-y-10">
          <SectionHeading
            eyebrow="Partnership tracks"
            title="Choose the track that best matches your institution"
            description="Each route is a clearer front door for a different kind of collaborator, with a dedicated page that explains fit, engagement models, examples, FAQs, and the next move."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {tracks.map((track) => (
              <Link
                key={track.slug}
                href={`/partner-with-us/${track.slug}`}
                className="group overflow-hidden rounded-[32px] border border-brand-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-panel"
              >
                <div className="grid md:grid-cols-[0.42fr_0.58fr]">
                  <div className="relative min-h-[18rem] bg-brand-mist">
                    <Image
                      src={track.heroImage}
                      alt={track.title}
                      fill
                      sizes="(max-width: 767px) 100vw, 35vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/45 via-transparent to-transparent" />
                  </div>

                  <div className="flex flex-col justify-between p-7">
                    <div className="space-y-3">
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
                        {track.eyebrow}
                      </p>
                      <h3 className="font-heading text-3xl font-bold text-brand-ink">
                        {track.title}
                      </h3>
                      <p className="text-sm font-medium leading-7 text-brand-navy">
                        {track.tagline}
                      </p>
                      <p className="text-sm leading-7 text-slate-600">{track.description}</p>
                    </div>

                    <div className="mt-6 space-y-5">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {track.stats.slice(0, 2).map((stat) => (
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
                        Explore track
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

      <section
        id="principles"
        className="mx-auto max-w-7xl scroll-mt-36 px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="space-y-8">
          <SectionHeading
            eyebrow="Partner types"
            title="Different institutions bring different strengths to the ecosystem"
            description="These cards summarise the role each partner type can play before you dive into the dedicated detail page for that track."
          />

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {content.partnerTypeCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[28px] border border-brand-border bg-white p-6 shadow-sm"
              >
                <h3 className="font-heading text-2xl font-bold text-brand-ink">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
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
            title="Start with the track that feels closest to your institution’s role"
            description="If you already know where you fit, open that partner track. If you are still deciding, the contact route is the best shared entry point."
          />

          <RouteCardGrid cards={content.nextSteps} />
        </div>
      </section>
    </div>
  );
}
