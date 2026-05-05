export interface ActionLink {
  label: string;
  href: string;
}

/**
 * types/content.ts
 *
 * Shared content types used across components and site-config.
 * Keep this as the single source for primitive content shapes.
 */

export type HighlightStat = {
  value: string;
  label: string;
  description?: string;
  icon?: string;
};

export type RouteCard = {
  href: string;
  eyebrow?: string;
  title: string;
  description: string;
};

export type NavItem = {
  label: string;
  href?: string;
  items?: { label: string; href: string }[];
};

export interface ContentBlock {
  title: string;
  body: string;
  bullets?: string[];
}


export interface SitePage {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  stats: HighlightStat[];
  sections: ContentBlock[];
  ctas: ActionLink[];
  related: RouteCard[];
}

export interface HomepageSection {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  variant: "light" | "navy" | "gold";
  cta?: ActionLink;
  items?: string[];
}

export interface InitiativeProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface InitiativeAudience {
  summary: string;
  groups: string[];
  eligibility: string[];
}

export interface InitiativeGalleryImage {
  src: string;
  alt: string;
}

export interface InitiativeTestimonial {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface InitiativePartner {
  name: string;
  description: string;
  href?: string;
  logo?: string;
}

export interface InitiativeFaq {
  question: string;
  answer: string;
}

export interface InitiativeApplyCta {
  heading: string;
  description: string;
  primary: ActionLink;
  secondary: ActionLink;
}

export interface InitiativePage extends SitePage {
  tagline: string;
  heroImage: string;
  overviewImage: string;
  mission: string;
  objectives: string[];
  howItWorks: InitiativeProcessStep[];
  impactStats: HighlightStat[];
  audience: InitiativeAudience;
  gallery: InitiativeGalleryImage[];
  testimonials: InitiativeTestimonial[];
  partners: InitiativePartner[];
  faqs: InitiativeFaq[];
  applyCta: InitiativeApplyCta;
}

export interface ArticleSeed {
  slug: string;
  category: "news" | "blogs";
  title: string;
  excerpt: string;
  publishedAt: string;
  coverImage?: string;
  readTimeMinutes?: number;
  content: string[];
}

export interface TrainingFocusCard {
  title: string;
  description: string;
}

export interface TrainingCohort {
  id: string;
  name: string;
  startDate: string;
  applicationDeadline?: string;
  summary: string;
  format: string;
  duration: string;
  location: string;
  status: "open" | "upcoming" | "waitlist";
}

export interface TrainingProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface TrainingAudienceCard {
  title: string;
  description: string;
  bullets: string[];
}

export interface TrainingTimelineItem {
  label: string;
  title: string;
  description: string;
}

export interface TrainingLandingContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  stats: HighlightStat[];
  routeCards: RouteCard[];
  focusAreas: TrainingFocusCard[];
  supportPoints: string[];
  cohorts: TrainingCohort[];
  process: TrainingProcessStep[];
}

export interface TrainingCatalogContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  highlights: string[];
  cohorts: TrainingCohort[];
  process: TrainingProcessStep[];
}

export interface TrainingEligibilityContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  audienceCards: TrainingAudienceCard[];
  readinessPoints: string[];
  nextSteps: RouteCard[];
}

export interface TrainingHowItWorksContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  process: TrainingProcessStep[];
  timeline: TrainingTimelineItem[];
  checklist: string[];
  nextSteps: RouteCard[];
}

export interface OrganisationOverviewCard {
  title: string;
  description: string;
}

export interface OrganisationServiceCard {
  title: string;
  description: string;
  icon: string;
  bullets: string[];
}

export interface OrganisationProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface OrganisationCaseStudy {
  title: string;
  organisationType: string;
  summary: string;
  outcome: string;
  highlight: string;
}

export interface OrganisationPackage {
  name: string;
  price: string;
  description: string;
  features: string[];
  note?: string;
}

export interface OrganisationFaq {
  question: string;
  answer: string;
}

export interface OrganisationContactCta {
  heading: string;
  description: string;
  email: string;
  primary: ActionLink;
  secondary: ActionLink;
}

export interface OrganisationServicePage {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  tagline: string;
  heroImage: string;
  stats: HighlightStat[];
  overviewCards: OrganisationServiceCard[];
  howItWorks: OrganisationProcessStep[];
  caseStudies: OrganisationCaseStudy[];
  pricingHeadline?: string;
  pricingDescription?: string;
  packages?: OrganisationPackage[];
  faqs: OrganisationFaq[];
  contactCta: OrganisationContactCta;
  related: RouteCard[];
}

export interface OrganisationOverviewContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  stats: HighlightStat[];
  valueCards: OrganisationOverviewCard[];
  engagementCards: OrganisationOverviewCard[];
  nextSteps: RouteCard[];
}

export interface PartnershipOverviewCard {
  title: string;
  description: string;
}

export interface PartnershipFocusCard {
  title: string;
  description: string;
  icon: string;
  bullets: string[];
}

export interface PartnershipProcessStep {
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface PartnershipScenario {
  title: string;
  partnerType: string;
  summary: string;
  outcome: string;
  highlight: string;
}

export interface PartnershipFaq {
  question: string;
  answer: string;
}

export interface PartnershipContactCta {
  heading: string;
  description: string;
  email: string;
  primary: ActionLink;
  secondary: ActionLink;
}

export interface PartnershipTrackPage {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  tagline: string;
  heroImage: string;
  stats: HighlightStat[];
  focusCards: PartnershipFocusCard[];
  howItWorks: PartnershipProcessStep[];
  scenarios: PartnershipScenario[];
  faqs: PartnershipFaq[];
  contactCta: PartnershipContactCta;
  related: RouteCard[];
}

export interface PartnershipOverviewContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  stats: HighlightStat[];
  valueCards: PartnershipOverviewCard[];
  partnerTypeCards: PartnershipOverviewCard[];
  nextSteps: RouteCard[];
}

export interface ImpactEvidenceCard {
  title: string;
  description: string;
  icon: string;
  bullets: string[];
}

export interface ImpactReportResource {
  id: string;
  year: string;
  title: string;
  summary: string;
  href: string;
  fileLabel: string;
  highlights: string[];
}

export interface ImpactFeaturedStory {
  label: string;
  headline: string;
  quote: string;
  name: string;
  role: string;
  programme: string;
  backgroundImage: string;
  videoUrl?: string;
  primaryCtaLabel: string;
  secondaryCta: ActionLink;
}

export interface ImpactStory {
  id: string;
  title: string;
  quote: string;
  name: string;
  role: string;
  programme: string;
  year: string;
  theme: string;
  image?: string;
  format: "written" | "video" | "partner";
}

export interface ImpactSdgGoal {
  goal: string;
  title: string;
  summary: string;
  icon: string;
  contributions: string[];
  linkedRoutes: RouteCard[];
}

export interface ImpactOverviewContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  stats: HighlightStat[];
  measurementCards: ImpactEvidenceCard[];
  proofPoints: string[];
  routeCards: RouteCard[];
}

export interface ImpactReportsContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  stats: HighlightStat[];
  reportResources: ImpactReportResource[];
  evidenceCards: ImpactEvidenceCard[];
  methodologyPoints: string[];
  related: RouteCard[];
}

export interface ImpactTestimonialsContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  featuredStory: ImpactFeaturedStory;
  stories: ImpactStory[];
  themes: string[];
  related: RouteCard[];
}

export interface ImpactSdgsContent {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  stats: HighlightStat[];
  goals: ImpactSdgGoal[];
  alignmentPrinciples: string[];
  related: RouteCard[];
}
