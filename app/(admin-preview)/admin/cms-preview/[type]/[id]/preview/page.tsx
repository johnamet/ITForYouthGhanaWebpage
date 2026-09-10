import { notFound } from "next/navigation";

import { CmsPreviewCanvas } from "@/components/admin/cms-preview/preview-canvas";
import type { PreviewMergeInputs } from "@/components/admin/cms-preview/preview-document";
import {
  isPreviewableDescriptor,
  type PreviewableKey,
  type PreviewContext,
} from "@/components/admin/cms-preview/preview-context";
import { getCourseCatalog } from "@/lib/api/courses";
import { getCmsPublishedArticles } from "@/lib/cms/articles";
import { getRecord } from "@/lib/cms/descriptors/crud";
import type { FormValues } from "@/lib/cms/descriptors/form-values";
import { getDescriptor } from "@/lib/cms/descriptors/registry";
import { initialValues } from "@/lib/cms/descriptors/form-values";
import {
  mergedRecordFor,
  optionalKeysOf,
  resolveFields,
} from "@/lib/cms/descriptors/seed-collections";
import { getCmsInitiatives } from "@/lib/cms/initiatives";
import { getCmsJobs } from "@/lib/cms/jobs";
import { getCmsPartners } from "@/lib/cms/partners";
import { getCmsPartnershipTracks } from "@/lib/cms/partnerships";
import { getCmsTeamMembers } from "@/lib/cms/team";
import { seedTrainingCourses } from "@/lib/content/training-config";
import type { Course } from "@/types/course";

type PreviewPageProps = { params: { type: string; id: string } };

/**
 * How long the external course catalogue gets before the seed is used instead.
 *
 * `getCourseCatalog` fetches papi.itforyouthghana.org with no timeout of its
 * own, and only ONE of the sixteen descriptors consumes the result. Meanwhile
 * `PreviewFrame` declares the preview dead after 8 seconds and blames the
 * editor's session for it, so an unreachable third party used to break all
 * sixteen previews with a wrong diagnosis.
 *
 * 2.5s is chosen to sit comfortably inside that 8-second budget alongside
 * everything else the frame is waiting on — the auth guard, seven Firestore
 * reads, the RSC render and hydration — while still being long enough that a
 * healthy API answers well within it. The fallback is the same seed catalogue
 * the public route uses when the API returns nothing, so the courses preview
 * degrades to shipped content rather than to an empty page.
 *
 * A per-descriptor context map would avoid the fetch entirely for the other
 * fifteen, but that is a larger refactor than this belongs in.
 */
const COURSE_FETCH_BUDGET_MS = 2500;

async function courseCatalogueWithinBudget(): Promise<Course[]> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const budget = new Promise<Course[]>((resolve) => {
    timer = setTimeout(() => resolve([]), COURSE_FETCH_BUDGET_MS);
  });

  try {
    return await Promise.race([getCourseCatalog(), budget]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export default async function CmsPreviewPage({ params }: PreviewPageProps) {
  const descriptor = getDescriptor(params.type);

  if (!descriptor || !isPreviewableDescriptor(descriptor)) {
    notFound();
  }

  const [
    stored,
    teamMembers,
    partners,
    jobs,
    initiatives,
    tracks,
    articles,
    externalCourses,
  ] = await Promise.all([
    getRecord(descriptor.key, params.id),
    getCmsTeamMembers(false),
    getCmsPartners(),
    getCmsJobs(false),
    getCmsInitiatives(),
    getCmsPartnershipTracks(),
    getCmsPublishedArticles(),
    courseCatalogueWithinBudget(),
  ]);

  // The same base the public route uses: the external catalogue when it has
  // anything, the shipped seed otherwise.
  const courseCatalogue = externalCourses.length
    ? externalCourses
    : seedTrainingCourses;

  const context: PreviewContext = {
    teamMembers,
    partners,
    jobs,
    initiatives,
    // ImpactOverviewPage takes the same partner list under its own prop name.
    impactPartners: partners,
    tracks,
    articles,
    courseCatalogue,
  };

  // Built exactly as the editor builds it, with the same three helpers and the
  // same inputs, so the baseline is in the shape the form will report. Any
  // other shape and the first draft payload changes shape underneath the
  // composition.
  const fields = resolveFields(descriptor, { id: params.id, stored });
  const fallbackRecord = mergedRecordFor(descriptor, params.id, stored);
  const record = stored ?? { id: params.id };

  // Firestore can return records whose prototypes are not plain objects, which
  // cannot cross the Server-to-Client boundary. Rebuild as plain JSON.
  const baseline = JSON.parse(
    JSON.stringify(initialValues(fields, record, fallbackRecord)),
  ) as FormValues;

  /**
   * What the canvas needs to turn the form's flat values back into the nested
   * document a public renderer takes.
   *
   * `fallbackRecord` IS `mergedRecordFor(descriptor, id, stored)` — the same
   * merged document the public getter would render before any draft edit — and
   * `optionalKeysOf` is the descriptor-level equivalent of `pageOptionalKeys`,
   * which is what the public site-page read passes to the same merge.
   */
  const merge: PreviewMergeInputs = {
    base: JSON.parse(JSON.stringify(fallbackRecord ?? {})) as Record<string, unknown>,
    allowKeys: optionalKeysOf(descriptor),
    stringListKeys: fields
      .filter((field) => field.kind === "stringList")
      .map((field) => field.key),
  };

  return (
    <CmsPreviewCanvas
      descriptorKey={descriptor.key as PreviewableKey}
      baseline={baseline}
      merge={merge}
      context={context}
    />
  );
}
