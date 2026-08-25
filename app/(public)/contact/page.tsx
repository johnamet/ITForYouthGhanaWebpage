import type { Metadata } from "next";

import { ContactPage } from "@/components/contact/contact-page";
import { getCmsContactPage } from "@/lib/cms/contact";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getCmsContactPage();

  return {
    title: content.eyebrow,
    description: content.description,
  };
}

export default async function ContactRoute() {
  const content = await getCmsContactPage();
  return <ContactPage content={content} />;
}
