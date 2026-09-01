import { NextResponse } from "next/server";

import { persistContactMessage } from "@/lib/cms/persistence";
import { sendContactNotification } from "@/lib/email/contact-notification";
import { contactSchema } from "@/lib/utils/validators";

async function parsePayload(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const formData = await request.formData();
  return Object.fromEntries(formData.entries());
}

export async function POST(request: Request) {
  const payload = await parsePayload(request);
  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Please check the highlighted fields and try again.",
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const persistence = await persistContactMessage(parsed.data).catch((error) => {
    console.error("Contact message persistence failed", error);
    return {
      configured: true,
      written: false,
      id: undefined,
    };
  });
  const notification = await sendContactNotification(parsed.data);

  if (notification.configured && !notification.delivered) {
    return NextResponse.json(
      {
        success: false,
        message: "The message was valid, but the email notification could not be sent. Please try again or email the team directly.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    success: true,
    message: notification.delivered
      ? "Thanks for reaching out. Your message has been sent to the ITFY team."
      : "Thanks for reaching out. Your message is validated locally; Brevo delivery will activate when production email settings are configured.",
    delivery: notification.delivered ? "brevo" : "not-configured",
    persistence: persistence.written
      ? "firestore"
      : persistence.configured
        ? "failed"
        : "not-configured",
    id: persistence.id,
    data: parsed.data,
  });
}
