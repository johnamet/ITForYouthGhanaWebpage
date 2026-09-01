import type { ContactPayload } from "@/lib/utils/validators";

const BREVO_TRANSACTIONAL_EMAIL_URL = "https://api.brevo.com/v3/smtp/email";

export const enquiryLabels: Record<ContactPayload["enquiryType"], string> = {
  training: "Training or courses",
  organisation: "For organisations",
  partnership: "Partnership",
  donation: "Donation or sponsorship",
  media: "Media request",
  volunteering: "Volunteering",
  general: "General enquiry",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildNotificationHtml(payload: ContactPayload) {
  const rows = [
    ["Name", payload.name],
    ["Email", payload.email],
    ["Phone", payload.phone ?? "Not provided"],
    ["Organisation", payload.organisation ?? "Not provided"],
    ["Enquiry type", enquiryLabels[payload.enquiryType]],
    ["Preferred contact", payload.preferredContact],
  ];

  return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #1a1a2e; line-height: 1.6;">
        <h1 style="margin: 0 0 16px;">New website enquiry</h1>
        <table style="border-collapse: collapse; width: 100%; max-width: 680px;">
          <tbody>
            ${rows
              .map(
                ([label, value]) => `
                  <tr>
                    <th style="border: 1px solid #e8eaf0; padding: 10px; text-align: left; width: 180px; background: #f4f5f8;">${escapeHtml(label)}</th>
                    <td style="border: 1px solid #e8eaf0; padding: 10px;">${escapeHtml(value)}</td>
                  </tr>
                `,
              )
              .join("")}
          </tbody>
        </table>
        <h2 style="margin: 24px 0 8px;">Message</h2>
        <p style="white-space: pre-line;">${escapeHtml(payload.message)}</p>
      </body>
    </html>
  `;
}

function buildNotificationText(payload: ContactPayload) {
  return [
    "New website enquiry",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone ?? "Not provided"}`,
    `Organisation: ${payload.organisation ?? "Not provided"}`,
    `Enquiry type: ${enquiryLabels[payload.enquiryType]}`,
    `Preferred contact: ${payload.preferredContact}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");
}

type ContactNotificationOptions = {
  subject?: string;
};

export async function sendContactNotification(
  payload: ContactPayload,
  options: ContactNotificationOptions = {},
) {
  const apiKey = process.env.BREVO_API_KEY;
  const notificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL;
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? notificationEmail;
  const senderName = process.env.BREVO_SENDER_NAME ?? "ITFY Website";

  if (!apiKey || !notificationEmail || !senderEmail) {
    return {
      configured: false,
      delivered: false,
    };
  }

  try {
    const response = await fetch(BREVO_TRANSACTIONAL_EMAIL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: {
          email: senderEmail,
          name: senderName,
        },
        to: [
          {
            email: notificationEmail,
            name: "ITFY Team",
          },
        ],
        replyTo: {
          email: payload.email,
          name: payload.name,
        },
        subject: options.subject ?? `Website enquiry: ${enquiryLabels[payload.enquiryType]}`,
        htmlContent: buildNotificationHtml(payload),
        textContent: buildNotificationText(payload),
      }),
    });

    if (!response.ok) {
      const details = await response.text().catch(() => "Unknown Brevo error");
      console.error("Brevo contact notification failed", details);

      return {
        configured: true,
        delivered: false,
      };
    }

    return {
      configured: true,
      delivered: true,
    };
  } catch (error) {
    console.error("Brevo contact notification failed", error);
    return {
      configured: true,
      delivered: false,
    };
  }
}
