/**
 * The Her First Laptop application status (Draft 1 §9 §1).
 *
 * Draft 1 is unusually emphatic about this one: "This banner is the single
 * most valuable component on the site for your workload. Every call and direct
 * message you currently field can be answered with a saved reply pointing at
 * this URL. Without a visible status, students will keep contacting you
 * individually, and your team will keep answering by hand."
 *
 * One CMS setting with three states. The dates are optional because a state is
 * still useful without them — "applications are closed" answers the question
 * even before the next round has a date.
 */

export type ApplicationStatusState = "open" | "closed" | "waiting-list";

export type ApplicationStatus = {
  state: ApplicationStatusState;
  /** Open state: the date applications close. */
  openUntil?: string;
  /** Open state: when every applicant will have heard. */
  replyBy?: string;
  /** Closed state: when the next round opens. */
  nextRoundOpens?: string;
  /**
   * Replaces the generated sentence entirely. For a situation none of the
   * three states describes well — a deadline extension, a pause for a
   * consignment delay — without needing a developer.
   */
  messageOverride?: string;
};

/**
 * The default when nothing has been set.
 *
 * "open" is deliberately NOT the default. An unattended banner claiming
 * applications are open would send students into a form nobody is reading,
 * which is the exact workload problem this component exists to solve. The
 * waiting-list state is honest whatever the real position is: it says demand
 * exceeds supply and sets no expectation the team has not agreed to.
 */
export const DEFAULT_APPLICATION_STATUS: ApplicationStatus = {
  state: "waiting-list",
};

export const APPLICATION_STATUS_DOC_ID = "application-status";

/**
 * Builds the sentence for a state. Copy follows Draft 1 §9 §1's own patterns.
 *
 * A date is folded in only when supplied — never rendered as an empty gap or a
 * bracketed placeholder, which would look like the broken tokens this
 * programme has already had to clean up once.
 */
export function applicationStatusMessage(status: ApplicationStatus): string {
  if (status.messageOverride?.trim()) return status.messageOverride.trim();

  switch (status.state) {
    case "open": {
      const until = status.openUntil?.trim();
      const reply = status.replyBy?.trim();
      const opening = until ? `Applications are open until ${until}.` : "Applications are open.";
      return reply ? `${opening} We expect to reply to all applicants by ${reply}.` : opening;
    }
    case "closed": {
      const next = status.nextRoundOpens?.trim();
      const opening = next
        ? `Applications are closed. The next round opens ${next}.`
        : "Applications are closed.";
      return `${opening} Join the waiting list to be notified.`;
    }
    case "waiting-list":
    default:
      return "We have more applications than machines right now. You can join the waiting list and we will contact you when stock allows.";
  }
}

/** The short label shown alongside the sentence. */
export function applicationStatusLabel(state: ApplicationStatusState): string {
  switch (state) {
    case "open":
      return "Applications open";
    case "closed":
      return "Applications closed";
    case "waiting-list":
    default:
      return "Waiting list only";
  }
}
