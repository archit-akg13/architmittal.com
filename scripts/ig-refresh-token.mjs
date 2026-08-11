#!/usr/bin/env node
/**
 * Refresh the long-lived Instagram access token and rewrite meta.env atomically.
 *
 * Run monthly (the token lasts 60 days, so monthly gives two chances to recover
 * before anything breaks):
 *   0 9 1 * *  cd ~/claude_projects/architmittal_website && node scripts/ig-refresh-token.mjs
 *
 * Usage:
 *   node scripts/ig-refresh-token.mjs              refresh and rewrite meta.env
 *   node scripts/ig-refresh-token.mjs --check-only report expiry, change nothing
 *   node scripts/ig-refresh-token.mjs --json       machine-readable output
 *
 * Exit codes:
 *   0  refreshed, and the token has more than 14 days of life
 *   1  ANY problem: refresh failed, or the token expires within 14 days
 *
 * This script is deliberately loud. Silent token expiry is how the whole pipeline
 * dies quietly, and silent failure is the recurring theme of this project — the
 * site once wrote leads to a directory the bot never read from for months while
 * the alerts fired normally the entire time. A non-zero exit here is the signal.
 */
import {
  META_ENV,
  REFRESH_HOST,
  loadAccessToken,
  metaDie,
  metaLog,
  readMetaEnv,
  redactMeta,
  registerMetaSecret,
  writeMetaEnv,
} from './_meta.mjs'
import { parseArgs } from './_common.mjs'

const WARN_DAYS = 14
const DAY_MS = 86400000

const args = parseArgs(process.argv.slice(2))
const checkOnly = Boolean(args['check-only'])
const asJson = Boolean(args.json)

function fmt(date) {
  return date.toISOString().slice(0, 10)
}

function daysUntil(date) {
  return Math.floor((date.getTime() - Date.now()) / DAY_MS)
}

async function main() {
  const token = loadAccessToken()
  const { env } = readMetaEnv()

  const storedExpiry = env.IG_TOKEN_EXPIRES_AT ? new Date(env.IG_TOKEN_EXPIRES_AT) : null
  if (storedExpiry && !Number.isNaN(storedExpiry.getTime())) {
    metaLog(`Stored expiry: ${fmt(storedExpiry)} (${daysUntil(storedExpiry)} days away)`)
  } else {
    metaLog(`Stored expiry: unknown (IG_TOKEN_EXPIRES_AT not recorded yet)`)
  }

  if (checkOnly) {
    if (!storedExpiry || Number.isNaN(storedExpiry.getTime())) {
      metaDie(
        `Cannot verify token lifetime: IG_TOKEN_EXPIRES_AT is not set in ${META_ENV}.\n` +
          `Run without --check-only once to record it.`
      )
    }
    const left = daysUntil(storedExpiry)
    if (asJson) console.log(JSON.stringify({ ok: left > WARN_DAYS, expiresAt: fmt(storedExpiry), daysLeft: left }))
    if (left <= WARN_DAYS) {
      metaDie(
        `TOKEN EXPIRES ${fmt(storedExpiry)} — only ${left} day(s) left.\n` +
          `Publishing will start failing on that date. Run:\n` +
          `  node scripts/ig-refresh-token.mjs`
      )
    }
    metaLog(`OK — ${left} days of token life remaining.`)
    return
  }

  // refresh_access_token lives at the host root, not under the versioned API path.
  const url = new URL(`${REFRESH_HOST}/refresh_access_token`)
  url.searchParams.set('grant_type', 'ig_refresh_token')
  url.searchParams.set('access_token', token)

  metaLog('Refreshing token via graph.instagram.com/refresh_access_token ...')

  let body
  try {
    const res = await fetch(url, { method: 'GET' })
    body = await res.json().catch(() => ({}))
    if (!res.ok || body.error) {
      const e = body.error ?? {}
      throw new Error(`code=${e.code ?? res.status} ${e.message ?? `HTTP ${res.status}`}`)
    }
  } catch (err) {
    const detail = redactMeta(err.message)
    const suffix =
      storedExpiry && !Number.isNaN(storedExpiry.getTime())
        ? `\nThe current token expires ${fmt(storedExpiry)} (${daysUntil(storedExpiry)} days).`
        : `\nThe current token's expiry is unknown — treat this as urgent.`
    metaDie(
      `TOKEN REFRESH FAILED: ${detail}${suffix}\n` +
        `A token must be at least 24 hours old and still valid to refresh.\n` +
        `If it has already expired, re-authorise the app to mint a new long-lived token.`
    )
  }

  const newToken = body.access_token
  const expiresIn = Number(body.expires_in ?? 0)
  if (!newToken || !expiresIn) {
    metaDie(`Refresh returned an unusable response (no access_token / expires_in).`)
  }
  registerMetaSecret(newToken)

  const expiresAt = new Date(Date.now() + expiresIn * 1000)
  writeMetaEnv({
    IG_ACCESS_TOKEN: newToken,
    IG_TOKEN_EXPIRES_AT: expiresAt.toISOString(),
    IG_TOKEN_REFRESHED_AT: new Date().toISOString(),
  })

  const left = daysUntil(expiresAt)
  metaLog(`Token rewritten to ${META_ENV} (mode 600). New expiry: ${fmt(expiresAt)} (${left} days).`)

  if (asJson) console.log(JSON.stringify({ ok: left > WARN_DAYS, expiresAt: fmt(expiresAt), daysLeft: left }))

  if (left <= WARN_DAYS) {
    metaDie(
      `Refresh succeeded but the token still expires ${fmt(expiresAt)} — only ${left} day(s) away.\n` +
        `That is abnormal; a healthy refresh returns ~60 days. Investigate the app's status.`
    )
  }

  metaLog('OK.')
}

main().catch((err) => metaDie(err?.stack || err?.message || String(err)))
