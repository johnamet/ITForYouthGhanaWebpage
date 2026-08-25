import Link from "next/link";
import type { RouteCard } from "@/types/content";

type RouteCardGridProps = {
  cards: RouteCard[];
};

export function RouteCardGrid({ cards }: RouteCardGridProps) {
  const visibleCards = cards.filter(
    (card) => card.href?.trim() && [card.eyebrow, card.title, card.description].some((value) => value?.trim()),
  );

  if (!visibleCards.length) return null;

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {visibleCards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="group block rounded-[20px] border border-[#e8eaf0] bg-white p-7 transition duration-250 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
        >
          {/* Icon slot — optional, rendered if card has iconBg */}
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-deep">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 fill-none stroke-brand-accent stroke-[1.5]"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>

          {card.eyebrow && (
            <p className="mb-1.5 text-[0.6rem] font-bold uppercase tracking-[0.28em] text-brand-accent">
              {card.eyebrow}
            </p>
          )}
          {card.title?.trim() ? <h3 className="font-heading text-xl font-bold text-brand-ink">
            {card.title}
          </h3> : null}
          {card.description?.trim() ? <p className="mt-2.5 text-[0.8rem] leading-[1.65] text-slate-500">
            {card.description}
          </p> : null}
          <p className="mt-5 flex items-center gap-1.5 text-[0.75rem] font-bold text-brand-deep transition-[gap] duration-200 group-hover:gap-2.5">
            Open route →
          </p>
        </Link>
      ))}
    </div>
  );
}
