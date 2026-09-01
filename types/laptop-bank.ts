/**
 * The six CMS content types for the IT for Youth Laptop Bank and Her First
 * Laptop (build spec §4).
 *
 * Field names are snake_case on purpose. These are the field names the client
 * sees in a CMS editor, and the spec names them this way — renaming them to
 * camelCase here would mean the spec, the editor and the code disagree about
 * what a field is called. Do not "tidy" them.
 */

export type ProcessStage = {
  number: number;
  title: string;
  /** The one-line version, used by the condensed stepper on page 5.1. */
  summary_sentence: string;
  full_text: string;
  owner: string;
  record_produced: string;
  duration: string;
};

export type IntakeItem = {
  item: string;
  minimum_accepted: string;
  notes: string;
  accepted: boolean;
  sort_order: number;
};

export type DonorDisplayConsent = "logo" | "named" | "anonymous";

export type Donor = {
  name: string;
  logo?: string;
  sector?: string;
  country?: string;
  display_consent: DonorDisplayConsent;
  quote?: string;
  quote_attribution?: string;
};

export type Story = {
  preferred_name: string;
  photo?: string;
  quote: string;
  pathway?: string;
  region?: string;
  institution?: string;
  publication_consent: boolean;
  /**
   * Spec 5.14 DATA: preferred_name, institution and photo may never render
   * together unless this is populated. Enforced in the query, in
   * lib/cms/laptop-bank.ts.
   */
  consent_record_ref?: string;
  date?: string;
};

/**
 * Spec 5.11. Every metric is nullable because "not yet reported" is a real
 * state that must be distinguishable from zero — a Laptop Bank that has
 * recycled 0 units and one that has not counted yet are different claims, and
 * spec §10 forbids publishing a placeholder zero.
 */
export type DashboardMetrics = {
  period_label: string;
  last_updated: string;
  units_offered: number | null;
  units_accepted: number | null;
  units_declined_at_offer: number | null;
  units_rejected_at_intake: number | null;
  drives_sanitised: number | null;
  deployed_individual: number | null;
  deployed_shared: number | null;
  ownership_transfers: number | null;
  retention_12m_pct: number | null;
  units_recycled: number | null;
  partner_orgs: number | null;
  deployment_by_region: number | null;
  deployment_by_pathway: number | null;
};

export type DocumentAudienceTag = "corporate" | "applicant" | "public";

export type LaptopBankDocument = {
  id: string;
  title: string;
  /**
   * Empty until IT for Youth supplies the PDF (spec §11 lists all six launch
   * PDFs as awaited). C12 renders an empty `file` as awaited rather than as a
   * link to nowhere.
   */
  file: string;
  format: string;
  fileSize?: string;
  version: string;
  date: string;
  audience_tag: DocumentAudienceTag;
};
