// In-memory sliding-window rate limiter. Per-process — fine for a single PM2
// worker, but resets on restart and won't share state across instances.
// For our scale that's acceptable.

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

// Cleanup expired entries periodically to prevent unbounded growth.
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  cleanup();
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    const newBucket = { count: 1, resetAt: now + windowMs };
    buckets.set(key, newBucket);
    return { allowed: true, remaining: limit - 1, resetAt: newBucket.resetAt };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count++;
  return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

// Best-effort client IP extraction. Trusts X-Forwarded-For only the *first* hop
// since we sit behind nginx + Cloudflare. Cloudflare appends to XFF, so the
// leftmost value is the real client (Cloudflare guarantees this).
export function getClientIp(request: Request): string {
  const cf = request.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
