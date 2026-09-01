import { token } from "@/lib/content/laptop-bank-tokens";
import type {
  IntakeItem,
  LaptopBankDocument,
  ProcessStage,
} from "@/types/laptop-bank";

/**
 * Seed content for the IT for Youth Laptop Bank (build spec 5.1–5.5, 5.9–5.10).
 *
 * Every string the spec marks COPY is reproduced byte-for-byte. Do not reword,
 * re-punctuate or improve it — if a line reads awkwardly that is the client's
 * decision. Values the spec leaves as {{TOKEN}} are interpolated through
 * `token()` so they resolve from one registry (spec §11).
 *
 * lib/cms/laptop-bank.ts prefers Firestore and falls back to these records, so
 * the pages render real published content before the CMS is populated.
 */

// ─── 5.2 block 2: the summary table, published exactly ────────────────────────
//
// The stage labels here differ from the expandables' titles below — block 2
// says "3 Collection" where block 3 says "Collection and chain of custody",
// and likewise for stages 6 and 8. Block 2 is marked "publish exactly", so
// both wordings are kept rather than one being normalised onto the other.

export type StageSummaryRow = {
  stage: string;
  duration: string;
  received: string;
};

export const laptopBankStageSummaryRows: StageSummaryRow[] = [
  {
    stage: "1 Offer and qualification",
    duration: `Within ${token("SLA_REPLY")}`,
    received: "A written decision, including what we cannot take and why",
  },
  {
    stage: "2 Agreement and transfer of title",
    duration: token("DUR_AGREEMENT"),
    received: "Signed Deed of Gift with your asset list annexed",
  },
  {
    stage: "3 Collection",
    duration: "By arrangement",
    received: "Dual-signed collection manifest",
  },
  {
    stage: "4 Intake, tagging and grading",
    duration: token("DUR_INTAKE"),
    received: "Grading summary for your consignment",
  },
  {
    stage: "5 Data sanitisation",
    duration: token("DUR_WIPE"),
    received: "A sanitisation certificate for every serial number",
  },
  {
    stage: "6 Refurbishment and quality assurance",
    duration: token("DUR_REFURB"),
    received: "Available on request",
  },
  {
    stage: "7 Allocation and handover",
    duration: "Next selection cycle",
    received: "Named deployment report at 3 months",
  },
  {
    stage: "8 In-life tracking",
    duration: "12 months",
    received: "Outcome summary at 12 months",
  },
  {
    stage: "9 End of life and recycling",
    duration: "As required",
    received: "Certificate of destruction covering your rejected units",
  },
];

// ─── 5.2 block 3: the nine Process Stage records ──────────────────────────────
//
// `summary_sentence` is the condensed line the stepper shows on page 5.1
// (block 4: "Summary sentence only"). The spec supplies no separate summary
// copy, so each one is the first sentence of that stage's own `full_text` —
// verbatim client COPY, summarising the stage, inventing nothing. Spec §11's
// "do not invent values" rules out writing fresh summaries here.

export const laptopBankStages: ProcessStage[] = [
  {
    number: 1,
    title: "Offer and qualification",
    duration: `Within ${token("SLA_REPLY")}`,
    summary_sentence:
      "We assess every offer against our published intake specification before agreeing to anything.",
    full_text:
      "We assess every offer against our published intake specification before agreeing to anything. The assessment covers quantity, age and specification, location, your timeline, and whether the machines are locked to a management platform. An offer can be accepted in full, accepted in part, or declined with an explanation and a referral to a certified recycler.",
    owner: "Partnerships lead",
    record_produced: "Offer record with outcome and reason",
  },
  {
    number: 2,
    title: "Agreement and transfer of title",
    duration: token("DUR_AGREEMENT"),
    summary_sentence: "A Deed of Gift is signed before collection.",
    full_text:
      "A Deed of Gift is signed before collection. It transfers legal title to IT for Youth Ghana, records the asset list by serial number, disclaims all warranties, confirms which party is responsible for data removal, confirms the machines have been released from device management and firmware passwords cleared, and states that we may deploy, retain for parts, or responsibly recycle any unit at our discretion. Units we cannot use are not returned.",
    owner: "Operations manager",
    record_produced: "Signed Deed of Gift with asset manifest annexed",
  },
  {
    number: 3,
    title: "Collection and chain of custody",
    duration: "By arrangement",
    summary_sentence:
      "Machines are counted against the manifest at your premises, in the presence of your representative, and both parties sign.",
    full_text:
      "Machines are counted against the manifest at your premises, in the presence of your representative, and both parties sign. Units travel sealed and are counted again on arrival at our facility by a second member of staff. Any discrepancy is recorded and reported to you within one working day.",
    owner: "Operations manager",
    record_produced: "Dual-signed collection manifest; arrival count sheet",
  },
  {
    number: 4,
    title: "Intake, tagging and grading",
    duration: token("DUR_INTAKE"),
    summary_sentence:
      "Every unit receives a permanent IT for Youth asset tag and a register entry capturing serial number, make, model, processor, memory, storage, screen condition, battery health, charger presence and donor batch.",
    full_text:
      "Every unit receives a permanent IT for Youth asset tag and a register entry capturing serial number, make, model, processor, memory, storage, screen condition, battery health, charger presence and donor batch. Each unit is then graded. Grade A deploys to an individual. Grade B deploys to shared use in a club or lab. Grade C is retained for parts. Reject goes to certified recycling.",
    owner: "Technical lead",
    record_produced: "Asset register entry per unit; consignment grading summary",
  },
  {
    number: 5,
    title: "Data sanitisation",
    duration: token("DUR_WIPE"),
    summary_sentence: `Every storage device is sanitised to ${token("WIPE_STANDARD")} on arrival, whether or not it has already been wiped.`,
    full_text: `Every storage device is sanitised to ${token("WIPE_STANDARD")} on arrival, whether or not it has already been wiped. Method depends on the drive: full overwrite for mechanical drives, the drive’s own secure erase or cryptographic erase command for solid-state drives, and physical destruction for any drive that fails to verify. Drives from units graded for parts or rejection are removed and destroyed rather than wiped. Each unit produces a certificate carrying the serial number, method, date, result and operator.`,
    owner: "Technical lead",
    record_produced: "Per-unit sanitisation certificate; consolidated pack issued to donor",
  },
  {
    number: 6,
    title: "Refurbishment, imaging and quality assurance",
    duration: token("DUR_REFURB"),
    summary_sentence: `Physical repair and cleaning, memory or storage upgrades where parts allow, battery replacement where economical, then installation of ${token("OS_NAME")} and the standard IT for Youth software image.`,
    full_text: `Physical repair and cleaning, memory or storage upgrades where parts allow, battery replacement where economical, then installation of ${token("OS_NAME")} and the standard IT for Youth software image. Every unit passes a written quality assurance checklist before it leaves the bench: boot time, all ports and keys, camera and microphone, wireless, battery runtime under load, and no diagnostic errors.`,
    owner: "Technical lead",
    record_produced: "Signed QA checklist per unit",
  },
  {
    number: 7,
    title: "Allocation and handover",
    duration: "Next selection cycle",
    summary_sentence:
      "Units are allocated against applications by a selection panel on a published cycle.",
    full_text:
      "Units are allocated against applications by a selection panel on a published cycle. Not first-come-first-served. The recipient signs a loan-to-own agreement, receives an induction covering care, security, backup and fault reporting, and signs a handover record. Photographs are taken only where separate written consent exists.",
    owner: "Programmes lead",
    record_produced: "Selection panel minutes; signed loan-to-own agreement; handover record",
  },
  {
    number: 8,
    title: "In-life tracking and support",
    duration: "12 months",
    summary_sentence:
      "Check-ins at three, six and twelve months confirm the machine is working and in the recipient’s possession.",
    full_text: `Check-ins at three, six and twelve months confirm the machine is working and in the recipient’s possession. Repairs are handled from the parts pool. Loss or theft is reported and recorded against the asset. On completion of the agreed training track and ${token("PEER_HOURS")} of peer teaching, title transfers to the recipient.`,
    owner: "Programmes lead",
    record_produced: "Check-in log per asset; ownership transfer certificate",
  },
  {
    number: 9,
    title: "End of life and recycling",
    duration: "As required",
    summary_sentence:
      "Units leave only through a licensed electronic waste handler, against a weight receipt and a certificate of destruction.",
    full_text:
      "Units leave only through a licensed electronic waste handler, against a weight receipt and a certificate of destruction. Nothing is sold into the informal repair market and nothing is left in general waste. Volumes and certificates are published annually.",
    owner: "Operations manager",
    record_produced: "Disposal certificate referenced against every asset tag",
  },
];

// ─── 5.3: the fourteen Intake Item records ────────────────────────────────────
//
// `sort_order` follows the spec's table order, which puts the nine accepted
// rows first. An em dash in `minimum_accepted` is published as-is; that is
// what the spec's table carries for the not-accepted rows.

export const laptopBankIntakeItems: IntakeItem[] = [
  {
    item: "Laptop processor",
    minimum_accepted: "Intel Core i5 8th generation or newer, or AMD Ryzen 3 2000 series or newer",
    notes: "Anything older cannot run a supported operating system for a useful lifetime.",
    accepted: true,
    sort_order: 1,
  },
  {
    item: "Memory",
    minimum_accepted: "8 GB, or 4 GB with a second slot",
    notes: "Single-slot 4 GB units are Grade C at best.",
    accepted: true,
    sort_order: 2,
  },
  {
    item: "Storage",
    minimum_accepted: "256 GB solid-state",
    notes: "Mechanical drives accepted only where an SSD can be fitted from the parts pool.",
    accepted: true,
    sort_order: 3,
  },
  {
    item: "Screen",
    minimum_accepted: "Intact, no cracks, no dead-pixel clusters",
    notes: "Cracked screens are Grade C.",
    accepted: true,
    sort_order: 4,
  },
  {
    item: "Battery",
    minimum_accepted: "60 per cent of rated capacity, or a replacement available",
    notes: "Tested on every unit.",
    accepted: true,
    sort_order: 5,
  },
  {
    item: "Charger",
    minimum_accepted: "One per unit",
    notes: "Bulk offers without chargers are assessed case by case.",
    accepted: true,
    sort_order: 6,
  },
  {
    item: "Firmware and management state",
    minimum_accepted: "No BIOS or EFI password, released from all device management platforms",
    notes: "The most common reason a donation fails. Raise it before collection.",
    accepted: true,
    sort_order: 7,
  },
  {
    item: "Provenance",
    minimum_accepted: "Named donor organisation with a signed Deed of Gift",
    notes: "No anonymous bulk drops.",
    accepted: true,
    sort_order: 8,
  },
  {
    item: "Peripherals and parts",
    minimum_accepted:
      "Monitors, docking stations, chargers, keyboards, mice, network switches, access points, memory and storage parts, projectors",
    notes: "Actively wanted. These equip labs and clubs.",
    accepted: true,
    sort_order: 9,
  },
  {
    item: "Below the processor floor",
    minimum_accepted: "—",
    notes: "Declined in writing with a referral to a licensed recycler.",
    accepted: false,
    sort_order: 10,
  },
  {
    item: "Cathode-ray monitors, printers",
    minimum_accepted: "—",
    notes: "Not accepted.",
    accepted: false,
    sort_order: 11,
  },
  {
    item: "Water-damaged units",
    minimum_accepted: "—",
    notes: "Not accepted.",
    accepted: false,
    sort_order: 12,
  },
  {
    item: "Desktops without monitors",
    minimum_accepted: "—",
    notes: "Not accepted.",
    accepted: false,
    sort_order: 13,
  },
  {
    item: "Unknown-provenance devices",
    minimum_accepted: "—",
    notes: "Not accepted.",
    accepted: false,
    sort_order: 14,
  },
];

// ─── 5.10: the six launch documents ───────────────────────────────────────────
//
// `file` is empty on every record. Spec §11 lists "All six launch PDFs" as
// content awaiting IT for Youth, so C12 renders each as awaited rather than
// linking to a file that does not exist. `version` and `date` are likewise
// awaited and stay empty — spec §10 forbids a placeholder.

export const laptopBankDocuments: LaptopBankDocument[] = [
  { id: "corporate-pack", title: "Corporate pack", file: "", format: "PDF", version: "", date: "", audience_tag: "corporate" },
  { id: "deed-of-gift", title: "Deed of Gift template", file: "", format: "PDF", version: "", date: "", audience_tag: "corporate" },
  { id: "data-handling-statement", title: "Data handling statement", file: "", format: "PDF", version: "", date: "", audience_tag: "corporate" },
  { id: "intake-specification", title: "Intake specification", file: "", format: "PDF", version: "", date: "", audience_tag: "public" },
  { id: "loan-to-own", title: "Loan-to-own agreement template", file: "", format: "PDF", version: "", date: "", audience_tag: "applicant" },
  { id: "privacy-notice", title: "Privacy notice", file: "", format: "PDF", version: "", date: "", audience_tag: "public" },
];

export const DATA_HANDLING_STATEMENT_ID = "data-handling-statement";
export const CORPORATE_PACK_ID = "corporate-pack";

// ─── 5.1: Laptop Bank landing ─────────────────────────────────────────────────

export type LaptopBankCard = {
  title: string;
  body: string;
  href?: string;
};

export const laptopBankLandingContent = {
  meta: {
    title: "IT for Youth Laptop Bank — donate retired corporate laptops in Ghana",
    description:
      "We collect retired corporate computers, sanitise every drive to a certified standard, refurbish them and place them with young people in training. Certificates, documented transfer and licensed recycling included.",
  },
  hero: {
    eyebrow: "IT for Youth Laptop Bank",
    heading: "Your retired laptops have another decade of use in them.",
    subheading:
      "The IT for Youth Laptop Bank collects retired computers from Ghanaian and international companies, sanitises every drive to a certified standard, refurbishes each machine, and places it with a young person in training. You get a documented, compliant route for your fleet refresh. She gets the tool she needs.",
    primaryCta: { label: "Offer your equipment", href: "/laptop-bank/donate-equipment" },
    secondaryCta: { label: "Download the corporate pack", href: "/policies/laptop-bank-documents" },
  },
  handleForYou: {
    eyebrow: "What we handle for you",
    title: "Four things your procurement and legal teams will ask about",
    cards: [
      {
        title: "Certified data destruction",
        body:
          "Every drive is sanitised to a recognised standard on arrival, whether or not it has already been wiped. You receive a certificate for every serial number.",
        href: "/laptop-bank/data-security",
      },
      {
        title: "Documented transfer",
        body:
          "A Deed of Gift transfers title, records every asset, and disclaims warranty. Your legal and procurement teams get a document they can file.",
        href: "/policies/laptop-bank-documents",
      },
      {
        title: "Collection and logistics",
        body:
          "We count, seal and collect from your premises, with a dual-signed manifest at both ends.",
        href: "/laptop-bank/how-it-works",
      },
      {
        title: "Certified recycling of the rest",
        body:
          "Units we cannot use are recycled through a licensed handler against a certificate of destruction. Nothing enters the informal waste stream.",
        href: "/laptop-bank/recycling",
      },
    ] satisfies LaptopBankCard[],
  },
  process: {
    eyebrow: "The process",
    title: "Nine stages, each producing a document",
    link: { label: "See the process in full", href: "/laptop-bank/how-it-works" },
  },
  whereMachinesGo: {
    eyebrow: "Where the machines go",
    title: "Your equipment is not ring-fenced to one programme",
    cards: [
      {
        title: "Her First Laptop",
        body: "Individual machines for young women in higher education, delivered with Girls in Tech.",
        href: "/her-first-laptop",
      },
      {
        title: "Tech Clubs and Rural Tech Connect",
        body: "Shared machines equipping school clubs and community labs beyond Accra.",
        href: "/what-we-do/tech-clubs",
      },
      {
        title: "Academy and Entrepreneurship Hub",
        body: "Machines for participants and founders in active training.",
        href: "/what-we-do/youth-academy",
      },
    ] satisfies LaptopBankCard[],
  },
  whatWeAccept: {
    eyebrow: "What we accept",
    title: "We publish our minimums and test every unit against them",
    link: { label: "Read the full intake specification", href: "/laptop-bank/what-we-accept" },
  },
  partners: {
    eyebrow: "Partner organisations",
    title: "The organisations whose fleet refreshes equip this programme",
  },
  closing: {
    heading: "Planning a fleet refresh?",
    body: `Tell us roughly what you have and when. We will tell you within ${token("SLA_REPLY")} what we can take, what we cannot, and how we would handle the rest. Offers of ten machines and offers of five hundred are both welcome.`,
    cta: { label: "Offer your equipment", href: "/laptop-bank/donate-equipment" },
  },
  stickyCta: { label: "Offer your equipment", href: "/laptop-bank/donate-equipment" },
};

// ─── 5.2: How it works ────────────────────────────────────────────────────────

export const laptopBankHowItWorksContent = {
  meta: {
    title: "How the IT for Youth Laptop Bank works",
    description:
      "Nine stages from your first email to the certificate confirming a machine has reached the end of its useful life. Every stage produces a document.",
  },
  hero: {
    eyebrow: "IT for Youth Laptop Bank",
    title: "How it works",
  },
  intro:
    "Nine stages, from your first email to the certificate confirming a machine has reached the end of its useful life. Every stage produces a document, and you receive copies of the ones that concern your equipment.",
  summaryTableCaption: "Every stage, what it takes, and what you receive",
  cta: { label: "Offer your equipment", href: "/laptop-bank/donate-equipment" },
};

// ─── 5.3: What we accept ──────────────────────────────────────────────────────

export const laptopBankWhatWeAcceptContent = {
  meta: {
    title: "What the IT for Youth Laptop Bank accepts",
    description:
      "Our published intake minimums, why we are selective, and the two firmware checks your IT team must complete before handover.",
  },
  hero: {
    eyebrow: "IT for Youth Laptop Bank",
    title: "What we accept",
  },
  introHeading: "We are selective, and here is why.",
  introBody:
    "A computer that cannot run a supported operating system for at least three more years is not a gift to a student, it is a problem transferred to her. So we publish our minimums, we test every unit against them, and we say no in writing when equipment falls short. We would rather take twenty good machines than two hundred we have to bury.",
  warningHeading: "Before you offer machines, check two things.",
  warningBody:
    "Corporate laptops are usually enrolled in a device management platform and often carry a firmware password. Both must be cleared by your IT team before handover, because neither can be removed by us. A machine still enrolled cannot be reimaged and cannot be deployed, however good the hardware is. Your IT team will know this as releasing the device from management and clearing the BIOS or EFI password.",
  closing:
    "Not sure whether your equipment qualifies? Send us the model names and rough age and we will tell you. There is no obligation.",
};

// ─── 5.4: Data security ───────────────────────────────────────────────────────
//
// Nine sections in the spec's order, with the spec's nine anchors. Spec §10
// checks that all nine resolve.

export type DataSecuritySection = {
  anchor: string;
  heading: string;
  body: string;
};

export const laptopBankDataSecurityContent = {
  meta: {
    title: "Data security and certified erasure | IT for Youth Laptop Bank",
    description:
      "What happens to your data, how every drive is sanitised and verified, and what documentation you receive for each serial number.",
  },
  hero: {
    eyebrow: "IT for Youth Laptop Bank",
    title: "Data security",
    description:
      "The page an IT manager reads before signing off a fleet handover. Every claim here corresponds to a record we can produce.",
  },
  sections: [
    {
      anchor: "commitment",
      heading: "Our commitment",
      body:
        "Every storage device entering our facility is sanitised before any other work begins, whether or not it has already been wiped. We assume nothing about the state of an incoming drive.",
    },
    {
      anchor: "method",
      heading: "Method by drive type",
      body: `Full overwrite for mechanical drives. Secure erase or cryptographic erase for solid-state. Physical destruction where a drive fails to verify. Every drive is sanitised to ${token("WIPE_STANDARD")}.`,
    },
    {
      anchor: "verification",
      heading: "Verification",
      body:
        "Every erase is verified. Any drive failing verification is physically destroyed rather than retried.",
    },
    {
      anchor: "certificates",
      heading: "Certificates",
      body: `One per serial number, carrying the method, date, result and operator. A consolidated pack is issued to the donor. We retain each certificate for ${token("CERT_RETENTION")}.`,
    },
    {
      anchor: "custody",
      heading: "Chain of custody",
      body:
        "Units are counted at your premises against the manifest and signed for by both parties, travel sealed, and are counted and signed for again on arrival by a second member of staff. Any discrepancy is reported to you within one working day.",
    },
    {
      anchor: "facility",
      heading: "Physical security",
      body: token("FACILITY_STATEMENT"),
    },
    {
      anchor: "parts-drives",
      heading: "Drives we do not wipe",
      body:
        "Drives from units graded for parts or rejection are removed and destroyed, not sanitised and resold.",
    },
    {
      anchor: "tags",
      heading: "Asset tags and branding",
      body: "Donor asset tags, engravings and branding are removed before deployment.",
    },
    {
      anchor: "exclusions",
      heading: "What we do not do",
      body:
        "We do not sell donated equipment. We do not pass units into the informal repair market. We do not deploy any machine that has not passed both sanitisation and quality assurance.",
    },
  ] satisfies DataSecuritySection[],
};

// ─── 5.5: Donate equipment ────────────────────────────────────────────────────

export const laptopBankDonateEquipmentContent = {
  meta: {
    title: "Offer your equipment | IT for Youth Laptop Bank",
    description:
      "Tell us what you have and when. We reply with what we can take, what we cannot, and how we would handle the rest.",
  },
  heading: "Offer your equipment",
  intro: `Five minutes now saves a meeting later. We reply within ${token("SLA_REPLY")} with what we can take, what we cannot, and how we would handle the rest. If you have an asset list, attach it and skip most of this form.`,
  /** {{REF}} is substituted at submit time with the generated reference. */
  confirmation: `Thank you. Your reference is {{REF}}. We will reply within ${token("SLA_REPLY")}. We have emailed you the corporate pack, which includes our data handling statement and the Deed of Gift template.`,
  stepTitles: [
    "About your organisation",
    "About the equipment",
    "Logistics and consent",
  ],
};

// ─── 5.9: Privacy notice ──────────────────────────────────────────────────────
//
// Spec §11 lists the privacy notice body as content awaiting IT for Youth. The
// structure is built now; the body is not drafted here. An invented privacy
// notice is a legal document the organisation did not write and did not agree
// to, and Draft 1 §6.2 flags Act 843 registration as a question for their
// lawyer. Each section therefore carries the spec's own "must state" line as
// editorial guidance, clearly marked as awaited.

export type PrivacyNoticeSection = {
  anchor: string;
  heading: string;
  mustState: string;
};

export const laptopBankPrivacyNoticeContent = {
  meta: {
    title: "Laptop Bank privacy notice | IT for Youth Ghana",
    description:
      "How the IT for Youth Laptop Bank and Her First Laptop handle personal data for applicants, recipients and corporate contacts.",
  },
  hero: {
    eyebrow: "Policies",
    title: "Laptop Bank privacy notice",
  },
  awaitedNotice:
    "The text of this notice is being finalised with IT for Youth Ghana's legal adviser, including the organisation's registration position under the Data Protection Act, 2012 (Act 843). The section structure below is final. Until each section is published, direct any data question to the contact route on our contact page.",
  sections: [
    { anchor: "who-we-are", heading: "Who we are", mustState: "Controller identity and a named contact route for data questions." },
    { anchor: "what-we-collect", heading: "What we collect", mustState: "Split into four sub-sections: applicants, recipients, corporate contacts, website visitors." },
    { anchor: "why", heading: "Why", mustState: "A specific purpose per category." },
    { anchor: "lawful-basis", heading: "Lawful basis", mustState: "Per purpose." },
    { anchor: "who-we-share-with", heading: "Who we share with", mustState: "Named categories: selection panel, institutions for enrolment verification, funders receiving aggregate reporting, hosting and email providers." },
    { anchor: "retention", heading: "How long we keep it", mustState: "Retention in years per category, with a short stated retention for unsuccessful applications." },
    { anchor: "your-rights", heading: "Your rights", mustState: "Access, correction, deletion, complaint route." },
    { anchor: "data-leaving-ghana", heading: "Data leaving Ghana", mustState: "Whether the site, forms and email are hosted outside Ghana, and where." },
  ] satisfies PrivacyNoticeSection[],
};

export const LAPTOP_BANK_PRIVACY_NOTICE_HREF = "/policies/laptop-bank-privacy-notice";

// ─── 5.10: Document downloads ─────────────────────────────────────────────────

export const laptopBankDocumentsContent = {
  meta: {
    title: "Laptop Bank documents | IT for Youth Ghana",
    description:
      "The corporate pack, Deed of Gift template, data handling statement, intake specification, loan-to-own agreement and privacy notice.",
  },
  hero: {
    eyebrow: "Policies",
    title: "Laptop Bank documents",
    description:
      "Every document a donor organisation, an applicant or a journalist may need, with its version and date. Superseded versions are removed rather than stacked.",
  },
  audienceHeadings: {
    corporate: "For donor organisations",
    applicant: "For applicants and recipients",
    public: "Published for anyone",
  },
};
