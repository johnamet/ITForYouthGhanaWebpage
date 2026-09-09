"use client";

import { useCallback, useEffect, useState } from "react";

import { DonationCampaign } from "@/components/home/donation-campaign";
import { FeaturedStoryVideo } from "@/components/home/featured-story-video";
import { HeroSlideshow } from "@/components/home/hero-slideshow";
import { HomepageTeamSection } from "@/components/home/homepage-team-section";
import { ImpactCounter } from "@/components/home/impact-counter";
import { InitiativesTree } from "@/components/home/initiatives-tree";
import { JoinCtaBlock } from "@/components/home/join-cta-block";
import { LatestNewsGrid } from "@/components/home/latest-news-grid";
import {
  HomepageChallengeSection,
  HomepageMissionSection,
  HomepageOverviewSection,
} from "@/components/home/legacy-homepage-sections";
import { MarqueeTicker } from "@/components/home/marquee-ticker";
import { NewsletterSignupSection } from "@/components/home/newsletter-signup-section";
import { PartnersStrip } from "@/components/home/patrners-strip";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { workspaceSectionsById } from "@/lib/cms/homepage-sections";
import { programmeShowcase as defaultProgrammeShowcase } from "@/lib/content/site-config";
import { cn } from "@/lib/utils/cn";

import { PreviewSectionBoundary } from "./preview-section-boundary";
import {
  isTrustedPreviewEvent,
  previewSectionDomId,
  type ParentToCanvasMessage,
  type PreviewBaseline,
} from "./preview-messages";

function PreviewSection({
  sectionId,
  label,
  editable,
  isActive,
  onSelect,
  resetKey,
  children,
}: {
  sectionId: string;
  label: string;
  editable: boolean;
  isActive: boolean;
  onSelect: (sectionId: string) => void;
  resetKey: number;
  children: React.ReactNode;
}) {
  if (!editable) {
    // Context sections are shown for layout truth but are not editable here.
    return (
      <div
        id={previewSectionDomId(sectionId)}
        className="pointer-events-none opacity-40"
      >
        <PreviewSectionBoundary label={label} resetKey={resetKey}>
          {children}
        </PreviewSectionBoundary>
      </div>
    );
  }

  return (
    <div id={previewSectionDomId(sectionId)} className="group relative">
      <PreviewSectionBoundary label={label} resetKey={resetKey}>
        {children}
      </PreviewSectionBoundary>
      <button
        type="button"
        onClick={() => onSelect(sectionId)}
        className={cn(
          "absolute inset-0 z-20 border-2 transition focus:outline-none focus-visible:border-brand-accent",
          isActive
            ? "border-brand-accent bg-brand-accent/[0.04]"
            : "border-transparent hover:border-brand-primary",
        )}
      >
        <span className="sr-only">Edit {label}</span>
      </button>
      <span
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-30 px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white transition",
          isActive
            ? "bg-brand-accent opacity-100"
            : "bg-brand-primary opacity-0 group-hover:opacity-100",
        )}
      >
        {label}
      </span>
    </div>
  );
}

export function HomepagePreviewCanvas({
  baseline,
}: {
  baseline: PreviewBaseline;
}) {
  const [values, setValues] = useState(baseline.editable);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [payloadVersion, setPayloadVersion] = useState(0);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!isTrustedPreviewEvent(event)) {
        return;
      }
      if (event.source !== window.parent) {
        return;
      }
      const message = event.data as ParentToCanvasMessage | null;
      if (!message || typeof message !== "object") {
        return;
      }

      if (message.type === "itfyg:preview-draft") {
        setValues(message.values);
        setActiveSectionId(message.activeSectionId);
        setPayloadVersion(message.payloadVersion);
        return;
      }

      if (message.type === "itfyg:preview-scroll") {
        setActiveSectionId(message.sectionId);
        document
          .getElementById(previewSectionDomId(message.sectionId))
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("message", handleMessage);
    // Announce readiness. Without this the parent's first payload can race the
    // iframe load and be dropped.
    window.parent.postMessage(
      { type: "itfyg:preview-ready" },
      window.location.origin,
    );
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const onSelect = useCallback((sectionId: string) => {
    window.parent.postMessage(
      { type: "itfyg:preview-select", sectionId },
      window.location.origin,
    );
  }, []);

  // Mirrors the public page: an empty showcase falls back to seed content.
  const showcaseItems = values.programmeShowcase.length
    ? values.programmeShowcase
    : defaultProgrammeShowcase;

  const editable = (sectionId: string, label: string, node: React.ReactNode) => (
    <PreviewSection
      sectionId={sectionId}
      label={label}
      editable
      isActive={activeSectionId === sectionId}
      onSelect={onSelect}
      resetKey={payloadVersion}
    >
      {node}
    </PreviewSection>
  );

  const context = (sectionId: string, label: string, node: React.ReactNode) => (
    <PreviewSection
      sectionId={sectionId}
      label={label}
      editable={false}
      isActive={false}
      onSelect={onSelect}
      resetKey={payloadVersion}
    >
      {node}
    </PreviewSection>
  );

  return (
    <div className="bg-white">
      {context(
        "hero-slideshow",
        "Hero slideshow",
        <HeroSlideshow slides={baseline.context.slides} interval={6000} />,
      )}
      {editable(
        "marquee",
        workspaceSectionsById.marquee.label,
        <MarqueeTicker ticker={values.ticker} />,
      )}
      {editable(
        "overview",
        workspaceSectionsById.overview.label,
        <HomepageOverviewSection content={values.overviewSection} />,
      )}
      {editable(
        "challenge-section",
        workspaceSectionsById["challenge-section"].label,
        <HomepageChallengeSection content={values.challengeSection} />,
      )}
      {editable(
        "mission-section",
        workspaceSectionsById["mission-section"].label,
        <HomepageMissionSection content={values.missionSection} />,
      )}
      {context(
        "impact-counter",
        "Impact counter",
        <ImpactCounter stats={baseline.context.impactStats} />,
      )}
      {editable(
        "programme-showcase",
        workspaceSectionsById["programme-showcase"].label,
        <InitiativesTree items={showcaseItems} />,
      )}
      {context(
        "donation",
        "Donation campaign",
        <DonationCampaign campaign={baseline.context.campaign} />,
      )}
      {context(
        "featured-story",
        "Featured story",
        <FeaturedStoryVideo story={baseline.context.story} />,
      )}
      {context(
        "articles",
        "Latest news & blog",
        <LatestNewsGrid articles={baseline.context.articles} />,
      )}
      {context(
        "testimonials",
        "Testimonials carousel",
        <TestimonialsSection testimonials={baseline.context.testimonials} />,
      )}
      {context(
        "team",
        "Team section",
        <HomepageTeamSection members={baseline.context.teamMembers} />,
      )}
      {context(
        "partners",
        "Partner strip",
        <PartnersStrip partners={baseline.context.partners} />,
      )}
      {editable(
        "join-cta",
        workspaceSectionsById["join-cta"].label,
        <JoinCtaBlock cards={values.joinCtaCards} />,
      )}
      {editable(
        "newsletter",
        workspaceSectionsById.newsletter.label,
        <NewsletterSignupSection content={values.newsletterSignup} />,
      )}
    </div>
  );
}
