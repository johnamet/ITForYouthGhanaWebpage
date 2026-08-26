/**
 * Joins discrete content points into a single prose run.
 *
 * Public pages render list-shaped CMS content as paragraphs rather than
 * bullets, so every string array in the content model passes through here.
 * Each point is trimmed, empties are dropped, and a full stop is appended to
 * any point that does not already end in terminal punctuation.
 */
export function pointsToParagraph(points?: string[]): string {
  if (!points || points.length === 0) return "";

  return points
    .map((point) => (point || "").trim())
    .filter(Boolean)
    .map((point) => (/[.!?]$/.test(point) ? point : `${point}.`))
    .join(" ");
}

/** Composes an authored body with its points into one paragraph of prose. */
export function composeProse(body?: string, points?: string[]): string {
  return [body, pointsToParagraph(points)].filter(Boolean).join(" ");
}
