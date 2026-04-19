import Link from "next/link";

export type MarqueeTickerMode = "stats" | "partners" | "news" | "announcement";

export type MarqueeTickerItem = {
  label: string;
  href?: string;
};

export type MarqueeTickerContent = {
  mode: MarqueeTickerMode;
  speed?: "slow" | "medium" | "fast";
  pauseOnHover?: boolean;
  items: MarqueeTickerItem[];
};

type MarqueeTickerProps = {
  ticker: MarqueeTickerContent;
};

const speedStyles = {
  slow: "[animation-duration:40s]",
  medium: "[animation-duration:28s]",
  fast: "[animation-duration:20s]",
};

function itemStyle(mode: MarqueeTickerMode) {
  switch (mode) {
    case "partners":
      return "rounded-full border border-brand-gold/30 bg-white/5 px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-white/90";
    case "news":
      return "text-[0.78rem] font-semibold text-brand-gold transition hover:text-white";
    case "announcement":
      return "text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-brand-gold";
    case "stats":
    default:
      return "text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-brand-gold";
  }
}

export function MarqueeTicker({ ticker }: MarqueeTickerProps) {
  const baseItems =
    ticker.items.length === 1 ? Array.from({ length: 8 }, () => ticker.items[0]) : ticker.items;
  const loopItems = [...baseItems, ...baseItems];

  return (
    <section className="overflow-hidden border-y border-white/8 bg-brand-navy">
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div
          className={`flex w-max items-center gap-4 whitespace-nowrap py-4 animate-marquee ${speedStyles[ticker.speed ?? "medium"]} ${
            ticker.pauseOnHover ? "hover:[animation-play-state:paused]" : ""
          }`}
        >
          {loopItems.map((item, index) => {
            const content = item.href ? (
              <Link href={item.href} className={itemStyle(ticker.mode)}>
                {item.label}
              </Link>
            ) : (
              <span className={itemStyle(ticker.mode)}>{item.label}</span>
            );

            return (
              <div key={`${item.label}-${index}`} className="flex items-center gap-4">
                {content}
                <span className="text-brand-gold/40">•</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
