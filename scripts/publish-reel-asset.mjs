#!/usr/bin/env node
/**
 * Publish a reel MP4 to architmittal.com so the Graph API can fetch it by public URL.
 *
 *   node scripts/publish-reel-asset.mjs --slug <slug> --file <path/to/reel.mp4>
 *   node scripts/publish-reel-asset.mjs --slug <slug> --file <path> --dry-run
 *
 * Validates the file against Instagram's Reels requirements BEFORE committing, then
 * pushes and blocks until the URL genuinely serves video/mp4.
 *
 * A caution about this transport: every reel committed here stays in git history
 * forever, and history cannot be slimmed without a force-push that rewrites the repo.
 * A 25s paper-and-ink reel is under 1 MB and harmless. Screen-recorded reels run
 * 20-50 MB, and a daily cadence would add roughly 10 GB a year to a clone that every
 * deploy pulls. Past MAX_COMMIT_MB this refuses and tells you to serve the file from
 * the VPS or object storage instead of versioning it.
 */
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import {
  SITE_ORIGIN,
  commitAndPush,
  die,
  loadToken,
  log,
  parseArgs,
  repoRoot,
  waitForLiveAssets,
  syncDirToVps,
} from './_common.mjs'

const MAX_IG_MB = 1000 // Instagram's own ceiling
const MAX_COMMIT_MB = 25 // ours, to keep the repo clonable
const MIN_SECONDS = 3
const MAX_SECONDS = 900

const args = parseArgs(process.argv.slice(2))
const dryRun = Boolean(args['dry-run'])

/** ffprobe reports frame rate as "30/1". Parse it; never eval it. */
function fps(rate) {
  const m = String(rate ?? '').match(/^(\d+)\/(\d+)$/)
  if (!m) return Number(rate) || 0
  const den = Number(m[2])
  return den ? Number(m[1]) / den : 0
}

function probe(file) {
  try {
    const out = execFileSync(
      'ffprobe',
      ['-v', 'error', '-print_format', 'json', '-show_format', '-show_streams', file],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
    )
    return JSON.parse(out)
  } catch (err) {
    die(`ffprobe failed on ${file}. Is ffmpeg installed?\n${err.stderr ?? err.message}`)
  }
}

async function main() {
  const slug = String(args.slug ?? '').trim()
  const file = args.file ? path.resolve(String(args.file)) : null
  if (!slug) die('Pass --slug <slug>')
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) die(`Slug "${slug}" must be lowercase letters, digits and hyphens.`)
  if (!file) die('Pass --file <path to mp4>')
  if (!fs.existsSync(file)) die(`Not found: ${file}`)

  const info = probe(file)
  const v = info.streams.find((s) => s.codec_type === 'video')
  const a = info.streams.find((s) => s.codec_type === 'audio')
  const seconds = Number(info.format.duration)
  const sizeMb = Number(info.format.size) / 1e6

  log('')
  log(`  file       ${file}`)
  log(`  video      ${v?.codec_name} ${v?.profile ?? ''} ${v?.width}x${v?.height} ${fps(v?.r_frame_rate)}fps ${v?.pix_fmt}`)
  log(`  audio      ${a ? `${a.codec_name} ${a.sample_rate}Hz` : 'NONE'}`)
  log(`  duration   ${seconds.toFixed(1)}s`)
  log(`  size       ${sizeMb.toFixed(2)} MB`)
  log('')

  const problems = []
  if (!v) problems.push('no video stream')
  if (v && v.codec_name !== 'h264') problems.push(`video is ${v.codec_name}; Instagram needs H.264`)
  if (v && v.pix_fmt !== 'yuv420p') problems.push(`pixel format is ${v.pix_fmt}; Instagram needs yuv420p`)
  if (!a) problems.push('no audio stream; mux a silent AAC track')
  if (a && a.codec_name !== 'aac') problems.push(`audio is ${a.codec_name}; Instagram needs AAC`)
  if (seconds < MIN_SECONDS) problems.push(`${seconds.toFixed(1)}s is under the ${MIN_SECONDS}s minimum`)
  if (seconds > MAX_SECONDS) problems.push(`${seconds.toFixed(1)}s exceeds the ${MAX_SECONDS}s maximum`)
  if (sizeMb > MAX_IG_MB) problems.push(`${sizeMb.toFixed(0)} MB exceeds Instagram's ${MAX_IG_MB} MB ceiling`)
  if (v) {
    const ratio = v.width / v.height
    if (Math.abs(ratio - 9 / 16) > 0.02) {
      problems.push(`aspect ${ratio.toFixed(3)} is not 9:16 (0.5625); reels are cropped or letterboxed otherwise`)
    }
  }
  if (problems.length) die(`This file will not publish as a reel:\n  ${problems.join('\n  ')}`)

  if (sizeMb > MAX_COMMIT_MB) {
    die(
      `${sizeMb.toFixed(1)} MB is above the ${MAX_COMMIT_MB} MB commit limit.\n` +
        `Committing it would put it in git history permanently, and every deploy clones that history.\n` +
        `Serve this from the VPS or object storage and publish with:\n` +
        `  node scripts/ig-publish.mjs --reel <public-url> --caption-file caption.txt`
    )
  }

  const root = repoRoot()
  const outDir = path.join(root, 'public', 'ig', slug)
  const dest = path.join(outDir, 'reel.mp4')
  const url = `${SITE_ORIGIN}/ig/${slug}/reel.mp4`

  if (dryRun) {
    log('DRY RUN — spec check passed. Would copy, commit and push:')
    log(`  ${path.relative(root, dest)}`)
    log(`  then verify ${url} serves video/mp4`)
    return
  }

  const token = loadToken()
  fs.mkdirSync(outDir, { recursive: true })
  fs.copyFileSync(file, dest)
  log(`  wrote ${path.relative(root, dest)}`)

  syncDirToVps(outDir, `ig/${slug}`)
  commitAndPush({
    paths: [dest],
    message: `Add Instagram reel asset: ${slug}`,
    token,
    dryRun: false,
  })

  const { ok, results } = await waitForLiveAssets([url], {
    typePattern: /video\/mp4/i,
    label: 'video/mp4',
  })
  if (!ok) {
    const r = results[0]
    die(
      `Reel pushed but not servable at ${url}\n` +
        `  status=${r.status} content-type=${r.contentType || 'n/a'}\n` +
        `Do NOT publish — the Graph API cannot fetch it.`
    )
  }

  log('')
  log(`Verified live: ${url}`)
  log('Publish with:')
  log(`  node scripts/ig-publish.mjs --reel ${url} --caption-file <caption.txt>`)
}

main().catch((err) => die(err?.stack || err?.message || String(err)))
