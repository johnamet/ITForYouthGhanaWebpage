import type { MetadataRoute } from "next";

import { getCmsPublishedArticles } from "@/lib/cms/articles";
import { getCmsDepartments } from "@/lib/cms/departments";
import { getCmsInitiatives } from "@/lib/cms/initiatives";
import {
  getCmsWhatWeDoDynamicPages,
  getCmsWhoWeAreDynamicPages,
} from "@/lib/cms/site-pages";
import { organisationServices } from "@/lib/content/organisation-config";
import { partnershipTracks } from "@/lib/content/partnership-config";
import { publicNavigation } from "@/lib/content/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, departments, whoWeArePages, whatWeDoPages, initiatives] = await Promise.all([
    getCmsPublishedArticles(),
    getCmsDepartments(),
    getCmsWhoWeAreDynamicPages(),
    getCmsWhatWeDoDynamicPages(),
    getCmsInitiatives(),
  ]);
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
    "/departments",
    ...publicNavigation.map((item) => item.href),
    ...initiatives.map((page) => `/what-we-do/${page.slug}`),
    ...organisationServices.map((page) => `/for-organisations/${page.slug}`),
    ...partnershipTracks.map((page) => `/partner-with-us/${page.slug}`),
    ...departments.map((department) => `/departments/${department.slug}`),
    ...whoWeArePages.map((page) => `/who-we-are/${page.slug}`),
    ...whatWeDoPages.map((page) => `/what-we-do/${page.slug}`),
    ...articles.map((article) => `/news-and-updates/${article.category}/${article.slug}`),
  ];

  return Array.from(new Set(routes)).map((route) => ({
    url: `https://itforyouthghana.org${route}`,
    lastModified: new Date(),
  }));
}
