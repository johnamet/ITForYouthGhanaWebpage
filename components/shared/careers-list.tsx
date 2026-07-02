import Link from "next/link";

import type { JobListing } from "@/types/content";

type CareersListProps = {
  jobs: JobListing[];
};

function formatType(value: JobListing["type"]) {
  return value.replace("-", " ");
}

export function CareersList({ jobs }: CareersListProps) {
  if (!jobs.length) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-brand-border bg-white p-8 text-center shadow-sm">
          <h2 className="font-heading text-2xl font-semibold text-brand-ink">No open roles right now</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            We are not hiring at the moment. Check back soon for opportunities.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">Open opportunities</p>
        <h2 className="mt-2 font-heading text-4xl font-semibold text-brand-ink">Join the team</h2>
      </div>

      <div className="grid gap-5">
        {jobs.map((job) => (
          <article key={job.id} className="rounded-[26px] border border-brand-border bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-heading text-2xl font-semibold text-brand-ink">{job.title}</h3>
                <p className="mt-2 text-sm font-medium text-slate-600">
                  {job.team} · {job.location} · <span className="capitalize">{formatType(job.type)}</span>
                </p>
              </div>

              {job.closingDate ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Closes {job.closingDate}
                </span>
              ) : null}
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-600">{job.summary}</p>

            <div className="mt-5">
              {job.applyUrl ? (
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Apply now
                </a>
              ) : (
                <Link
                  href="/contact"
                  className="inline-flex rounded-full border border-brand-border px-4 py-2 text-xs font-semibold text-brand-ink transition hover:bg-brand-mist"
                >
                  Contact us
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
