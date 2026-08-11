/**
 * Shared Instagram Graph API helpers.
 *
 * Credential rule: IG_ACCESS_TOKEN is read from ~/.config/automation/meta.env and
 * must never reach stdout, stderr, a log file, or a commit. Everything printed
 * from here goes through redactMeta() first.
 *
 * Host note: this uses graph.instagram.com, NOT graph.facebook.com. The account is
 * on the "Instagram API with Instagram Login" path, where /me resolves to the
 * app-scoped ID. graph.facebook.com expects the IG Business ID instead, and mixing
 * the two produces "object does not exist" errors that read like permission bugs.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

export const API = 'https://graph.instagram.com/v21.0'
export const REFRESH_HOST = 'https://graph.instagram.com'
export const META_ENV = path.join(os.homedir(), '.config', 'automation', 'meta.env')

const SECRETS = new Set()

export function registerMetaSecret(value) {
  if (value && value.length > 8) SECRETS.add(value)
}

export function redactMeta(input) {
  let out = String(input ?? '')
  for (const s of SECRETS) out = out.split(s).join('***REDACTED***')
  // Belt and braces: IG long-lived tokens are long base64ish blobs, often IG-prefixed.
  out = out.replace(/\bIG[A-Za-z0-9]{20,}\b/g, 'IG***REDACTED***')
  out = out.replace(/([?&]access_token=)[^&\s"']+/gi, '$1***REDACTED***')
  return out
}

export function metaLog(...args) {
  console.log(args.map(redactMeta).join(' '))
}

export function metaDie(message) {
  console.error(`\nERROR: ${redactMeta(message)}\n`)
  process.exit(1)
}

/** Parses meta.env into an ordered list of lines plus a key map, so rewrites preserve comments. */
export function readMetaEnv() {
  if (!fs.existsSync(META_ENV)) {
    metaDie(
      `Missing ${META_ENV}\n` +
        `Expected IG_ACCESS_TOKEN (long-lived Instagram Login token).\n` +
        `  mkdir -p ~/.config/automation && chmod 700 ~/.config/automation\n` +
        `  printf 'IG_ACCESS_TOKEN=YOUR_TOKEN\\n' > ${META_ENV}\n` +
        `  chmod 600 ${META_ENV}`
    )
  }

  const mode = fs.statSync(META_ENV).mode & 0o777
  if (mode & 0o077) {
    metaDie(`${META_ENV} is mode ${mode.toString(8)}; it must be 600. Run: chmod 600 ${META_ENV}`)
  }

  const raw = fs.readFileSync(META_ENV, 'utf8')
  const env = {}
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
    const [key, ...rest] = trimmed.split('=')
    env[key.trim()] = rest.join('=').trim()
  }
  return { raw, env }
}

export function loadAccessToken() {
  const { env } = readMetaEnv()
  const token = env.IG_ACCESS_TOKEN
  if (!token) metaDie(`IG_ACCESS_TOKEN is not set in ${META_ENV}`)
  registerMetaSecret(token)
  return token
}

/**
 * Rewrites meta.env atomically: write a 600 temp file in the same directory, then
 * rename over the original. A crash mid-write leaves the old file intact rather
 * than a truncated one, which would lock us out of the account entirely.
 */
export function writeMetaEnv(updates) {
  const { raw } = readMetaEnv()
  const keys = new Set(Object.keys(updates))
  const seen = new Set()

  const lines = raw.split('\n').map((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) return line
    const key = trimmed.split('=')[0].trim()
    if (!keys.has(key)) return line
    seen.add(key)
    return `${key}=${updates[key]}`
  })

  for (const key of keys) {
    if (!seen.has(key)) lines.push(`${key}=${updates[key]}`)
  }

  let out = lines.join('\n')
  if (!out.endsWith('\n')) out += '\n'

  const dir = path.dirname(META_ENV)
  const tmp = path.join(dir, `.meta.env.${process.pid}.tmp`)
  fs.writeFileSync(tmp, out, { mode: 0o600 })
  fs.chmodSync(tmp, 0o600) // explicit: writeFileSync mode is subject to umask
  fs.renameSync(tmp, META_ENV)
  fs.chmodSync(META_ENV, 0o600)
}

/** GET against the Graph API. Returns parsed JSON; throws a GraphError on failure. */
export async function graphGet(pathname, params) {
  const url = new URL(`${API}/${pathname}`)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  const res = await fetch(url, { method: 'GET' })
  const body = await res.json().catch(() => ({}))
  if (!res.ok || body.error) throw new GraphError(pathname, res.status, body.error)
  return body
}

/** POST against the Graph API. Returns parsed JSON; throws a GraphError on failure. */
export async function graphPost(pathname, params) {
  const form = new URLSearchParams(params)
  const res = await fetch(`${API}/${pathname}`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form,
  })
  const body = await res.json().catch(() => ({}))
  if (!res.ok || body.error) throw new GraphError(pathname, res.status, body.error)
  return body
}

/**
 * Carries the two fields that actually diagnose a failure.
 *
 * error_user_msg is deliberately dropped: it comes back localised (we have had it
 * return Hindi) and says nothing the code and message do not already say.
 * Code 9004 specifically means the image URL could not be fetched — it is a bad
 * or unservable URL, not a permissions problem.
 */
export class GraphError extends Error {
  constructor(pathname, httpStatus, error = {}) {
    const code = error.code ?? 'n/a'
    const sub = error.error_subcode ? ` subcode=${error.error_subcode}` : ''
    const msg = error.message ?? `HTTP ${httpStatus}`
    super(`${pathname} failed: code=${code}${sub} ${msg}`)
    this.name = 'GraphError'
    this.code = error.code
    this.subcode = error.error_subcode
    this.graphMessage = error.message
    this.httpStatus = httpStatus
    if (code === 9004) {
      this.hint =
        'Code 9004 = Instagram could not fetch the image URL. Verify the URL returns 200 with content-type image/jpeg from the public internet.'
    }
  }
}
