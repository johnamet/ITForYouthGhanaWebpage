const BREVO_TRANSACTIONAL_EMAIL_URL = "https://api.brevo.com/v3/smtp/email";

/**
 * Email for the two Laptop Bank forms.
 *
 * This exists instead of reusing lib/email/contact-notification.ts because
 * spec §7 is explicit: "Form notification emails to staff contain a reference
 * number and a link only. No personal data in the email body."
 * sendContactNotification composes the whole submission — name, email, phone —
 * into its body, which is right for a general contact enquiry and wrong here.
 * A student application carries an institution, a student identifier and a
 * free-text account of someone's circumstances; none of that belongs in a
 * mailbox, and Draft 1 §14.2 says the same thing ("email only a notification
 * with a link").
 *
 * So the staff notification below carries a reference, a form name and a link.
 * Nothing else. Do not "improve" it by adding the submitter's details.
 *
 * The acknowledgement to the submitter is a separate function, and that one
 * does address them by name — it is going to the person the data is about.
 */

/**
 * Escapes text interpolated into an HTML email body. The outcome emails
 * address the applicant by her preferred name, which is free text she typed,
 * so it must not be able to inject markup into a message we send.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type EmailResult = {
  configured: boolean;
  delivered: boolean;
};

function getBrevoConfig() {
  const apiKey = process.env.BREVO_API_KEY;
  const notificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL;
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? notificationEmail;
  const senderName = process.env.BREVO_SENDER_NAME ?? "IT for Youth Ghana";

  if (!apiKey || !notificationEmail || !senderEmail) return null;
  return { apiKey, notificationEmail, senderEmail, senderName };
}

async function send(body: Record<string, unknown>, label: string): Promise<EmailResult> {
  const config = getBrevoConfig();
  if (!config) return { configured: false, delivered: false };

  try {
    const response = await fetch(BREVO_TRANSACTIONAL_EMAIL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": config.apiKey },
      body: JSON.stringify({
        sender: { email: config.senderEmail, name: config.senderName },
        ...body,
      }),
    });

    if (!response.ok) {
      const details = await response.text().catch(() => "Unknown Brevo error");
      console.error(`Brevo ${label} failed`, details);
      return { configured: true, delivered: false };
    }

    return { configured: true, delivered: true };
  } catch (error) {
    console.error(`Brevo ${label} failed`, error);
    return { configured: true, delivered: false };
  }
}

export type LaptopBankFormKind = "equipment-offer" | "student-application";

const FORM_LABELS: Record<LaptopBankFormKind, string> = {
  "equipment-offer": "Corporate equipment offer",
  "student-application": "Her First Laptop application",
};

/**
 * The staff link, pointed at the specific submission.
 *
 * THIS MUST RESOLVE TO A ROUTE THAT ACTUALLY SHOWS THE RECORD. Spec §7 keeps
 * every piece of personal data out of the email body, so this link is the only
 * route staff have to a submission — if it lands on a page that cannot see the
 * record, the submission is invisible and effectively lost.
 *
 * It previously pointed at /admin/messages and /admin/applications, which read
 * the `contactMessages` and `applications` collections. Laptop Bank
 * submissions are written to `laptopBankOffers` and `laptopBankApplications`,
 * so those pages would never have shown them. Do not point this at a generic
 * inbox again.
 */
function adminLinkFor(kind: LaptopBankFormKind, reference: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://itforyouthghana.org";
  const path =
    kind === "equipment-offer"
      ? `/admin/laptop-bank/offers/${reference}`
      : `/admin/laptop-bank/applications/${reference}`;
  return `${base}${path}`;
}

/**
 * Tells staff a submission arrived. Reference and link only — see the note at
 * the top of this file.
 */
export async function sendLaptopBankStaffNotification(
  kind: LaptopBankFormKind,
  reference: string,
): Promise<EmailResult> {
  const config = getBrevoConfig();
  if (!config) return { configured: false, delivered: false };

  const label = FORM_LABELS[kind];
  const link = adminLinkFor(kind, reference);

  return send(
    {
      to: [{ email: config.notificationEmail, name: "IT for Youth Ghana team" }],
      subject: `${label} received — ${reference}`,
      textContent: `A new ${label.toLowerCase()} has been received.\n\nReference: ${reference}\n\nOpen it here: ${link}\n\nThis email deliberately carries no personal data. Everything about the submission is in the record.`,
      htmlContent: `<html><body style="font-family: Arial, sans-serif; color:#1a1a1a; line-height:1.6;"><p>A new ${label.toLowerCase()} has been received.</p><p><strong>Reference:</strong> ${reference}</p><p><a href="${link}">Open it in the admin area</a></p><p style="color:#5c6672; font-size:13px;">This email deliberately carries no personal data. Everything about the submission is in the record.</p></body></html>`,
    },
    "laptop bank staff notification",
  );
}

/**
 * Acknowledges the submission to the person who made it.
 *
 * Spec 5.5 BEHAVIOUR: the corporate acknowledgement carries the corporate pack.
 * The pack PDF is awaited (spec §11), so `packUrl` is passed only once it
 * exists; until then the email links to the documents page instead of claiming
 * an attachment that is not there.
 *
 * Spec 5.9 BUILD requires the privacy notice to be linked from both
 * confirmation emails, which is why `privacyNoticeUrl` is not optional.
 */
export async function sendLaptopBankAcknowledgement(options: {
  toEmail: string;
  toName: string;
  subject: string;
  bodyText: string;
  privacyNoticeUrl: string;
  packUrl?: string;
}): Promise<EmailResult> {
  const { toEmail, toName, subject, bodyText, privacyNoticeUrl, packUrl } = options;

  const packLine = packUrl
    ? `\n\nThe corporate pack is here: ${packUrl}`
    : "";

  return send(
    {
      to: [{ email: toEmail, name: toName }],
      subject,
      textContent: `${bodyText}${packLine}\n\nHow we handle your data: ${privacyNoticeUrl}`,
      // Blank lines in bodyText become real paragraphs. The outcome templates
      // below are multi-paragraph, and collapsing them into one block turned a
      // considered letter into a wall of text.
      htmlContent: `<html><body style="font-family: Arial, sans-serif; color:#1a1a1a; line-height:1.6;">${bodyText
        .split(/\n{2,}/)
        .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
        .join("")}${packUrl ? `<p><a href="${packUrl}">Download the corporate pack</a></p>` : ""}<p style="font-size:13px;"><a href="${privacyNoticeUrl}">How we handle your data</a></p></body></html>`,
    },
    "laptop bank acknowledgement",
  );
}

// ─── Applicant outcome emails ─────────────────────────────────────────────────

export type ApplicationOutcome =
  | "shortlisted"
  | "waiting-list"
  | "offered"
  | "rejected";

type OutcomeTemplate = {
  subject: (reference: string) => string;
  body: (name: string) => string;
};

/**
 * The outcome emails for a Her First Laptop application (Draft 1 §14.6).
 *
 * Draft 1 is emphatic about which of these matters most: "The not-selected
 * email matters more than the offer email. You will send far more of them, and
 * each one either protects or damages your standing with a student who talks to
 * other students." So the rejected template is the longest of the four, it
 * offers the alternatives spec 5.7 block 5 already promises in writing — the
 * waiting list, and the shared machines in Tech Clubs and community labs — and
 * it never implies she fell short.
 *
 * These go TO the applicant, so unlike the staff notification they address her
 * by name. Spec §7's "no personal data in the email body" governs staff mail,
 * where the recipient is not the person the data is about.
 *
 * Tone follows Draft 1 §2 and §8: she is an applicant and a student, never a
 * "beneficiary"; the subject of a sentence is what she is doing, not what she
 * lacks.
 */
const OUTCOME_TEMPLATES: Record<ApplicationOutcome, OutcomeTemplate> = {
  shortlisted: {
    subject: (reference) => `Your Her First Laptop application — shortlisted (${reference})`,
    body: (name) =>
      `Hello ${name},\n\nYour application for Her First Laptop has been shortlisted. Someone from our team will contact you shortly for a short conversation about your course and how you would use the machine.\n\nThere is nothing you need to send us in the meantime, and there is never any payment at any stage.`,
  },
  "waiting-list": {
    subject: (reference) => `Your Her First Laptop application — waiting list (${reference})`,
    body: (name) =>
      `Hello ${name},\n\nWe were not able to offer you a laptop in this cycle, because we received far more applications than we had machines. You are on the list for the next one, and you do not need to apply again.\n\nIn the meantime you can use the shared machines in our Tech Clubs and community labs. Reply to this email if you would like us to point you to the nearest one.`,
  },
  offered: {
    subject: (reference) => `Your Her First Laptop application — you have been selected (${reference})`,
    body: (name) =>
      `Hello ${name},\n\nYou have been selected for a laptop through Her First Laptop. Someone from our team will contact you to arrange handover and to take you through the loan-to-own agreement and the induction.\n\nThe machine becomes yours outright once you have completed your training track and your teaching hours. There is no payment at any stage.`,
  },
  rejected: {
    subject: (reference) => `Your Her First Laptop application — this cycle's outcome (${reference})`,
    body: (name) =>
      `Hello ${name},\n\nThank you for applying to Her First Laptop. We were not able to offer you a laptop in this cycle.\n\nWe receive far more applications than we have machines, so a great many strong applications go unmet each cycle. This outcome is about the number of machines we had, not about your application.\n\nThere are two things we can offer you now. You can use the shared machines in our Tech Clubs and community labs, and several of our training tracks do not require a personal computer — you are welcome on those. Reply to this email and we will point you to the nearest option and to the tracks that are open.\n\nYou are also welcome to apply again in the next cycle.`,
  },
};

/** True when this status has an outcome email a reviewer can send. */
export function hasOutcomeEmail(status: string): status is ApplicationOutcome {
  return Object.prototype.hasOwnProperty.call(OUTCOME_TEMPLATES, status);
}

/**
 * Sends an applicant the outcome of her application.
 *
 * ONLY called when a reviewer explicitly asks for it — see the notify checkbox
 * on the review form. It is not sent automatically on a status change, because
 * a reviewer correcting a mis-click would otherwise email a real person a
 * decision that was never made.
 *
 * NOTE ON CHANNEL: spec 5.8 makes SMS the primary channel for applicants, and
 * email is optional on the application form (§6.2), so many applicants will
 * have no email address at all. This function therefore reports
 * `configured: false` rather than throwing when there is no address, and the
 * review screen tells the reviewer to reach her by phone or WhatsApp instead.
 * Wiring an SMS provider is the outstanding piece.
 */
export async function sendApplicationOutcome(options: {
  outcome: ApplicationOutcome;
  toEmail?: string;
  toName: string;
  reference: string;
  privacyNoticeUrl: string;
}): Promise<EmailResult> {
  const { outcome, toEmail, toName, reference, privacyNoticeUrl } = options;

  if (!toEmail?.trim()) return { configured: false, delivered: false };

  const template = OUTCOME_TEMPLATES[outcome];

  return sendLaptopBankAcknowledgement({
    toEmail,
    toName,
    subject: template.subject(reference),
    bodyText: template.body(toName),
    privacyNoticeUrl,
  });
}
