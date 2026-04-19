import type { MetadataRoute } from "next";

import {
  articles,
  initiatives,
  organisationPages,
  partnershipPages,
  publicNavigation,
} from "@/lib/content/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/who-we-are",
    "/who-we-are/team",
    "/who-we-are/partners",
    "/who-we-are/careers",
    "/what-we-do",
    "/apply-for-training",
    "/apply-for-training/who-can-apply",
    "/apply-for-training/courses",
    "/apply-for-training/how-it-works",
    "/programs",
    "/for-organisations",
    "/partner-with-us",
    "/our-impact/reports",
    "/our-impact/testimonials",
    "/our-impact/sdgs",
    "/news-and-updates",
    "/news-and-updates/news",
    "/news-and-updates/blogs",
    "/contact",
    "/donate",
    ...publicNavigation.map((item) => item.href),
    ...initiatives.map((page) => `/what-we-do/${page.slug}`),
    ...organisationPages.map((page) => `/for-organisations/${page.slug}`),
    ...partnershipPages.map((page) => `/partner-with-us/${page.slug}`),
    ...articles.map((article) => `/news-and-updates/${article.category}/${article.slug}`),
  ];

  return Array.from(new Set(routes)).map((route) => ({
    url: `https://itforyouthghana.org${route}`,
    lastModified: new Date(),
  }));
}
