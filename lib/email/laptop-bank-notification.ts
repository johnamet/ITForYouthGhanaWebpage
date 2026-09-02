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
      htmlContent: `<html><body style="font-family: Arial, sans-serif; color:#1a1a1a; line-height:1.6;"><p>${bodyText}</p>${packUrl ? `<p><a href="${packUrl}">Download the corporate pack</a></p>` : ""}<p style="font-size:13px;"><a href="${privacyNoticeUrl}">How we handle your data</a></p></body></html>`,
    },
    "laptop bank acknowledgement",
  );
}
