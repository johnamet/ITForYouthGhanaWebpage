/**
 * Returns src only when next/image can actually render it, otherwise undefined.
 *
 * CMS-supplied image URLs are not validated on write, so a bad value can reach
 * next/image and take the whole route down with a 500. It was once believed
 * that a malformed URL like "https:/files/x.jpg" (single slash) fails to
 * parse — it does not: `new URL(...)` parses it successfully and normalises
 * the host to "files". The real failure next/image throws is
 * `hostname "files" is not configured under images in next.config.js` (or,
 * for a protocol-relative "//host/path" value, an explicit rejection of the
 * "//" form). So the only reliable guard is an allowlist of the hostnames
 * actually configured in next.config.mjs's `images.remotePatterns`.
 *
 * IMPORTANT: this allowlist MUST be kept in sync with next.config.mjs's
 * `images.remotePatterns`. If you add or remove a remote pattern there,
 * update ALLOWED_IMAGE_HOSTS here too, or valid images will start being
 * rejected (or invalid ones will start slipping through to a 500 again).
 *
 * Only "https:" is accepted below because every entry in next.config.mjs's
 * `images.remotePatterns` specifies `protocol: "https"` — none configures
 * "http". If an "http" pattern is ever added there, this protocol check
 * must be revisited to allow it too.
 */
const ALLOWED_IMAGE_HOSTS = new Set([
  "files.itforyouthghana.org",
  "images.unsplash.com",
  "firebasestorage.googleapis.com",
  "storage.googleapis.com",
  "images.pexels.com",
  "tse2.mm.bing.net",
  "imarticus.org",
  "img.freepik.com",
  "photos.fife.usercontent.google.com",
]);

/**
 * Resolves a CMS image to a usable src, falling back when the stored value is
 * blank or rejected as an invalid image URL.
 *
 * This is purposely more forgiving than a raw `value ?? fallback` because CMS
 * content can be empty, whitespace-only, or malformed. For page heroes and
 * card imagery we want a usable asset instead of an empty no-image state when a
 * fallback exists.
 */
export function safeImageSrcOrFallback(
  value: string | null | undefined,
  fallback: string,
): string | null | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return fallback;
  return safeImageSrc(trimmed) ?? fallback;
}

/**
 * Course cards always render an `<Image>` unconditionally (no empty-state
 * gate like `EditorialImageHero`/`ContentImage`), so unlike
 * `safeImageSrcOrFallback` this substitutes the fallback for an absent value
 * too, not just a rejected one — there is no "let the caller's gate handle
 * it" option here. Shared by `CourseDetailCard` and `TrainingCourseCatalog`,
 * which were previously carrying byte-identical copies of this one-liner.
 */
export function resolveCourseImage(image: string | null | undefined): string {
  return safeImageSrc(image) ?? "/images/fallback/placeholder.svg";
}

export type ImageSrcRejection = { value: string; reason: string };

// Opt-in rejection sink. Off by default and untouched by normal rendering —
// `rejectionCollectionEnabled` only ever flips true when a caller (currently
// only scripts/verify-media-pages.ts) explicitly asks for it, so this array
// stays empty and this module stays otherwise unaffected in every request
// path. console.warn (below) remains the always-on signal; this sink exists
// only to let that same information be gathered and reported by a script
// instead of read one browser console at a time.
let rejectionCollectionEnabled = false;
const collectedRejections: ImageSrcRejection[] = [];

/** Turns on rejection collection. Call once, before rendering, from a script. */
export function enableImageSrcRejectionCollection(): void {
  rejectionCollectionEnabled = true;
}

/** Returns every rejection collected so far (a copy — callers cannot mutate the sink). */
export function getCollectedImageSrcRejections(): ImageSrcRejection[] {
  return [...collectedRejections];
}

/** Empties the sink without disabling collection. */
export function clearCollectedImageSrcRejections(): void {
  collectedRejections.length = 0;
}

function rejectImageSrc(value: string, reason: string): undefined {
  console.warn(`[safeImageSrc] rejected image src "${value}": ${reason}`);
  if (rejectionCollectionEnabled) {
    collectedRejections.push({ value, reason });
  }
  return undefined;
}

export function safeImageSrc(src?: string | null): string | undefined {
  const value = src?.trim();
  if (!value) return undefined;

  // next/image throws explicitly on a protocol-relative "//host/path" value,
  // so reject it before the rooted-path fast path below would otherwise wave
  // it through (it also starts with "/").
  if (value.startsWith("//")) {
    return rejectImageSrc(value, `protocol-relative URLs ("//...") are not supported by next/image`);
  }

  // A rooted path is always fine.
  if (value.startsWith("/")) return value;

  // Anything else must parse as an absolute http(s) URL whose hostname is
  // configured in next.config.mjs's images.remotePatterns.
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      return rejectImageSrc(value, `protocol must be https, got "${url.protocol}"`);
    }
    if (!ALLOWED_IMAGE_HOSTS.has(url.hostname)) {
      return rejectImageSrc(value, `hostname not configured in next.config.mjs remotePatterns`);
    }
    return url.href;
  } catch {
    return rejectImageSrc(value, `failed to parse as a URL`);
  }
}
