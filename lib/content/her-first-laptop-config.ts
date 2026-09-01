import { token } from "@/lib/content/laptop-bank-tokens";
import type { LaptopBankCard } from "@/lib/content/laptop-bank-config";

/**
 * Seed content for Her First Laptop (build spec 5.6–5.8).
 *
 * Every COPY string is byte-for-byte from the spec. Tone, per Draft 1 §8:
 * warm, specific, free of pity — the subject of every sentence is what she is
 * doing, not what she lacks. Never "beneficiaries".
 */

// ─── 5.6: appeal landing ──────────────────────────────────────────────────────

export const herFirstLaptopContent = {
  meta: {
    title: "Her First Laptop | Give a laptop to a young woman in Ghana",
    description:
      "Fund one renewed laptop for a young woman in training. A refurbished machine of her own, and the training to use it.",
  },
  hero: {
    eyebrow: "Her First Laptop",
    heading: "Her first laptop",
    subheading: "A refurbished machine of her own, and the training to use it.",
    primaryCta: { label: "Give a laptop", href: "#give" },
    /**
     * Spec 5.6 BEHAVIOUR: this link must remain visible in the mobile
     * viewport without scrolling, so it belongs in the hero panel itself —
     * never below the fold.
     */
    secondaryCta: { label: "I am a student — apply here", href: "/her-first-laptop/apply" },
  },
  need: {
    eyebrow: "The need",
    title: "Every week, the same request",
    /**
     * Spec 5.6 block 2: "Three sentences plus one figure. Awaiting
     * {{NEED_STAT}}." Draft 1 §8 §2 adds: if the count is not ready, ship the
     * paragraph without the middle sentence. The token stays in place here so
     * staging shows what is outstanding; the sentence carrying it is the one
     * to drop when the figure never arrives.
     */
    body: `Young women in Ghanaian universities contact us asking for the same thing. Not fees, not advice. A laptop. ${token("NEED_STAT")} such requests reached us. They are studying, and they are sharing a phone screen or queuing for a campus lab to do it.`,
  },
  giving: {
    eyebrow: "What your gift does",
    title: "Every amount covers a stage of the work, not the purchase of a computer",
  },
  howItWorks: {
    eyebrow: "How it works",
    title: "From a company's fleet refresh to her desk",
    cards: [
      {
        title: "1. A company retires a machine",
        body:
          "Banks, telecoms companies and mining firms refresh their laptop fleets every three to four years. We collect what they retire.",
      },
      {
        title: "2. We sanitise and refurbish it",
        body:
          "Every drive is wiped to a certified standard. Parts are replaced, the machine is reimaged, and it passes a full quality check.",
      },
      {
        title: "3. She applies and is selected",
        body:
          "Applications are reviewed by a panel on a published cycle, against published criteria.",
      },
      {
        title: "4. She earns full ownership",
        body: `The laptop is hers to keep once she completes her training track and ${token("PEER_HOURS")} teaching other young people what she has learned.`,
      },
    ] satisfies LaptopBankCard[],
  },
  loanToOwn: {
    eyebrow: "Loan-to-own",
    title: "This is not a giveaway",
    body: `This is not a giveaway. Every laptop is issued on a ${token("LOAN_MONTHS")} agreement and becomes hers outright when she has completed her training track and her teaching hours. Your donation covers sanitisation, parts, licensing, logistics and a year of support — not the purchase of a computer, because the computer was already built.`,
  },
  story: {
    eyebrow: "One story",
    title: "In her own words",
  },
  whereFrom: {
    eyebrow: "Where the machines come from",
    title: "Powered by the IT for Youth Laptop Bank",
    body:
      "Her First Laptop is powered by the IT for Youth Laptop Bank, which collects, sanitises and refurbishes retired corporate equipment across Ghana.",
    link: { label: "How the Laptop Bank works", href: "/laptop-bank/how-it-works" },
  },
  stickyCta: { label: "Give a laptop", href: "#give" },
};

// ─── 5.7: eligibility and selection ───────────────────────────────────────────
//
// Blocks 1 and 3 are authored as string arrays and composed to prose at render
// time via pointsToParagraph. The spec calls them bullet lists; this repo's
// public pages carry no bullet lists, and lib/utils/prose.ts is the
// established mechanism for publishing list-shaped content as prose. Every
// COPY word survives; only the glyphs go.
//
// Block 2 stays an ordered array because its ordering is semantic — the
// criteria are ranked — and renders through the numbered treatment already
// used by components/organisations/organisation-enquiry-form.tsx.

export const herFirstLaptopEligibilityContent = {
  meta: {
    title: "Who can apply | Her First Laptop",
    description:
      "Who can apply, how we choose, what you commit to, and what happens if you are not selected this cycle.",
  },
  hero: {
    eyebrow: "Her First Laptop",
    title: "Eligibility and selection",
    description:
      "Published criteria, a published cycle and a panel decision. Read this before you apply so you know exactly what you are agreeing to.",
  },
  whoCanApply: {
    eyebrow: "Who can apply",
    title: "Three things must be true",
    points: [
      "Women enrolled at a recognised Ghanaian tertiary institution",
      "Currently on, or accepted onto, an IT for Youth training track",
      "Without regular access to a working computer",
    ],
  },
  howWeChoose: {
    eyebrow: "How we choose",
    title: "What the panel weighs, in order",
    criteria: [
      "How limited your current access to a computer is",
      "Commitment already shown through participation in our programmes",
      "How far your course or work genuinely requires a computer",
      `Priority groups: ${token("PRIORITY_GROUPS")}`,
    ],
  },
  commitments: {
    eyebrow: "What you commit to",
    title: "Four commitments, and we do hold you to them",
    points: [
      "Completing your training track",
      `${token("PEER_HOURS")} teaching other young people what you have learned`,
      "Three check-ins over twelve months",
      "Reporting loss, theft or damage",
    ],
  },
  cycle: {
    eyebrow: "The cycle",
    title: "When decisions are made, and by whom",
    body: `Applications are reviewed on a published cycle: ${token("CYCLE")}. Decisions are made by ${token("PANEL")}.`,
  },
  ifNotSelected: {
    eyebrow: "If you are not selected",
    title: "You stay on the list",
    body:
      "We receive far more applications than we have machines. If you are not selected this cycle you stay on the list for the next one, and you can use the shared machines in our Tech Clubs and community labs in the meantime.",
  },
  noPaymentWarning: {
    heading: "Applying is free",
    body: `Applying is free. No payment of any kind is required at any stage, and no member of our staff will ever ask you for money. If anyone does, report it to ${token("REPORT_CONTACT")}.`,
  },
  faqs: {
    eyebrow: "Questions",
    title: "The six we are asked most",
    /**
     * Spec 5.7 block 7 supplies the six questions in order and no answers.
     * Answers are drawn only from copy the spec publishes elsewhere, so
     * nothing here is invented; where the spec supplies no basis for an
     * answer the question carries a token instead of a guess.
     */
    items: [
      {
        question: "Does it cost anything?",
        answer: `Applying is free. No payment of any kind is required at any stage, and no member of our staff will ever ask you for money. If anyone does, report it to ${token("REPORT_CONTACT")}.`,
      },
      {
        question: "When does the laptop become mine?",
        answer: `Every laptop is issued on a ${token("LOAN_MONTHS")} agreement and becomes yours outright when you have completed your training track and ${token("PEER_HOURS")} teaching other young people what you have learned.`,
      },
      {
        question: "What happens if it breaks?",
        answer:
          "Repairs are handled from our parts pool. There are check-ins at three, six and twelve months, and you should report a fault as soon as it appears rather than waiting for the next check-in. Loss or theft is reported and recorded against the asset.",
      },
      {
        question: "Can I apply if I already have a broken laptop?",
        answer:
          "Yes. A broken laptop you cannot repair is one of the answers on the application form, and it counts as limited access to a working computer.",
      },
      {
        question: "Can I apply if I am not yet in an IT for Youth programme?",
        answer:
          "The application form includes “Not yet enrolled”, and answering it does not exclude you. Eligibility asks that you are currently on, or accepted onto, an IT for Youth training track, so we will route you into a track as part of the conversation.",
      },
      {
        question: "How long does a decision take?",
        answer: `Applications are reviewed on a published cycle: ${token("CYCLE")}. Decisions for the current cycle are announced on ${token("DECISION_DATE")}, and we contact every applicant on the number they gave us, whether or not they are selected.`,
      },
    ],
  },
  cta: { label: "Start your application", href: "/her-first-laptop/apply" },
};

// ─── 5.8: apply ───────────────────────────────────────────────────────────────

export const herFirstLaptopApplyContent = {
  meta: {
    title: "Apply for a laptop | Her First Laptop",
    description: "Who can apply, how we choose, and what you need before you start.",
  },
  heading: "Apply for a laptop",
  /**
   * Spec 5.8 block 1: condensed blocks 1 and 3 from 5.7, and it must appear
   * before the first field. The page renders this above the form.
   */
  summaryHeading: "Before you start",
  eligibilitySummary:
    "Her First Laptop is open to women enrolled at a recognised Ghanaian tertiary institution who are on, or accepted onto, an IT for Youth training track and do not have regular access to a working computer.",
  commitmentsSummary: `If you are selected you commit to completing your training track, ${token("PEER_HOURS")} teaching other young people what you have learned, three check-ins over twelve months, and reporting loss, theft or damage.`,
  needBeforeYouStart:
    "Have your student identifier and a photograph or scan of your proof of enrolment ready, along with a phone number that reaches you and one alternative contact.",
  /** {{REF}} is substituted at submit time with the generated reference. */
  confirmation: `Your application is in. Your reference is {{REF}}. Decisions for this cycle are announced on ${token("DECISION_DATE")} and we will contact you on the number you gave us, whether or not you are selected.`,
  stepTitles: [
    "About you",
    "Your studies",
    "Your situation",
    "Commitments and consent",
  ],
};

// ─── Reference lists for form 6.2 ─────────────────────────────────────────────

/**
 * The sixteen regions of Ghana, which is the count spec §6.2 specifies.
 * Alphabetical, because an applicant is scanning for their own.
 */
export const GHANA_REGIONS = [
  "Ahafo",
  "Ashanti",
  "Bono",
  "Bono East",
  "Central",
  "Eastern",
  "Greater Accra",
  "North East",
  "Northern",
  "Oti",
  "Savannah",
  "Upper East",
  "Upper West",
  "Volta",
  "Western",
  "Western North",
] as const;

/**
 * Spec §6.2: "Pre-populated list of recognised institutions", with an "other"
 * escape. The list is deliberately not exhaustive — Ghana has many accredited
 * tertiary institutions, and an applicant whose institution is missing must
 * never be blocked, which is what "Another institution" is for. Maintain this
 * list from the CMS as real applications name places it does not cover.
 */
export const GHANA_TERTIARY_INSTITUTIONS = [
  "University of Ghana",
  "Kwame Nkrumah University of Science and Technology",
  "University of Cape Coast",
  "University of Education, Winneba",
  "University for Development Studies",
  "University of Professional Studies, Accra",
  "University of Mines and Technology",
  "University of Energy and Natural Resources",
  "University of Health and Allied Sciences",
  "C. K. Tedam University of Technology and Applied Sciences",
  "Akenten Appiah-Menka University of Skills Training and Entrepreneurial Development",
  "Ghana Communication Technology University",
  "Ghana Institute of Management and Public Administration",
  "Accra Technical University",
  "Kumasi Technical University",
  "Takoradi Technical University",
  "Ho Technical University",
  "Tamale Technical University",
  "Cape Coast Technical University",
  "Koforidua Technical University",
  "Sunyani Technical University",
  "Bolgatanga Technical University",
  "Ashesi University",
  "Central University",
  "Valley View University",
  "Presbyterian University College",
  "Methodist University Ghana",
  "Catholic University of Ghana",
  "Regent University College of Science and Technology",
  "Wisconsin International University College",
  "Pentecost University",
  "All Nations University",
] as const;

/**
 * Spec §6.2: "The 8 pathways plus 'Not yet enrolled'." Slugs and labels match
 * lib/content/site-config.ts's initiatives, so an answer here maps onto a real
 * programme page.
 */
export const ITFY_TRACKS = [
  { value: "girls-in-tech", label: "Girls in Tech" },
  { value: "youth-academy", label: "Youth Tech Academy" },
  { value: "entrepreneurship-hub", label: "Entrepreneurship Hub" },
  { value: "code-impact-challenge", label: "Code Impact Challenge" },
  { value: "rural-tech-connect", label: "Rural Tech Connect" },
  { value: "community-outreach", label: "Community Outreach" },
  { value: "advocacy", label: "Advocacy" },
  { value: "tech-clubs", label: "Tech Clubs" },
  { value: "not-yet-enrolled", label: "Not yet enrolled" },
] as const;

/** Spec §6.2: "Current computer access". */
export const CURRENT_COMPUTER_ACCESS = [
  { value: "none", label: "None" },
  { value: "phone-only", label: "Phone only" },
  { value: "shared-machine", label: "A shared family or friend's machine" },
  { value: "campus-lab-or-cafe", label: "Campus lab or internet cafe only" },
  { value: "broken-laptop", label: "A broken laptop I cannot repair" },
] as const;

export const YEARS_OF_STUDY = [
  "Year 1",
  "Year 2",
  "Year 3",
  "Year 4",
  "Year 5 or above",
  "Postgraduate",
] as const;

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const REFERRAL_SOURCES = [
  { value: "itfy-programme", label: "Through an IT for Youth programme" },
  { value: "friend", label: "A friend or classmate" },
  { value: "lecturer", label: "A lecturer or coordinator" },
  { value: "social", label: "Social media" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "search", label: "Search engine" },
  { value: "other", label: "Somewhere else" },
] as const;
