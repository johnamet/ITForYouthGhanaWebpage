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

export const newsPageSchema = z.record(z.unknown());

export type NewsPagePayload = z.infer<typeof newsPageSchema>;

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
  order: optionalNumber,
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

// ─── Settings & Homepage validators (Phase 1) ───────────────────────────────

export const socialsSchema = z
  .array(
    z.object({
      label: z.string().trim().min(2),
      href: z.string().trim().url(),
      network: z.string().trim().optional(),
    }),
  )
  .default([]);

export const settingsSchema = z.object({
  siteTitle: optionalTrimmedString,
  siteDescription: optionalTrimmedString,
  defaultOgImage: optionalTrimmedString,
  contact: z
    .object({
      email: optionalEmail,
      phone: optionalTrimmedString,
      location: optionalTrimmedString,
    })
    .partial()
    .default({}),
  socials: socialsSchema,
});

export type SettingsPayload = z.infer<typeof settingsSchema>;

const sitePageHighlightStatSchema = z.object({
  value: z.string().trim().min(1, "Please add a stat value."),
  label: z.string().trim().min(2, "Please add a stat label."),
  description: optionalTrimmedString,
  icon: optionalTrimmedString,
});

const sitePageSectionSchema = z.object({
  title: z.string().trim().min(2, "Please add a section title."),
  body: z.string().trim().min(12, "Please add useful section body copy."),
  bullets: z.array(z.string().trim().min(1)).optional().default([]),
});

const sitePageActionLinkSchema = z.object({
  label: z.string().trim().min(2, "Please add a link label."),
  href: z.string().trim().min(1, "Please add a link destination."),
});

const sitePageRouteCardSchema = z.object({
  href: z.string().trim().min(1, "Please add a card destination."),
  eyebrow: optionalTrimmedString,
  title: z.string().trim().min(2, "Please add a card title."),
  description: z.string().trim().min(12, "Please add a useful card description."),
});

const sitePageCourseSchema = z.object({
  id: z.string().trim().min(1, "Please add a course ID."),
  slug: z
    .string()
    .trim()
    .min(3, "Please add a course slug.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  title: z.string().trim().min(2, "Please add a course title."),
  description: z.string().trim().min(12, "Please add a useful course description."),
  descriptionHtml: optionalTrimmedString.nullable().optional(),
  shortDescription: z.string().trim().min(12, "Please add a short course description."),
  category: z.string().trim().min(2, "Please add a category."),
  level: z.string().trim().min(2, "Please add a level."),
  duration: z.string().trim().min(2, "Please add a duration."),
  deliveryMode: z.string().trim().min(2, "Please add a delivery mode."),
  image: optionalTrimmedString.nullable().optional(),
  pricing: z.object({
    amount: z.number().nonnegative().nullable(),
    currency: z.string().trim().min(2).default("GHS"),
    isFree: checkboxBoolean.default(false),
  }),
  tags: z.array(z.string().trim().min(1)).default([]),
  applyUrl: optionalTrimmedString.nullable().optional(),
  startDate: optionalTrimmedString.nullable().optional(),
  endDate: optionalTrimmedString.nullable().optional(),
  objectives: z.array(z.string().trim().min(1)).optional().default([]),
  requirements: z.array(z.string().trim().min(1)).optional().default([]),
  includedItems: z.array(z.string().trim().min(1)).optional().default([]),
  previewVideoUrl: optionalTrimmedString.nullable().optional(),
});

export const sitePageSchema = z.object({
  slug: optionalTrimmedString,
  eyebrow: z.string().trim().min(2, "Please add an eyebrow label."),
  title: z.string().trim().min(2, "Please add a page title."),
  description: z.string().trim().min(12, "Please add a page description."),
  intro: z.string().trim().min(12, "Please add intro copy."),
  heroImage: optionalTrimmedString,
  stats: z.array(sitePageHighlightStatSchema).min(1, "Please add at least one stat."),
  sections: z.array(sitePageSectionSchema).min(1, "Please add at least one content section."),
  ctas: z.array(sitePageActionLinkSchema).default([]),
  related: z.array(sitePageRouteCardSchema).default([]),
  courses: z.array(sitePageCourseSchema).optional().default([]),
  overviewTitle: optionalTrimmedString,
  overviewDescription: optionalTrimmedString,
  operatingEyebrow: optionalTrimmedString,
  operatingTitle: optionalTrimmedString,
  operatingDescription: optionalTrimmedString,
  principlesEyebrow: optionalTrimmedString,
  principlesTitle: optionalTrimmedString,
  principlesDescription: optionalTrimmedString,
  principlesHeroEyebrow: optionalTrimmedString,
  principlesHeroTitle: optionalTrimmedString,
  exploreEyebrow: optionalTrimmedString,
  exploreTitle: optionalTrimmedString,
  exploreDescription: optionalTrimmedString,
});

export type SitePagePayload = z.infer<typeof sitePageSchema>;

export const homepageSchema = z
  .object({
    announcement: z
      .object({
        id: optionalTrimmedString,
        variant: z.enum(["info", "success", "urgent", "alert"]).optional(),
        label: optionalTrimmedString,
        message: optionalTrimmedString,
        cta: z
          .object({
            label: optionalTrimmedString,
            href: optionalTrimmedString,
          })
          .partial()
          .optional(),
        startDate: optionalTrimmedString,
        endDate: optionalTrimmedString,
        countdownDate: optionalTrimmedString,
        dismissible: checkboxBoolean.optional(),
      })
      .partial()
      .optional(),
    heroSlides: z.array(z.unknown()).optional(),
    ticker: z.unknown().optional(),
    programmeShowcase: z.array(z.unknown()).optional(),
    donationCampaign: z.unknown().optional(),
    featuredStory: z.unknown().optional(),
    joinCtaCards: z.array(z.unknown()).optional(),
    newsletterSignup: z.unknown().optional(),
    floatingElements: z.unknown().optional(),
  })
  .partial();

export type HomepagePayload = z.infer<typeof homepageSchema>;

export const highlightStatSchema = z.object({
  value: z.string().trim().min(1),
  label: z.string().trim().min(1),
  description: optionalTrimmedString,
  icon: optionalTrimmedString,
});

const contactPageChannelSchema = z.object({
  label: z.string().trim().min(1, "Please add a channel label."),
  value: z.string().trim().min(1, "Please add a channel value."),
  description: z.string().trim().min(1, "Please add a channel description."),
  href: z.string().trim().min(1, "Please add a channel link."),
});

const contactPageEnquiryOptionSchema = z.object({
  value: z.enum([
    "training",
    "organisation",
    "partnership",
    "donation",
    "media",
    "volunteering",
    "general",
  ]),
  label: z.string().trim().min(1, "Please add an option label."),
  description: z.string().trim().min(1, "Please add an option description."),
});

const contactPageResponseStepSchema = z.object({
  number: z.string().trim().min(1, "Please add a step number."),
  title: z.string().trim().min(1, "Please add a step title."),
  description: z.string().trim().min(1, "Please add a step description."),
});

const contactPageRouteCardSchema = z.object({
  href: z.string().trim().min(1, "Please add a card destination."),
  eyebrow: optionalTrimmedString,
  title: z.string().trim().min(1, "Please add a card title."),
  description: z.string().trim().min(1, "Please add a card description."),
});

export const contactPageSchema = z
  .object({
    eyebrow: optionalTrimmedString,
    title: optionalTrimmedString,
    description: optionalTrimmedString,
    heroImage: optionalTrimmedString,
    stats: z.array(highlightStatSchema).optional(),
    channels: z.array(contactPageChannelSchema).optional(),
    enquiryOptions: z.array(contactPageEnquiryOptionSchema).optional(),
    responseSteps: z.array(contactPageResponseStepSchema).optional(),
    routeCards: z.array(contactPageRouteCardSchema).optional(),
    privacyNote: optionalTrimmedString,
  })
  .partial();

export type ContactPagePayload = z.infer<typeof contactPageSchema>;

// ─── Impact stats validators ────────────────────────────────────────────────

export const impactStatsSchema = z.object({
  stats: z.array(highlightStatSchema).min(1),
});

export type ImpactStatsPayload = z.infer<typeof impactStatsSchema>;

export const impactPageSchema = z.record(z.unknown());

export type ImpactPagePayload = z.infer<typeof impactPageSchema>;

// ─── Partnership validators (Tier 1 with JSON bridges) ─────────────────────

const partnershipOverviewCardSchema = z.object({
  title: z.string().trim().min(1, "Please add a card title."),
  description: z.string().trim().min(1, "Please add a card description."),
});

const partnershipFocusCardSchema = z.object({
  title: z.string().trim().min(1, "Please add a card title."),
  description: z.string().trim().min(1, "Please add a card description."),
  icon: z.string().trim().min(1).default(""),
  bullets: z.array(z.string().trim().min(1)).default([]),
});

const partnershipProcessStepSchema = z.object({
  number: z.string().trim().min(1, "Please add a step number."),
  title: z.string().trim().min(1, "Please add a step title."),
  description: z.string().trim().min(1, "Please add a step description."),
  icon: z.string().trim().min(1).default(""),
});

const partnershipScenarioSchema = z.object({
  title: z.string().trim().min(1, "Please add a scenario title."),
  partnerType: z.string().trim().min(1, "Please add a partner type."),
  summary: z.string().trim().min(1, "Please add a scenario summary."),
  outcome: z.string().trim().min(1, "Please add a scenario outcome."),
  highlight: z.string().trim().min(1).default(""),
});

const partnershipFaqSchema = z.object({
  question: z.string().trim().min(1, "Please add a question."),
  answer: z.string().trim().min(1, "Please add an answer."),
});

const partnershipContactCtaSchema = z.object({
  heading: z.string().trim().min(1, "Please add a contact heading."),
  description: z.string().trim().min(1, "Please add contact copy."),
  email: z.string().trim().min(1, "Please add a contact email."),
  primary: sitePageActionLinkSchema,
  secondary: sitePageActionLinkSchema,
});

export const partnershipOverviewSchema = z
  .object({
    eyebrow: optionalTrimmedString,
    title: optionalTrimmedString,
    description: optionalTrimmedString,
    heroImage: optionalTrimmedString,
    stats: z.array(highlightStatSchema).optional(),
    overviewSectionEyebrow: optionalTrimmedString,
    overviewSectionTitle: optionalTrimmedString,
    overviewSectionDescription: optionalTrimmedString,
    tracksSectionEyebrow: optionalTrimmedString,
    tracksSectionTitle: optionalTrimmedString,
    tracksSectionDescription: optionalTrimmedString,
    partnerTypesSectionEyebrow: optionalTrimmedString,
    partnerTypesSectionTitle: optionalTrimmedString,
    partnerTypesSectionDescription: optionalTrimmedString,
    nextStepsSectionEyebrow: optionalTrimmedString,
    nextStepsSectionTitle: optionalTrimmedString,
    nextStepsSectionDescription: optionalTrimmedString,
    valueCards: z.array(partnershipOverviewCardSchema).optional(),
    partnerTypeCards: z.array(partnershipOverviewCardSchema).optional(),
    nextSteps: z.array(sitePageRouteCardSchema).optional(),
  })
  .partial();

export type PartnershipOverviewPayload = z.infer<typeof partnershipOverviewSchema>;

export const partnershipTrackSchema = z
  .object({
    slug: z.string().trim().min(2).optional(),
    eyebrow: optionalTrimmedString,
    title: optionalTrimmedString,
    description: optionalTrimmedString,
    tagline: optionalTrimmedString,
    heroImage: optionalTrimmedString,
    snapshotEyebrow: optionalTrimmedString,
    stats: z.array(highlightStatSchema).optional(),
    overviewSectionEyebrow: optionalTrimmedString,
    overviewSectionTitle: optionalTrimmedString,
    overviewSectionDescription: optionalTrimmedString,
    overviewCardBadgeLabel: optionalTrimmedString,
    focusCards: z.array(partnershipFocusCardSchema).optional(),
    howItWorksSectionEyebrow: optionalTrimmedString,
    howItWorksSectionTitle: optionalTrimmedString,
    howItWorksSectionDescription: optionalTrimmedString,
    howItWorks: z.array(partnershipProcessStepSchema).optional(),
    scenariosSectionEyebrow: optionalTrimmedString,
    scenariosSectionTitle: optionalTrimmedString,
    scenariosSectionDescription: optionalTrimmedString,
    scenarios: z.array(partnershipScenarioSchema).optional(),
    faqsSectionEyebrow: optionalTrimmedString,
    faqsSectionTitle: optionalTrimmedString,
    faqsSectionDescription: optionalTrimmedString,
    faqs: z.array(partnershipFaqSchema).optional(),
    contactSectionEyebrow: optionalTrimmedString,
    contactCta: partnershipContactCtaSchema.optional(),
    relatedSectionEyebrow: optionalTrimmedString,
    relatedSectionTitle: optionalTrimmedString,
    relatedSectionDescription: optionalTrimmedString,
    related: z.array(sitePageRouteCardSchema).optional(),
  })
  .partial();

export type PartnershipTrackPayload = z.infer<typeof partnershipTrackSchema>;
