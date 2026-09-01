import { TokenText } from "@/components/laptop-bank/token";
import { cn } from "@/lib/utils/cn";

export type CalloutVariant = "info" | "warning";

type CalloutBoxProps = {
  variant?: CalloutVariant;
  heading?: string;
  body: string;
  className?: string;
  id?: string;
};

/**
 * C6 — callout box, two variants.
 *
 * No icon. This repo's public pages carry no icons, so the variant reads from
 * the accent rule and the ground colour instead of a glyph. Draft 1 §14.3 also
 * requires that colour is never the only signal, which is why the heading
 * carries the warning's meaning in words.
 */
const variantClasses: Record<CalloutVariant, string> = {
  info: "border-l-4 border-brand-primary bg-brand-mist/60",
  warning: "border-l-4 border-brand-gold bg-brand-warm",
};

export function CalloutBox({ variant = "info", heading, body, className, id }: CalloutBoxProps) {
  if (!body.trim() && !heading?.trim()) return null;

  return (
    <aside
      id={id}
      className={cn(
        "rounded-r-[24px] px-6 py-6 sm:px-8 sm:py-7",
        variantClasses[variant],
        className,
      )}
    >
      {heading?.trim() ? (
        <h3 className="font-heading text-xl font-bold text-brand-ink sm:text-2xl">{heading}</h3>
      ) : null}
      {body.trim() ? (
        <p className={cn("text-sm leading-7 text-slate-700", heading?.trim() && "mt-3")}>
          <TokenText>{body}</TokenText>
        </p>
      ) : null}
    </aside>
  );
}
