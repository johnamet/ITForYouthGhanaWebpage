import { AlertTriangle, FileDown, ShieldCheck, ShieldOff } from "lucide-react";

import type { ConsentRecord } from "@/lib/cms/laptop-bank-submissions";

/**
 * Read-only display pieces shared by the two Laptop Bank submission detail
 * screens.
 *
 * Built once rather than twice: the offer and the application show different
 * fields but need identical treatment for field groups, consent records,
 * upload links and storage warnings — and the consent and upload treatments
 * are exactly the ones that must not drift between the two screens.
 */

export type DetailRow = {
  label: string;
  /** Rendered as "Not provided" when empty. */
  value?: string | string[] | boolean;
  /** Renders the value in a monospace block, for long free text. */
  longform?: boolean;
};

function formatValue(value: DetailRow["value"]): string {
  if (value === undefined || value === null) return "Not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "Not provided";
  return value.trim() ? value : "Not provided";
}

export function DetailSection({ title, rows }: { title: string; rows: DetailRow[] }) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-lg font-bold text-slate-950">{title}</h2>
      <dl className="mt-5 grid gap-5 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className={row.longform ? "sm:col-span-2" : undefined}>
            <dt className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
              {row.label}
            </dt>
            <dd
              className={
                row.longform
                  ? "mt-2 whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-800"
                  : "mt-1 text-sm leading-6 text-slate-800"
              }
            >
              {formatValue(row.value)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/**
 * The consent record, spelled out.
 *
 * Spec §7 requires each consent to be stored as its own boolean with a
 * timestamp. Displaying them individually, with the timestamp, is what makes
 * that storage useful — a reviewer or an auditor can see exactly what was
 * agreed and when, rather than a single "consented: yes".
 */
export function ConsentList({
  consents,
  labels,
}: {
  consents: Record<string, ConsentRecord>;
  labels: Record<string, string>;
}) {
  const entries = Object.entries(labels);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-lg font-bold text-slate-950">Consents</h2>
      <ul className="mt-5 space-y-3">
        {entries.map(([key, label]) => {
          const record = consents[key];
          const given = record?.given === true;
          return (
            <li key={key} className="flex items-start gap-3 text-sm leading-6">
              {given ? (
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <ShieldOff className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              )}
              <span>
                <span className={given ? "font-semibold text-slate-900" : "text-slate-600"}>
                  {label}
                </span>
                <span className="ml-2 text-slate-500">
                  {given ? `given${record?.at ? ` ${record.at}` : ""}` : "not given"}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * A link to an uploaded file.
 *
 * Always through /api/laptop-bank/uploads/<id>, which verifies the admin
 * session and logs the actor. Never a signed or public URL — spec §7 requires
 * these files to be served only through an authenticated route, and the whole
 * point of storing them under an opaque UUID is defeated by handing out a
 * direct link.
 */
export function UploadLink({
  uploadId,
  label,
  logged = false,
}: {
  uploadId: string;
  label: string;
  logged?: boolean;
}) {
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="font-heading text-lg font-bold text-slate-950">{label}</h2>
      <a
        href={`/api/laptop-bank/uploads/${uploadId}`}
        className="mt-4 inline-flex items-center gap-2 rounded-control border border-brand-navy bg-white px-5 py-2.5 text-sm font-bold text-brand-navy transition hover:bg-brand-navy hover:text-white"
      >
        <FileDown className="h-4 w-4" />
        Open the file
      </a>
      {logged ? (
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Opening this file is recorded against your account. Only open it when you are reviewing
          this application.
        </p>
      ) : null}
    </section>
  );
}

/**
 * Shown when a file failed to store.
 *
 * Both public form routes record this on the submission rather than swallowing
 * it, because Draft 1 §14.5 names silent upload failure as the fault most
 * likely to be quietly losing submissions. Surfacing it here is the other half
 * of that: a reviewer needs to know the submission arrived incomplete so they
 * can ask for the file rather than judging it as sent.
 */
export function StorageFailureWarning({ what }: { what: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[24px] border border-amber-300 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
      <span>
        <span className="font-bold">{what} did not save.</span> The submission arrived but its file
        was lost in transit, so there is nothing to open below. Contact the submitter and ask them
        to send it again — do not judge this submission as though the file were missing on purpose.
      </span>
    </div>
  );
}

/** Shown when the record does not exist. */
export function SubmissionNotFound({ reference }: { reference: string }) {
  return (
    <p className="rounded-[28px] border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600">
      No submission found for reference <span className="font-bold">{reference}</span>. It may have
      been deleted, or Firebase may not be configured in this environment.
    </p>
  );
}
