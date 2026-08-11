#!/usr/bin/env node
/**
 * Publish a carousel or reel to Instagram via the Graph API.
 *
 * No browser, no file picker, no Chrome session, and the Mac does not need to be
 * awake. Images are referenced by public URL — push them to architmittal.com with
 * scripts/publish-ig-assets.mjs first, which is what guarantees they are servable.
 *
 * Usage:
 *   node scripts/ig-publish.mjs --slug mcp-servers-i-run --caption-file caption.txt --dry-run
 *   node scripts/ig-publish.mjs --slug mcp-servers-i-run --caption-file caption.txt
 *   node scripts/ig-publish.mjs --reel https://architmittal.com/ig/x/reel.mp4 --caption-file caption.txt
 *
 * Ported from ~/automation_branding/setup/ig_publish.py, keeping its structure and
 * its hard-won host/ID notes. Adds: a real pre-flight, a publish log, container IDs
 * logged at every step, and a readback that proves the post exists.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import {
  graphGet,
  graphPost,
  loadAccessToken,
  metaDie,
  metaLog,
  redactMeta,
} from './_meta.mjs'
import { parseArgs, SITE_ORIGIN } from './_common.mjs'

const BASE_URL = `${SITE_ORIGIN}/ig`
const MAX_CAPTION = 2200
const MIN_SLIDES = 2
const MAX_SLIDES = 10

// Kept outside the repo: the deploy does `git reset --hard origin/main`, so
// anything tracked here would be a commit-noise risk and anything untracked in a
// deployed directory is a data-loss risk. State belongs in the state directory.
const LOG_PATH =
  process.env.IG_PUBLISH_LOG ||
  path.join(os.homedir(), '.local', 'state', 'instagram-engine', 'publish-log.jsonl')

const args = parseArgs(process.argv.slice(2))
const dryRun = Boolean(args['dry-run'])

function appendLog(entry) {
  const record = { timestamp: new Date().toISOString(), ...entry }
  try {
    fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true })
    fs.appendFileSync(LOG_PATH, `${JSON.stringify(record)}\n`)
    metaLog(`Logged to ${LOG_PATH}`)
  } catch (err) {
    // A logging failure must never mask a publish result.
    metaLog(`WARNING: could not write publish log: ${redactMeta(err.message)}`)
  }
  return record
}

/** Confirms a URL is fetchable as JPEG from the public internet. */
async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'GET', redirect: 'follow' })
    const contentType = res.headers.get('content-type') || ''
    await res.arrayBuffer().catch(() => {})
    return { url, status: res.status, contentType, ok: res.status === 200 && /image\/jpe?g/i.test(contentType) }
  } catch (err) {
    return { url, status: 0, contentType: redactMeta(err.message), ok: false }
  }
}

/** Reels encode asynchronously. Poll the container until it reports FINISHED. */
async function waitForContainer(containerId, token, { tries = 60, intervalMs = 10000 } = {}) {
  for (let i = 1; i <= tries; i++) {
    const s = await graphGet(containerId, { fields: 'status_code,status', access_token: token })
    if (s.status_code === 'FINISHED') {
      metaLog(`  container ${containerId} FINISHED`)
      return
    }
    if (s.status_code === 'ERROR') {
      metaDie(`Container ${containerId} failed encoding: ${s.status ?? 'no detail'}`)
    }
    metaLog(`  container ${containerId} ${s.status_code ?? 'PENDING'} (${i}/${tries})`)
    await new Promise((r) => setTimeout(r, intervalMs))
  }
  metaDie(`Timed out waiting for container ${containerId} to finish encoding.`)
}

/** Reads the post back so success is proven, not inferred from a 200. */
async function verifyPublished(mediaId, token, expect) {
  const media = await graphGet(mediaId, {
    fields: 'id,media_type,media_url,permalink,timestamp,children{id}',
    access_token: token,
  })
  const childCount = media.children?.data?.length ?? 0
  metaLog('')
  metaLog('Readback from the API:')
  metaLog(`  id          ${media.id}`)
  metaLog(`  media_type  ${media.media_type}`)
  metaLog(`  permalink   ${media.permalink}`)
  metaLog(`  children    ${childCount}`)

  const problems = []
  if (expect.mediaType && media.media_type !== expect.mediaType) {
    problems.push(`expected media_type ${expect.mediaType}, got ${media.media_type}`)
  }
  if (expect.childCount != null && childCount !== expect.childCount) {
    problems.push(`expected ${expect.childCount} children, got ${childCount}`)
  }
  return { media, childCount, problems }
}

async function main() {
  const captionFile = args['caption-file']
  if (!captionFile) metaDie('Pass --caption-file <path>.')
  if (!fs.existsSync(captionFile)) metaDie(`Caption file not found: ${captionFile}`)

  const caption = fs.readFileSync(captionFile, 'utf8').trim()
  if (caption.length > MAX_CAPTION) {
    metaDie(`Caption is ${caption.length} chars; Instagram's limit is ${MAX_CAPTION}.`)
  }

  const token = loadAccessToken()
  const slug = args.slug ? String(args.slug).trim() : null
  const reelUrl = args.reel ? String(args.reel).trim() : null
  if (!slug && !reelUrl) metaDie('Pass --slug (carousel) or --reel <public mp4 url> (video).')

  // ---------------- reel ----------------
  if (reelUrl) {
    metaLog(`Pre-flight: ${reelUrl}`)
    let head
    try {
      head = await fetch(reelUrl, { method: 'HEAD', redirect: 'follow' })
    } catch (err) {
      metaDie(`Video URL unreachable: ${redactMeta(err.message)}`)
    }
    const ctype = head.headers.get('content-type') || ''
    metaLog(`  status=${head.status} type=${ctype}`)
    if (head.status !== 200) metaDie('Video URL did not return 200. Push it to architmittal.com first.')
    if (!/video\/mp4/i.test(ctype)) {
      metaDie(`Video URL is ${ctype || 'unknown'}. Instagram needs an MP4 (H.264/AAC) served as video/mp4.`)
    }

    if (dryRun) {
      metaLog('\nDRY RUN — pre-flight passed, no containers created, nothing published.')
      return
    }

    const container = await graphPost('me/media', {
      media_type: 'REELS',
      video_url: reelUrl,
      caption,
      access_token: token,
    })
    metaLog(`Created reel container: ${container.id}`)
    await waitForContainer(container.id, token)

    const published = await graphPost('me/media_publish', {
      creation_id: container.id,
      access_token: token,
    })
    metaLog(`Published media id: ${published.id}`)

    const { media, problems } = await verifyPublished(published.id, token, { mediaType: 'REELS' })
    appendLog({
      kind: 'reel',
      slug: slug ?? null,
      videoUrl: reelUrl,
      containerId: container.id,
      mediaId: published.id,
      permalink: media.permalink,
      outcome: problems.length ? 'published_with_mismatch' : 'published',
      problems,
    })
    if (problems.length) metaDie(`Published, but readback did not match:\n  ${problems.join('\n  ')}`)
    metaLog('\nOK — reel published and verified.')
    return
  }

  // ---------------- carousel ----------------
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    metaDie(`Slug "${slug}" must be lowercase letters, digits and hyphens.`)
  }

  // Discover slides by probing sequentially, then require every one to be a real
  // JPEG. This runs BEFORE any container is created, so a bad URL costs nothing
  // and fails locally instead of as a confusing 9004 from the API.
  const explicit = args.images ? Number(args.images) : 0
  const limit = explicit || MAX_SLIDES
  metaLog(`Pre-flight: probing ${BASE_URL}/${slug}/1.jpg .. ${limit}.jpg`)

  const checks = []
  for (let i = 1; i <= limit; i++) {
    const result = await checkUrl(`${BASE_URL}/${slug}/${i}.jpg`)
    if (!result.ok) {
      if (explicit) {
        metaDie(
          `Required slide ${i} is not servable: ${result.url}\n` +
            `  status=${result.status} content-type=${result.contentType || 'n/a'}\n` +
            `Run: node scripts/publish-ig-assets.mjs --slug ${slug} --dir <slides>`
        )
      }
      break // autodetect: first gap ends the carousel
    }
    metaLog(`  OK  ${result.url}  (${result.contentType})`)
    checks.push(result)
  }

  if (checks.length < MIN_SLIDES || checks.length > MAX_SLIDES) {
    metaDie(
      `Found ${checks.length} servable slide(s). An Instagram carousel needs ${MIN_SLIDES}-${MAX_SLIDES}.\n` +
        `A 200 that is not image/jpeg counts as unservable — check the deploy landed.`
    )
  }

  const urls = checks.map((c) => c.url)
  metaLog(`\n${urls.length} slides · caption ${caption.length}/${MAX_CAPTION} chars`)

  if (dryRun) {
    metaLog('\nDRY RUN — pre-flight passed, no containers created, nothing published.')
    urls.forEach((u) => metaLog(`  would publish ${u}`))
    return
  }

  // Children first, then parent, then publish. Every ID is logged so a partial
  // failure can be diagnosed and the orphaned containers identified.
  const children = []
  try {
    for (const [i, url] of urls.entries()) {
      const child = await graphPost('me/media', {
        image_url: url,
        is_carousel_item: 'true',
        access_token: token,
      })
      metaLog(`  child ${i + 1}/${urls.length}: container ${child.id}`)
      children.push(child.id)
      await new Promise((r) => setTimeout(r, 1000))
    }

    const parent = await graphPost('me/media', {
      media_type: 'CAROUSEL',
      children: children.join(','),
      caption,
      access_token: token,
    })
    metaLog(`Parent container: ${parent.id}`)

    const published = await graphPost('me/media_publish', {
      creation_id: parent.id,
      access_token: token,
    })
    metaLog(`Published media id: ${published.id}`)

    const { media, childCount, problems } = await verifyPublished(published.id, token, {
      mediaType: 'CAROUSEL_ALBUM',
      childCount: urls.length,
    })

    appendLog({
      kind: 'carousel',
      slug,
      slideUrls: urls,
      childContainerIds: children,
      parentContainerId: parent.id,
      mediaId: published.id,
      permalink: media.permalink,
      childCount,
      outcome: problems.length ? 'published_with_mismatch' : 'published',
      problems,
    })

    if (problems.length) metaDie(`Published, but readback did not match:\n  ${problems.join('\n  ')}`)
    metaLog(`\nOK — carousel published and verified: ${media.permalink}`)
  } catch (err) {
    appendLog({
      kind: 'carousel',
      slug,
      slideUrls: urls,
      childContainerIds: children,
      outcome: 'failed',
      errorCode: err.code ?? null,
      errorMessage: redactMeta(err.graphMessage ?? err.message ?? String(err)),
    })
    const hint = err.hint ? `\n${err.hint}` : ''
    metaDie(`${redactMeta(err.message)}${hint}`)
  }
}

main().catch((err) => metaDie(err?.stack || err?.message || String(err)))
