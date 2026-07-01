import { z } from "zod";

const optionalTrimmedString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional(),
);

const consentBoolean = z.preprocess(
  (value) => value === true || value === "true" || value === "on",
  z.boolean().refine(Boolean, "Please confirm that the team can contact you about this enquiry."),
);

const checkboxBoolean = z.preprocess(
  (value) => value === true || value === "true" || value === "on",
  z.boolean(),
);

const optionalNumber = z.preprocess((value) => {
  if (value === "" || value === undefined || value === null) {
    return undefined;
  }

  return Number(value);
}, z.number().int().positive().optional());

const stringList = z.preprocess((value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}, z.array(z.string().trim().min(1)).default([]));

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: optionalTrimmedString,
  organisation: optionalTrimmedString,
  enquiryType: z.enum([
    "training",
    "organisation",
    "partnership",
    "donation",
    "media",
    "volunteering",
    "general",
  ]),
  preferredContact: z.enum(["email", "phone", "either"]).default("email"),
  message: z.string().trim().min(20, "Please share at least 20 characters so the team has context."),
  consent: consentBoolean,
});

export type ContactPayload = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().email(),
  interest: z.string().optional(),
});

export const applicationSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  course: z.string().min(2),
  notes: z.string().optional(),
});

export const articleSchema = z.object({
  title: z.string().trim().min(6, "Please add a clear article title."),
  slug: z
    .string()
    .trim()
    .min(3, "Please add a URL slug.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  category: z.enum(["news", "blogs"]),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  type: z.enum(["News", "Blog", "Event", "Press"]).default("News"),
  excerpt: z.string().trim().min(24, "Please add a useful excerpt."),
  publishedAt: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid YYYY-MM-DD date."),
  coverImage: optionalTrimmedString,
  coverAlt: optionalTrimmedString,
  tags: stringList,
  authorName: z.string().trim().min(2, "Please add an author name."),
  authorRole: z.string().trim().min(2, "Please add an author role."),
  authorAvatar: optionalTrimmedString,
  featured: checkboxBoolean.default(false),
  readTimeMinutes: optionalNumber,
  contentHtml: z.string().trim().min(24, "Please add article body content."),
  seoTitle: optionalTrimmedString,
  seoDescription: optionalTrimmedString,
  seoOgImage: optionalTrimmedString,
});

export type ArticlePayload = z.infer<typeof articleSchema>;

// ─── Team validators ─────────────────────────────────────────────────────────

const optionalEmail = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().email().optional(),
);

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z
    .string()
    .trim()
    .url()
    .optional(),
);

export const teamSchema = z.object({
  name: z.string().trim().min(2, "Please enter a name."),
  role: z.string().trim().min(2, "Please enter a role."),
  department: z.string().trim().min(2, "Please enter a department."),
  bio: z.string().trim().min(10, "Please enter a short biography."),
  photo: optionalTrimmedString,
  email: optionalEmail,
  linkedin: optionalUrl,
  featured: checkboxBoolean.default(false),
  status: z.enum(["active", "inactive"]).default("active"),
  order: optionalNumber,
});

export type TeamPayload = z.infer<typeof teamSchema>;

export const partnerSchema = z.object({
  name: z.string().trim().min(2, "Please enter a partner name."),
  logo: optionalTrimmedString,
  href: optionalUrl,
  active: checkboxBoolean.default(true),
});

export type PartnerPayload = z.infer<typeof partnerSchema>;

export const testimonialSchema = z.object({
  name: z.string().trim().min(2, "Please enter a name."),
  quote: z.string().trim().min(12, "Please enter a meaningful quote."),
  role: z.string().trim().min(2, "Please enter a role."),
  programme: optionalTrimmedString,
  year: optionalTrimmedString,
  avatar: optionalTrimmedString,
  initials: z
    .string()
    .trim()
    .max(3, "Initials can be up to 3 characters.")
    .optional(),
  active: checkboxBoolean.default(true),
});

export type TestimonialPayload = z.infer<typeof testimonialSchema>;

export const jobSchema = z.object({
  title: z.string().trim().min(3, "Please enter a clear role title."),
  summary: z.string().trim().min(20, "Please add a short role summary."),
  team: z.string().trim().min(2, "Please enter a team/department."),
  location: z.string().trim().min(2, "Please enter a location."),
  type: z.enum(["full-time", "part-time", "contract", "volunteer"]).default("full-time"),
  status: z.enum(["draft", "published", "closed"]).default("draft"),
  applyUrl: optionalUrl,
  closingDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid YYYY-MM-DD date.")
    .optional(),
  featured: checkboxBoolean.default(false),
});

export type JobPayload = z.infer<typeof jobSchema>;
