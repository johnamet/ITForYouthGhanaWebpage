import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ContentImage } from "@/components/media/content-image";
import { VideoCard } from "@/components/media/video-card";
import { resolveMedia, type MediaTheme, type PoolEntry } from "@/lib/content/media-pool";
import { safeImageSrc } from "@/lib/utils/image-src";
import { composeProse } from "@/lib/utils/prose";
import { cn } from "@/lib/utils/cn";

export type ProseMediaCardProps = {
  /**
   * "panel" (default) is the padded card the media rollout uses.
   * "spotlight" reproduces the retired SpotlightCard: a 6px accent bar, an
   * edge-to-edge 16/9 image, a pill eyebrow, and an optional CTA button.
   */
  variant?: "panel" | "spotlight";
  /** Spotlight variant only — the accent bar colour. */
  accentColor?: string;
  /** Renders a Button below the prose, on either variant ("pink" on spotlight, "blue" on panel). */
  cta?: { label: string; href: string; download?: boolean };
  eyebrow?: string;
  title: string;
  body?: string;
  /** Rendered as prose, never as a list. */
  points?: string[];
  /**
   * A prominent labelled value, rendered top-right of the text block. Built for
   * the price on a pricing card, where the number is what a reader scans for
   * and an `eyebrow` reads as a category label instead. Not rendered on the
   * spotlight variant.
   */
  badge?: { label?: string; value: string };
  /**
   * A supporting line set off by the site's gold rule, below the prose. Use it
   * for content that belongs with the card but is not part of its prose — a
   * feature list, a set of tags. Not rendered on the spotlight variant.
   */
  aside?: string;
  /** A muted closing line, below everything else. Not rendered on the spotlight variant. */
  footnote?: string;
  /** Authored media always wins over the pool. */
  media?: {
    image?: string;
    /** Authored icon/illustration URL. Ranks between `image` and `resolved`. */
    iconImage?: string;
    imageAlt?: string;
    videoUrl?: string;
    videoTitle?: string;
  };
  /**
   * A pool entry the parent already picked via `resolveMediaSet`, so sibling
   * cards in the same grid don't land on the same photograph. A grid
   * container should call `resolveMediaSet` once for all of its cards and
   * pass each result in here; it only matters when no authored image or
   * iconImage is present.
   */
  resolved?: PoolEntry;
  /** Stable content key for the resolver — never a bare array index. */
  mediaKey: string;
  theme: MediaTheme;
  /** Media above the prose, or beside it from lg up. */
  layout?: "stacked" | "side";
  /**
   * How many columns the surrounding grid uses. Only shapes the `stacked`
   * layout's `sizes` descriptor — `layout="side"` is always effectively
   * two columns from lg up regardless of this value. Defaults to 4.
   */
  columns?: 1 | 2 | 3 | 4;
  /** Escape hatch that overrides whatever `columns` would otherwise compute. */
  sizes?: string;
  /** Which grid column the media occupies for `layout="side"`. Defaults to `"start"`. */
  mediaPosition?: "start" | "end";
  /**
   * "card" (default) is the current panel treatment: the whole row renders
   * as one white card. "bare" instead renders the outer row with no card
   * styling at all and gives the copy block its own
   * `rounded-[30px] border border-brand-border bg-white p-6 shadow-sm` card.
   * This exists only to reproduce the retired
   * components/shared/alternating-feature-row.tsx's exact chrome for
   * layout="side" callers (the initiative "how it works" rows) — do not
   * remove it as unused.
   */
  chrome?: "card" | "bare";
  /**
   * When true, frames the media in a
   * `min-h-[18rem] overflow-hidden rounded-[32px] border border-brand-border
   * bg-brand-mist` box instead of routing it through ContentImage's own
   * rounding/aspect-ratio treatment. Defaults to false (current behaviour).
   * Like `chrome`, this exists solely to preserve the retired
   * AlternatingFeatureRow's treatment — do not remove it as unused.
   */
  mediaFrame?: boolean;
  tone?: "light" | "dark";
  href?: string;
  className?: string;
  /**
   * Overrides the aspect ratio the layout would otherwise pick — `wide` for
   * stacked, `landscape` for side. Needed by card families whose media is
   * icon-shaped artwork rather than photography.
   */
  aspectRatio?: "landscape" | "portrait" | "square" | "wide";
  /**
   * `cover` (default) crops to fill, which is right for photographs. `contain`
   * fits the whole image inside the box without cropping, which is right for
   * uploaded logos, SDG tiles and other icon artwork.
   */
  mediaFit?: "cover" | "contain";
};

function stackedSizes(columns: 1 | 2 | 3 | 4): string {
  switch (columns) {
    case 1:
      return "100vw";
    case 2:
      return "(min-width: 1024px) 50vw, 100vw";
    case 3:
      return "(min-width: 1024px) 33vw, 100vw";
    case 4:
    default:
      return "(min-width: 1024px) 25vw, 100vw";
  }
}

/**
 * A prose block paired with a photograph or video.
 *
 * Public pages pair every prose block with media, so this is the shared shape
 * the repeating card families use. When the CMS carries no image, one is
 * resolved deterministically from the themed pool.
 */
export function ProseMediaCard({
  variant = "panel",
  accentColor = "var(--color-accent)",
  cta,
  eyebrow,
  title,
  body,
  points,
  badge,
  aside,
  footnote,
  media,
  resolved,
  mediaKey,
  theme,
  layout = "stacked",
  columns = 4,
  sizes,
  mediaPosition = "start",
  chrome = "card",
  mediaFrame = false,
  tone = "light",
  href,
  className,
  aspectRatio,
  mediaFit = "cover",
}: ProseMediaCardProps) {
  const description = composeProse(body, points);

  if (!title.trim() && !description) return null;

  // The spotlight variant is a single fixed design (ported verbatim from the
  // retired SpotlightCard) with no layout, columns, mediaPosition or tone
  // behaviour of its own. If those props are supplied alongside
  // variant="spotlight" they are simply ignored here rather than throwing.
  const isSpotlight = variant === "spotlight";

  const isDark = !isSpotlight && tone === "dark";

  const authoredImage = media?.image?.trim();
  const authoredIconImage = media?.iconImage?.trim();
  const authoredAlt = media?.imageAlt?.trim();

  // Precedence: authored image > authored icon image > group-resolved pool
  // entry (from resolveMediaSet) > per-card pool fallback (resolveMedia).
  let image: string;
  let isAuthoredImage: boolean;
  if (authoredImage) {
    image = authoredImage;
    isAuthoredImage = true;
  } else if (authoredIconImage) {
    image = authoredIconImage;
    isAuthoredImage = true;
  } else if (resolved) {
    image = resolved.url;
    isAuthoredImage = false;
  } else {
    image = resolveMedia(mediaKey, theme).url;
    isAuthoredImage = false;
  }

  // A pool photograph — whether picked per-group via `resolved` or per-card
  // via resolveMedia — is chosen by hashing `mediaKey`, not by matching this
  // card's subject matter, so it has no semantic relationship to the text.
  // Describing it would imply it depicts what the text says, so it gets
  // empty alt instead. Only authored imagery (`media.image` or
  // `media.iconImage`) is eligible for a real description. The pool's own
  // `alt` strings stay in lib/content/media-pool.ts as metadata; they are
  // just not used here.
  const imageAlt = isAuthoredImage ? authoredAlt || title : "";

  const videoUrl = media?.videoUrl?.trim();

  const computedSizes =
    sizes ?? (layout === "side" ? "(min-width: 1024px) 50vw, 100vw" : stackedSizes(columns));

  // `mediaFrame`'s framed image is rendered via a plain next/image (like the
  // spotlight branch below) rather than ContentImage, because ContentImage
  // always imposes its own aspect-ratio box and rounded-media corners, which
  // would fight the retired AlternatingFeatureRow's min-h-[18rem]/rounded-32
  // frame this prop reproduces. safeImageSrc is applied explicitly here for
  // the same reason it is on the spotlight image below: bypassing
  // ContentImage forfeits its internal guard against a malformed CMS URL.
  const framedImageSrc = mediaFrame && !videoUrl ? safeImageSrc(image) : undefined;

  const visual = mediaFrame ? (
    <div className="relative min-h-[18rem] overflow-hidden rounded-[32px] border border-brand-border bg-brand-mist">
      {videoUrl ? (
        <VideoCard
          thumbnail={image}
          title={media?.videoTitle?.trim() || title}
          videoUrl={videoUrl}
          className="absolute inset-0 h-full w-full"
        />
      ) : framedImageSrc ? (
        <Image
          src={framedImageSrc}
          alt={imageAlt}
          fill
          sizes={computedSizes}
          className={mediaFit === "contain" ? "object-contain" : "object-cover"}
        />
      ) : null}
    </div>
  ) : videoUrl ? (
    <VideoCard thumbnail={image} title={media?.videoTitle?.trim() || title} videoUrl={videoUrl} />
  ) : (
    <ContentImage
      src={image}
      alt={imageAlt}
      aspectRatio={aspectRatio ?? (layout === "side" ? "landscape" : "wide")}
      sizes={computedSizes}
      fit={mediaFit}
    />
  );

  // The spotlight variant renders its image edge-to-edge via next/image
  // directly instead of through ContentImage, because ContentImage imposes
  // its own rounding and gradient placeholder that SpotlightCard never had.
  // ContentImage runs every src through safeImageSrc internally to guard
  // against a malformed CMS URL crashing the route — bypassing ContentImage
  // must not lose that protection, so the same guard is applied explicitly
  // here. SpotlightCard never supported video, so this variant has no
  // VideoCard treatment; videoUrl still only governs whether the outer href
  // wrap below is suppressed.
  const spotlightImageSrc = isSpotlight ? safeImageSrc(image) : undefined;

  // When a video is present, VideoCard renders its own <a> around the
  // thumbnail. Also wrapping the whole card in a next/link <a> (the `href`
  // branch below) would nest anchors — invalid HTML that causes a hydration
  // mismatch — so the outer link is skipped whenever videoUrl is set. Any
  // href supplied alongside a video is still honored, just as a "Read more"
  // link in the text block instead of an outer wrap. Do not reinstate the
  // outer wrap for this case.
  const readMore =
    videoUrl && href ? (
      <Link href={href} className="mt-4 inline-block text-sm font-semibold text-brand-gold hover:underline">
        Read more
      </Link>
    ) : null;

  const titleElement = title.trim() ? (
    <h3
      className={cn(
        "font-heading text-2xl font-bold",
        eyebrow ? "mt-4" : null,
        isDark ? "text-white" : "text-brand-ink",
      )}
    >
      {title}
    </h3>
  ) : null;

  // badge/aside/footnote are a panel-only extension for card families that
  // need a price, a feature line, or a closing note alongside their prose
  // (see the props' docs). The spotlight variant is a frozen port of the
  // retired SpotlightCard — its appearance must not change — so all three
  // are suppressed here rather than wired up, even if a caller supplies
  // them. Do not "complete" this by rendering them on spotlight.
  const showBadge = !isSpotlight && Boolean(badge);
  const showAside = !isSpotlight && Boolean(aside);
  const showFootnote = !isSpotlight && Boolean(footnote);

  const text = (
    <div>
      {eyebrow ? (
        isSpotlight ? (
          <span className="inline-flex rounded-full bg-brand-mist/70 px-3 py-1 text-xs font-semibold text-brand-navy">
            {eyebrow}
          </span>
        ) : (
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
            {eyebrow}
          </p>
        )
      ) : null}
      {showBadge && badge ? (
        // Title and badge share a row only when a badge is present — a card
        // with no badge keeps exactly the plain title markup below.
        <div className="flex flex-wrap items-start justify-between gap-4">
          {titleElement}
          <div className="rounded-[20px] bg-brand-navy px-4 py-3 text-white">
            {badge.label ? (
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-gold">
                {badge.label}
              </p>
            ) : null}
            <p className="mt-2 font-heading text-2xl font-bold">{badge.value}</p>
          </div>
        </div>
      ) : (
        titleElement
      )}
      {description ? (
        <p
          className={cn(
            "mt-3 text-sm leading-7",
            isDark ? "text-white/78" : "text-slate-600",
          )}
        >
          {description}
        </p>
      ) : null}
      {showAside && aside ? (
        <p
          className={cn(
            "mt-6 border-l-2 border-brand-gold pl-5 text-sm leading-7",
            // Dark tone equivalent of the light tone's text-slate-600 — this
            // is the same treatment the prose paragraph above uses on navy.
            isDark ? "text-white/78" : "text-slate-600",
          )}
        >
          {aside}
        </p>
      ) : null}
      {showFootnote && footnote ? (
        <p
          className={cn(
            "mt-5 text-sm leading-7",
            // Dark tone equivalent of the light tone's muted text-slate-500.
            // Dimmer than the aside/body treatment above (white/78) so the
            // footnote still reads as the most muted line on a navy card.
            isDark ? "text-white/60" : "text-slate-500",
          )}
        >
          {footnote}
        </p>
      ) : null}
      {readMore}
      {cta ? (
        <div className="mt-5">
          <Button href={cta.href} download={cta.download} variant={isSpotlight ? "pink" : "blue"} size="lg">
            {cta.label}
          </Button>
        </div>
      ) : null}
    </div>
  );

  // A linkable shell only makes sense when the card actually ends up wrapped
  // in the outer <Link> below. VideoCard renders its own <a> around the
  // thumbnail, and Button renders `cta.href` through next/link when given an
  // href, i.e. its own <a> too — wrapping either in the outer <Link> below
  // would nest anchors, which is invalid HTML and causes a hydration
  // mismatch. So the outer wrap, and the link-only hover/focus treatment
  // that comes with it, is skipped whenever videoUrl is set, or whenever cta
  // is set; a card-level `href` is deliberately ignored in that case. `cta`
  // now renders on both variants (see the render branches above), so this
  // guard is no longer variant-conditional.
  const isLinked = Boolean(href) && !videoUrl && !cta;

  if (isSpotlight) {
    const shell = cn(
      "overflow-hidden rounded-[18px] border border-brand-border bg-white shadow-sm",
      isLinked
        ? "transition hover:shadow-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
        : null,
      className,
    );

    const spotlightContent = (
      <>
        <div aria-hidden="true" style={{ background: accentColor, height: 6 }} />
        {spotlightImageSrc ? (
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={spotlightImageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={mediaFit === "contain" ? "object-contain" : "object-cover"}
            />
          </div>
        ) : null}
        <div className="p-6">{text}</div>
      </>
    );

    if (isLinked) {
      return (
        <Link href={href!} className={cn("block", shell)}>
          {spotlightContent}
        </Link>
      );
    }

    return <article className={shell}>{spotlightContent}</article>;
  }

  const flipMedia = layout === "side" && mediaPosition === "end";

  // `chrome="bare"` (never used by the spotlight variant, which has its own
  // fixed shell below) moves the card styling from the outer shell onto the
  // copy block, and — for layout="side" — restores the retired
  // AlternatingFeatureRow's 1.05fr/0.95fr column bias instead of an even
  // split. See the `chrome` prop doc for why this exists.
  const isBareChrome = chrome === "bare";

  const copyBlock = isBareChrome ? (
    <div className="rounded-[30px] border border-brand-border bg-white p-6 shadow-sm">{text}</div>
  ) : (
    text
  );

  const content =
    layout === "side" ? (
      <div
        className={cn(
          "grid gap-6 lg:items-center",
          isBareChrome ? "lg:grid-cols-[1.05fr_0.95fr]" : "lg:grid-cols-2",
        )}
      >
        <div className={flipMedia ? "lg:order-2" : undefined}>{visual}</div>
        <div className={flipMedia ? "lg:order-1" : undefined}>{copyBlock}</div>
      </div>
    ) : (
      <div className="space-y-5">
        {visual}
        {copyBlock}
      </div>
    );

  const shell = cn(
    isBareChrome ? null : cn("rounded-[30px] p-6 shadow-sm", isDark ? "bg-brand-navy" : "border border-brand-border bg-white"),
    isLinked
      ? "transition hover:shadow-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
      : null,
    className,
  );

  if (isLinked) {
    return (
      <Link href={href!} className={cn("block", shell)}>
        {content}
      </Link>
    );
  }

  return <div className={shell}>{content}</div>;
}
