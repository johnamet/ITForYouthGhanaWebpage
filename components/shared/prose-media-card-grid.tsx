import {
  ProseMediaCard,
  type ProseMediaCardProps,
} from "@/components/shared/prose-media-card";
import { resolveMediaSet, type MediaTheme } from "@/lib/content/media-pool";
import { cn } from "@/lib/utils/cn";

/** Each card supplies its own content and `mediaKey`; the grid injects the rest. */
export type ProseMediaCardGridItem = Omit<
  ProseMediaCardProps,
  "resolved" | "theme" | "columns"
>;

export type ProseMediaCardGridProps = {
  cards: ProseMediaCardGridItem[];
  theme: MediaTheme;
  /** Column count once past `breakpoint`. Also shapes each card's `sizes`. */
  columns?: 1 | 2 | 3 | 4;
  /** Breakpoint at which the columns kick in. Below it the grid is one column. */
  breakpoint?: "sm" | "md" | "lg";
  gap?: "5" | "6";
  className?: string;
};

const columnClasses: Record<
  "sm" | "md" | "lg",
  Record<1 | 2 | 3 | 4, string>
> = {
  sm: { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" },
  md: { 1: "", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" },
  lg: { 1: "", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" },
};

/**
 * A grid of ProseMediaCards that resolves the whole group's photographs in one
 * call, so sibling cards cannot land on the same image.
 *
 * This exists because relying on each caller to remember `resolveMediaSet` did
 * not work: the first two grids built on ProseMediaCard both forgot it, and
 * shipped visibly repeated photographs. Prefer this over a bare grid div
 * wherever more than one card is rendered together.
 */
export function ProseMediaCardGrid({
  cards,
  theme,
  columns = 3,
  breakpoint = "lg",
  gap = "5",
  className,
}: ProseMediaCardGridProps) {
  if (!cards.length) return null;

  // Resolved once, positionally, so `resolved[index]` always belongs to
  // `cards[index]` — the ordering the whole component depends on.
  const resolved = resolveMediaSet(
    cards.map((card) => card.mediaKey),
    theme,
  );

  return (
    <div
      className={cn(
        "grid",
        gap === "6" ? "gap-6" : "gap-5",
        columnClasses[breakpoint][columns],
        className,
      )}
    >
      {cards.map((card, index) => (
        <ProseMediaCard
          key={card.mediaKey}
          {...card}
          theme={theme}
          columns={columns}
          resolved={resolved[index]}
        />
      ))}
    </div>
  );
}
