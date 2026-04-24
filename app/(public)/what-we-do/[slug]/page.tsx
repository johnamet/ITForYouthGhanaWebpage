import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InitiativePageTemplate } from "@/components/what-we-do/initiative-page";
import { initiatives } from "@/lib/content/site-config";

type InitiativePageProps = {
  params: { slug: string };
};

export function generateStaticParams() {
  return initiatives.map((initiative) => ({ slug: initiative.slug }));
}

export function generateMetadata({ params }: InitiativePageProps): Metadata {
  const page = initiatives.find((initiative) => initiative.slug === params.slug);

  if (!page) {
    return {
      title: "What We Do",
    };
  }

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: `${page.title} | IT For Youth Ghana`,
      description: page.description,
      images: [page.heroImage],
    },
  };
}

export default function InitiativePage({ params }: InitiativePageProps) {
  const page = initiatives.find((initiative) => initiative.slug === params.slug);
  if (!page) {
    notFound();
  }
  return <InitiativePageTemplate page={page} />;
}
