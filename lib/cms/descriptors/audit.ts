import { getCurrentAdminUser } from "@/lib/cms/admin-auth";
import { writeAuditLog } from "@/lib/cms/audit";

/**
 * Runs a CMS write and records who did it.
 *
 * WHY THIS EXISTS
 * 22 of this repo's 45 admin write routes recorded nothing, which made
 * /admin/audit quietly incomplete: a change made through one of them could not
 * be attributed to anyone. Routing every write through one wrapper means a new
 * route gets its audit entry by construction rather than by the author
 * remembering — which is the failure mode that produced those 22.
 *
 * TWO DELIBERATE CHOICES
 *
 * 1. The audit entry is written AFTER the write succeeds. An entry for a write
 *    that then failed is worse than no entry: it asserts a change that did not
 *    happen.
 *
 * 2. A failed audit write never fails the request. Losing the trail for one
 *    change is bad; refusing a legitimate content save because the log was
 *    briefly unavailable is worse, and would make the audit log a single point
 *    of failure for the whole CMS.
 *
 * `{ configured: false }` — the shape every CMS writer in this repo returns
 * when Firebase Admin is absent — is passed straight through without an audit
 * entry, because nothing was written.
 */
export async function auditedWrite<T extends { configured: boolean }>(options: {
  action: "create" | "update" | "delete";
  /** Plural noun matching the sibling routes, so /admin/audit groups rows. */
  resourceType: string;
  /**
   * The record's id, or a function deriving it from the write's result.
   *
   * A create does not know its document id until the write returns, so a bare
   * string cannot serve both cases — the jobs POST route needs
   * `(r) => r.id ?? "unknown"`.
   */
  resourceId: string | ((result: T) => string);
  summary?: string;
  changes?: Record<string, unknown>;
  write: () => Promise<T>;
}): Promise<T> {
  const result = await options.write();
  if (!result.configured) return result;

  const actor = await getCurrentAdminUser();

  await writeAuditLog({
    action: options.action,
    resourceType: options.resourceType,
    resourceId:
      typeof options.resourceId === "function"
        ? options.resourceId(result)
        : options.resourceId,
    actor: actor ? { uid: actor.uid, email: actor.email, role: actor.role } : null,
    summary: options.summary,
    changes: options.changes,
  }).catch((error) => {
    console.error(
      `Audit entry failed for ${options.action} ${options.resourceType}/${options.resourceId}`,
      error,
    );
  });

  return result;
}
