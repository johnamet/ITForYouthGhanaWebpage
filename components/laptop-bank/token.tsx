import {
  LAPTOP_BANK_TOKENS,
  UNRESOLVED_TOKEN_SOURCE,
  type TokenName,
} from "@/lib/content/laptop-bank-tokens";

type TokenTextProps = {
  children: string;
  className?: string;
};

type Segment = string | { token: string };

/** Splits a COPY string into plain runs and unresolved-token runs. */
function splitOnTokens(value: string): Segment[] {
  // A fresh RegExp per call: /g regexps carry lastIndex, so a shared instance
  // would skip matches on alternating calls.
  const pattern = new RegExp(UNRESOLVED_TOKEN_SOURCE, "g");
  const segments: Segment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value)) !== null) {
    if (match.index > lastIndex) segments.push(value.slice(lastIndex, match.index));
    segments.push({ token: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < value.length) segments.push(value.slice(lastIndex));

  return segments;
}

/**
 * Renders COPY that may still contain `{{TOKEN}}` placeholders.
 *
 * Spec §1: an unsupplied token renders as visible red text, so nobody
 * reviewing staging can mistake it for finished copy. Once the token's `value`
 * is set in lib/content/laptop-bank-tokens.ts the placeholder never reaches
 * this component and the string renders as ordinary prose.
 *
 * Use this for any string composed with `token()`. A plain `{copy.body}` would
 * render `{{SLA_REPLY}}` in body text indistinguishable from real content,
 * which is the exact failure spec §1 is guarding against.
 */
export function TokenText({ children, className }: TokenTextProps) {
  const segments = splitOnTokens(children);

  // No token present — the common case once content lands. Render the string
  // directly so the DOM carries no extra wrapper.
  if (segments.length === 1 && typeof segments[0] === "string") {
    return className ? <span className={className}>{children}</span> : <>{children}</>;
  }

  return (
    <span className={className}>
      {segments.map((segment, index) =>
        typeof segment === "string" ? (
          <span key={index}>{segment}</span>
        ) : (
          <span
            key={index}
            className="font-bold text-red-600"
            title={
              LAPTOP_BANK_TOKENS[segment.token as TokenName]?.needed ??
              "Awaiting content from IT for Youth"
            }
          >
            {`{{${segment.token}}}`}
          </span>
        ),
      )}
    </span>
  );
}

/** True when the string still carries an unresolved token. */
export function hasUnresolvedToken(value: string): boolean {
  return new RegExp(UNRESOLVED_TOKEN_SOURCE).test(value);
}
