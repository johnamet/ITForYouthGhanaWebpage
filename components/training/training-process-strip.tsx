import type { TrainingProcessStep } from "@/types/content";

type TrainingProcessStripProps = {
  eyebrow: string;
  title: string;
  description: string;
  steps: TrainingProcessStep[];
};

export function TrainingProcessStrip({
  eyebrow,
  title,
  description,
  steps,
}: TrainingProcessStripProps) {
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

      <div className="grid gap-5 lg:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl" aria-hidden="true">
                {step.icon}
              </span>
              <span className="font-heading text-3xl font-bold text-brand-gold/70">
                {step.number}
              </span>
            </div>
            <h3 className="mt-5 font-heading text-2xl font-bold text-brand-ink">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
