import { notFound } from "next/navigation";

import { ContentPage } from "@/components/shared/content-page";
import { initiatives } from "@/lib/content/site-config";

type InitiativePageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return initiatives.map((initiative) => ({ slug: initiative.slug }));
}

export default function InitiativePage({ params }: InitiativePageProps) {
  const page = initiatives.find((initiative) => initiative.slug === params.slug);
  if (!page) {
    notFound();
  }
  return <ContentPage page={page} />;
}
