import fs from 'node:fs'
import path from 'node:path'

/* Sprynt-style transparent collage: faded post-thumbnail columns drifting behind the hero. */
export default function HeroCollage() {
  let items: { thumb: string }[] = []
  try { items = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'packs', 'feed.json'), 'utf8')).items.slice(0, 18) } catch {}
  if (items.length < 9) return null
  const cols = [items.slice(0, 6), items.slice(6, 12), items.slice(12, 18)]
  return (
    <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] overflow-hidden opacity-[0.16] lg:block"
      style={{ maskImage: 'linear-gradient(90deg, transparent, #000 35%)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 35%)' }}>
      <div className="flex h-full gap-3 rotate-2">
        {cols.map((col, c) => (
          <div key={c} className={`flex w-1/3 flex-col gap-3 ${c % 2 ? 'drift-rev' : 'drift'}`}>
            {[...col, ...col].map((i, k) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img key={k} src={i.thumb} alt="" loading="lazy" className="w-full rounded-lg object-cover" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
