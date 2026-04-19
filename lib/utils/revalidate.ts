export const revalidationMap: Record<string, string[]> = {
  homepage: ["/"],
  initiative: ["/what-we-do"],
  article: ["/news-and-updates/news", "/news-and-updates/blogs"],
  team: ["/who-we-are/team"],
  partners: ["/who-we-are/partners"],
  testimonials: ["/our-impact/testimonials"],
};

export function isValidRevalidationSecret(secret?: string | null) {
  const expected = process.env.REVALIDATION_SECRET;
  return Boolean(secret && expected && secret === expected);
}
