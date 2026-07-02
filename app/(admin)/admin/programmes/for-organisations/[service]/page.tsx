import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye, Pencil } from "lucide-react";

import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminStatusPill } from "@/components/admin/admin-status-pill";
import { organisationServices } from "@/lib/content/organisation-config";
import type { AdminMetric, AdminTableColumn } from "@/types/admin";

type AdminOrganisationServicePageProps = {
  params: { service: string };
};

type OrganisationServiceSectionRow = {
  id: string;
  label: string;
  description: string;
  status: "live" | "planned";
  items: string;
};

export function generateStaticParams() {
  return organisationServices.map((service) => ({ service: service.slug }));
}

const sectionColumns: AdminTableColumn<OrganisationServiceSectionRow>[] = [
  {
    key: "label",
    label: "Editable section",
    render: (row) => (
      <div>
        <p className="font-bold text-slate-950">{row.label}</p>
        <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
          {row.description}
        </p>
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

export default function AdminOrganisationServicePage({
  params,
}: AdminOrganisationServicePageProps) {
  const service = organisationServices.find((entry) => entry.slug === params.service);

  if (!service) {
    notFound();
  }

  const metrics: AdminMetric[] = [
    {
      label: "Stats",
      value: String(service.stats.length),
      description: "Hero and proof metrics ready for editable service cards.",
      status: "published",
    },
    {
      label: "Case studies",
      value: String(service.caseStudies.length),
      description: "Representative examples that can become CMS-managed proof.",
      status: "active",
    },
    {
      label: "FAQs",
      value: String(service.faqs.length),
      description: "Service-specific questions and answers.",
      status: "active",
    },
  ];

  const rows: OrganisationServiceSectionRow[] = [
    {
      id: "hero",
      label: "Hero",
      description: "Eyebrow, title, tagline, image, stats, and primary CTA.",
      status: "live",
      items: service.heroImage ? "Image + copy" : "Copy only",
    },
    {
      id: "overview",
      label: "Service overview",
      description: "Value proposition cards and service-specific support areas.",
      status: "live",
      items: `${service.overviewCards.length} cards`,
    },
    {
      id: "process",
      label: "How it works",
      description: "The delivery sequence for organisational engagement.",
      status: "live",
      items: `${service.howItWorks.length} steps`,
    },
    {
      id: "proof",
      label: "Case studies",
      description: "Seeded examples that can become real partner stories later.",
      status: "live",
      items: `${service.caseStudies.length} examples`,
    },
    {
      id: "packages",
      label: "Packages",
      description: "Optional service packages, pricing frames, and scope notes.",
      status: service.packages?.length ? "live" : "planned",
      items: `${service.packages?.length ?? 0} packages`,
    },
    {
      id: "contact",
      label: "Contact CTA",
      description: "Email, primary CTA, secondary CTA, and related route links.",
      status: "live",
      items: service.contactCta.email,
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="Organisation CMS"
        title={`Service editor: ${service.title}`}
        description={service.description}
        primaryAction={{
          label: "Preview public page",
          href: `/for-organisations/${service.slug}`,
        }}
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
          href={`/for-organisations/${service.slug}`}
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
