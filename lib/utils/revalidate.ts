export const revalidationMap: Record<string, string[]> = {
  homepage: ["/"],
  initiative: ["/what-we-do"],
  organisation: ["/for-organisations"],
  partnership: ["/partner-with-us"],
  article: ["/news-and-updates", "/news-and-updates/news", "/news-and-updates/blogs", "/sitemap.xml"],
  team: ["/who-we-are/team"],
  partners: ["/who-we-are/partners"],
  testimonials: ["/our-impact/testimonials"],
  job: ["/who-we-are/careers"],
  impactStats: ["/", "/our-impact", "/our-impact/reports"],
  settings: ["/", "/contact", "/sitemap.xml"],
};

export function getRevalidationPaths(contentType: string, slug?: string) {
  const paths = new Set(revalidationMap[contentType] ?? []);

  if (slug) {
    if (contentType === "initiative") {
      paths.add(`/what-we-do/${slug}`);
    }

    if (contentType === "organisation") {
      paths.add(`/for-organisations/${slug}`);
    }

    if (contentType === "partnership") {
      paths.add(`/partner-with-us/${slug}`);
    }

    if (contentType === "article") {
      paths.add(`/news-and-updates/news/${slug}`);
      paths.add(`/news-and-updates/blogs/${slug}`);
      paths.add("/news-and-updates");
      paths.add("/");
    }
  }

  return Array.from(paths);
}

export function isValidRevalidationSecret(secret?: string | null) {
  const expected = process.env.REVALIDATION_SECRET;
  return Boolean(secret && expected && secret === expected);
}
