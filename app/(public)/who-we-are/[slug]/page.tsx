import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContentPage } from "@/components/shared/content-page";
import {
  getCmsWhoWeAreDynamicPageBySlug,
  getCmsWhoWeAreDynamicPages,
} from "@/lib/cms/site-pages";

type WhoWeAreDynamicPageProps = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const pages = await getCmsWhoWeAreDynamicPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: WhoWeAreDynamicPageProps): Promise<Metadata> {
  const page = await getCmsWhoWeAreDynamicPageBySlug(params.slug);

  if (!page) {
    return {
      title: "Page not found",
    };
  }

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      images: page.heroImage ? [page.heroImage] : undefined,
    },
  };
}

export default async function WhoWeAreDynamicPage({ params }: WhoWeAreDynamicPageProps) {
  const page = await getCmsWhoWeAreDynamicPageBySlug(params.slug);

  if (!page) {
    notFound();
  }

  return <ContentPage page={page} />;
}
