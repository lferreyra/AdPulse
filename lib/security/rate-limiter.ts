// ============================================================
// lib/security/rate-limiter.ts
// In-memory rate limiter for serverless functions.
// Note: In a real distributed environment with heavy traffic,
// consider using Redis (e.g. Upstash) for rate limiting.
// For this MVP, an in-memory map suffices for a single region/instance.
// ============================================================

const rateLimits = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 10, windowMs: 60000 },
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimits.get(identifier);

  if (!record || record.resetAt < now) {
    // New or expired record
    const resetAt = now + options.windowMs;
    rateLimits.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: options.limit - 1, resetAt };
  }

  if (record.count >= options.limit) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  // Increment counter
  record.count++;
  return { allowed: true, remaining: options.limit - record.count, resetAt: record.resetAt };
}

/**
 * Cleanup expired rate limit records to prevent memory leaks.
 * This can be called periodically or randomly.
 */
export function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, record] of rateLimits.entries()) {
    if (record.resetAt < now) {
      rateLimits.delete(key);
    }
  }
}
