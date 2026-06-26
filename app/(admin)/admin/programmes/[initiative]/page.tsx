import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, Pencil } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { initiatives } from "@/lib/content/site-config";
import type { AdminMetric, AdminTableColumn } from "@/types/admin";

type AdminInitiativePageProps = {
  params: { initiative: string };
};

type InitiativeSectionRow = {
  id: string;
  label: string;
  description: string;
  status: "live" | "planned";
  items: string;
};

export function generateStaticParams() {
  return initiatives.map((initiative) => ({ initiative: initiative.slug }));
}

const sectionColumns: AdminTableColumn<InitiativeSectionRow>[] = [
  {
    key: "label",
    label: "Editable section",
    render: (row) => (
      <div>
        <p className="font-bold text-slate-950">{row.label}</p>
        <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">{row.description}</p>
      </div>
    ),
  },
  {
    key: "items",
    label: "Seeded items",
    render: (row) => <p className="font-semibold text-slate-800">{row.items}</p>,
  },
  {
    key: "status",
    label: "Status",
    render: (row) => <AdminStatusPill status={row.status} />,
  },
  {
    key: "actions",
    label: "Actions",
    render: () => (
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white"
      >
        <Pencil className="h-3.5 w-3.5" />
        Edit scaffold
      </button>
    ),
  },
];

export default function AdminInitiativePage({ params }: AdminInitiativePageProps) {
  const initiative = initiatives.find((entry) => entry.slug === params.initiative);

  if (!initiative) {
    notFound();
  }

  const metrics: AdminMetric[] = [
    {
      label: "Impact stats",
      value: String(initiative.impactStats.length),
      description: "Stats ready for editable counter cards and report proof.",
      status: "published",
    },
    {
      label: "Gallery assets",
      value: String(initiative.gallery.length),
      description: "Images that will move to Firebase Storage references.",
      status: "active",
    },
    {
      label: "FAQs",
      value: String(initiative.faqs.length),
      description: "Question and answer blocks ready for rich editing.",
      status: "active",
    },
  ];

  const rows: InitiativeSectionRow[] = [
    {
      id: "hero",
      label: "Hero",
      description: "Eyebrow, title, tagline, media, CTAs, and stat strip.",
      status: "live",
      items: initiative.heroImage ? "Image + copy" : "Copy only",
    },
    {
      id: "overview",
      label: "Overview",
      description: "Mission narrative, body copy, overview image, and objectives.",
      status: "live",
      items: `${initiative.objectives.length} objectives`,
    },
    {
      id: "process",
      label: "How it works",
      description: "Ordered process cards with icons, titles, and descriptions.",
      status: "live",
      items: `${initiative.howItWorks.length} steps`,
    },
    {
      id: "audience",
      label: "Audience and eligibility",
      description: "Target groups, eligibility notes, and learner fit content.",
      status: "live",
      items: `${initiative.audience.groups.length} groups`,
    },
    {
      id: "proof",
      label: "Proof layers",
      description: "Gallery, testimonials, partners, FAQs, and related route cards.",
      status: "live",
      items: `${initiative.gallery.length + initiative.testimonials.length + initiative.partners.length} records`,
    },
    {
      id: "seo",
      label: "SEO and publishing",
      description: "Metadata, OG image, publish state, and revalidation targets.",
      status: "planned",
      items: "CMS fields pending",
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Programme CMS"
        title={`Initiative editor: ${initiative.title}`}
        description={initiative.description}
        primaryAction={{ label: "Preview public page", href: `/what-we-do/${initiative.slug}` }}
      />

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/content/homepage"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700"
        >
          <Pencil className="h-4 w-4" />
          Homepage placement
        </Link>
        <Link
          href={`/what-we-do/${initiative.slug}`}
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-bold text-white"
        >
          <Eye className="h-4 w-4" />
          Public route
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {metrics.map((metric) => (
          <AdminMetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <AdminDataTable columns={sectionColumns} rows={rows} />
    </div>
  );
}
