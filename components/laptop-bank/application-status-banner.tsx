import { Button } from "@/components/ui/button";
import {
  applicationStatusLabel,
  applicationStatusMessage,
  type ApplicationStatus,
} from "@/lib/content/laptop-bank-status";
import { cn } from "@/lib/utils/cn";

/**
 * The application status banner (Draft 1 §9 §1).
 *
 * Draft 1 §14.3: "Do not rely on colour alone for the application status
 * banner; include text." So the state is carried by an explicit label —
 * "Applications open" / "Applications closed" / "Waiting list only" — and the
 * colour only reinforces it. A reader with any form of colour blindness, or
 * reading a printout, gets the same information.
 *
 * The form below it is NOT disabled when applications are closed, deliberately.
 * Draft 1's purpose for this banner is to set expectations, not to lock people
 * out, and its closed copy explicitly invites the reader to "join the waiting
 * list" — which is the same form. Turning submissions off would lose exactly
 * the applicants the waiting list exists to keep.
 */
const stateClasses: Record<ApplicationStatus["state"], string> = {
  open: "border-emerald-300 bg-emerald-50 text-emerald-950",
  closed: "border-slate-300 bg-slate-100 text-slate-900",
  "waiting-list": "border-amber-300 bg-amber-50 text-amber-950",
};

const labelClasses: Record<ApplicationStatus["state"], string> = {
  open: "bg-emerald-600 text-white",
  closed: "bg-slate-700 text-white",
  "waiting-list": "bg-amber-600 text-white",
};

export function ApplicationStatusBanner({
  status,
  /** Shown on pages other than the apply page itself. */
  applyCta = false,
  className,
}: {
  status: ApplicationStatus;
  applyCta?: boolean;
  className?: string;
}) {
  const message = applicationStatusMessage(status);
  const label = applicationStatusLabel(status.state);

  return (
    <aside
      // A status region, so a screen reader announces it on arrival rather
      // than leaving it to be discovered on the way past.
      role="status"
      className={cn("rounded-[24px] border px-6 py-5 sm:px-8", stateClasses[status.state], className)}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={cn(
            "inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em]",
            labelClasses[status.state],
          )}
        >
          {label}
        </span>
        <p className="text-base leading-7">{message}</p>
      </div>

      {applyCta ? (
        <div className="mt-5">
          <Button href="/her-first-laptop/apply" variant="solid-pink" size="md">
            {status.state === "open" ? "Start your application" : "Join the waiting list"}
          </Button>
        </div>
      ) : null}
    </aside>
  );
}
