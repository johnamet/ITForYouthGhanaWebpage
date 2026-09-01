import { cn } from "@/lib/utils/cn";
import type { IntakeItem } from "@/types/laptop-bank";

type SpecTableProps = {
  items: IntakeItem[];
  /**
   * Page 5.1 block 6: "First 6 Intake Items only" and no notes column. The
   * caller passes the already-sliced items; this only drops the notes column.
   */
  condensed?: boolean;
  /**
   * Page 5.3 block 3: "All Intake Items, split accepted / not accepted".
   */
  split?: boolean;
  className?: string;
};

const groupHeadings = {
  accepted: "What we accept",
  rejected: "What we cannot accept",
} as const;

/**
 * C5 — responsive intake specification table.
 *
 * Spec §3: "Responsive. Collapses to stacked cards below 768px. Accepted / not
 * accepted visual states."
 *
 * The table and the stacked cards render from the same `items` array rather
 * than being two hand-maintained markups, so they cannot drift. The table is
 * `hidden md:table`; the cards are `md:hidden`. 768px is Tailwind's `md`, which
 * is the exact breakpoint the spec names.
 *
 * The accepted state is carried by a border colour AND a word ("Accepted" /
 * "Not accepted"), never colour alone — Draft 1 §14.3.
 */
function AcceptedLabel({ accepted }: { accepted: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]",
        accepted ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-700",
      )}
    >
      {accepted ? "Accepted" : "Not accepted"}
    </span>
  );
}

function SpecRows({ items, condensed }: { items: IntakeItem[]; condensed?: boolean }) {
  return (
    <>
      {/* ≥768px: a real table. Below that the stacked cards below take over. */}
      <table className="hidden w-full border-collapse text-left md:table">
        <thead>
          <tr className="border-b border-brand-border">
            <th scope="col" className="py-3 pr-4 text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
              Item
            </th>
            <th scope="col" className="py-3 pr-4 text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
              Minimum accepted
            </th>
            {condensed ? null : (
              <th scope="col" className="py-3 pr-4 text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
                Notes
              </th>
            )}
            <th scope="col" className="py-3 text-xs font-bold uppercase tracking-[0.16em] text-brand-gold">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.item}
              className={cn(
                "border-b border-brand-border/70 align-top",
                item.accepted ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-slate-400",
              )}
            >
              <th scope="row" className="py-4 pl-4 pr-4 text-sm font-bold text-brand-ink">
                {item.item}
              </th>
              <td className="py-4 pr-4 text-sm leading-7 text-slate-600">{item.minimum_accepted}</td>
              {condensed ? null : (
                <td className="py-4 pr-4 text-sm leading-7 text-slate-600">{item.notes}</td>
              )}
              <td className="py-4">
                <AcceptedLabel accepted={item.accepted} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <768px: the same rows as stacked cards. */}
      <div className="space-y-4 md:hidden">
        {items.map((item) => (
          <div
            key={item.item}
            className={cn(
              "rounded-r-[20px] border border-brand-border bg-white p-5 shadow-sm",
              item.accepted ? "border-l-4 border-l-emerald-500" : "border-l-4 border-l-slate-400",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="font-heading text-lg font-bold text-brand-ink">{item.item}</p>
              <AcceptedLabel accepted={item.accepted} />
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.minimum_accepted}</p>
            {condensed ? null : (
              <p className="mt-2 text-sm leading-7 text-slate-500">{item.notes}</p>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export function SpecTable({ items, condensed, split, className }: SpecTableProps) {
  if (!items.length) return null;

  if (!split) {
    return (
      <div className={className}>
        <SpecRows items={items} condensed={condensed} />
      </div>
    );
  }

  const accepted = items.filter((item) => item.accepted);
  const rejected = items.filter((item) => !item.accepted);

  return (
    <div className={cn("space-y-12", className)}>
      {([
        ["accepted", accepted],
        ["rejected", rejected],
      ] as const).map(([group, groupItems]) =>
        groupItems.length ? (
          <div key={group}>
            <h3 className="font-heading text-2xl font-bold text-brand-ink">{groupHeadings[group]}</h3>
            <div className="mt-5">
              <SpecRows items={groupItems} condensed={condensed} />
            </div>
          </div>
        ) : null,
      )}
    </div>
  );
}

/** The condensed slice page 5.1 block 6 publishes: the first six items. */
export function condensedIntakeItems(items: IntakeItem[]): IntakeItem[] {
  return items.slice(0, 6);
}
