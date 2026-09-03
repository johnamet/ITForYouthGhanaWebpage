import { applyOverrides } from "@/lib/cms/descriptors/page-overrides";
import {
  articleCategoryContent,
  newsHubContent,
} from "@/lib/content/news-config";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type {
  ArticleCategory,
  ArticleCategoryContent,
  NewsHubContent,
} from "@/types/content";
import { toPlainData } from "@/lib/utils/plain";
import { FIREBASE_COLLECTIONS } from "@/types/firebase";

export const NEWS_PAGE_SLUGS = ["hub", "news", "blogs"] as const;

export type NewsPageSlug = (typeof NEWS_PAGE_SLUGS)[number];

export type NewsPageContentMap = {
  hub: NewsHubContent;
  news: ArticleCategoryContent;
  blogs: ArticleCategoryContent;
};

export type NewsPageContent = NewsPageContentMap[NewsPageSlug];

const seedNewsPages: NewsPageContentMap = {
  hub: newsHubContent,
  news: articleCategoryContent.news,
  blogs: articleCategoryContent.blogs,
};

export const newsPageLabels: Record<NewsPageSlug, string> = {
  hub: "News & Updates hub",
  news: "News listing",
  blogs: "Blogs listing",
};

export const newsPagePreviewPaths: Record<NewsPageSlug, string> = {
  hub: "/news-and-updates",
  news: "/news-and-updates/news",
  blogs: "/news-and-updates/blogs",
};

export function isNewsPageSlug(value: string): value is NewsPageSlug {
  return NEWS_PAGE_SLUGS.includes(value as NewsPageSlug);
}

/**
 * Merges stored overrides over the seed.
 *
 * Routed through the shared merger rather than a spread. `{ ...fallback,
 * ...data }` carries a stored `updatedAt` Timestamp straight through, and a
 * Timestamp reaching a Client Component logs an error on every prerender while
 * the build still exits 0 — easy to ship, easy to miss. The same bug was found
 * and fixed in lib/cms/partnerships.ts and lib/cms/impact-pages.ts.
 *
 * The merger only accepts keys the seed already has, so stored plumbing is
 * dropped without a denylist, and it understands both the flat-path keys the
 * generated editor writes and the whole-value keys the old forms wrote.
 */
function normalizeObject<T extends object>(fallback: T, data: Record<string, unknown> | undefined): T {
  return applyOverrides(
    fallback as unknown as Record<string, unknown>,
    toPlainData((data ?? {}) as Record<string, unknown>),
  ) as unknown as T;
}

export async function getCmsNewsPage<Slug extends NewsPageSlug>(
  slug: Slug,
): Promise<NewsPageContentMap[Slug]> {
  const fallback = seedNewsPages[slug];
  const db = await getAdminFirestore();

  if (!db) {
    return fallback;
  }

  try {
    const doc = await db.collection(FIREBASE_COLLECTIONS.newsPages).doc(slug).get();

    if (!doc.exists) {
      return fallback;
    }

    return normalizeObject(fallback, doc.data() ?? {});
  } catch (error) {
    console.error("News page read failed. Falling back to seed content.", error);
    return fallback;
  }
}

export async function getCmsArticleCategoryContent(
  category: ArticleCategory,
): Promise<ArticleCategoryContent> {
  return getCmsNewsPage(category);
}

export async function saveCmsNewsPage<Slug extends NewsPageSlug>(
  slug: Slug,
  payload: Partial<NewsPageContentMap[Slug]>,
) {
  const db = await getAdminFirestore();

  if (!db) {
    return { configured: false, written: false } as const;
  }

  const { FieldValue } = await import("firebase-admin/firestore");
  await db.collection(FIREBASE_COLLECTIONS.newsPages).doc(slug).set(
    {
      ...(payload as Record<string, unknown>),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return { configured: true, written: true, id: slug } as const;
}
