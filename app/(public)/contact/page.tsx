import type { Metadata } from "next";

import { ContactPage } from "@/components/contact/contact-page";
import { contactPageContent } from "@/lib/content/contact-config";

export const metadata: Metadata = {
  title: "Contact | IT For Youth Ghana",
  description:
    "Contact IT For Youth Ghana for training enquiries, partnerships, organisation services, donor conversations, media requests, volunteering, and general support.",
};

export default function ContactRoute() {
  return <ContactPage content={contactPageContent} />;
}
