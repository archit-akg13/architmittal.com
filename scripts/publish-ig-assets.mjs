#!/usr/bin/env node
/**
 * Publish Instagram carousel slides to architmittal.com so the Graph API can fetch
 * them by public URL (no browser, no file picker).
 *
 * Converts a directory of images to 1080x1350 JPEG at public/ig/<slug>/1.jpg, 2.jpg, ...
 * then commits and pushes. The resulting URLs are consumed by
 * ~/automation_branding/setup/ig_publish.py, which expects exactly:
 *   https://architmittal.com/ig/<slug>/<n>.jpg   (sequential from 1, JPEG, 2-10 slides)
 *
 * Usage:
 *   node scripts/publish-ig-assets.mjs --slug mcp-servers-i-run --dir ./slides [--dry-run]
 *
 * Options:
 *   --slug <slug>   Folder under public/ig/ (must match ig_publish.py --slug)
 *   --dir <path>    Directory of source images, published in natural filename order
 *   --force         Overwrite an existing public/ig/<slug>/
 *   --dry-run       Convert nothing, commit nothing — just report the plan
 *
 * Credentials: GITHUB_TOKEN from ~/.config/automation/github.env (mode 600).
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import {
  SITE_ORIGIN,
  commitAndPush,
  die,
  loadToken,
  log,
  parseArgs,
  repoRoot,
} from './_common.mjs'

// Instagram portrait carousel. The Graph API rejects PNG, so everything becomes JPEG.
const WIDTH = 1080
const HEIGHT = 1350
const MIN_SLIDES = 2
const MAX_SLIDES = 10
const SOURCE_EXT = /\.(png|jpe?g|webp|tiff?|avif)$/i

const args = parseArgs(process.argv.slice(2))
const dryRun = Boolean(args['dry-run'])
const root = repoRoot()

function naturalSort(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
}

async function main() {
  const slug = String(args.slug ?? '').trim()
  if (!slug) die('Pass --slug <slug> (must match the --slug you give ig_publish.py).')
  if (!/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
    die(`Slug "${slug}" must be lowercase letters, digits and hyphens.`)
  }

  const srcDir = args.dir ? path.resolve(args.dir) : null
  if (!srcDir) die('Pass --dir <directory of slide images>.')
  if (!fs.existsSync(srcDir) || !fs.statSync(srcDir).isDirectory()) {
    die(`Not a directory: ${srcDir}`)
  }

  const sources = fs
    .readdirSync(srcDir)
    .filter((f) => SOURCE_EXT.test(f) && !f.startsWith('.'))
    .sort(naturalSort)
    .map((f) => path.join(srcDir, f))

  if (sources.length < MIN_SLIDES || sources.length > MAX_SLIDES) {
    die(
      `Found ${sources.length} image(s) in ${srcDir}. ` +
        `An Instagram carousel needs ${MIN_SLIDES}-${MAX_SLIDES}.`
    )
  }

  const outDir = path.join(root, 'public', 'ig', slug)
  if (fs.existsSync(outDir) && !args.force) {
    die(`${path.relative(root, outDir)} already exists. Pass --force to overwrite.`)
  }

  log('')
  log(`  slug     ${slug}`)
  log(`  source   ${srcDir}`)
  log(`  slides   ${sources.length}`)
  log(`  output   ${path.relative(root, outDir)}/1.jpg .. ${sources.length}.jpg`)
  log(`  size     ${WIDTH}x${HEIGHT} JPEG`)
  log('')
  sources.forEach((s, i) => log(`  ${i + 1}.jpg  <-  ${path.basename(s)}`))
  log('')

  // Fail on a credential problem before writing any files.
  const token = dryRun ? null : loadToken()

  const urls = sources.map((_, i) => `${SITE_ORIGIN}/ig/${slug}/${i + 1}.jpg`)

  if (dryRun) {
    log('DRY RUN — would convert and write the files above, then:')
    commitAndPush({ paths: [outDir], message: '', token: null, dryRun: true })
    log('')
    log('DRY RUN — resulting URLs would be:')
    urls.forEach((u) => log(`  ${u}`))
    log('')
    log(`DRY RUN — then: python3 ~/automation_branding/setup/ig_publish.py --slug ${slug} --caption-file caption.txt --dry-run`)
    return
  }

  fs.mkdirSync(outDir, { recursive: true })

  for (const [i, src] of sources.entries()) {
    const dest = path.join(outDir, `${i + 1}.jpg`)
    await sharp(src)
      .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
      .flatten({ background: '#ffffff' }) // drop alpha; JPEG has no transparency
      .jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true })
      .toFile(dest)
    const kb = Math.round(fs.statSync(dest).size / 1024)
    log(`  wrote ${path.relative(root, dest)}  (${kb} KB)`)
  }

  commitAndPush({
    paths: [outDir],
    message: `Add Instagram carousel assets: ${slug}`,
    token,
    dryRun: false,
  })

  log('')
  log('Public URLs (wait for the Actions deploy to finish before posting):')
  urls.forEach((u) => log(`  ${u}`))
  log('')
  log('Then post the carousel:')
  log(`  python3 ~/automation_branding/setup/ig_publish.py --slug ${slug} --caption-file caption.txt --dry-run`)
}

main().catch((err) => die(err?.stack || err?.message || String(err)))
