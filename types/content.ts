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
