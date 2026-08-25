import type { JobListing } from "@/types/content";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StateMessage } from "@/components/ui/state-message";

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
        <StateMessage
          title="No open roles right now"
          description="We are not hiring at the moment. Check back soon for opportunities."
        />
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-accent">Open opportunities</p>
        <h2 className="mt-2 font-heading text-4xl font-semibold text-brand-ink">Join the team</h2>
      </div>

      <div className="grid gap-5">
        {jobs.map((job) => (
          <Card key={job.id} className="rounded-[26px]">
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
                <Button
                  href={job.applyUrl}
                  external
                  variant="secondary"
                  size="sm"
                >
                  Apply now
                </Button>
              ) : (
                <Button
                  href="/contact"
                  variant="outline"
                  size="sm"
                >
                  Contact us
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
