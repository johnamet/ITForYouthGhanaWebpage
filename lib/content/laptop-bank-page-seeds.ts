import {
  laptopBankDataSecurityContent,
  laptopBankDocumentsContent,
  laptopBankDonateEquipmentContent,
  laptopBankHowItWorksContent,
  laptopBankLandingContent,
  laptopBankPrivacyNoticeContent,
  laptopBankWhatWeAcceptContent,
} from "@/lib/content/laptop-bank-config";
import {
  herFirstLaptopApplyContent,
  herFirstLaptopContent,
  herFirstLaptopEligibilityContent,
} from "@/lib/content/her-first-laptop-config";

/**
 * The editable page copy for the Laptop Bank and Her First Laptop pages.
 *
 * WHY THIS EXISTS
 * Every other section of this site lets an editor override page copy —
 * `getCmsSitePage`, `getCmsInitiativeBySlug`, `getCmsOrganisationService`, the
 * impact and news pages — with the code holding a seed. The Laptop Bank pages
 * were the only ones reading their copy straight from a module with no
 * override path, which meant a heading change needed a developer and a
 * redeploy. Draft 1 §1's second rule for the developer is that content which
 * "change[s] often" must be editable without a code change.
 *
 * The seed stays in code and remains the fallback, so a page renders correctly
 * before anything is stored and cannot be blanked by an empty CMS record.
 *
 * ONE REGISTRY, MANY EDITORS. The admin descriptor for each page is generated
 * from its seed (see laptop-bank-admin-schema.ts), so adding a field to any
 * content object above makes it appear in the editor with no further work.
 */

export type LaptopBankPageSeed = {
  /** Document id in the `laptopBankPages` collection, and the admin route key. */
  key: string;
  label: string;
  /** The public route this copy renders on. */
  route: string;
  description: string;
  seed: Record<string, unknown>;
};

export const LAPTOP_BANK_PAGE_SEEDS: LaptopBankPageSeed[] = [
  {
    key: "laptop-bank",
    label: "Laptop Bank landing",
    route: "/laptop-bank",
    description: "Hero, the four things we handle, where the machines go, and the closing call to action.",
    seed: laptopBankLandingContent,
  },
  {
    key: "how-it-works",
    label: "How it works",
    route: "/laptop-bank/how-it-works",
    description: "Intro and section headings. The nine stages themselves are edited under Process stages.",
    seed: laptopBankHowItWorksContent,
  },
  {
    key: "what-we-accept",
    label: "What we accept",
    route: "/laptop-bank/what-we-accept",
    description: "Intro, the firmware warning, and the closing line. The specification itself is edited under Intake specification.",
    seed: laptopBankWhatWeAcceptContent,
  },
  {
    key: "data-security",
    label: "Data security",
    route: "/laptop-bank/data-security",
    description: "All nine sections. This is the page that wins or loses corporate donations — every claim here should match a record you can produce.",
    seed: laptopBankDataSecurityContent,
  },
  {
    key: "donate-equipment",
    label: "Offer your equipment",
    route: "/laptop-bank/donate-equipment",
    description: "Heading, intro, the confirmation shown after submitting, and the three step titles.",
    seed: laptopBankDonateEquipmentContent,
  },
  {
    key: "privacy-notice",
    label: "Laptop Bank privacy notice",
    route: "/policies/laptop-bank-privacy-notice",
    description: "The eight section headings and the notice explaining that the text is still with your legal adviser.",
    seed: laptopBankPrivacyNoticeContent,
  },
  {
    key: "documents",
    label: "Laptop Bank documents",
    route: "/policies/laptop-bank-documents",
    description: "Page headings and the three audience group titles. The files themselves are edited under Documents.",
    seed: laptopBankDocumentsContent,
  },
  {
    key: "her-first-laptop",
    label: "Her First Laptop landing",
    route: "/her-first-laptop",
    description: "Hero, the need, how it works, loan-to-own, and where the machines come from.",
    seed: herFirstLaptopContent,
  },
  {
    key: "eligibility",
    label: "Eligibility and selection",
    route: "/her-first-laptop/eligibility",
    description: "Who can apply, how we choose, commitments, the cycle, and the no-payment warning. The FAQs are edited separately.",
    seed: herFirstLaptopEligibilityContent,
  },
  {
    key: "apply",
    label: "Apply for a laptop",
    route: "/her-first-laptop/apply",
    description: "The summary shown before the first field, and the confirmation shown after submitting.",
    seed: herFirstLaptopApplyContent,
  },
];

export function getPageSeed(key: string): LaptopBankPageSeed | undefined {
  return LAPTOP_BANK_PAGE_SEEDS.find((page) => page.key === key);
}

// PATH_SEPARATOR and NON_EDITABLE_KEYS moved to
// lib/cms/descriptors/page-overrides.ts when the pattern was generalised.
export { PATH_SEPARATOR, NON_EDITABLE_KEYS } from "@/lib/cms/descriptors/page-overrides";
