/**
 * Returns src only when next/image can actually render it, otherwise undefined.
 *
 * CMS-supplied image URLs are not validated on write, so a malformed value like
 * "https:/files/x.jpg" (single slash) reaches next/image, which throws on an
 * invalid src and takes the whole route down with a 500. A bad field should
 * degrade to a placeholder, never crash a page.
 */
export function safeImageSrc(src?: string | null): string | undefined {
  const value = src?.trim();
  if (!value) return undefined;

  // A rooted path is always fine.
  if (value.startsWith("/")) return value;

  // Anything else must parse as an absolute http(s) URL with a real host.
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    if (!url.hostname || !url.hostname.includes(".")) return undefined;
    return value;
  } catch {
    return undefined;
  }
}
