export const FIREBASE_COLLECTIONS = {
  homepage: "homepage",
  initiatives: "initiatives",
  forOrganisations: "forOrganisations",
  articles: "articles",
  team: "team",
  partners: "partners",
  testimonials: "testimonials",
  jobListings: "jobListings",
  impactStats: "impactStats",
  siteContent: "siteContent",
  applications: "applications",
  contactMessages: "contactMessages",
  newsletterSubs: "newsletterSubs",
  users: "users",
  auditLog: "auditLog",
  settings: "settings",
} as const;

export type FirebaseCollection = keyof typeof FIREBASE_COLLECTIONS;

export interface FirebaseScaffoldSettings {
  projectId?: string;
  storageBucket?: string;
  authDomain?: string;
}

export interface RevalidationPayload {
  paths: string[];
  secret?: string;
}
