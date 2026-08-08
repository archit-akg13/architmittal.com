/**
 * Shared helpers for the publishing scripts.
 *
 * Credential rule: the GitHub token is read from ~/.config/automation/github.env
 * and must never reach stdout, stderr, a commit message, or the git remote list.
 * Every string that leaves this module goes through redact() first.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

export const REPO_SLUG = 'archit-akg13/architmittal.com'
export const SITE_ORIGIN = 'https://architmittal.com'
export const ENV_FILE = path.join(os.homedir(), '.config', 'automation', 'github.env')

/** Values registered here are scrubbed from anything we print. */
const SECRETS = new Set()

export function registerSecret(value) {
  if (value && value.length > 6) SECRETS.add(value)
}

export function redact(input) {
  let out = String(input ?? '')
  for (const s of SECRETS) out = out.split(s).join('***REDACTED***')
  // Belt and braces: scrub any token-shaped string and any credentialed URL.
  out = out.replace(/(gh[pousr]_|github_pat_)[A-Za-z0-9_]+/g, '$1***REDACTED***')
  out = out.replace(/https:\/\/[^@\s/]+@/g, 'https://***REDACTED***@')
  return out
}

export function log(...args) {
  console.log(args.map(redact).join(' '))
}

export function die(message) {
  console.error(`\nERROR: ${redact(message)}\n`)
  process.exit(1)
}

/** Reads GITHUB_TOKEN from the env file. Verifies the file is not world-readable. */
export function loadToken() {
  if (!fs.existsSync(ENV_FILE)) {
    die(
      `Missing ${ENV_FILE}\n` +
        `Create a fine-grained GitHub PAT on the "archit-akg13" account, scoped to\n` +
        `${REPO_SLUG} with Contents: Read and write, then:\n` +
        `  mkdir -p ~/.config/automation && chmod 700 ~/.config/automation\n` +
        `  printf 'GITHUB_TOKEN=YOUR_TOKEN\\n' > ${ENV_FILE}\n` +
        `  chmod 600 ${ENV_FILE}`
    )
  }

  const mode = fs.statSync(ENV_FILE).mode & 0o777
  if (mode & 0o077) {
    die(`${ENV_FILE} is mode ${mode.toString(8)}; it must be 600. Run: chmod 600 ${ENV_FILE}`)
  }

  let token = null
  for (const line of fs.readFileSync(ENV_FILE, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue
    const [key, ...rest] = trimmed.split('=')
    if (key.trim() === 'GITHUB_TOKEN') token = rest.join('=').trim()
  }

  if (!token) die(`GITHUB_TOKEN is not set in ${ENV_FILE}`)
  registerSecret(token)
  return token
}

/** Runs git, returning trimmed stdout. Errors are redacted before they surface. */
export function git(args, { cwd = repoRoot(), allowFail = false } = {}) {
  try {
    return execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim()
  } catch (err) {
    if (allowFail) return null
    const detail = [err.stdout, err.stderr].filter(Boolean).join('\n').trim() || err.message
    die(`git ${redact(args.join(' '))} failed:\n${detail}`)
  }
}

let _root = null
export function repoRoot() {
  if (_root) return _root
  try {
    _root = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim()
  } catch {
    die('Not inside a git repository.')
  }
  return _root
}

/**
 * Commits exactly the given paths and pushes main.
 *
 * The token is passed to git via an ephemeral -c http.extraHeader so it never
 * appears in `git remote -v`, .git/config, the reflog, or any error string.
 */
export function commitAndPush({ paths, message, token, dryRun }) {
  const root = repoRoot()

  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'])
  if (branch !== 'main') {
    die(`On branch "${branch}". Publishing only happens from main. Run: git checkout main`)
  }

  if (dryRun) {
    log(`DRY RUN — would commit ${paths.length} path(s):`)
    for (const p of paths) log(`  ${path.relative(root, p)}`)
    log(`DRY RUN — would push main to ${REPO_SLUG}`)
    return { pushed: false }
  }

  git(['add', '--', ...paths])

  const staged = git(['diff', '--cached', '--name-only'])
  if (!staged) die('Nothing staged — the file matched what is already committed.')

  // --only limits the commit to these paths, so unrelated working-tree edits are left alone.
  // -m must precede the `--` separator, or the message is parsed as a pathspec.
  git(['commit', '--only', '-m', message, '--', ...paths])
  log(`Committed: ${git(['log', '--oneline', '-1'])}`)

  // Rebase onto any posts published from elsewhere since we last fetched.
  git(['fetch', 'origin', 'main'])
  const behind = git(['rev-list', '--count', 'HEAD..origin/main'])
  if (behind !== '0') {
    log(`origin/main is ${behind} commit(s) ahead — rebasing before push.`)
    git(['rebase', 'origin/main'])
  }

  const authHeader = `Authorization: Basic ${Buffer.from(`x-access-token:${token}`).toString('base64')}`
  registerSecret(authHeader)

  git([
    '-c',
    `http.extraHeader=${authHeader}`,
    'push',
    `https://github.com/${REPO_SLUG}.git`,
    'HEAD:main',
  ])

  log('Pushed to main. GitHub Actions (.github/workflows/deploy.yml) will deploy to the VPS.')
  return { pushed: true }
}

/** Polls a URL until it returns 200, so we can confirm the Actions deploy landed. */
export async function waitForLive(url, { timeoutMs = 300000, intervalMs = 15000 } = {}) {
  const deadline = Date.now() + timeoutMs
  log(`Waiting for ${url} to go live (up to ${Math.round(timeoutMs / 1000)}s)...`)

  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' })
      if (res.status === 200) {
        log(`LIVE: ${url}`)
        return true
      }
      log(`  ${res.status} — not yet, retrying...`)
    } catch (err) {
      log(`  unreachable (${redact(err.message)}) — retrying...`)
    }
    await new Promise((r) => setTimeout(r, intervalMs))
  }

  log(`Timed out waiting for ${url}. Check the Actions run:`)
  log(`  https://github.com/${REPO_SLUG}/actions`)
  return false
}

/** Minimal --flag / --flag=value parser. */
export function parseArgs(argv) {
  const out = { _: [] }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (!arg.startsWith('--')) {
      out._.push(arg)
      continue
    }
    const body = arg.slice(2)
    if (body.includes('=')) {
      const [k, ...v] = body.split('=')
      out[k] = v.join('=')
    } else if (argv[i + 1] && !argv[i + 1].startsWith('--')) {
      out[body] = argv[++i]
    } else {
      out[body] = true
    }
  }
  return out
}
