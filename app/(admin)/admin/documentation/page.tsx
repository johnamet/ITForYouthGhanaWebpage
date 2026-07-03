import Link from "next/link";
import type { ReactNode } from "react";
import { BookOpen, CheckCircle2, ExternalLink, FileText, RefreshCw } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { revalidationMap } from "@/lib/utils/revalidate";

type DocSection = {
  id: string;
  title: string;
  summary: string;
  adminRoute: string;
  publicRoutes: string[];
  purpose: string;
  useWhen: string[];
  howToUpdate: string[];
  publishingNotes: string[];
};

const documentationSections: DocSection[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    summary: "The first stop for CMS health, collection status, role guidance, and revalidation visibility.",
    adminRoute: "/admin/dashboard",
    publicRoutes: ["No direct public page"],
    purpose:
      "Use the dashboard to understand what content exists, what is active, and which CMS areas may still rely on seed content or Firebase configuration.",
    useWhen: [
      "You want a quick health check before editing the site.",
      "You need to see collection readiness and publishing status.",
      "You want to confirm which paths are revalidated after CMS saves.",
    ],
    howToUpdate: [
      "The dashboard is mostly read-only. Use its action links to jump into the right manager.",
      "Review the collection cards before adding new records so you know where the content will appear.",
      "Use the revalidation list to understand which public pages should refresh after a save.",
    ],
    publishingNotes: [
      "Dashboard numbers are only as accurate as the active CMS records and configured Firebase connection.",
      "If Firebase is not configured, some pages may fall back to seed content from the codebase.",
    ],
  },
  {
    id: "homepage-content",
    title: "Homepage Content",
    summary: "Controls the homepage experience: hero, ticker, programme showcase, donation campaign, story, CTAs, and newsletter blocks.",
    adminRoute: "/admin/content/homepage",
    publicRoutes: ["/"],
    purpose:
      "Use homepage content when the front page needs to guide visitors quickly toward training, impact proof, donation, stories, news, partners, and newsletter signup.",
    useWhen: [
      "A campaign, cohort, donation push, or homepage CTA needs to change.",
      "The order or messaging of homepage sections needs to be clearer.",
      "Leadership wants the homepage to reflect current priorities.",
    ],
    howToUpdate: [
      "Open the homepage content editor and review each section before saving.",
      "Keep hero and CTA copy direct. Each block should answer who it is for, what action matters, and where the visitor should go next.",
      "Use real image URLs already available in the media library or project assets.",
      "After saving, check the public homepage on desktop and mobile.",
    ],
    publishingNotes: [
      "Homepage saves revalidate `/`.",
      "Avoid inventing new statistics. Use approved proof points or numbers confirmed by leadership.",
    ],
  },
  {
    id: "banner-hero-floating",
    title: "Banner, Hero Slides, Donation, Story, Floating Elements, Impact Stats",
    summary: "Focused homepage and global components that can be updated separately from the full homepage editor.",
    adminRoute: "/admin/content/banner",
    publicRoutes: ["/", "Global layout where enabled"],
    purpose:
      "Use these editors for quick updates to high-visibility blocks without editing the full homepage content object.",
    useWhen: [
      "Applications open or close and the announcement bar must change.",
      "A hero slide, donation target, featured story, or floating donate button needs a focused update.",
      "Impact numbers need to be corrected across pages that use shared stats.",
    ],
    howToUpdate: [
      "Use Banner for top-of-site announcements with start and end dates.",
      "Use Hero Slides for carousel messaging, images, and primary or secondary CTAs.",
      "Use Donation Campaign for the homepage giving block.",
      "Use Featured Story for the proof/video section.",
      "Use Floating Elements for donate button, scroll-to-top, and exit-intent behavior.",
      "Use Impact Stats for shared numbers that appear across the site.",
    ],
    publishingNotes: [
      "Date-sensitive content should include clear start and end dates.",
      "Impact stats should be verified before publishing because they appear as credibility signals.",
    ],
  },
  {
    id: "who-we-are",
    title: "Who We Are Pages",
    summary: "About page content, route cards, custom Who We Are subpages, team profiles, departments, partners, and careers.",
    adminRoute: "/admin/content/who-we-are",
    publicRoutes: ["/who-we-are", "/who-we-are/team", "/departments", "/departments/[slug]", "/who-we-are/partners", "/who-we-are/careers"],
    purpose:
      "Use this area to explain the organisation, the people behind the work, formal departments, partners, governance-related pages, and opportunities to join.",
    useWhen: [
      "The About page narrative, stats, CTAs, or related route cards need updating.",
      "A new team member joins, leaves, changes role, or should be featured.",
      "A department needs its own detailed page with responsibilities, services, priorities, resources, and members.",
      "A partner logo, partner listing, career, board, governance, or advisor page needs updating.",
    ],
    howToUpdate: [
      "Use Who We Are for the main About page content.",
      "Use Who We Are Pages for custom pages below `/who-we-are`, such as governance, board, advisors, or similar pages.",
      "Use Team to create individual people profiles. Select the CMS department so the member links to the correct department page.",
      "Use Departments for the deeper work pages. Add mission, responsibilities, services, workflows, priorities, stats, resources, CTAs, and team links.",
      "Use Partners for public partner profiles and logo metadata.",
      "Use Careers or Jobs for open roles shown on the careers page.",
    ],
    publishingNotes: [
      "Team is the people directory. Departments are the detailed pages about the work.",
      "When a team member is connected to a department slug, the public Team page links that department heading to the matching department page.",
      "Department pages automatically show matching team members by selected member IDs, department ID, department slug, or matching department name.",
    ],
  },
  {
    id: "apply-training",
    title: "Apply For Training",
    summary: "Training hub, eligibility page, process page, and course listing content.",
    adminRoute: "/admin/content/apply-for-training",
    publicRoutes: ["/apply-for-training", "/apply-for-training/who-can-apply", "/apply-for-training/how-it-works", "/apply-for-training/courses"],
    purpose:
      "Use these pages to help learners understand whether to apply, what happens next, and which course path fits them.",
    useWhen: [
      "A cohort application window opens or closes.",
      "Eligibility, process steps, timelines, or course explanations change.",
      "Learners are asking the same questions and the site needs clearer guidance.",
    ],
    howToUpdate: [
      "Use Apply Training for the overview page and route cards.",
      "Use Training Fit for eligibility and readiness guidance.",
      "Use Training Process for application journey, timeline, and preparation steps.",
      "Use Training Courses for the public course listing and course-support content.",
      "Keep instructions practical. Learners should know what to do next after reading.",
    ],
    publishingNotes: [
      "Avoid promising acceptance, scholarships, devices, stipends, or job placement unless confirmed for that cohort.",
      "When dates change, check banner, homepage CTAs, and training pages together.",
    ],
  },
  {
    id: "programmes",
    title: "Programmes And Initiatives",
    summary: "Programme pages for what ITFY does across training, outreach, advocacy, and clubs.",
    adminRoute: "/admin/programmes/girls-in-tech",
    publicRoutes: ["/what-we-do", "/what-we-do/[slug]"],
    purpose:
      "Use programme pages to explain each initiative, who it serves, what it offers, and what outcome it creates.",
    useWhen: [
      "A programme description, gallery, FAQ, CTA, or impact proof needs to change.",
      "A new initiative is being prepared or an existing one needs sharper positioning.",
      "Partners or learners need clearer information about a specific route.",
    ],
    howToUpdate: [
      "Open the relevant programme editor from the programmes area.",
      "Review hero copy, audience, outcomes, gallery assets, FAQs, and CTAs.",
      "Keep each programme distinct. Do not reuse vague descriptions across initiatives.",
      "Check the public What We Do overview after changing a programme that appears in route cards.",
    ],
    publishingNotes: [
      "Programme content should stay grounded in the eight ITFY initiative areas.",
      "Use approved statistics only. Programme claims should be specific and verifiable.",
    ],
  },
  {
    id: "organisations-partnerships",
    title: "Organisations And Partnerships",
    summary: "Organisation services, partnership overview, and partner track pages.",
    adminRoute: "/admin/partner-with-us",
    publicRoutes: ["/for-organisations", "/for-organisations/[slug]", "/partner-with-us", "/partner-with-us/[slug]"],
    purpose:
      "Use this area to guide companies, schools, NGOs, government, foundations, and technical partners toward the right collaboration route.",
    useWhen: [
      "A sponsorship, training, hiring, volunteering, or institutional partnership offer changes.",
      "Partner-facing copy needs stronger proof or clearer next steps.",
      "A new partner track needs to be prepared.",
    ],
    howToUpdate: [
      "Use For Organisations editors for corporate training, sponsorships, graduate hiring, and volunteering service pages.",
      "Use Partner With Us for the partnership overview and audience routes.",
      "Use partnership track editors for specific partner categories.",
      "Make the CTA route clear: contact, enquire, sponsor, hire, volunteer, or partner.",
    ],
    publishingNotes: [
      "Do not name partners or funders unless they are already approved for public use.",
      "When a partnership offer changes, check homepage CTAs and contact routing as well.",
    ],
  },
  {
    id: "impact-news",
    title: "Impact, Testimonials, News, And Articles",
    summary: "Impact pages, SDG pages, reports, testimonials, news hub, listing pages, and article records.",
    adminRoute: "/admin/our-impact",
    publicRoutes: ["/our-impact", "/our-impact/reports", "/our-impact/testimonials", "/our-impact/sdgs", "/news-and-updates", "/news-and-updates/news", "/news-and-updates/blogs"],
    purpose:
      "Use these editors to publish evidence, stories, updates, blog thinking, reports, and public proof of work.",
    useWhen: [
      "Impact numbers, report links, SDG explanations, or testimonial stories change.",
      "A new article, blog, or news update needs to be published.",
      "The news hub or listing page descriptions need to guide readers better.",
    ],
    howToUpdate: [
      "Use Our Impact for impact overview, report, testimonial, and SDG page copy.",
      "Use Testimonials for learner or partner quotes that appear in impact areas and possibly homepage sections.",
      "Use Articles to create or edit individual news/blog records.",
      "Use News & Updates for hub and listing page copy.",
      "Use clear titles, excerpts, categories, dates, author details, images, and body content.",
    ],
    publishingNotes: [
      "Only publish real names, photos, and quotes when consent is confirmed.",
      "News should be timely and factual. Blogs can explain lessons, context, and thinking.",
    ],
  },
  {
    id: "applications",
    title: "Applications",
    summary: "Review and manage learner training applications submitted through the public form.",
    adminRoute: "/admin/applications",
    publicRoutes: ["/apply-for-training/courses", "/api/apply"],
    purpose:
      "Use Applications to review submitted learner interest, update status, and keep notes for follow-up.",
    useWhen: [
      "A new application arrives.",
      "An applicant needs to be reviewed, shortlisted, rejected, or enrolled.",
      "The team needs internal notes before contacting a learner.",
    ],
    howToUpdate: [
      "Open the application record and review all submitted fields.",
      "Update the status carefully so the team can filter the pipeline.",
      "Add notes that help future reviewers understand the decision.",
      "Do not store sensitive information that is not needed for the application process.",
    ],
    publishingNotes: [
      "Application records are admin-facing and should not publish to public pages.",
      "Treat applicant data as private. Keep notes professional and minimal.",
    ],
  },
  {
    id: "settings-contact",
    title: "Settings, Contact, Users, And Media",
    summary: "Operational CMS areas for site contact details, integrations, users, files, and contact messages.",
    adminRoute: "/admin/settings",
    publicRoutes: ["/contact", "Global footer/contact details where used"],
    purpose:
      "Use these areas to keep public contact channels, admin access, integrations, uploaded files, and contact enquiries organised.",
    useWhen: [
      "A phone number, email address, contact route, or integration status changes.",
      "An admin user needs to be created or reviewed.",
      "A file path, image, logo, document, or contact message needs to be managed.",
    ],
    howToUpdate: [
      "Use Settings for public contact details and integration readiness.",
      "Use Contact Page for public contact copy, channels, enquiry options, and routing cards.",
      "Use Users for admin access management.",
      "Use Media for file organisation and asset URLs.",
      "Use Messages for contact enquiries submitted from the public contact form.",
    ],
    publishingNotes: [
      "Check contact details after saving because wrong routing can block real enquiries.",
      "Only grant admin access to people who need it for their role.",
    ],
  },
];

const workflowRules = [
  "Before editing, open the public page in another tab so you understand what the visitor currently sees.",
  "Change one content area at a time, save, then review the public route that the CMS says it updates.",
  "Use draft or inactive status when content is not ready for the public site.",
  "Keep CTAs specific. A good CTA says what action the visitor is taking, not only 'Learn more'.",
  "Use real names, quotes, partners, dates, and statistics only when they are approved for public use.",
  "After publishing high-visibility edits, check desktop and mobile layouts.",
];

const statusGuidance = [
  {
    label: "Published / Active",
    body: "Visible to public pages when the relevant page reads CMS records.",
  },
  {
    label: "Draft / Inactive",
    body: "Saved in the CMS but normally hidden from public display.",
  },
  {
    label: "Archived",
    body: "Kept for reference but not intended for normal public display.",
  },
  {
    label: "Featured",
    body: "Used to give a record extra emphasis where the public component supports it.",
  },
];

export default function AdminDocumentationPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Usage & documentation"
        title="CMS guide for ITFY admins"
        description="A practical guide to what each admin area controls, which public pages it updates, and how to publish changes without losing your way."
        icon={<BookOpen className="h-6 w-6" />}
        primaryAction={{ label: "Open dashboard", href: "/admin/dashboard" }}
      />

      <section className="grid gap-5 md:grid-cols-3">
        <SummaryCard
          icon={<FileText className="h-5 w-5" />}
          label="Admin sections"
          value={String(documentationSections.length)}
          description="Main CMS areas documented with purpose, update steps, and publishing notes."
        />
        <SummaryCard
          icon={<RefreshCw className="h-5 w-5" />}
          label="Revalidation types"
          value={String(Object.keys(revalidationMap).length)}
          description="Content types that trigger public page refreshes after a CMS save."
        />
        <SummaryCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Publishing rule"
          value="Review"
          description="Every save should be followed by checking the affected public page."
        />
      </section>

      <section className="grid gap-8 xl:grid-cols-[280px_1fr]">
        <aside className="xl:sticky xl:top-8 xl:self-start">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
              Table of contents
            </p>
            <nav className="mt-5 grid gap-2">
              {documentationSections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-brand-mist hover:text-brand-ink"
                >
                  {section.title}
                </a>
              ))}
              <a
                href="#publishing-workflow"
                className="rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-brand-mist hover:text-brand-ink"
              >
                Publishing workflow
              </a>
              <a
                href="#revalidation-map"
                className="rounded-2xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-brand-mist hover:text-brand-ink"
              >
                What updates what
              </a>
            </nav>
          </div>
        </aside>

        <div className="space-y-8">
          {documentationSections.map((section) => (
            <DocumentationSection key={section.id} section={section} />
          ))}

          <section
            id="publishing-workflow"
            className="scroll-mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
                  Publishing workflow
                </p>
                <h2 className="mt-2 font-heading text-3xl font-bold text-slate-950">
                  A safe way to edit the site
                </h2>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                  Use this checklist for any public-facing update, especially homepage, training,
                  departments, partnerships, impact, and contact changes.
                </p>
              </div>
              <AdminStatusPill status="cms-ready" label="Recommended" />
            </div>

            <ol className="mt-6 grid gap-3">
              {workflowRules.map((rule, index) => (
                <li key={rule} className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {statusGuidance.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-100 p-4">
                  <p className="font-bold text-slate-950">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section
            id="revalidation-map"
            className="scroll-mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
              What updates what
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-slate-950">
              Revalidation map
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              These are the base public paths refreshed by each content type. Some routes also
              add a detail path when a slug is saved, such as a department, article, initiative,
              organisation service, partnership track, or dynamic Who We Are page.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {Object.entries(revalidationMap).map(([type, paths]) => (
                <div key={type} className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-bold text-slate-950">{type}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {paths.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  description,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-3 font-heading text-4xl font-bold text-slate-950">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-brand-gold">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-slate-600">{description}</p>
    </div>
  );
}

function DocumentationSection({ section }: { section: DocSection }) {
  return (
    <article
      id={section.id}
      className="scroll-mt-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
            CMS area
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-slate-950">
            {section.title}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            {section.summary}
          </p>
        </div>
        <Link
          href={section.adminRoute}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          Open area
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.35fr_0.65fr]">
        <div className="space-y-4">
          <InfoBlock title="Admin route" items={[section.adminRoute]} />
          <InfoBlock title="Public pages affected" items={section.publicRoutes} />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-brand-mist/60 p-4">
            <p className="font-bold text-brand-ink">Purpose</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{section.purpose}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <InfoBlock title="Use when" items={section.useWhen} />
            <InfoBlock title="How to update" items={section.howToUpdate} />
            <InfoBlock title="Publishing notes" items={section.publishingNotes} />
          </div>
        </div>
      </div>
    </article>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <p className="font-bold text-slate-950">{title}</p>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
