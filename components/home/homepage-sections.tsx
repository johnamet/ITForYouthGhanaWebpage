import {
  getCmsHeroSlides,
  getCmsHomepageTicker,
  getCmsProgrammeShowcase,
  getCmsOverviewSection,
  getCmsChallengeSection,
  getCmsMissionSection,
  getCmsDonationCampaign,
  getCmsFeaturedStory,
  getCmsJoinCtaCards,
  getCmsNewsletterSignup,
} from "@/lib/cms/homepage";
import { getCmsFeaturedArticles } from "@/lib/cms/articles";
import { getCmsPartners } from "@/lib/cms/partners";
import { getCmsTestimonials } from "@/lib/cms/testimonials";
import { getCmsImpactStats } from "@/lib/cms/impact-stats";

import { HeroCapsuleSlideshow } from "@/components/home/hero-capsule-slideshow";
import { MarqueeTicker } from "@/components/home/marquee-ticker";
import { ImpactCounter } from "@/components/home/impact-counter";
import { LegacyHomepageSections } from "@/components/home/legacy-homepage-sections";
import { ProgrammeShowcase } from "@/components/home/programme-showcase";
import { DonationCampaign } from "@/components/home/donation-campaign";
import { FeaturedStoryVideo } from "@/components/home/featured-story-video";
import { LatestNewsGrid } from "@/components/home/latest-news-grid";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { PartnersStrip } from "@/components/home/patrners-strip";
import { ClosingBlock } from "@/components/home/closing-block";

/**
 * The homepage composition.
 *
 * The marquee sits directly under the hero again. Its content remains CMS-owned
 * and can carry announcements, news or partner names as well as statistics, so
 * it is a distinct live-information layer rather than part of the hero copy.
 *
 * Two redundancies remain folded together:
 *
 *   The overview section answered "what we do", which the programme showcase
 *   answered again further down. Its copy now drives the showcase heading,
 *   which also fixes that heading having been hardcoded and uneditable.
 *
 *   The join-the-movement grid and the newsletter band were consecutive
 *   sections both asking the reader to act, splitting one decision across two
 *   screens. They are one closing block now.
 *
 * Fourteen original sections became twelve.
 */
export async function HomepageSections() {
  const [
    articles,
    testimonials,
    partners,
    impactStats,
    slides,
    ticker,
    showcase,
    campaign,
    story,
    joinCards,
    newsletter,
    challenge,
    mission,
    overview,
  ] = await Promise.all([
    getCmsFeaturedArticles(3),
    getCmsTestimonials(),
    getCmsPartners(),
    getCmsImpactStats(),
    getCmsHeroSlides(),
    getCmsHomepageTicker(),
    getCmsProgrammeShowcase(),
    getCmsDonationCampaign(),
    getCmsFeaturedStory(),
    getCmsJoinCtaCards(),
    getCmsNewsletterSignup(),
    getCmsChallengeSection(),
    getCmsMissionSection(),
    getCmsOverviewSection(),
  ]);

  return (
    <div className="bg-white">
      {/* 1 ── Hero capsule slideshow */}
      <HeroCapsuleSlideshow slides={slides} interval={6000} />

      {/* 2 ── CMS-controlled live information immediately under the hero */}
      <MarqueeTicker ticker={ticker} />

      {/* 3 ── Why this work exists, and what it aims at */}
      <LegacyHomepageSections challenge={challenge} mission={mission} />

      {/* 4 ── Impact counter */}
      <ImpactCounter stats={impactStats} />

      {/* 5 ── What we do, led by the folded-in overview copy */}
      <ProgrammeShowcase
        items={showcase}
        intro={{
          eyebrow: overview.title,
          title: overview.headline,
          description: overview.description,
        }}
      />

      {/* 6 ── Donation campaign */}
      <DonationCampaign campaign={campaign} />

      {/* 7 ── Featured story / video */}
      <FeaturedStoryVideo story={story} />

      {/* 8 ── Latest news & blog */}
      <LatestNewsGrid articles={articles} />

      {/* 9 ── Student testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 10 ── Partner strip */}
      <PartnersStrip partners={partners} />

      {/* 11 ── One closing moment: pick a route, or stay in touch */}
      <ClosingBlock cards={joinCards} newsletter={newsletter} />
    </div>
  );
}
