#!/usr/bin/env node
/**
 * Deploy preflight — refuses to pass unless the runtime environment is actually
 * correct on the machine it runs on.
 *
 * The recurring failure mode on this project is configuration that silently
 * does nothing: a .env.local the standalone server never reads, `pm2 restart`
 * reusing saved env, a data directory inside the build output that every deploy
 * overwrites. Each looked fine and quietly wasn't. This checks the real
 * running state rather than what a config file claims.
 *
 * Usage (on the VPS):
 *   node scripts/preflight.mjs            # everything
 *   node scripts/preflight.mjs --files    # config files only (before first deploy)
 *   node scripts/preflight.mjs --json     # machine-readable summary
 *
 * Read-only and safe to run repeatedly.
 *
 * PRINTS NO SECRET VALUES. Variable names, presence, lengths and short salted
 * digests only — never the value itself.
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'

const args = new Set(process.argv.slice(2))
const FILES_ONLY = args.has('--files')
const AS_JSON = args.has('--json')

const SITE_DIR = process.env.SITE_DIR || '/var/www/architmittal.com'
const SITE_PROC = 'architmittal-website'
const BOT_PROC = 'archit-telegram-bot'

const MIN_SECRET_LENGTH = 16

const results = []

function record(name, ok, detail, fatal = true) {
  results.push({ name, ok, detail, fatal })
}

/**
 * Short digest for comparing two secrets without revealing either.
 * Salted so the digest cannot be matched against a rainbow table of the value.
 */
function fingerprint(value) {
  return crypto.createHash('sha256').update(`preflight:${value}`).digest('hex').slice(0, 12)
}

function parseEnvFile(filePath) {
  const out = {}
  let raw
  try {
    raw = fs.readFileSync(filePath, 'utf8')
  } catch {
    return null
  }
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
    const [key, ...rest] = trimmed.split('=')
    out[key.trim()] = rest.join('=').trim()
  }
  return out
}

function parseChatIds(raw) {
  return String(raw || '')
    .split(',')
    .map((s) => Number(s.trim()))
    .filter(Boolean)
}

// ---------------------------------------------------------------- file checks

const siteEnvPath = path.join(SITE_DIR, '.env.server')
const botEnvPath = path.join(SITE_DIR, 'bot', '.env')

const siteEnv = parseEnvFile(siteEnvPath)
const botEnv = parseEnvFile(botEnvPath)

if (siteEnv === null) {
  record('site .env.server readable', false, `cannot read ${siteEnvPath}`)
} else {
  record('site .env.server readable', true, siteEnvPath)

  const mode = fs.statSync(siteEnvPath).mode & 0o777
  record(
    'site .env.server permissions',
    !(mode & 0o077),
    `mode ${mode.toString(8)}${mode & 0o077 ? ' — should be 600' : ''}`,
    false
  )

  const secret = siteEnv.NOTIFY_SECRET
  if (!secret) {
    record('NOTIFY_SECRET set (site file)', false, `NOTIFY_SECRET missing from ${siteEnvPath}`)
  } else if (secret.length < MIN_SECRET_LENGTH) {
    record(
      'NOTIFY_SECRET set (site file)',
      false,
      `NOTIFY_SECRET is ${secret.length} chars; needs at least ${MIN_SECRET_LENGTH}`
    )
  } else {
    record('NOTIFY_SECRET set (site file)', true, `${secret.length} chars, fp ${fingerprint(secret)}`)
  }
}

if (botEnv === null) {
  record('bot .env readable', false, `cannot read ${botEnvPath}`)
} else {
  record('bot .env readable', true, botEnvPath)

  const ids = parseChatIds(botEnv.TELEGRAM_ALLOWED_CHAT_IDS || botEnv.TELEGRAM_CHAT_ID)
  if (ids.length === 0) {
    record(
      'TELEGRAM_ALLOWED_CHAT_IDS set (bot file)',
      false,
      'TELEGRAM_ALLOWED_CHAT_IDS is empty or unparseable — the bot will refuse every command'
    )
  } else {
    record('TELEGRAM_ALLOWED_CHAT_IDS set (bot file)', true, `${ids.length} chat ID(s) parsed`)
  }

  const botSecret = botEnv.NOTIFY_SECRET
  if (!botSecret) {
    record('NOTIFY_SECRET set (bot file)', false, `NOTIFY_SECRET missing from ${botEnvPath}`)
  } else {
    record('NOTIFY_SECRET set (bot file)', true, `${botSecret.length} chars, fp ${fingerprint(botSecret)}`)
  }

  // The failure this catches: site and bot each have a secret, both look fine,
  // but they differ — so every notification 401s and no lead alert arrives.
  if (siteEnv?.NOTIFY_SECRET && botSecret) {
    const same = fingerprint(siteEnv.NOTIFY_SECRET) === fingerprint(botSecret)
    record(
      'NOTIFY_SECRET matches between site and bot',
      same,
      same ? 'fingerprints agree' : 'FINGERPRINTS DIFFER — notifications will 401 silently'
    )
  }
}

// ------------------------------------------------------------- pm2 env checks

function pm2List() {
  try {
    return JSON.parse(execFileSync('pm2', ['jlist'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }))
  } catch {
    return null
  }
}

if (!FILES_ONLY) {
  const procs = pm2List()

  if (procs === null) {
    record('pm2 reachable', false, 'could not run `pm2 jlist` — run this on the VPS')
  } else {
    record('pm2 reachable', true, `${procs.length} process(es)`)

    const site = procs.find((p) => p.name === SITE_PROC)
    if (!site) {
      record(`${SITE_PROC} running`, false, `not found in pm2`)
    } else {
      record(`${SITE_PROC} running`, site.pm2_env?.status === 'online', `status ${site.pm2_env?.status}`)

      // The check that matters: what the RUNNING process sees, not the config.
      // `pm2 restart <name>` reuses the saved env, so ecosystem.config.js can be
      // correct while the live process still has the old values.
      const env = site.pm2_env?.env ?? site.pm2_env ?? {}

      const liveSecret = env.NOTIFY_SECRET
      if (!liveSecret) {
        record(
          'NOTIFY_SECRET visible to the running site process',
          false,
          'not in the pm2 env — run: pm2 restart ecosystem.config.js --update-env'
        )
      } else {
        const matchesFile = siteEnv?.NOTIFY_SECRET
          ? fingerprint(liveSecret) === fingerprint(siteEnv.NOTIFY_SECRET)
          : null
        record(
          'NOTIFY_SECRET visible to the running site process',
          matchesFile !== false,
          matchesFile === false
            ? 'process has a DIFFERENT value than .env.server — restart with --update-env'
            : `fp ${fingerprint(liveSecret)}`
        )
      }

      const dataDir = env.DATA_DIR
      if (!dataDir) {
        record(
          'DATA_DIR visible to the running site process',
          false,
          'not in the pm2 env — leads will be written relative to .next/standalone and lost on the next build'
        )
      } else {
        const abs = path.isAbsolute(dataDir)
        const inBuild = dataDir.split(path.sep).includes('.next')
        let writable = false
        try {
          fs.accessSync(dataDir, fs.constants.W_OK)
          writable = true
        } catch {
          /* reported below */
        }
        record('DATA_DIR is absolute', abs, abs ? dataDir : `"${dataDir}" is not absolute`)
        record(
          'DATA_DIR is outside the build output',
          !inBuild,
          inBuild ? `${dataDir} sits inside .next/ — every build overwrites it` : dataDir
        )
        record('DATA_DIR is writable', writable, writable ? 'writable' : `cannot write to ${dataDir}`)
      }
    }

    const bot = procs.find((p) => p.name === BOT_PROC)
    if (!bot) {
      record(`${BOT_PROC} running`, false, 'not found in pm2', false)
    } else {
      record(`${BOT_PROC} running`, bot.pm2_env?.status === 'online', `status ${bot.pm2_env?.status}`)

      const env = bot.pm2_env?.env ?? bot.pm2_env ?? {}
      const ids = parseChatIds(env.TELEGRAM_ALLOWED_CHAT_IDS || env.TELEGRAM_CHAT_ID)
      record(
        'TELEGRAM_ALLOWED_CHAT_IDS visible to the running bot process',
        ids.length > 0,
        ids.length > 0
          ? `${ids.length} chat ID(s)`
          : 'not in the pm2 env — the bot is refusing every command; restart it'
      )
    }
  }
}

// --------------------------------------------------------------------- report

const failures = results.filter((r) => !r.ok && r.fatal)
const warnings = results.filter((r) => !r.ok && !r.fatal)

if (AS_JSON) {
  console.log(JSON.stringify({ ok: failures.length === 0, results }, null, 2))
} else {
  console.log('')
  for (const r of results) {
    const mark = r.ok ? 'PASS' : r.fatal ? 'FAIL' : 'WARN'
    console.log(`  [${mark}] ${r.name}${r.detail ? ` — ${r.detail}` : ''}`)
  }
  console.log('')

  if (failures.length) {
    console.error(`PREFLIGHT FAILED — ${failures.length} problem(s):`)
    for (const f of failures) console.error(`  - ${f.name}: ${f.detail}`)
    console.error('')
  } else {
    console.log(`Preflight passed${warnings.length ? ` with ${warnings.length} warning(s)` : ''}.`)
    console.log('')
  }
}

process.exit(failures.length ? 1 : 0)
