#!/usr/bin/env node
/**
 * One-off: convert the legacy PNG slides to JPEG, because the Graph API rejects PNG.
 *
 * The PNGs are never deleted — the JPEG is written alongside as a sibling file.
 *
 * Nothing is cropped. Slides that violate Instagram's minimum width or accepted
 * aspect-ratio range are REPORTED, not silently skipped, because a silently
 * dropped slide turns a 7-slide carousel into a 6-slide one and nobody notices.
 *
 * Usage:
 *   node scripts/convert-legacy-slides.mjs --root ~/automation_branding/carousels-batch
 *   node scripts/convert-legacy-slides.mjs --root <dir> --dry-run
 *   node scripts/convert-legacy-slides.mjs --root <dir> --canvas 1080x1350   pad to portrait
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { die, log, parseArgs } from './_common.mjs'

const MIN_EDGE = 320
// Instagram accepts feed images between 4:5 portrait and 1.91:1 landscape.
const MIN_RATIO = 0.8
const MAX_RATIO = 1.91
const QUALITY = 90

const args = parseArgs(process.argv.slice(2))
const dryRun = Boolean(args['dry-run'])
const force = Boolean(args.force)

let canvas = null
if (args.canvas) {
  const m = String(args.canvas).match(/^(\d+)x(\d+)$/)
  if (!m) die(`--canvas must look like 1080x1350, got "${args.canvas}"`)
  canvas = { width: Number(m[1]), height: Number(m[2]) }
}

function expand(p) {
  return p.startsWith('~') ? path.join(process.env.HOME, p.slice(1)) : path.resolve(p)
}

function walkPngs(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walkPngs(full, out)
    else if (/\.png$/i.test(entry.name)) out.push(full)
  }
  return out
}

/** Averages the top-left 8x8 block, so padding bands match the slide's own paper. */
async function cornerColour(src) {
  try {
    const { data } = await sharp(src)
      .extract({ left: 0, top: 0, width: 8, height: 8 })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    let r = 0, g = 0, b = 0
    const px = data.length / 3
    for (let i = 0; i < data.length; i += 3) {
      r += data[i]; g += data[i + 1]; b += data[i + 2]
    }
    return { r: Math.round(r / px), g: Math.round(g / px), b: Math.round(b / px) }
  } catch {
    return { r: 247, g: 241, b: 230 }
  }
}

async function main() {
  const root = expand(String(args.root ?? '~/automation_branding/carousels-batch'))
  if (!fs.existsSync(root)) die(`Not found: ${root}`)

  const pngs = walkPngs(root).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  )
  if (!pngs.length) die(`No PNG files under ${root}`)

  log(`\nFound ${pngs.length} PNG(s) under ${root}`)
  log(canvas ? `Target canvas: ${canvas.width}x${canvas.height} (padded, never cropped)` : `Preserving each slide's native dimensions`)
  log('')

  const converted = []
  const skipped = []
  const rejected = []

  for (const src of pngs) {
    const rel = path.relative(root, src)
    const dest = src.replace(/\.png$/i, '.jpg')

    let meta
    try {
      meta = await sharp(src).metadata()
    } catch (err) {
      rejected.push({ rel, reason: `unreadable: ${err.message}` })
      continue
    }

    const { width, height } = meta
    if (!width || !height) {
      rejected.push({ rel, reason: 'no dimensions' })
      continue
    }

    // Validate the SOURCE. When padding to a fixed canvas the output ratio is
    // always legal, but a source below the minimum edge is still upscaled mush,
    // so it gets reported either way.
    if (Math.min(width, height) < MIN_EDGE) {
      rejected.push({ rel, reason: `${width}x${height} — shorter edge below ${MIN_EDGE}px minimum` })
      continue
    }

    const ratio = width / height
    if (!canvas && (ratio < MIN_RATIO || ratio > MAX_RATIO)) {
      rejected.push({
        rel,
        reason: `${width}x${height} — aspect ${ratio.toFixed(3)} outside Instagram's ${MIN_RATIO}-${MAX_RATIO} range (pass --canvas to pad it)`,
      })
      continue
    }

    if (fs.existsSync(dest) && !force) {
      skipped.push({ rel, reason: 'JPEG already exists (pass --force to overwrite)' })
      continue
    }

    if (dryRun) {
      converted.push({ rel, note: `${width}x${height} -> ${canvas ? `${canvas.width}x${canvas.height} padded` : `${width}x${height}`}` })
      continue
    }

    let pipeline = sharp(src)
    const pad = await cornerColour(src)
    if (canvas) {
      pipeline = pipeline.resize(canvas.width, canvas.height, { fit: 'contain', background: pad })
    }
    await pipeline
      .flatten({ background: pad })
      .toColourspace('srgb')
      .jpeg({ quality: QUALITY, chromaSubsampling: '4:4:4', mozjpeg: true })
      .toFile(dest)

    const kb = Math.round(fs.statSync(dest).size / 1024)
    converted.push({ rel, note: `${width}x${height} -> ${path.basename(dest)} (${kb} KB)` })
  }

  log(`Converted (${converted.length}):`)
  for (const c of converted) log(`  ${c.rel}  ${c.note}`)

  if (skipped.length) {
    log(`\nSkipped (${skipped.length}):`)
    for (const s of skipped) log(`  ${s.rel}  ${s.reason}`)
  }

  if (rejected.length) {
    log(`\nREJECTED (${rejected.length}) — these need attention, they were not converted:`)
    for (const r of rejected) log(`  ${r.rel}  ${r.reason}`)
  }

  log(`\n${converted.length} converted · ${skipped.length} skipped · ${rejected.length} rejected`)
  log(dryRun ? 'DRY RUN — no files were written. The PNGs are untouched either way.' : 'PNG originals left in place.')

  // A rejection is a real problem that needs a human decision about the source art.
  if (rejected.length) process.exitCode = 1
}

main().catch((err) => die(err?.stack || err?.message || String(err)))
