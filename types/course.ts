export interface CourseCategory {
  id: string;
  name: string;
  description: string | null;
  course_count: number;
}

export interface CoursePricing {
  amount: number | null;
  currency: string;
  isFree: boolean;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  level: string;
  duration: string;
  deliveryMode: string;
  image: string | null;
  pricing: CoursePricing;
  tags: string[];
  applyUrl: string | null;
  startDate: string | null;
}

export interface RawApiResponse {
  success: boolean;
  message?: string;
  data?: {
    data?: unknown[];
    courses?: unknown[];
  };
}

const htmlToText = (value: string) =>
  value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const pickString = (record: Record<string, unknown>, ...keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
};

const pickArray = (record: Record<string, unknown>, ...keys: string[]) => {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === "string");
    }
  }
  return [];
};

export function transformCourseData(raw: unknown): Course {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid course payload");
  }

  const record = raw as Record<string, unknown>;
  const title = pickString(record, "title", "name");
  const description = pickString(record, "description", "summary", "excerpt");
  const normalizedDescription = description ? htmlToText(description) : "Course details coming soon.";
  const amountValue =
    typeof record.price === "number"
      ? record.price
      : typeof record.amount === "number"
        ? record.amount
        : typeof record.fee === "number"
          ? record.fee
          : null;
  const isFree =
    Boolean(record.isFree) ||
    amountValue === 0 ||
    pickString(record, "pricingType", "payment_type").toLowerCase() === "free";

  const id = pickString(record, "id", "_id", "uuid") || toSlug(title);
  const slug = pickString(record, "slug") || toSlug(title || id);

  return {
    id,
    slug,
    title: title || "Untitled course",
    description: normalizedDescription,
    shortDescription: normalizedDescription.slice(0, 160),
    category: pickString(record, "category", "categoryName", "track") || "General",
    level: pickString(record, "level", "difficulty") || "All levels",
    duration: pickString(record, "duration", "length") || "Flexible",
    deliveryMode: pickString(record, "deliveryMode", "mode", "format") || "Hybrid",
    image: pickString(record, "image", "thumbnail", "coverImage") || null,
    pricing: {
      amount: isFree ? 0 : amountValue,
      currency: pickString(record, "currency") || "GHS",
      isFree,
    },
    tags: pickArray(record, "tags", "skills"),
    applyUrl:
      pickString(record, "applyUrl", "applicationUrl") ||
      `https://portal.itforyouthghana.org?course=${encodeURIComponent(slug)}`,
    startDate: pickString(record, "startDate", "startsAt") || null,
  };
}
