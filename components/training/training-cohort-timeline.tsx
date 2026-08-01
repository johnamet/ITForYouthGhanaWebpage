import type { TrainingCohort } from "@/types/content";

type TrainingCohortTimelineProps = {
  eyebrow: string;
  title: string;
  description: string;
  cohorts: TrainingCohort[];
};

const cohortStatusStyles: Record<TrainingCohort["status"], string> = {
  open: "border-emerald-200 bg-emerald-50 text-emerald-700",
  upcoming: "border-brand-border bg-brand-mist/70 text-brand-navy",
  waitlist: "border-amber-200 bg-amber-50 text-amber-700",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function statusLabel(status: TrainingCohort["status"]) {
  if (status === "open") {
    return "Applications open";
  }
  if (status === "waitlist") {
    return "Waitlist";
  }
  return "Upcoming";
}

export function TrainingCohortTimeline({
  eyebrow,
  title,
  description,
  cohorts,
}: TrainingCohortTimelineProps) {
  if (!cohorts.length) return null;

  return (
    <section className="space-y-8">
      <div className="max-w-3xl space-y-3">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
          {eyebrow}
        </p>
        <h2 className="font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
          {title}
        </h2>
        <p className="text-base leading-8 text-slate-600">{description}</p>
      </div>

      <div className="space-y-5">
        {cohorts.map((cohort) => (
          <div
            key={cohort.id}
            className="grid gap-5 rounded-[30px] border border-brand-border bg-white p-6 shadow-sm lg:grid-cols-[12rem_1fr]"
          >
            <div className="space-y-3 rounded-[24px] bg-brand-mist/70 p-5">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
                Starts
              </p>
              <p className="font-heading text-2xl font-bold text-brand-navy">
                {formatDate(cohort.startDate)}
              </p>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${cohortStatusStyles[cohort.status]}`}
              >
                {statusLabel(cohort.status)}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-brand-ink">
                    {cohort.name}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{cohort.summary}</p>
                </div>

                {cohort.applicationDeadline ? (
                  <div className="rounded-[22px] border border-brand-border px-4 py-3 text-sm text-slate-600">
                    Deadline:{" "}
                    <span className="font-semibold text-brand-ink">
                      {formatDate(cohort.applicationDeadline)}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] border border-brand-border px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Format
                  </p>
                  <p className="mt-2 text-sm font-semibold text-brand-ink">{cohort.format}</p>
                </div>
                <div className="rounded-[22px] border border-brand-border px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Duration
                  </p>
                  <p className="mt-2 text-sm font-semibold text-brand-ink">{cohort.duration}</p>
                </div>
                <div className="rounded-[22px] border border-brand-border px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Location
                  </p>
                  <p className="mt-2 text-sm font-semibold text-brand-ink">{cohort.location}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
