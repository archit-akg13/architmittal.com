#!/usr/bin/env node
/**
 * Publish a blog post to architmittal.com.
 *
 * Writes content/blog/<slug>.mdx with the frontmatter lib/blog.ts expects,
 * commits just that file, pushes main, and waits for GitHub Actions to deploy.
 *
 * Usage:
 *   node scripts/publish-post.mjs --file draft.mdx [--dry-run]
 *   node scripts/publish-post.mjs \
 *     --title "How I cut an API bill by 85%" \
 *     --description "..." \
 *     --tags "AI,Cost Optimization" \
 *     --body-file body.md [--dry-run]
 *
 * Options:
 *   --file <path>        Draft .mdx with frontmatter (gray-matter parsed)
 *   --title/--description/--tags/--body-file   Build a post from parts
 *   --image <path>       og:image (default /og-default.jpg)
 *   --date <YYYY-MM-DD>  Publish date (default: today)
 *   --slug <slug>        Override the slug derived from the title
 *   --min-words <n>      Body length floor (default 600)
 *   --dry-run            Validate and render, but do not write, commit, or push
 *   --no-wait            Skip polling the live URL after push
 *
 * Credentials: GITHUB_TOKEN from ~/.config/automation/github.env (mode 600).
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import {
  SITE_ORIGIN,
  commitAndPush,
  die,
  loadToken,
  log,
  parseArgs,
  repoRoot,
  waitForLive,
} from './_common.mjs'

const DESC_MIN = 120
const DESC_MAX = 160
const MIN_TAGS = 2
const DEFAULT_IMAGE = '/og-default.jpg'

const args = parseArgs(process.argv.slice(2))
const dryRun = Boolean(args['dry-run'])
const minWords = Number(args['min-words'] ?? 600)
const root = repoRoot()
const blogDir = path.join(root, 'content', 'blog')

/** "How I Cut an API Bill by 85%!" -> "how-i-cut-an-api-bill-by-85" */
export function slugify(title) {
  return String(title)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[₹$€£%&]/g, ' ')
    .replace(/['’"“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function countWords(body) {
  return body.trim().split(/\s+/).filter(Boolean).length
}

// ---------------------------------------------------------------- gather input

function gather() {
  if (args.file) {
    const draftPath = path.resolve(args.file)
    if (!fs.existsSync(draftPath)) die(`Draft not found: ${draftPath}`)
    const { data, content } = matter(fs.readFileSync(draftPath, 'utf8'))
    return {
      title: args.title ?? data.title,
      description: args.description ?? data.description,
      tags: args.tags ? String(args.tags).split(',') : data.tags,
      image: args.image ?? data.image ?? DEFAULT_IMAGE,
      date: args.date ?? data.date ?? todayISO(),
      slug: args.slug ?? data.slug,
      body: content,
    }
  }

  if (!args['body-file']) {
    die('Pass either --file <draft.mdx> or --title/--description/--tags/--body-file. See --help.')
  }
  const bodyPath = path.resolve(args['body-file'])
  if (!fs.existsSync(bodyPath)) die(`Body file not found: ${bodyPath}`)

  return {
    title: args.title,
    description: args.description,
    tags: args.tags ? String(args.tags).split(',') : undefined,
    image: args.image ?? DEFAULT_IMAGE,
    date: args.date ?? todayISO(),
    slug: args.slug,
    body: fs.readFileSync(bodyPath, 'utf8'),
  }
}

// ------------------------------------------------------------------ validation

function validate(post) {
  const errors = []

  if (!post.title || !String(post.title).trim()) errors.push('title is missing')
  if (!post.body || !post.body.trim()) errors.push('body is empty')

  const desc = String(post.description ?? '').trim()
  if (!desc) {
    errors.push('description is missing')
  } else if (desc.length < DESC_MIN || desc.length > DESC_MAX) {
    errors.push(`description is ${desc.length} chars; must be ${DESC_MIN}-${DESC_MAX}`)
  }

  const tags = Array.isArray(post.tags)
    ? post.tags.map((t) => String(t).trim()).filter(Boolean)
    : []
  if (tags.length < MIN_TAGS) errors.push(`needs at least ${MIN_TAGS} tags; got ${tags.length}`)

  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(post.date))) {
    errors.push(`date "${post.date}" is not ISO YYYY-MM-DD`)
  }

  const words = countWords(post.body ?? '')
  if (words < minWords) errors.push(`body is ${words} words; minimum is ${minWords}`)

  const slug = post.slug ? slugify(post.slug) : slugify(post.title ?? '')
  if (!slug) {
    errors.push('could not derive a slug from the title')
  } else if (fs.existsSync(path.join(blogDir, `${slug}.mdx`))) {
    errors.push(`slug "${slug}" already exists at content/blog/${slug}.mdx`)
  }

  if (errors.length) {
    die(`Post rejected — nothing was written:\n  - ${errors.join('\n  - ')}`)
  }

  return { ...post, slug, tags, description: desc, words }
}

// --------------------------------------------------------------------- render

function render(post) {
  const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  const frontmatter = [
    '---',
    `title: "${esc(post.title)}"`,
    `description: "${esc(post.description)}"`,
    `date: "${post.date}"`,
    `tags: [${post.tags.map((t) => `"${esc(t)}"`).join(', ')}]`,
    `image: "${esc(post.image)}"`,
    `canonicalUrl: "${SITE_ORIGIN}/blog/${post.slug}"`,
    '---',
    '',
  ].join('\n')

  return frontmatter + post.body.trim() + '\n'
}

// ----------------------------------------------------------------------- main

async function main() {
  if (args.help) {
    log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('*/')[0].replace(/^\/\*\*?/, ''))
    return
  }

  const post = validate(gather())
  const outPath = path.join(blogDir, `${post.slug}.mdx`)
  const url = `${SITE_ORIGIN}/blog/${post.slug}`
  const contents = render(post)

  log('')
  log(`  slug         ${post.slug}`)
  log(`  title        ${post.title}`)
  log(`  description  ${post.description.length} chars`)
  log(`  tags         ${post.tags.join(', ')}`)
  log(`  date         ${post.date}`)
  log(`  body         ${post.words} words`)
  log(`  url          ${url}`)
  log('')

  // Load the token before writing anything, so a credential problem fails clean.
  const token = dryRun ? null : loadToken()

  if (dryRun) {
    log('DRY RUN — rendered frontmatter:')
    log(contents.split('---')[1].trim().split('\n').map((l) => `    ${l}`).join('\n'))
    log('')
    log(`DRY RUN — would write ${path.relative(root, outPath)}`)
    commitAndPush({ paths: [outPath], message: '', token: null, dryRun: true })
    log('DRY RUN — nothing written, committed, or pushed.')
    return
  }

  fs.writeFileSync(outPath, contents, 'utf8')
  log(`Wrote ${path.relative(root, outPath)}`)

  commitAndPush({
    paths: [outPath],
    message: `Add blog post: ${post.title}`,
    token,
    dryRun: false,
  })

  if (args['no-wait']) {
    log(`Skipping live check. Post should appear at ${url}`)
    return
  }

  const live = await waitForLive(url)
  if (!live) process.exit(1)
}

main().catch((err) => die(err?.stack || err?.message || String(err)))
