import {
  getCmsHeroSlides,
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
 * Three redundancies were removed rather than restyled:
 *
 *   The marquee ticker restated the impact counter's figures a few hundred
 *   pixels above it, so the page opened by making the same claim twice. The
 *   component, its CMS data and its admin editor all remain (the editor renders
 *   a live preview of it); it is only off the public page.
 *
 *   The overview section answered "what we do", which the programme showcase
 *   answered again further down. Its copy now drives the showcase heading,
 *   which also fixes that heading having been hardcoded and uneditable.
 *
 *   The join-the-movement grid and the newsletter band were consecutive
 *   sections both asking the reader to act, splitting one decision across two
 *   screens. They are one closing block now.
 *
 * Fourteen rendered sections became eleven.
 */
export async function HomepageSections() {
  const [
    articles,
    testimonials,
    partners,
    impactStats,
    slides,
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

      {/* 2 ── Why this work exists, and what it aims at */}
      <LegacyHomepageSections challenge={challenge} mission={mission} />

      {/* 3 ── Impact counter: the page's single figures moment */}
      <ImpactCounter stats={impactStats} />

      {/* 4 ── What we do, led by the folded-in overview copy */}
      <ProgrammeShowcase
        items={showcase}
        intro={{
          eyebrow: overview.title,
          title: overview.headline,
          description: overview.description,
        }}
      />

      {/* 5 ── Donation campaign */}
      <DonationCampaign campaign={campaign} />

      {/* 6 ── Featured story / video */}
      <FeaturedStoryVideo story={story} />

      {/* 7 ── Latest news & blog */}
      <LatestNewsGrid articles={articles} />

      {/* 8 ── Student testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 9 ── Partner strip */}
      <PartnersStrip partners={partners} />

      {/* 10 ── One closing moment: pick a route, or stay in touch */}
      <ClosingBlock cards={joinCards} newsletter={newsletter} />
    </div>
  );
}
