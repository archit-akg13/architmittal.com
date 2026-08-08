import type { NextRequest } from 'next/server'

/**
 * Per-IP sliding-window rate limiting for the public write endpoints.
 *
 * In-memory, deliberately:
 *  - pm2 runs this app with `instances: 1`, so a single process sees every
 *    request and there is no cross-process state to reconcile.
 *  - A file-backed counter would add a disk write to every request on exactly
 *    the endpoints we are protecting from disk exhaustion, and would need
 *    locking to survive concurrent submissions.
 *
 * Tradeoff: a restart (deploy, crash, max_memory_restart) clears the windows.
 * That is acceptable — the limit exists to stop sustained flooding, and a
 * restart is not something a caller can trigger on demand.
 *
 * If this app is ever scaled past one instance, or moved to serverless, this
 * becomes per-instance and needs replacing with a shared store.
 */

type Bucket = number[] // request timestamps, ascending

const buckets = new Map<string, Bucket>()

/**
 * Cap on distinct tracked IPs. Without this the Map itself is a memory
 * exhaustion vector — the thing we are defending against would just move.
 */
const MAX_TRACKED_IPS = 10_000

/**
 * Resolves the client IP.
 *
 * Order matters. nginx sets `X-Real-IP $remote_addr`, overwriting anything the
 * client sent, so it is trustworthy. It sets `X-Forwarded-For` with
 * `$proxy_add_x_forwarded_for`, which APPENDS the real peer to any client
 * supplied value — so in `1.2.3.4, <real>` the first entry is attacker
 * controlled and the last is real. Reading `xff.split(',')[0]`, the usual
 * idiom, would let anyone bypass this limit by rotating a spoofed header.
 */
export function clientIp(request: NextRequest): string {
  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp

  const xff = request.headers.get('x-forwarded-for')
  if (xff) {
    const parts = xff.split(',').map((p) => p.trim()).filter(Boolean)
    if (parts.length) return parts[parts.length - 1] // last hop, not first
  }

  return 'unknown'
}

/** Drops timestamps outside the window, and the bucket itself once empty. */
function prune(key: string, windowMs: number, now: number): Bucket {
  const cutoff = now - windowMs
  const kept = (buckets.get(key) ?? []).filter((t) => t > cutoff)

  if (kept.length === 0) {
    buckets.delete(key)
    return []
  }

  buckets.set(key, kept)
  return kept
}

/**
 * Evicts the least recently active buckets when the map grows too large.
 *
 * Uses forEach and Array.from rather than for..of over the Map, because the
 * project's tsconfig has no explicit `target` and defaults below es2015, where
 * direct Map iteration needs --downlevelIteration.
 */
function evictIfNeeded(windowMs: number, now: number) {
  if (buckets.size <= MAX_TRACKED_IPS) return

  const keys: string[] = []
  buckets.forEach((_value, key) => keys.push(key))
  keys.forEach((key) => prune(key, windowMs, now))

  if (buckets.size <= MAX_TRACKED_IPS) return

  // Still over after pruning: drop least-recently-active buckets.
  const byLastSeen: Array<{ key: string; lastSeen: number }> = []
  buckets.forEach((value, key) => {
    byLastSeen.push({ key, lastSeen: value[value.length - 1] ?? 0 })
  })
  byLastSeen.sort((a, b) => a.lastSeen - b.lastSeen)

  byLastSeen.forEach(({ key }) => {
    if (buckets.size > MAX_TRACKED_IPS) buckets.delete(key)
  })
}

export type RateLimitResult = {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
}

/**
 * Records an attempt and reports whether it is allowed.
 *
 * @param key     Caller identity, namespaced per endpoint.
 * @param limit   Requests permitted per window.
 * @param windowMs Window length in milliseconds.
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const hits = prune(key, windowMs, now)

  if (hits.length >= limit) {
    const oldest = hits[0]
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
    }
  }

  hits.push(now)
  buckets.set(key, hits)
  evictIfNeeded(windowMs, now)

  return { allowed: true, remaining: limit - hits.length, retryAfterSeconds: 0 }
}

/** Test seam. Not used in request handling. */
export function __resetRateLimits() {
  buckets.clear()
}
