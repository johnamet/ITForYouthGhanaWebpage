import { ProseMediaCardGrid } from "@/components/shared/prose-media-card-grid";
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
  if (!steps.length) return null;

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

      <ProseMediaCardGrid
        theme="training"
        columns={4}
        breakpoint="lg"
        gap="5"
        cards={steps
          .filter((step) => step.title?.trim())
          .map((step) => ({
            title: step.title,
            body: step.description,
            mediaKey: `training:process:${step.number}`,
            media: { iconImage: step.iconImage },
          }))}
      />
    </section>
  );
}
