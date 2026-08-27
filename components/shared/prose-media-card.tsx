import Link from "next/link";

import { ContentImage } from "@/components/media/content-image";
import { VideoCard } from "@/components/media/video-card";
import { resolveMedia, type MediaTheme } from "@/lib/content/media-pool";
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
    imageAlt?: string;
    videoUrl?: string;
    videoTitle?: string;
  };
  /** Stable content key for the resolver — never a bare array index. */
  mediaKey: string;
  theme: MediaTheme;
  /** Media above the prose, or beside it from lg up. */
  layout?: "stacked" | "side";
  tone?: "light" | "dark";
  href?: string;
  className?: string;
};

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
  mediaKey,
  theme,
  layout = "stacked",
  tone = "light",
  href,
  className,
}: ProseMediaCardProps) {
  const description = composeProse(body, points);

  if (!title.trim() && !description) return null;

  const isDark = tone === "dark";
  const fallback = resolveMedia(mediaKey, theme);
  const image = media?.image?.trim() || fallback.url;
  const imageAlt = media?.imageAlt?.trim() || fallback.alt;
  const videoUrl = media?.videoUrl?.trim();

  const visual = videoUrl ? (
    <VideoCard thumbnail={image} title={media?.videoTitle?.trim() || title} videoUrl={videoUrl} />
  ) : (
    <ContentImage
      src={image}
      alt={imageAlt}
      aspectRatio={layout === "side" ? "landscape" : "wide"}
      sizes={layout === "side" ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 100vw"}
    />
  );

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
    </div>
  );

  const content =
    layout === "side" ? (
      <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
        {visual}
        {text}
      </div>
    ) : (
      <div className="space-y-5">
        {visual}
        {text}
      </div>
    );

  const shell = cn(
    "rounded-[30px] p-6 shadow-sm",
    isDark ? "bg-brand-navy" : "border border-brand-border bg-white",
    href
      ? "transition hover:shadow-editorial focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
      : null,
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cn("block", shell)}>
        {content}
      </Link>
    );
  }

  return <div className={shell}>{content}</div>;
}
