import { ImageResponse } from "next/og";

/**
 * The shared Open Graph share card for the two new sections.
 *
 * Draft 1 §14.4: "Give both new sections their own Open Graph images. The Her
 * First Laptop share image is the one that will circulate on WhatsApp, which
 * will be your largest referral channel." Without one, a shared link falls
 * back to whatever the platform scrapes, which for these pages is nothing.
 *
 * The card is typographic rather than photographic, and that is a decision
 * rather than a shortcut: Draft 1 §8 rules out stock imagery of anonymous
 * African students, consented recipient portraits are still owed (§15), and a
 * share image is the most-copied asset on a page — the worst possible place to
 * put a placeholder photograph. Generated at build time, so it needs no asset
 * and cannot drift from the page's own wording.
 *
 * Text is kept well inside the frame because WhatsApp and several other clients
 * crop a 1200×630 card towards square.
 */

/** 1200×630 is the size every major platform expects. */
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const NAVY = "#142850";
const ACCENT = "#D70B52";
const MIST = "#E8F1FA";

export function renderOgCard({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: NAVY,
          padding: "96px 110px",
          // A gold rule down the left edge, echoing the editorial hero panel
          // the public pages use.
          borderLeft: `20px solid ${ACCENT}`,
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: ACCENT,
            fontWeight: 700,
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 82,
            lineHeight: 1.05,
            color: "white",
            fontWeight: 700,
            // Keeps a long title from reaching the crop edge.
            maxWidth: 900,
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 34,
            lineHeight: 1.4,
            color: MIST,
            maxWidth: 880,
          }}
        >
          {subtitle}
        </div>
        <div style={{ marginTop: 48, fontSize: 26, color: "rgba(255,255,255,0.66)" }}>
          itforyouthghana.org
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
