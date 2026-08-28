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

const breakpointPx: Record<"sm" | "md" | "lg", number> = {
  sm: 640,
  md: 768,
  lg: 1024,
};

/**
 * Computes the `sizes` descriptor that matches the grid classes produced by
 * `columnClasses[breakpoint][columns]`, so the two can no longer drift apart
 * on either axis (column count *and* the breakpoint they kick in at).
 *
 * Exported standalone so it can be exercised without rendering anything.
 */
export function gridSizes(
  breakpoint: "sm" | "md" | "lg",
  columns: 1 | 2 | 3 | 4,
): string {
  if (columns === 1) return "100vw";
  return `(min-width: ${breakpointPx[breakpoint]}px) ${Math.round(100 / columns)}vw, 100vw`;
}

/**
 * A grid of ProseMediaCards that resolves the whole group's photographs in one
 * call, so sibling cards cannot land on the same image.
 *
 * This exists because relying on each caller to remember `resolveMediaSet` did
 * not work: the first two grids built on ProseMediaCard both forgot it, and
 * shipped visibly repeated photographs. Prefer this over a bare grid div
 * wherever more than one card is rendered together.
 *
 * `columns` and `breakpoint` together drive both the grid's own column
 * classes and the `sizes` descriptor computed for each card (see
 * `gridSizes`), so the two can't drift the way a hand-written `sizes` next to
 * a hand-written `grid-cols-*` class tends to. That computed value only
 * fills in for a card that doesn't already set its own `sizes`, and it is
 * never applied to a `layout="side"` card — side layout has its own correct
 * `50vw` split regardless of the surrounding grid's column count.
 *
 * Each theme's pool holds exactly 8 photographs. `resolveMediaSet` cycles
 * through them positionally and wraps once a group runs past that, so a
 * group of more than 8 cards will start repeating by design — there's no
 * ninth photo to reach for. Keep that in mind when sizing a large grid.
 *
 * The de-duplication only covers the cards passed to a single call: it
 * relies on resolving the whole group's media in one pass, so splitting one
 * visual group across two `ProseMediaCardGrid` calls defeats it — each call
 * resolves independently and knows nothing about the other's picks. Keep a
 * group in one grid.
 *
 * That independence cuts the other way too: two different grids rendered on
 * the same page are not aware of each other, so it's possible for both to
 * show the same photograph even though each is internally clean. Reaching
 * for a different `theme` per grid is a natural instinct here, but it is not
 * on its own enough, because the pools overlap more than you'd expect —
 * `community` and `rural`, for instance, share 7 of their 8 photographs.
 * `mentoring`/`team`, `entrepreneurship`/`advocacy` and
 * `graduation`/`impact` each share 4 of 8; `training`/`corporate`,
 * `community`/`advocacy`, `community`/`youth`, `entrepreneurship`/`impact`
 * and `rural`/`advocacy` each share 3 of 8. When placing co-located grids,
 * check the actual pool contents in `lib/content/media-pool.ts` for overlap
 * rather than assuming two differently-named themes are disjoint.
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
      {cards.map((card, index) => {
        // Guard 1: an explicit caller `sizes` always wins.
        // Guard 2: layout="side" already computes its own correct 50vw
        // split in ProseMediaCard — a stacked-grid descriptor would clobber
        // it, since `sizes` overrides everything there.
        const sizes =
          card.sizes ?? (card.layout === "side" ? undefined : gridSizes(breakpoint, columns));

        return (
          <ProseMediaCard
            key={card.mediaKey}
            {...card}
            theme={theme}
            columns={columns}
            resolved={resolved[index]}
            sizes={sizes}
          />
        );
      })}
    </div>
  );
}
