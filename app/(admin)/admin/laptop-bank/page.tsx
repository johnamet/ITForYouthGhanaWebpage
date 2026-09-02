import { Database, FileText, GraduationCap, Laptop } from "lucide-react";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { countRecords, getSingletonRecord } from "@/lib/cms/laptop-bank-admin";
import {
  LAPTOP_BANK_CONTENT_TYPES,
  LAPTOP_BANK_PAGE_TYPE_KEYS,
  LAPTOP_BANK_RECORD_TYPE_KEYS,
} from "@/lib/content/laptop-bank-admin-schema";
import { getEquipmentOffers, getStudentApplications } from "@/lib/cms/laptop-bank-submissions";

/**
 * The Laptop Bank admin index.
 *
 * Spec §4 asks that all six content types be "editable without a developer".
 * A content type nobody can find is not editable, so this screen exists to
 * make all six — and both submission inboxes — reachable in one click from the
 * admin navigation.
 */
export default async function AdminLaptopBankPage() {
  const [counts, metrics, offers, applications] = await Promise.all([
    Promise.all(
      LAPTOP_BANK_RECORD_TYPE_KEYS.filter(
        (key) => LAPTOP_BANK_CONTENT_TYPES[key].shape === "collection",
      ).map(async (key) => [key, await countRecords(key)] as const),
    ),
    getSingletonRecord("dashboard-metrics"),
    getEquipmentOffers(),
    getStudentApplications(),
  ]);

  const countByKey = new Map(counts);

  const inboxes = [
    {
      href: "/admin/laptop-bank/offers",
      label: "Equipment offers",
      description:
        "Corporate offers from /laptop-bank/donate-equipment. Reply within the published service level.",
      count: offers.length,
      pending: offers.filter((offer) => offer.status === "new").length,
      icon: <Laptop className="h-5 w-5" />,
    },
    {
      href: "/admin/laptop-bank/applications",
      label: "Laptop applications",
      description:
        "Her First Laptop applications. Every applicant gets an outcome, whether or not they are selected.",
      count: applications.length,
      pending: applications.filter((application) => application.status === "new").length,
      icon: <GraduationCap className="h-5 w-5" />,
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        eyebrow="IT for Youth Laptop Bank"
        title="Laptop Bank"
        description="The six content types behind the Laptop Bank and Her First Laptop pages, plus both submission inboxes."
        icon={<Laptop className="h-6 w-6" />}
      />

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-slate-950">Submissions</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {inboxes.map((inbox) => (
            <a
              key={inbox.href}
              href={inbox.href}
              className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-navy"
            >
              <div className="flex items-center gap-3 text-brand-navy">
                {inbox.icon}
                <p className="font-heading text-lg font-bold text-slate-950">{inbox.label}</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{inbox.description}</p>
              <p className="mt-4 text-sm font-bold text-slate-800">
                {inbox.count} total
                {inbox.pending ? (
                  <span className="ml-2 rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800">
                    {inbox.pending} awaiting review
                  </span>
                ) : null}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-slate-950">Content</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {LAPTOP_BANK_RECORD_TYPE_KEYS.map((key) => {
            const descriptor = LAPTOP_BANK_CONTENT_TYPES[key];
            const isSingleton = descriptor.shape === "singleton";
            const count = countByKey.get(key);

            return (
              <a
                key={key}
                href={`/admin/laptop-bank/records/${key}`}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-navy"
              >
                <div className="flex items-center gap-3 text-brand-navy">
                  <Database className="h-5 w-5" />
                  <p className="font-heading text-lg font-bold text-slate-950">
                    {descriptor.plural}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{descriptor.description}</p>
                <p className="mt-4 text-sm font-bold text-slate-800">
                  {isSingleton
                    ? metrics
                      ? "One record, published"
                      : "One record, not yet filled in"
                    : `${count ?? 0} record${count === 1 ? "" : "s"}`}
                </p>
              </a>
            );
          })}
        </div>
      </section>

      {/*
        Page copy. Every other section of this site already lets an editor
        change a heading without a developer — these pages were the exception,
        which meant a wording change needed a code edit and a redeploy.
      */}
      <section className="space-y-4">
        <h2 className="font-heading text-xl font-bold text-slate-950">Page wording</h2>
        <p className="max-w-3xl text-sm leading-7 text-slate-600">
          Headings and paragraphs on the public pages. Anything left empty keeps the wording the
          site ships with, so a half-finished edit cannot blank a page. Link destinations and
          section anchors are not editable — the URL map is final and gets printed on legal
          paperwork.
        </p>
        <div className="grid gap-4 lg:grid-cols-2">
          {LAPTOP_BANK_PAGE_TYPE_KEYS.map((key) => {
            const descriptor = LAPTOP_BANK_CONTENT_TYPES[key];
            return (
              <a
                key={key}
                href={`/admin/laptop-bank/records/${key}`}
                className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-brand-navy"
              >
                <div className="flex items-center gap-3 text-brand-navy">
                  <FileText className="h-5 w-5" />
                  <p className="font-heading text-lg font-bold text-slate-950">
                    {descriptor.label}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-600">{descriptor.description}</p>
                <p className="mt-4 text-sm font-bold text-slate-800">
                  {descriptor.fields.length} editable field
                  {descriptor.fields.length === 1 ? "" : "s"}
                </p>
              </a>
            );
          })}
        </div>
      </section>
    </div>
  );
}
