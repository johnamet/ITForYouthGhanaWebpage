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

  // Firestore can return records whose prototypes are not plain objects, which
  // cannot cross the Server-to-Client boundary. Rebuild as plain JSON. Every
  // date on these records is already a string (see normalizeArticle), so this
  // is lossless.
  const publishedValues = JSON.parse(
    JSON.stringify({
      ticker,
      overviewSection,
      challengeSection,
      missionSection,
      programmeShowcase,
      joinCtaCards,
      newsletterSignup,
    }),
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
