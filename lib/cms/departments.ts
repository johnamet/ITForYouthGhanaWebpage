import { readSeedCollection, readSeedRecord } from "@/lib/cms/descriptors/seed-collections";
import { departmentDescriptor } from "@/lib/content/cms-descriptors/seed-collections";
import { departments as seedDepartments } from "@/lib/content/site-config";
import type { DepartmentProfile } from "@/types/content";

/**
 * The departments: the eight the site ships, with any stored edits applied.
 *
 * This file used to hold about two hundred lines of normalisers —
 * `toActionLinks`, `toStats`, `toContentBlocks`, `toWorkflowSteps`,
 * `toResources`, `toContact` — rebuilding every field with an explicit type
 * check. They existed because a stored document was trusted to REPLACE the
 * seed, so a value of the wrong shape would have reached a `.map()` during a
 * prerender and failed the build.
 *
 * Replacing them with a merge only became safe once the merge itself refused a
 * value whose shape does not match the seed's — see the shape guard in
 * lib/cms/descriptors/page-overrides.ts. That is the same guarantee, in one
 * place, for every content type rather than hand-written per type. What it
 * buys is that a string added to a department in code is editable in the admin
 * immediately, where before it was silently uneditable until somebody extended
 * both the normaliser and the form.
 */

function sortDepartments(departments: DepartmentProfile[]) {
  return [...departments].sort((left, right) => {
    const order = (left.order ?? 0) - (right.order ?? 0);
    if (order !== 0) return order;
    return left.title.localeCompare(right.title);
  });
}

export async function getCmsDepartments(includeUnpublished = false): Promise<DepartmentProfile[]> {
  const departments = await readSeedCollection<DepartmentProfile>(departmentDescriptor);
  const visible = includeUnpublished
    ? departments
    : departments.filter((department) => department.status === "published");

  // Never return nothing: a status that hides every department would otherwise
  // leave /departments an empty page with no explanation.
  return sortDepartments(visible.length ? visible : seedDepartments);
}

export async function getCmsDepartmentBySlug(slug: string, includeUnpublished = false) {
  const departments = await getCmsDepartments(includeUnpublished);
  return departments.find((department) => department.slug === slug);
}

export async function getCmsDepartmentById(id: string): Promise<DepartmentProfile | undefined> {
  return readSeedRecord<DepartmentProfile>(departmentDescriptor, id);
}
