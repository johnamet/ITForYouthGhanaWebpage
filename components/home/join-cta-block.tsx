import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

export function JoinCtaBlock({ cards }: JoinCtaBlockProps) {
  const visibleCards = cards.filter((card) => card.active !== false);
  if (!visibleCards.length) return null;

  return (
    <section className="bg-white px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-heading text-5xl font-bold leading-none text-brand-ink sm:text-6xl lg:text-7xl">
            Join the movement
          </h2>
          <p className="mx-auto mt-5 max-w-3xl font-heading text-2xl font-bold leading-tight text-brand-ink sm:text-3xl">
            Clear paths for learners, organisations, and volunteers
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-[0.95rem] leading-[1.8] text-slate-500">
            Choose the role that fits you and take a practical next step with IT For Youth
            Ghana.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {visibleCards.map((card) => {
            return (
              <div
                key={card.id}
                className="flex h-full flex-col rounded-[30px] border border-brand-border bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-panel"
              >
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
