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

export function safeImageSrc(src?: string | null): string | undefined {
  const value = src?.trim();
  if (!value) return undefined;

  // next/image throws explicitly on a protocol-relative "//host/path" value,
  // so reject it before the rooted-path fast path below would otherwise wave
  // it through (it also starts with "/").
  if (value.startsWith("//")) {
    console.warn(
      `[safeImageSrc] rejected image src "${value}": protocol-relative URLs ("//...") are not supported by next/image`
    );
    return undefined;
  }

  // A rooted path is always fine.
  if (value.startsWith("/")) return value;

  // Anything else must parse as an absolute http(s) URL whose hostname is
  // configured in next.config.mjs's images.remotePatterns.
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      console.warn(
        `[safeImageSrc] rejected image src "${value}": protocol must be https, got "${url.protocol}"`
      );
      return undefined;
    }
    if (!ALLOWED_IMAGE_HOSTS.has(url.hostname)) {
      console.warn(
        `[safeImageSrc] rejected image src "${value}": hostname not configured in next.config.mjs remotePatterns`
      );
      return undefined;
    }
    return url.href;
  } catch {
    console.warn(`[safeImageSrc] rejected image src "${value}": failed to parse as a URL`);
    return undefined;
  }
}
