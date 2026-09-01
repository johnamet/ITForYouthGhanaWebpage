import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { DocumentAudienceTag, LaptopBankDocument } from "@/types/laptop-bank";

type DocumentDownloadBlockProps = {
  documents: LaptopBankDocument[];
  /** Page 5.10 groups the six launch files by audience_tag. */
  groupByAudience?: boolean;
  headings?: Record<DocumentAudienceTag, string>;
  className?: string;
};

/** Spec 5.10's order: donor-facing first, then applicant, then public. */
const AUDIENCE_ORDER: DocumentAudienceTag[] = ["corporate", "applicant", "public"];

const DEFAULT_HEADINGS: Record<DocumentAudienceTag, string> = {
  corporate: "For donor organisations",
  applicant: "For applicants and recipients",
  public: "Published for anyone",
};

function DocumentCard({ document }: { document: LaptopBankDocument }) {
  const file = document.file.trim();
  // Every one of the six launch PDFs is awaited (spec §11), so at launch this
  // is the normal state rather than an edge case. Rendering a disabled row
  // beats either hiding the document — the reader would not know it exists —
  // or linking to a file that 404s.
  const isAwaited = file.length === 0;

  const meta = [
    document.format.trim(),
    document.fileSize?.trim(),
    document.version.trim() ? `Version ${document.version.trim()}` : "",
    document.date.trim(),
  ].filter(Boolean);

  return (
    <div className="flex flex-col justify-between gap-5 rounded-[24px] border border-brand-border bg-white p-6 shadow-sm sm:flex-row sm:items-center">
      <div>
        <p className="font-heading text-lg font-bold text-brand-ink">{document.title}</p>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          {meta.length ? meta.join(" · ") : "Version and date to be published with the file."}
        </p>
      </div>
      {isAwaited ? (
        <p className="shrink-0 rounded-control border border-brand-border bg-slate-50 px-5 py-2.5 text-sm font-bold text-slate-500">
          Awaiting publication
        </p>
      ) : (
        <Button href={file} variant="blue-outline" size="md" download className="shrink-0">
          Download
        </Button>
      )}
    </div>
  );
}

/**
 * C12 — document download block.
 *
 * Spec §3: "Title, format, file size, version, date. Reads Document content
 * type." Spec 5.10 DATA: "Every file displays version and date. Superseded
 * versions are removed, not stacked" — this component renders whatever the
 * reader returns, so removing a superseded version is a CMS action, and
 * nothing here stacks two versions of the same id.
 */
export function DocumentDownloadBlock({
  documents,
  groupByAudience = false,
  headings = DEFAULT_HEADINGS,
  className,
}: DocumentDownloadBlockProps) {
  if (!documents.length) return null;

  if (!groupByAudience) {
    return (
      <div className={cn("space-y-4", className)}>
        {documents.map((document) => (
          <DocumentCard key={document.id} document={document} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-12", className)}>
      {AUDIENCE_ORDER.map((audience) => {
        const group = documents.filter((document) => document.audience_tag === audience);
        if (!group.length) return null;

        return (
          <div key={audience}>
            <h3 className="font-heading text-2xl font-bold text-brand-ink">{headings[audience]}</h3>
            <div className="mt-5 space-y-4">
              {group.map((document) => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
