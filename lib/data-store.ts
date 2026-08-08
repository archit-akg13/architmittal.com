import path from 'path'

/**
 * Resolves the directory holding inquiries.json / subscribers.json.
 *
 * This must NOT be derived from process.cwd(). The Next.js standalone server
 * calls `process.chdir(__dirname)` on startup (see .next/standalone/server.js),
 * so cwd inside a route handler is `<project>/.next/standalone`, not the
 * project root. Two things followed from that:
 *
 *  1. The site wrote leads to `.next/standalone/data/`, while bot.js read
 *     `$SITE_DIR/data/` — different files, so /leads always looked empty.
 *  2. `next build` copies the project-root `data/` into `.next/standalone/data/`
 *     via output file tracing, so every deploy overwrote the live file with the
 *     empty repo copy and destroyed whatever had been captured since the last
 *     deploy. Telegram alerts still fired at submission time, which is why the
 *     loss was invisible.
 *
 * Production sets DATA_DIR explicitly (see ecosystem.config.js) to an absolute
 * path outside `.next/`, which both the site and the bot agree on.
 */
export const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(process.cwd(), 'data')

export const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json')
export const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json')

/**
 * True if the resolved directory sits inside the build output, where a rebuild
 * will overwrite it. Checked by scripts/preflight.mjs.
 */
export function isInsideBuildOutput(dir: string = DATA_DIR): boolean {
  return dir.split(path.sep).includes('.next')
}
