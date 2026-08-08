/**
 * Tests for the rate limiter and IP resolution.
 *
 * Run: node --test lib/rate-limit.test.mjs
 *
 * The .ts module is imported directly — Node 25 strips types natively, and the
 * only TypeScript in the file is a type-only import, so no build step or extra
 * toolchain is needed to exercise it.
 */
import { test } from 'node:test'
import assert from 'node:assert'
import { clientIp, rateLimit, __resetRateLimits } from './rate-limit.ts'

const headers = (obj) => ({ headers: { get: (k) => obj[k.toLowerCase()] ?? null } })

test('rateLimit allows up to the limit then refuses', () => {
  __resetRateLimits()
  const window = 60_000
  for (let i = 0; i < 5; i++) {
    const r = rateLimit('k', 5, window)
    assert.strictEqual(r.allowed, true, `request ${i + 1} should pass`)
  }
  const sixth = rateLimit('k', 5, window)
  assert.strictEqual(sixth.allowed, false)
  assert.ok(sixth.retryAfterSeconds > 0, 'sets Retry-After')
})

test('separate keys have independent budgets', () => {
  __resetRateLimits()
  for (let i = 0; i < 5; i++) rateLimit('a', 5, 60_000)
  assert.strictEqual(rateLimit('a', 5, 60_000).allowed, false)
  assert.strictEqual(rateLimit('b', 5, 60_000).allowed, true)
})

test('endpoint namespacing keeps contact and subscribe separate', () => {
  __resetRateLimits()
  for (let i = 0; i < 5; i++) rateLimit('contact:1.2.3.4', 5, 60_000)
  assert.strictEqual(rateLimit('contact:1.2.3.4', 5, 60_000).allowed, false)
  assert.strictEqual(rateLimit('subscribe:1.2.3.4', 5, 60_000).allowed, true)
})

test('window expiry frees the budget again', () => {
  __resetRateLimits()
  for (let i = 0; i < 5; i++) rateLimit('k', 5, 1) // 1ms window
  const before = Date.now()
  while (Date.now() - before < 5) {
    /* spin briefly past the window */
  }
  assert.strictEqual(rateLimit('k', 5, 1).allowed, true)
})

test('clientIp prefers X-Real-IP, which nginx overwrites', () => {
  assert.strictEqual(clientIp(headers({ 'x-real-ip': '9.9.9.9' })), '9.9.9.9')
})

test('BYPASS GUARD: a spoofed X-Forwarded-For prefix does not win', () => {
  // nginx appends the real peer, so the client-supplied value is the FIRST
  // entry. Taking [0] — the common idiom — would let anyone rotate a fake IP
  // and never hit the limit.
  const req = headers({ 'x-forwarded-for': '1.1.1.1, 203.0.113.7' })
  assert.strictEqual(clientIp(req), '203.0.113.7')
})

test('BYPASS GUARD: spoofed XFF cannot override a real X-Real-IP', () => {
  const req = headers({ 'x-forwarded-for': '1.1.1.1', 'x-real-ip': '203.0.113.7' })
  assert.strictEqual(clientIp(req), '203.0.113.7')
})

test('rotating a spoofed XFF prefix still hits one shared bucket', () => {
  __resetRateLimits()
  let refused = 0
  for (let i = 0; i < 20; i++) {
    const req = headers({ 'x-forwarded-for': `10.0.0.${i}, 203.0.113.7` })
    const r = rateLimit(`contact:${clientIp(req)}`, 5, 60_000)
    if (!r.allowed) refused++
  }
  assert.strictEqual(refused, 15, 'all but the first 5 are refused')
})

test('missing headers degrade to a single "unknown" bucket, not a bypass', () => {
  assert.strictEqual(clientIp(headers({})), 'unknown')
})

test('empty X-Forwarded-For falls through to unknown', () => {
  assert.strictEqual(clientIp(headers({ 'x-forwarded-for': ' , ' })), 'unknown')
})
