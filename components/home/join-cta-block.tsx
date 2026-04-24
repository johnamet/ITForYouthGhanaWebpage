import Link from "next/link";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  HeartHandshake,
  LucideIcon,
} from "lucide-react";

import { SectionHeading } from "@/components/shared/section-heading";

export type JoinCtaCard = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  icon: "students" | "organisations" | "volunteer";
  active?: boolean;
};

type JoinCtaBlockProps = {
  cards: JoinCtaCard[];
};

const iconMap: Record<JoinCtaCard["icon"], LucideIcon> = {
  students: GraduationCap,
  organisations: Building2,
  volunteer: HeartHandshake,
};

export function JoinCtaBlock({ cards }: JoinCtaBlockProps) {
  const visibleCards = cards.filter((card) => card.active !== false);

  return (
    <section className="bg-white px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <SectionHeading
          eyebrow="Join the movement"
          title="Clear paths for learners, organisations, and volunteers"
          description="This section gives each audience a focused next step without forcing everyone through the same journey."
          align="center"
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {visibleCards.map((card) => {
            const Icon = iconMap[card.icon];

            return (
              <div
                key={card.id}
                className="flex h-full flex-col rounded-[30px] border border-brand-border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-panel"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-mist text-brand-navy">
                  <Icon className="h-7 w-7" />
                </div>

                <div className="mt-6 space-y-3">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
                    {card.eyebrow}
                  </p>
                  <h3 className="font-heading text-2xl font-bold text-brand-ink">
                    {card.title}
                  </h3>
                  <p className="text-sm leading-7 text-slate-600">{card.description}</p>
                </div>

                <Link
                  href={card.href}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-navy"
                >
                  {card.buttonLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
