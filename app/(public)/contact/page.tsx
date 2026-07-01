import type { Metadata } from "next";

import { ContactPage } from "@/components/contact/contact-page";
import { getCmsContactPage } from "@/lib/cms/contact";

export const metadata: Metadata = {
  title: contactPageContent.eyebrow,
  description: contactPageContent.description,
};

export default async function ContactRoute() {
  const content = await getCmsContactPage();
  return <ContactPage content={content} />;
}
