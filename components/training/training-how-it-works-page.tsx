import Image from "next/image";
import Link from "next/link";

import { RouteCardGrid } from "@/components/shared/route-card-grid";
import { TrainingProcessStrip } from "@/components/training/training-process-strip";
import { trainingHowItWorksContent } from "@/lib/content/training-config";

export function TrainingHowItWorksPage() {
  return (
    <div className="bg-white">
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="absolute inset-0">
          <Image
            src={trainingHowItWorksContent.heroImage}
            alt="Learners listening during orientation and onboarding"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(125deg,rgba(10,27,52,0.92)_0%,rgba(10,27,52,0.78)_44%,rgba(10,27,52,0.45)_100%)]" />
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
            <Link href="/apply-for-training" className="transition hover:text-white">
              Apply for Training
            </Link>
            <span>/</span>
            <span className="text-white">How It Works</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-end">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-gold">
                {trainingHowItWorksContent.eyebrow}
              </p>
              <h1 className="max-w-4xl font-heading text-5xl font-bold leading-tight sm:text-6xl">
                {trainingHowItWorksContent.title}
              </h1>
              <p className="max-w-3xl text-xl leading-8 text-slate-100">
                {trainingHowItWorksContent.description}
              </p>
            </div>

            <div className="rounded-[32px] border border-white/12 bg-white/10 p-6 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-gold">
                Why this matters
              </p>
              <p className="mt-5 text-base leading-8 text-white/78">
                When learners know the sequence ahead of time, they can prepare better, reduce
                anxiety, and make stronger decisions about whether to apply now or wait for a
                better-fit cohort.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <TrainingProcessStrip
          eyebrow="Apply process"
          title="Four steps, one clearer journey"
          description="The process below mirrors the same logic used on the course listing page, but gives learners a fuller explanation of what each stage is meant to do."
          steps={trainingHowItWorksContent.process}
        />
      </section>

      <section className="bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              Timeline
            </p>
            <h2 className="font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
              What the process usually looks like in practice
            </h2>
            <p className="text-base leading-8 text-slate-600">
              Exact dates shift by cohort, but the overall sequence stays consistent enough that
              learners can plan with confidence.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-4">
            {trainingHowItWorksContent.timeline.map((item) => (
              <div
                key={item.title}
                className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm"
              >
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
                  {item.label}
                </p>
                <h3 className="mt-4 font-heading text-2xl font-bold text-brand-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] bg-brand-navy p-8 text-white">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              Prepare well
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold">
              Small preparation steps make the process smoother
            </h2>
            <p className="mt-4 text-base leading-8 text-white/78">
              Most friction in application flows comes from uncertainty. These simple preparation
              steps help learners submit with more confidence and fewer surprises.
            </p>
          </div>

          <div className="space-y-4">
            {trainingHowItWorksContent.checklist.map((item) => (
              <div
                key={item}
                className="rounded-[26px] border border-brand-border bg-white px-5 py-5 shadow-sm"
              >
                <p className="text-sm leading-7 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-mist/45 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="max-w-3xl space-y-3">
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
              Next steps
            </p>
            <h2 className="font-heading text-3xl font-bold text-brand-ink sm:text-4xl">
              Keep moving while the decision is still fresh
            </h2>
            <p className="text-base leading-8 text-slate-600">
              Once the process makes sense, the next useful move is either choosing a pathway or
              checking whether the fit is right before you apply.
            </p>
          </div>

          <RouteCardGrid cards={trainingHowItWorksContent.nextSteps} />
        </div>
      </section>
    </div>
  );
}
