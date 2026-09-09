import { HomepagePreviewCanvas } from "@/components/admin/homepage-workspace/preview-canvas";
import type { PreviewBaseline } from "@/components/admin/homepage-workspace/preview-messages";
import { getCmsFeaturedArticles } from "@/lib/cms/articles";
import {
  getCmsChallengeSection,
  getCmsDonationCampaign,
  getCmsFeaturedStory,
  getCmsHeroSlides,
  getCmsHomepageTicker,
  getCmsJoinCtaCards,
  getCmsMissionSection,
  getCmsNewsletterSignup,
  getCmsOverviewSection,
  getCmsProgrammeShowcase,
} from "@/lib/cms/homepage";
import { getCmsImpactStats } from "@/lib/cms/impact-stats";
import { getCmsPartners } from "@/lib/cms/partners";
import { getCmsTeamMembers } from "@/lib/cms/team";
import { getCmsTestimonials } from "@/lib/cms/testimonials";

export default async function HomepagePreviewPage() {
  const [
    ticker,
    overviewSection,
    challengeSection,
    missionSection,
    programmeShowcase,
    joinCtaCards,
    newsletterSignup,
    slides,
    impactStats,
    campaign,
    story,
    articles,
    testimonials,
    teamMembers,
    partners,
  ] = await Promise.all([
    getCmsHomepageTicker(),
    getCmsOverviewSection(),
    getCmsChallengeSection(),
    getCmsMissionSection(),
    getCmsProgrammeShowcase(),
    getCmsJoinCtaCards(),
    getCmsNewsletterSignup(),
    getCmsHeroSlides(),
    getCmsImpactStats(),
    getCmsDonationCampaign(),
    getCmsFeaturedStory(),
    getCmsFeaturedArticles(3),
    getCmsTestimonials(),
    getCmsTeamMembers(false),
    getCmsPartners(),
  ]);

  // Firestore can return records whose prototypes are not plain objects, which
  // cannot cross the Server-to-Client boundary. Rebuild as plain JSON. Dates on
  // these records are already strings (see normalizeArticle), so this is
  // lossless.
  const baseline = JSON.parse(
    JSON.stringify({
      editable: {
        ticker,
        overviewSection,
        challengeSection,
        missionSection,
        programmeShowcase,
        joinCtaCards,
        newsletterSignup,
      },
      context: {
        slides,
        impactStats,
        campaign,
        story,
        articles,
        testimonials,
        teamMembers,
        partners,
      },
    }),
  ) as PreviewBaseline;

  return <HomepagePreviewCanvas baseline={baseline} />;
}
