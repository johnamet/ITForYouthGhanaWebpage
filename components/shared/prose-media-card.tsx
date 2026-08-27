import Link from "next/link";

import { ContentImage } from "@/components/media/content-image";
import { VideoCard } from "@/components/media/video-card";
import { resolveMedia, type MediaTheme, type PoolEntry } from "@/lib/content/media-pool";
import { composeProse } from "@/lib/utils/prose";
import { cn } from "@/lib/utils/cn";

export type ProseMediaCardProps = {
  eyebrow?: string;
  title: string;
  body?: string;
  /** Rendered as prose, never as a list. */
  points?: string[];
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
  tone?: "light" | "dark";
  href?: string;
  className?: string;
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
  eyebrow,
  title,
  body,
  points,
  media,
  resolved,
  mediaKey,
  theme,
  layout = "stacked",
  columns = 4,
  sizes,
  mediaPosition = "start",
  tone = "light",
  href,
  className,
}: ProseMediaCardProps) {
  const description = composeProse(body, points);

  if (!title.trim() && !description) return null;

  const isDark = tone === "dark";

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

  const visual = videoUrl ? (
    <VideoCard thumbnail={image} title={media?.videoTitle?.trim() || title} videoUrl={videoUrl} />
  ) : (
    <ContentImage
      src={image}
      alt={imageAlt}
      aspectRatio={layout === "side" ? "landscape" : "wide"}
      sizes={computedSizes}
    />
  );

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

  const text = (
    <div>
      {eyebrow ? (
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.28em] text-brand-gold">
          {eyebrow}
        </p>
      ) : null}
      {title.trim() ? (
        <h3
          className={cn(
            "font-heading text-2xl font-bold",
            eyebrow ? "mt-4" : null,
            isDark ? "text-white" : "text-brand-ink",
          )}
        >
          {title}
        </h3>
      ) : null}
      {description ? (
        <p className={cn("mt-3 text-sm leading-7", isDark ? "text-white/78" : "text-slate-600")}>
          {description}
        </p>
      ) : null}
      {readMore}
    </div>
  );

  const flipMedia = layout === "side" && mediaPosition === "end";

  const content =
    layout === "side" ? (
      <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
        <div className={flipMedia ? "lg:order-2" : undefined}>{visual}</div>
        <div className={flipMedia ? "lg:order-1" : undefined}>{text}</div>
      </div>
    ) : (
      <div className="space-y-5">
        {visual}
        {text}
      </div>
    );

  // A linkable shell only makes sense when the card actually ends up wrapped
  // in the outer <Link> below; the video branch never gets that wrap (see
  // above), so it shouldn't get the link-only hover/focus treatment either.
  const isLinked = Boolean(href) && !videoUrl;

  const shell = cn(
    "rounded-[30px] p-6 shadow-sm",
    isDark ? "bg-brand-navy" : "border border-brand-border bg-white",
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
