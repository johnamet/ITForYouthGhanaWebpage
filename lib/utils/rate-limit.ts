/**
 * Server-side rate limiting for the two public Laptop Bank forms.
 *
 * Spec §6.1 BEHAVIOUR: "Anti-spam: hidden honeypot field plus server-side rate
 * limiting. No image captcha." The no-captcha rule is not incidental — Draft 1
 * §14.2 requires bot protection "that does not block low-bandwidth users", and
 * an image captcha is exactly the thing that fails an applicant on a mid-range
 * Android phone over mobile data.
 *
 * WHAT THIS IS: a fixed-window counter held in the Node process's memory.
 *
 * WHAT THIS IS NOT: durable or shared. It resets on every redeploy and every
 * cold start, and a deployment running multiple instances gets one independent
 * window per instance, so the effective limit is the stated limit times the
 * instance count. It raises the cost of casual scripted abuse and nothing more.
 * If submission volume ever makes that insufficient, the replacement is a
 * shared store (Firestore with a TTL, or Redis) behind this same function
 * signature — not a captcha.
 */

type Window = {
  count: number;
  resetAt: number;
};

const windows = new Map<string, Window>();

/** Bound the map so a flood of distinct keys cannot grow it without limit. */
const MAX_TRACKED_KEYS = 10_000;

export const DEFAULT_LIMIT = 5;
export const DEFAULT_WINDOW_MS = 10 * 60 * 1000;

export type RateLimitResult = {
  allowed: boolean;
  /** Seconds until the window resets. 0 when allowed. */
  retryAfterSeconds: number;
};

export function checkRateLimit(
  key: string,
  limit: number = DEFAULT_LIMIT,
  windowMs: number = DEFAULT_WINDOW_MS,
): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    if (windows.size >= MAX_TRACKED_KEYS) {
      // Drop everything already expired before admitting a new key. Cheap,
      // and enough: the map only grows when traffic is genuinely spread
      // across many keys, which is the case this bound exists for.
      for (const [trackedKey, window] of windows) {
        if (window.resetAt <= now) windows.delete(trackedKey);
      }
    }
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Best-effort caller identity for the limiter key.
 *
 * Behind a proxy the socket address is the proxy's, so the forwarded headers
 * are the only signal available. They are client-controllable, which is
 * another reason this limiter is a speed bump rather than a security control.
 */
export function rateLimitKeyFromRequest(request: Request, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return `${scope}:${ip}`;
}
