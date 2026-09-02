export const FIREBASE_COLLECTIONS = {
  homepage: "homepage",
  initiatives: "initiatives",
  forOrganisations: "forOrganisations",
  partnerships: "partnerships",
  articles: "articles",
  newsPages: "newsPages",
  departments: "departments",
  team: "team",
  partners: "partners",
  testimonials: "testimonials",
  jobListings: "jobListings",
  impactStats: "impactStats",
  impactPages: "impactPages",
  siteContent: "siteContent",
  applications: "applications",
  contactMessages: "contactMessages",
  newsletterSubs: "newsletterSubs",
  users: "users",
  auditLog: "auditLog",
  settings: "settings",
  trainingCohorts: "trainingCohorts",
  // IT for Youth Laptop Bank (build spec §4). The first six are the CMS
  // content types; the last two hold form submissions from §6.1 and §6.2.
  laptopBankStages: "laptopBankStages",
  laptopBankIntake: "laptopBankIntake",
  laptopBankDonors: "laptopBankDonors",
  laptopBankStories: "laptopBankStories",
  laptopBankMetrics: "laptopBankMetrics",
  laptopBankDocuments: "laptopBankDocuments",
  laptopBankOffers: "laptopBankOffers",
  laptopBankApplications: "laptopBankApplications",
  // Holds the {{TOKEN}} values document (spec 5.1: single source in the CMS).
  laptopBankSettings: "laptopBankSettings",
  laptopBankPages: "laptopBankPages",
  laptopBankFaqs: "laptopBankFaqs",
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
