import { HomepageWorkspaceProvider } from "@/components/admin/homepage-workspace/workspace-provider";
import { WorkspaceLayout } from "@/components/admin/homepage-workspace/workspace-layout";
import type { HomepageDraftValues } from "@/lib/cms/homepage-sections";
import {
  getCmsChallengeSection,
  getCmsHomepageTicker,
  getCmsJoinCtaCards,
  getCmsMissionSection,
  getCmsNewsletterSignup,
  getCmsOverviewSection,
  getCmsProgrammeShowcase,
} from "@/lib/cms/homepage";

type AdminHomepagePageProps = {
  searchParams: { section?: string };
};

export default async function AdminHomepageWorkspacePage({
  searchParams,
}: AdminHomepagePageProps) {
  const [
    ticker,
    overviewSection,
    challengeSection,
    missionSection,
    programmeShowcase,
    joinCtaCards,
    newsletterSignup,
  ] = await Promise.all([
    getCmsHomepageTicker(),
    getCmsOverviewSection(),
    getCmsChallengeSection(),
    getCmsMissionSection(),
    getCmsProgrammeShowcase(),
    getCmsJoinCtaCards(),
    getCmsNewsletterSignup(),
  ]);

  // Annotated rather than cast, so the compiler checks this object against
  // HomepageDraftValues. JSON.stringify accepts `any`, so building the literal
  // inline and casting the result would let a swapped variable or a dropped
  // field compile cleanly and fail at runtime.
  const published: HomepageDraftValues = {
    ticker,
    overviewSection,
    challengeSection,
    missionSection,
    programmeShowcase,
    joinCtaCards,
    newsletterSignup,
  };

  // Firestore can return records whose prototypes are not plain objects, which
  // cannot cross the Server-to-Client boundary. Rebuild as plain JSON. Every
  // date on these records is already a string (see normalizeArticle), so this
  // is lossless.
  const publishedValues = JSON.parse(
    JSON.stringify(published),
  ) as HomepageDraftValues;

  return (
    <HomepageWorkspaceProvider
      publishedValues={publishedValues}
      initialSectionId={searchParams.section ?? null}
    >
      <WorkspaceLayout />
    </HomepageWorkspaceProvider>
  );
}
