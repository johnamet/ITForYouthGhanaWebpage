"use client";

import { createContext, useContext, type ReactNode } from "react";

import {
  LAPTOP_BANK_TOKENS,
  UNRESOLVED_TOKEN_SOURCE,
  type TokenName,
  type TokenValues,
} from "@/lib/content/laptop-bank-tokens";

/**
 * Render-time resolution of the {{TOKEN}} placeholders.
 *
 * WHY A CONTEXT RATHER THAN A LOOKUP AT MODULE SCOPE
 * Content modules like lib/content/laptop-bank-config.ts are evaluated once,
 * when the module first loads, so they cannot hold a value an editor may change
 * a minute later — a build-time substitution would mean every content change
 * needed a redeploy. Spec 5.1 BEHAVIOUR asks for a "single source in the CMS",
 * so the values are read once per request in the public layout and handed down
 * from there. Every string keeps its placeholder until it is rendered.
 *
 * Keeping the resolution inside `TokenText` is what let this change land
 * without touching the twenty-two places that render token-bearing copy.
 */

const TokenContext = createContext<TokenValues>({});

/**
 * Supplies the CMS token values to everything below it.
 *
 * Rendered by app/(public)/layout.tsx, so it sits above every public page.
 * Server Components between this provider and a `TokenText` are fine — the
 * context is read by the client component that needs it, not by the server
 * tree in between.
 */
export function TokenValuesProvider({
  values,
  children,
}: {
  values: TokenValues;
  children: ReactNode;
}) {
  return <TokenContext.Provider value={values}>{children}</TokenContext.Provider>;
}

/**
 * The supplied token values.
 *
 * For a Client Component that needs to branch on whether a value exists —
 * the giving mechanic disables a tier until both its figures are supplied.
 * To render copy, prefer `TokenText`.
 */
export function useTokenValues(): TokenValues {
  return useContext(TokenContext);
}

type TokenTextProps = {
  children: string;
  className?: string;
};

type Segment = string | { token: string };

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
 * Renders COPY that may contain `{{TOKEN}}` placeholders.
 *
 * A placeholder with a supplied value renders as ordinary prose. One without
 * renders as visible red text, which spec §1 requires so nobody reviewing
 * staging can mistake it for finished copy — and which is the signal that told
 * us these were reaching a deployed URL.
 *
 * Use this for any string composed with `token()`. A plain `{copy.body}` would
 * print `{{SLA_REPLY}}` in body text indistinguishable from real content.
 */
export function TokenText({ children, className }: TokenTextProps) {
  const values = useTokenValues();
  const segments = splitOnTokens(children);

  // No placeholder at all — the common case for copy that never had one.
  if (segments.length === 1 && typeof segments[0] === "string") {
    return className ? <span className={className}>{children}</span> : <>{children}</>;
  }

  return (
    <span className={className}>
      {segments.map((segment, index) => {
        if (typeof segment === "string") return <span key={index}>{segment}</span>;

        const supplied = values[segment.token as TokenName];
        if (supplied?.trim()) {
          return <span key={index}>{supplied}</span>;
        }

        return (
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
        );
      })}
    </span>
  );
}
