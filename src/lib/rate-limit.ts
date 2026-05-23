/**
 * Rate limiter with Cloudflare KV (shared across workers) and in-memory fallback.
 */

interface RateLimitKv {
  get<T = string>(
    key: string,
    type?: "json" | "text" | "arrayBuffer" | "stream"
  ): Promise<T | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number }
  ): Promise<void>;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  remaining: number;
}

const rateMap = new Map<string, RateLimitEntry>();

interface CloudflareEnv {
  RATE_LIMIT_KV?: RateLimitKv;
}

function getKvNamespace(): RateLimitKv | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getRequestContext } = require("@cloudflare/next-on-pages") as {
      getRequestContext: () => { env: CloudflareEnv };
    };
    return getRequestContext().env.RATE_LIMIT_KV ?? null;
  } catch {
    return null;
  }
}

function checkRateLimitMemory(
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

async function checkRateLimitKv(
  key: string,
  maxRequests: number,
  windowMs: number,
  kv: RateLimitKv
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowSeconds = Math.ceil(windowMs / 1000);
  const stored = await kv.get<{ count: number; resetAt: number }>(key, "json");

  if (!stored || now > stored.resetAt) {
    const resetAt = now + windowMs;
    await kv.put(key, JSON.stringify({ count: 1, resetAt }), {
      expirationTtl: windowSeconds,
    });
    return { allowed: true, retryAfterSeconds: 0, remaining: maxRequests - 1 };
  }

  if (stored.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((stored.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds, remaining: 0 };
  }

  const next = { count: stored.count + 1, resetAt: stored.resetAt };
  await kv.put(key, JSON.stringify(next), {
    expirationTtl: Math.max(1, Math.ceil((stored.resetAt - now) / 1000)),
  });

  return {
    allowed: true,
    retryAfterSeconds: 0,
    remaining: maxRequests - next.count,
  };
}

/** @deprecated Use checkRateLimitAsync for KV-backed limits in production. */
export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  return checkRateLimitMemory(key, maxRequests, windowMs);
}

export async function checkRateLimitAsync(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult> {
  const kv = getKvNamespace();
  if (kv) {
    try {
      return await checkRateLimitKv(key, maxRequests, windowMs, kv);
    } catch {
      // Fall back to in-memory if KV read/write fails
    }
  }
  return checkRateLimitMemory(key, maxRequests, windowMs);
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
