import type { MetadataRoute } from "next";

import { organisationServices } from "@/lib/content/organisation-config";
import { partnershipTracks } from "@/lib/content/partnership-config";
import { getPublishedArticles } from "@/lib/content/news-config";
import {
  initiatives,
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
    ...organisationServices.map((page) => `/for-organisations/${page.slug}`),
    ...partnershipTracks.map((page) => `/partner-with-us/${page.slug}`),
    ...getPublishedArticles().map((article) => `/news-and-updates/${article.category}/${article.slug}`),
  ];

  return Array.from(new Set(routes)).map((route) => ({
    url: `https://itforyouthghana.org${route}`,
    lastModified: new Date(),
  }));
}
