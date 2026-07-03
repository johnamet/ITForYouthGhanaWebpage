import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentPage } from "@/components/shared/content-page";
import { InitiativePageTemplate } from "@/components/what-we-do/initiative-page";
import { getCmsInitiativeBySlug, getCmsInitiatives } from "@/lib/cms/initiatives";
import {
  getCmsWhatWeDoDynamicPageBySlug,
  getCmsWhatWeDoDynamicPages,
} from "@/lib/cms/site-pages";

type InitiativePageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const [initiatives, pages] = await Promise.all([
    getCmsInitiatives(),
    getCmsWhatWeDoDynamicPages(),
  ]);

  return [
    ...initiatives.map((initiative) => ({ slug: initiative.slug })),
    ...pages.map((page) => ({ slug: page.slug })),
  ];
}

export async function generateMetadata({ params }: InitiativePageProps): Promise<Metadata> {
  const page =
    (await getCmsInitiativeBySlug(params.slug)) ??
    (await getCmsWhatWeDoDynamicPageBySlug(params.slug));

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
      images: page.heroImage ? [page.heroImage] : undefined,
    },
  };
}

export default async function InitiativePage({ params }: InitiativePageProps) {
  const initiative = await getCmsInitiativeBySlug(params.slug);

  if (initiative) {
    return <InitiativePageTemplate page={initiative} />;
  }

  const page = await getCmsWhatWeDoDynamicPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return <ContentPage page={page} />;
}
