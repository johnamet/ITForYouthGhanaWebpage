import { z } from "zod";

const optionalTrimmedString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().optional(),
);

const editableCmsString = z.string().trim().optional();

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

const optionalDate = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date.")
    .optional(),
);

const organisationEnquiryBaseSchema = z.object({
  organisationName: z.string().trim().min(2, "Please enter the organisation name."),
  organisationWebsite: optionalUrl,
  industry: z.string().trim().min(2, "Please enter the organisation's sector or industry."),
  contactName: z.string().trim().min(2, "Please enter the main contact's name."),
  contactRole: z.string().trim().min(2, "Please enter the main contact's role."),
  workEmail: z.string().trim().email("Please enter a valid work email address."),
  phone: z.string().trim().min(7, "Please enter a contact phone number."),
  preferredContact: z.enum(["email", "phone", "either"]).default("email"),
  consent: consentBoolean,
  // Honeypot. Real users never see or complete this field.
  companyFax: optionalTrimmedString,
});

const jobVacancyEnquirySchema = organisationEnquiryBaseSchema.extend({
  kind: z.literal("job-vacancy"),
  roleTitle: z.string().trim().min(2, "Please enter the vacancy title."),
  opportunityType: z.enum([
    "full-time",
    "part-time",
    "internship",
    "graduate-programme",
    "contract",
    "apprenticeship",
  ]),
  team: optionalTrimmedString,
  numberOfOpenings: z.coerce
    .number()
    .int()
    .min(1, "Please enter at least one opening.")
    .max(500, "Please enter 500 openings or fewer."),
  jobLocation: z.string().trim().min(2, "Please enter the role location."),
  workArrangement: z.enum(["on-site", "hybrid", "remote"]),
  entryLevelFit: z.enum(["yes", "no", "depends"]),
  applicationDeadline: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid application deadline."),
  expectedStartDate: optionalDate,
  compensation: optionalTrimmedString,
  roleSummary: z.string().trim().min(30, "Please describe the role in at least 30 characters."),
  requirements: z.string().trim().min(20, "Please share the main skills or requirements."),
  applicationMethod: z.string().trim().min(10, "Please explain how candidates should apply."),
  additionalNotes: optionalTrimmedString,
});

const staffVolunteeringEnquirySchema = organisationEnquiryBaseSchema.extend({
  kind: z.literal("staff-volunteering"),
  organisationAddress: z.string().trim().min(5, "Please enter the organisation's address."),
  numberOfStaff: z.coerce
    .number()
    .int()
    .min(1, "Please enter at least one staff volunteer.")
    .max(500, "Please enter 500 staff volunteers or fewer."),
  volunteeringAreas: z
    .array(
      z.enum([
        "mentoring",
        "workshops",
        "career-talks",
        "cv-portfolio-reviews",
        "mock-interviews",
        "event-judging",
        "project-coaching",
        "other",
      ]),
    )
    .min(1, "Please select at least one way your staff would like to help."),
  staffExpertise: z.string().trim().min(20, "Please describe the skills your staff can offer."),
  engagementLength: z.enum(["one-off", "short-series", "ongoing", "not-sure"]),
  availability: z.string().trim().min(5, "Please share a preferred date or availability window."),
  deliveryMode: z.enum(["in-person", "remote", "hybrid", "flexible"]),
  preferredLocation: optionalTrimmedString,
  numberOfLearners: z.preprocess(
    (value) => (value === "" || value === undefined || value === null ? undefined : Number(value)),
    z.number().int().min(1).max(1000).optional(),
  ),
  goals: z.string().trim().min(20, "Please tell us what a useful engagement would achieve."),
  additionalNotes: optionalTrimmedString,
});

export const organisationEnquirySchema = z.discriminatedUnion("kind", [
  jobVacancyEnquirySchema,
  staffVolunteeringEnquirySchema,
]);

export type OrganisationEnquiryPayload = z.infer<typeof organisationEnquirySchema>;

export const teamSchema = z.object({
  name: z.string().trim().min(2, "Please enter a name."),
  role: z.string().trim().min(2, "Please enter a role."),
  department: z.string().trim().min(2, "Please enter a department."),
  departmentId: optionalTrimmedString,
  departmentSlug: optionalTrimmedString,
  bio: z.string().trim().min(10, "Please enter a short biography."),
  photo: optionalTrimmedString,
  email: optionalEmail,
  linkedin: optionalUrl,
  featured: checkboxBoolean.default(false),
  status: z.enum(["active", "inactive"]).default("active"),
  order: optionalNumber,
});

export type TeamPayload = z.infer<typeof teamSchema>;

// ─── Department validators ──────────────────────────────────────────────────

const departmentServiceSchema = z.object({
  title: z.string().trim().min(2, "Please add a service title."),
  body: z.string().trim().min(10, "Please add service copy."),
  bullets: z.array(z.string().trim().min(1)).default([]),
});

const departmentWorkflowSchema = z.object({
  title: z.string().trim().min(2, "Please add a workflow step title."),
  description: z.string().trim().min(10, "Please add workflow step copy."),
});

const departmentResourceSchema = z.object({
  label: z.string().trim().min(2, "Please add a resource label."),
  href: z.string().trim().min(1, "Please add a resource link."),
  description: optionalTrimmedString,
});

const departmentHighlightStatSchema = z.object({
  value: z.string().trim().min(1, "Please add a stat value."),
  label: z.string().trim().min(2, "Please add a stat label."),
  description: optionalTrimmedString,
  icon: optionalTrimmedString,
  // New optional image URL for icon
  iconImage: optionalTrimmedString,
});

const departmentActionLinkSchema = z.object({
  label: z.string().trim().min(2, "Please add a link label."),
  href: z.string().trim().min(1, "Please add a link destination."),
});

const departmentContactSchema = z
  .object({
    name: optionalTrimmedString,
    role: optionalTrimmedString,
    email: optionalEmail,
  })
  .partial()
  .default({});

export const departmentSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Please add a URL slug.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  eyebrow: z.string().trim().min(2, "Please add an eyebrow label."),
  title: z.string().trim().min(2, "Please add a department title."),
  summary: z.string().trim().default(""),
  description: z.string().trim().default(""),
  intro: z.string().trim().default(""),
  mission: z.string().trim().min(12, "Please add a mission statement."),
  heroImage: editableCmsString,
  icon: optionalTrimmedString,
  // New optional image URL for icon
  iconImage: optionalTrimmedString,
  color: optionalTrimmedString,
  responsibilities: z.array(z.string().trim().min(1)).min(1, "Please add at least one responsibility."),
  services: z.array(departmentServiceSchema).default([]),
  workflows: z.array(departmentWorkflowSchema).default([]),
  priorities: z.array(z.string().trim().min(1)).default([]),
  stats: z.array(departmentHighlightStatSchema).default([]),
  teamMemberIds: z.array(z.string().trim().min(1)).default([]),
  resources: z.array(departmentResourceSchema).default([]),
  contact: departmentContactSchema,
  ctas: z.array(departmentActionLinkSchema).default([]),
  featured: checkboxBoolean.default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  order: optionalNumber,
});

export type DepartmentPayload = z.infer<typeof departmentSchema>;

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
  logoUrl: optionalTrimmedString,
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
  // New optional image URL for icon
  iconImage: optionalTrimmedString,
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

const trainingCohortSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  startDate: z.string().trim().min(1),
  applicationDeadline: optionalTrimmedString,
  summary: z.string().trim().min(1),
  format: z.string().trim().min(1),
  duration: z.string().trim().min(1),
  location: z.string().trim().min(1),
  status: z.enum(["open", "upcoming", "waitlist"]),
});

const trainingProcessStepSchema = z.object({
  number: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  icon: z.string().trim().default(""),
  iconImage: optionalTrimmedString,
});

export const sitePageSchema = z.object({
  slug: optionalTrimmedString,
  eyebrow: z.string().trim().min(2, "Please add an eyebrow label."),
  title: z.string().trim().min(2, "Please add a page title."),
  description: z.string().trim().default(""),
  intro: z.string().trim().default(""),
  heroImage: optionalTrimmedString,
  heroVideoUrl: optionalTrimmedString,
  heroVideoThumbnail: optionalTrimmedString,
  stats: z.array(sitePageHighlightStatSchema).default([]),
  sections: z.array(sitePageSectionSchema).default([]),
  ctas: z.array(sitePageActionLinkSchema).default([]),
  related: z.array(sitePageRouteCardSchema).default([]),
  courses: z.array(sitePageCourseSchema).optional().default([]),
  cohorts: z.array(trainingCohortSchema).optional().default([]),
  process: z.array(trainingProcessStepSchema).optional().default([]),
  overviewTitle: editableCmsString,
  overviewDescription: editableCmsString,
  operatingEyebrow: editableCmsString,
  operatingTitle: editableCmsString,
  operatingDescription: editableCmsString,
  principlesEyebrow: editableCmsString,
  principlesTitle: editableCmsString,
  principlesDescription: editableCmsString,
  principlesHeroEyebrow: editableCmsString,
  principlesHeroTitle: editableCmsString,
  principlesImage: editableCmsString,
  principlesImageAlt: editableCmsString,
  highlightsEyebrow: editableCmsString,
  exploreEyebrow: editableCmsString,
  exploreTitle: editableCmsString,
  exploreDescription: editableCmsString,
  processEyebrow: editableCmsString,
  processTitle: editableCmsString,
  processDescription: editableCmsString,
  nextStepEyebrow: editableCmsString,
  nextStepTitle: editableCmsString,
  nextStepDescription: editableCmsString,
});

export type SitePagePayload = z.infer<typeof sitePageSchema>;

export const dynamicSitePageSchema = sitePageSchema.extend({
  slug: z
    .string()
    .trim()
    .min(3, "Please add a URL slug.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  order: optionalNumber,
});

export type DynamicSitePagePayload = z.infer<typeof dynamicSitePageSchema>;

// ─── What We Do / Initiative validators ─────────────────────────────────────

const initiativeActionLinkSchema = z.object({
  label: z.string().trim().min(1, "Please add a link label."),
  href: z.string().trim().min(1, "Please add a link destination."),
});

const initiativeRouteCardSchema = z.object({
  href: z.string().trim().min(1, "Please add a card destination."),
  eyebrow: optionalTrimmedString,
  title: z.string().trim().min(1, "Please add a card title."),
  description: z.string().trim().min(1, "Please add a card description."),
});

const initiativeHighlightStatSchema = z.object({
  value: z.string().trim().min(1, "Please add a stat value."),
  label: z.string().trim().min(1, "Please add a stat label."),
  description: optionalTrimmedString,
  icon: optionalTrimmedString,
  iconImage: optionalTrimmedString,
});

const initiativeContentBlockSchema = z.object({
  title: z.string().trim().min(1, "Please add a section title."),
  body: z.string().trim().min(1, "Please add section copy."),
  bullets: z.array(z.string().trim().min(1)).optional().default([]),
});

const initiativeProcessStepSchema = z.object({
  number: z.string().trim().min(1, "Please add a step number."),
  title: z.string().trim().min(1, "Please add a step title."),
  description: z.string().trim().min(1, "Please add step copy."),
  icon: z.string().trim().default(""),
  iconImage: optionalTrimmedString,
});

const initiativeAudienceSchema = z.object({
  summary: z.string().trim().min(1, "Please add audience summary copy."),
  groups: z.array(z.string().trim().min(1)).default([]),
  eligibility: z.array(z.string().trim().min(1)).default([]),
});

const initiativeGalleryImageSchema = z.object({
  src: z.string().trim().min(1, "Please add an image URL."),
  alt: z.string().trim().min(1, "Please add image alt text."),
});

const initiativeTestimonialSchema = z.object({
  quote: z.string().trim().min(1, "Please add the quote."),
  name: z.string().trim().min(1, "Please add a name."),
  role: z.string().trim().min(1, "Please add a role."),
  avatar: optionalTrimmedString,
});

const initiativePartnerSchema = z.object({
  name: z.string().trim().min(1, "Please add a partner name."),
  description: z.string().trim().min(1, "Please add partner context."),
  href: optionalTrimmedString,
  logo: optionalTrimmedString,
});

const initiativeFaqSchema = z.object({
  question: z.string().trim().min(1, "Please add a question."),
  answer: z.string().trim().min(1, "Please add an answer."),
});

const initiativeApplyCtaSchema = z.object({
  heading: z.string().trim().min(1, "Please add a CTA heading."),
  description: z.string().trim().min(1, "Please add CTA copy."),
  primary: initiativeActionLinkSchema,
  secondary: initiativeActionLinkSchema,
});

const initiativeSectionContentSchema = z.object({
  overviewEyebrow: z.string().trim().default(""),
  overviewTitle: z.string().trim().default(""),
  overviewImageAlt: z.string().trim().default(""),
  howItWorksEyebrow: z.string().trim().default(""),
  howItWorksTitle: z.string().trim().default(""),
  howItWorksDescription: z.string().trim().default(""),
  impactEyebrow: z.string().trim().default(""),
  impactTitle: z.string().trim().default(""),
  impactDescription: z.string().trim().default(""),
  audienceEyebrow: z.string().trim().default(""),
  eligibilityEyebrow: z.string().trim().default(""),
  galleryEyebrow: z.string().trim().default(""),
  galleryTitle: z.string().trim().default(""),
  galleryDescription: z.string().trim().default(""),
  testimonialsEyebrow: z.string().trim().default(""),
  testimonialsTitle: z.string().trim().default(""),
  testimonialsDescription: z.string().trim().default(""),
  partnersEyebrow: z.string().trim().default(""),
  partnersTitle: z.string().trim().default(""),
  partnersDescription: z.string().trim().default(""),
  partnerLinkLabel: z.string().trim().default(""),
  faqsEyebrow: z.string().trim().default(""),
  faqsTitle: z.string().trim().default(""),
  faqsDescription: z.string().trim().default(""),
  applyCtaEyebrow: z.string().trim().default(""),
  relatedEyebrow: z.string().trim().default(""),
  relatedTitle: z.string().trim().default(""),
  relatedDescription: z.string().trim().default(""),
  shareEyebrow: z.string().trim().default(""),
  quickLinksEyebrow: z.string().trim().default(""),
});

export const initiativeSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3, "Please add a URL slug.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  eyebrow: z.string().trim().min(1, "Please add an eyebrow label."),
  title: z.string().trim().min(1, "Please add a page title."),
  description: z.string().trim().default(""),
  intro: z.string().trim().default(""),
  stats: z.array(initiativeHighlightStatSchema).default([]),
  sections: z.array(initiativeContentBlockSchema).default([]),
  ctas: z.array(initiativeActionLinkSchema).default([]),
  related: z.array(initiativeRouteCardSchema).default([]),
  tagline: z.string().trim().default(""),
  heroImage: z.string().trim().min(1, "Please add a hero image."),
  overviewImage: z.string().trim().min(1, "Please add an overview image."),
  mission: z.string().trim().min(1, "Please add mission copy."),
  objectives: z.array(z.string().trim().min(1)).default([]),
  howItWorks: z.array(initiativeProcessStepSchema).default([]),
  impactStats: z.array(initiativeHighlightStatSchema).default([]),
  audience: initiativeAudienceSchema,
  gallery: z.array(initiativeGalleryImageSchema).default([]),
  testimonials: z.array(initiativeTestimonialSchema).default([]),
  partners: z.array(initiativePartnerSchema).default([]),
  faqs: z.array(initiativeFaqSchema).default([]),
  applyCta: initiativeApplyCtaSchema,
  sectionContent: initiativeSectionContentSchema,
  quickLinks: z.array(initiativeActionLinkSchema).default([]),
  /**
   * C13 — the Laptop Bank cross-link block (Laptop Bank build spec §8).
   * Optional so it round-trips through the CMS: spec §8 requires the block to
   * be editable per page, and Community Outreach has no block at launch.
   * Without this field a CMS write would silently strip the seeded block.
   */
  relatedProgramme: z
    .object({
      body: z.string().trim(),
      linkLabel: z.string().trim(),
      href: z.string().trim(),
    })
    .optional(),
});

export type InitiativePayload = z.infer<typeof initiativeSchema>;

const whatWeDoHeroStatSchema = z.object({
  label: z.string().trim().min(1, "Please add a stat label."),
  description: z.string().trim().min(1, "Please add stat context."),
});

const whatWeDoEcosystemCardSchema = z.object({
  eyebrow: z.string().trim().min(1, "Please add an eyebrow label."),
  title: z.string().trim().min(1, "Please add a card title."),
  description: z.string().trim().min(1, "Please add card copy."),
  image: optionalTrimmedString,
  imageAlt: optionalTrimmedString,
});

const whatWeDoPathwayCardSchema = z.object({
  title: z.string().trim().min(1, "Please add a card title."),
  description: z.string().trim().min(1, "Please add card copy."),
});

const whatWeDoGalleryItemSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string().trim().min(1, "Please add a resource URL."),
  title: z.string().trim().min(1, "Please add a media title."),
  description: optionalTrimmedString,
  thumbnailUrl: optionalTrimmedString,
});

export const whatWeDoOverviewSchema = z.object({
  eyebrow: z.string().trim().min(1, "Please add an eyebrow label."),
  title: z.string().trim().min(1, "Please add a page title."),
  description: z.string().trim().default(""),
  heroImage: z.string().trim().min(1, "Please add a hero image."),
  heroStats: z.array(whatWeDoHeroStatSchema).min(4, "Please keep four hero stat labels."),
  overviewSectionEyebrow: optionalTrimmedString,
  overviewSectionTitle: optionalTrimmedString,
  overviewSectionDescription: optionalTrimmedString,
  ecosystemCards: z.array(whatWeDoEcosystemCardSchema).default([]),
  initiativesSectionEyebrow: optionalTrimmedString,
  initiativesSectionTitle: optionalTrimmedString,
  initiativesSectionDescription: optionalTrimmedString,
  gallerySectionEyebrow: optionalTrimmedString,
  gallerySectionTitle: optionalTrimmedString,
  gallerySectionDescription: optionalTrimmedString,
  galleryItems: z.array(whatWeDoGalleryItemSchema).default([]),
  pathwaysSectionEyebrow: optionalTrimmedString,
  pathwaysSectionTitle: optionalTrimmedString,
  pathwaysSectionDescription: optionalTrimmedString,
  pathwayCards: z.array(whatWeDoPathwayCardSchema).default([]),
  nextStepsSectionEyebrow: optionalTrimmedString,
  nextStepsSectionTitle: optionalTrimmedString,
  nextStepsSectionDescription: optionalTrimmedString,
  nextSteps: z.array(initiativeRouteCardSchema).default([]),
});

export type WhatWeDoOverviewPayload = z.infer<typeof whatWeDoOverviewSchema>;

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
    overviewSection: z.unknown().optional(),
    challengeSection: z.unknown().optional(),
    missionSection: z.unknown().optional(),
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
  // New optional image URL for icon
  iconImage: optionalTrimmedString,
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
    eyebrow: editableCmsString,
    title: editableCmsString,
    description: editableCmsString,
    heroImage: editableCmsString,
    stats: z.array(highlightStatSchema).optional(),
    channels: z.array(contactPageChannelSchema).optional(),
    enquiryOptions: z.array(contactPageEnquiryOptionSchema).optional(),
    responseSteps: z.array(contactPageResponseStepSchema).optional(),
    routeCards: z.array(contactPageRouteCardSchema).optional(),
    privacyNote: editableCmsString,
    channelsEyebrow: editableCmsString,
    channelsTitle: editableCmsString,
    channelsDescription: editableCmsString,
    formEyebrow: editableCmsString,
    formTitle: editableCmsString,
    formDescription: editableCmsString,
    messageEyebrow: editableCmsString,
    messageTitle: editableCmsString,
    messageDescription: editableCmsString,
    privacyTitle: editableCmsString,
    routesEyebrow: editableCmsString,
    routesTitle: editableCmsString,
    routesDescription: editableCmsString,
    emailCtaLabel: editableCmsString,
    formCtaLabel: editableCmsString,
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
  image: optionalTrimmedString,
  imageAlt: optionalTrimmedString,
});

const partnershipFocusCardSchema = z.object({
  title: z.string().trim().min(1, "Please add a card title."),
  description: z.string().trim().min(1, "Please add a card description."),
  icon: z.string().trim().min(1).default(""),
  // Optional image URL alternative to icon
  iconImage: optionalTrimmedString,
  image: optionalTrimmedString,
  imageAlt: optionalTrimmedString,
  bullets: z.array(z.string().trim().min(1)).default([]),
});

const partnershipProcessStepSchema = z.object({
  number: z.string().trim().min(1, "Please add a step number."),
  title: z.string().trim().min(1, "Please add a step title."),
  description: z.string().trim().min(1, "Please add a step description."),
  icon: z.string().trim().min(1).default(""),
  // Optional image URL alternative to icon
  iconImage: optionalTrimmedString,
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
    overviewVideoUrl: optionalTrimmedString,
    overviewVideoTitle: optionalTrimmedString,
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
    overviewVideoUrl: optionalTrimmedString,
    overviewVideoTitle: optionalTrimmedString,
  })
  .partial();

export type PartnershipTrackPayload = z.infer<typeof partnershipTrackSchema>;

// ─── User validators ───────────────────────────────────────────────────────────

export const userSchema = z.object({
  name: z.string().trim().min(2, "Please enter a name."),
  email: z.string().trim().email("Please enter a valid email address."),
  role: z.enum(["super-admin", "editor", "viewer", "file-server-only"]).default("viewer"),
  status: z.enum(["active", "inactive"]).default("active"),
  notes: optionalTrimmedString,
});

export type UserPayload = z.infer<typeof userSchema>;

// ─── Admin update schemas for operational records ───────────────────────────

export const applicationAdminUpdateSchema = z.object({
  status: z.enum(["new", "reviewed", "shortlisted", "rejected", "enrolled"]),
  notes: optionalTrimmedString,
});

export type ApplicationAdminUpdatePayload = z.infer<typeof applicationAdminUpdateSchema>;

export const contactMessageAdminUpdateSchema = z.object({
  status: z.enum(["new", "reviewed", "archived"]),
  notes: optionalTrimmedString,
});

export type ContactMessageAdminUpdatePayload = z.infer<typeof contactMessageAdminUpdateSchema>;

// ─── IT for Youth Laptop Bank ─────────────────────────────────────────────────
//
// Build spec §6.1 and §6.2. Enum values are the spec's own options; do not add
// to them without a spec change, because several of them write straight through
// to a CMS field (public recognition → Donor.display_consent).

/**
 * A consent that must be actively given. Spec §7: "Consent checkboxes are never
 * pre-ticked and never bundled. Store each consent as its own boolean with a
 * timestamp." Each one is therefore its own literal(true) field, never a single
 * combined flag.
 */
const requiredConsent = z.preprocess(
  (value) => value === true || value === "true" || value === "on",
  z.literal(true, {
    errorMap: () => ({ message: "Please tick this box to continue." }),
  }),
);

const optionalConsent = z.preprocess(
  (value) => value === true || value === "true" || value === "on",
  z.boolean().default(false),
);

/**
 * Ghana mobile numbers, in the two forms people actually type: +233XXXXXXXXX
 * and 0XXXXXXXXX. Draft 1 §13.1 asks that both be accepted and normalised.
 */
const ghanaPhone = z
  .string()
  .trim()
  .regex(
    /^(?:\+233|0)\d{9}$/,
    "Please enter a Ghana phone number, starting either +233 or 0.",
  );

export const equipmentOfferSchema = z.object({
  // Step 1 — About your organisation
  organisationName: z.string().trim().min(2, "Please enter your organisation's name."),
  sector: z
    .enum([
      "banking",
      "telecoms",
      "mining",
      "oil-and-gas",
      "public-sector",
      "education",
      "ngo",
      "technology",
      "other",
    ])
    .optional(),
  country: z.string().trim().min(2, "Please choose a country."),
  city: z.string().trim().min(2, "Please enter a city."),
  contactName: z.string().trim().min(2, "Please enter your name."),
  contactRole: z.string().trim().min(2, "Please enter your role."),
  workEmail: z.string().trim().email("Please enter a valid work email address."),
  phone: optionalTrimmedString,
  heardAboutUs: optionalTrimmedString,

  // Step 2 — About the equipment
  equipmentTypes: stringList.refine(
    (types) => types.length > 0,
    "Please choose at least one type of equipment.",
  ),
  estimatedQuantity: z.enum(["1-9", "10-49", "50-99", "100-499", "500+"]),
  approximateAge: z.enum(["under-3", "3-5", "5-7", "over-7", "mixed"]),
  makeAndModel: optionalTrimmedString,
  releasedFromManagement: z.enum(["yes", "no", "need-to-check"]),
  firmwarePasswordsCleared: z.enum(["yes", "no", "need-to-check"]),
  drivesAlreadyWiped: z.enum(["yes-with-certificates", "yes-without", "no", "unsure"]),
  drivesRetainedByYou: z.enum(["yes", "no"]),

  // Step 3 — Logistics, recognition and consent
  collectionAddress: optionalTrimmedString,
  targetTimeline: z.enum(["within-a-month", "1-3-months", "3-6-months", "later", "no-fixed-date"]),
  /** Writes directly to Donor.display_consent — spec §6.1 step 3. */
  publicRecognition: z.enum(["logo", "named", "anonymous"]),
  supportRefurbishmentCosts: optionalConsent,
  /** The one checkbox that defaults checked. It is a preference, not a consent. */
  deploymentReport: optionalConsent,
  anythingElse: optionalTrimmedString,
  privacyConsent: requiredConsent,
  marketingConsent: optionalConsent,

  /** Honeypot. Spec §6.1 BEHAVIOUR. */
  companyFax: optionalTrimmedString,
});

export type EquipmentOfferPayload = z.infer<typeof equipmentOfferSchema>;

/**
 * Spec §6.2.
 *
 * DATA CONSTRAINT, from the spec and non-negotiable: "Do not add fields for
 * household income, guardian income, bank details, or hardship documentation.
 * Do not add date of birth." Draft 1 §13.2 gives the reasoning — none of it
 * improves the selection decision, and all of it increases what the
 * organisation is liable for if this data is ever exposed. The device-access
 * question and the free-text question already provide a hardship signal.
 *
 * Anyone adding a field here should check it against that list first.
 */
export const studentApplicationSchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name."),
    preferredName: optionalTrimmedString,
    phone: ghanaPhone,
    phoneIsWhatsApp: optionalConsent,
    /** Spec §6.2: "Must differ from the primary phone." Checked in .refine below. */
    alternativeContact: z.string().trim().min(5, "Please give one alternative contact."),
    email: z.preprocess(
      (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
      z.string().trim().email("Please enter a valid email address.").optional(),
    ),
    institution: z.string().trim().min(2, "Please choose your institution."),
    programmeOfStudy: z.string().trim().min(2, "Please enter your programme of study."),
    yearOfStudy: z.string().trim().min(1, "Please choose your year of study."),
    expectedCompletionMonth: z.string().trim().min(1, "Please choose a month."),
    expectedCompletionYear: z.string().trim().regex(/^\d{4}$/, "Please choose a year."),
    studentIdentifier: z.string().trim().min(2, "Please enter your student identifier."),
    regionOfResidence: z.string().trim().min(2, "Please choose your region."),
    currentComputerAccess: z.enum([
      "none",
      "phone-only",
      "shared-machine",
      "campus-lab-or-cafe",
      "broken-laptop",
    ]),
    itfyTrack: z.string().trim().min(2, "Please choose a track, or 'Not yet enrolled'."),
    whyYouNeedIt: z
      .string()
      .trim()
      .min(20, "Please tell us a little more — at least a couple of sentences.")
      .refine((value) => countWords(value) <= 200, "Please keep this to 200 words or fewer."),
    whatYouWillDo: z
      .string()
      .trim()
      .min(20, "Please tell us a little more — at least a couple of sentences.")
      .refine((value) => countWords(value) <= 150, "Please keep this to 150 words or fewer."),
    referralSource: optionalTrimmedString,

    // Four separate commitments and consents. Spec §6.2 BEHAVIOUR: "All four
    // commitment and consent checkboxes are separate inputs. No single
    // combined checkbox."
    commitmentCompleteTrack: requiredConsent,
    commitmentPeerTeaching: requiredConsent,
    commitmentCheckIns: requiredConsent,
    loanToOwnTerms: requiredConsent,
    declarationOfTruth: requiredConsent,
    privacyConsent: requiredConsent,
    /** Optional, and refusing it must not affect the application. */
    storyAndPhotoConsent: optionalConsent,

    /** Honeypot. */
    companyFax: optionalTrimmedString,
  })
  .refine(
    (data) => normalisePhone(data.alternativeContact) !== normalisePhone(data.phone),
    {
      message: "Please give an alternative contact that is different from your main phone number.",
      path: ["alternativeContact"],
    },
  );

export type StudentApplicationPayload = z.infer<typeof studentApplicationSchema>;

/** Words, for the live counters and the hard caps in spec §6.2. */
export function countWords(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * Normalises 0XXXXXXXXX and +233XXXXXXXXX to one form, so "0241234567" and
 * "+233241234567" are correctly recognised as the same number when checking
 * that the alternative contact actually differs.
 */
export function normalisePhone(value: string): string {
  const digits = value.trim().replace(/[\s()-]/g, "");
  if (digits.startsWith("+233")) return `0${digits.slice(4)}`;
  if (digits.startsWith("233")) return `0${digits.slice(3)}`;
  return digits;
}

/**
 * Free webmail domains. Spec §6.1: a free webmail work-email domain "triggers a
 * soft prompt, not a block" — so this is used by the form for a nudge and by
 * the route only to flag the record for follow-up. It must never reject.
 */
const FREE_WEBMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
  "mail.com",
  "yandex.com",
  "gmx.com",
]);

export function isFreeWebmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1];
  return domain ? FREE_WEBMAIL_DOMAINS.has(domain) : false;
}

// ─── Laptop Bank submission review (admin) ────────────────────────────────────

/**
 * Offer statuses use the spec's own vocabulary. Spec 5.2 stage 1: an offer
 * "can be accepted in full, accepted in part, or declined with an explanation
 * and a referral to a certified recycler" — so those are the three outcomes a
 * reviewer records, plus the states either side of them.
 */
export const equipmentOfferAdminUpdateSchema = z.object({
  status: z.enum([
    "new",
    "reviewing",
    "accepted-in-full",
    "accepted-in-part",
    "declined",
    "collected",
    "archived",
  ]),
  notes: optionalTrimmedString,
});

export type EquipmentOfferAdminUpdatePayload = z.infer<typeof equipmentOfferAdminUpdateSchema>;

/**
 * Application statuses. "waiting-list" is not decoration: spec 5.7 block 5
 * promises an unsuccessful applicant that she "stays on the list for the next
 * one", and Draft 1 §9 §7 wants every applicant to get an outcome. A reviewer
 * needs a state that means exactly that.
 */
export const studentApplicationAdminUpdateSchema = z.object({
  status: z.enum([
    "new",
    "reviewed",
    "shortlisted",
    "waiting-list",
    "offered",
    "rejected",
    "enrolled",
  ]),
  notes: optionalTrimmedString,
});

export type StudentApplicationAdminUpdatePayload = z.infer<
  typeof studentApplicationAdminUpdateSchema
>;
