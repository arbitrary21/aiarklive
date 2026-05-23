/**
 * Best-effort in-memory rate limiter.
 * Works per edge worker instance; not shared across instances.
 * For strict multi-instance enforcement, use Cloudflare KV or Durable Objects.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateMap = new Map<string, RateLimitEntry>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = rateMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds, remaining: 0 };
  }

  entry.count++;
  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: maxRequests - entry.count,
  };
}

export function rateLimitResponse(retryAfterSeconds: number): Response {
  return Response.json(
    {
      error: `Rate limit exceeded. Try again in ${retryAfterSeconds} seconds.`,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "X-RateLimit-Limit": "true",
      },
    }
  );
}
