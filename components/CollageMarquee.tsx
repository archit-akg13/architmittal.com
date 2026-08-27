import fs from 'node:fs'
import path from 'node:path'

/* Sprynt-style proofstrip: two counter-scrolling rows of the REAL Instagram posts. */
type Item = { slug: string; thumb: string; hook: string }

export default function CollageMarquee() {
  let items: Item[] = []
  try {
    items = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'packs', 'feed.json'), 'utf8')).items.slice(0, 24)
  } catch {}
  if (items.length < 6) return null
  const half = Math.ceil(items.length / 2)
  const rows = [items.slice(0, half), items.slice(half)]
  return (
    <section aria-label="Recent Instagram posts" className="overflow-hidden border-y border-[--ink]/10 bg-[--paper3] py-6">
      {rows.map((row, r) => (
        <div key={r} className={`mq-row mt-3 flex w-max gap-3 first:mt-0 ${r ? 'mq-rev' : ''}`}>
          {[...row, ...row].map((i, k) => (
            <a key={`${i.slug}-${k}`} href="/packs" tabIndex={k >= row.length ? -1 : 0} aria-hidden={k >= row.length}
              className="block w-[110px] shrink-0 overflow-hidden rounded-lg border border-[--ink]/10 transition-transform duration-200 hover:scale-[1.04] sm:w-[140px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={i.thumb} alt={i.hook || i.slug} loading="lazy" className="aspect-[9/16] w-full object-cover" />
            </a>
          ))}
        </div>
      ))}
      <p className="mt-4 text-center text-sm text-[--ink]/55">One free AI tool a day on Instagram → <a className="font-semibold underline underline-offset-2 hover:text-[--red]" href="/packs">grab any of them here</a></p>
    </section>
  )
}
