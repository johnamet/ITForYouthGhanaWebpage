import { notFound } from "next/navigation";

import { CmsPreviewCanvas } from "@/components/admin/cms-preview/preview-canvas";
import type { PreviewContext } from "@/components/admin/cms-preview/preview-context";
import {
  isPreviewableDescriptor,
  type PreviewableKey,
} from "@/components/admin/cms-preview/preview-registry";
import { getCourseCatalog } from "@/lib/api/courses";
import { getCmsPublishedArticles } from "@/lib/cms/articles";
import { getRecord } from "@/lib/cms/descriptors/crud";
import type { FormValues } from "@/lib/cms/descriptors/form-values";
import { getDescriptor } from "@/lib/cms/descriptors/registry";
import { initialValues } from "@/lib/cms/descriptors/form-values";
import { mergedRecordFor, resolveFields } from "@/lib/cms/descriptors/seed-collections";
import { getCmsInitiatives } from "@/lib/cms/initiatives";
import { getCmsJobs } from "@/lib/cms/jobs";
import { getCmsPartners } from "@/lib/cms/partners";
import { getCmsPartnershipTracks } from "@/lib/cms/partnerships";
import { getCmsTeamMembers } from "@/lib/cms/team";
import { seedTrainingCourses } from "@/lib/content/training-config";

type PreviewPageProps = { params: { type: string; id: string } };

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
    getCourseCatalog(),
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

  return (
    <CmsPreviewCanvas
      descriptorKey={descriptor.key as PreviewableKey}
      baseline={baseline}
      context={context}
    />
  );
}
