'use client'
/* Hallmark · redesign (in-place) · macrostructure: Ecosystem Index (feed grid) · tone: utilitarian
 * Instagram-recognition layout: profile header, 3-col reel-ratio grid, per-card resource button.
 * pre-emit critique: P4 H4 E4 S4 R4 V4
 */


export type FeedItem = {
  slug: string
  kind: 'reel' | 'carousel'
  hook: string
  postedAt: string | null
  permalink: string
  trigger: string
  thumb: string
  resource: { name: string; url: string | null } | null
}


export default function PackFeed({ items, onLockedClick, unlocked }: {
  items: FeedItem[]
  unlocked: boolean
  onLockedClick: () => void
}) {
  return (
    <ol className="grid grid-cols-3 gap-1 sm:gap-2">
      {items.map((i) => (
        <li key={i.slug} className="flex min-w-0 flex-col">
          <a
            href={i.permalink} target="_blank" rel="noopener noreferrer"
            aria-label={`Open the Instagram ${i.kind} — ${i.hook || i.slug}`}
            className="group relative block aspect-[9/16] overflow-hidden rounded-md bg-heading/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/60"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.thumb} alt={i.hook || i.slug} loading="lazy"
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]" />
            <span aria-hidden className="absolute right-1.5 top-1.5 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white">
              {i.kind === 'reel' ? '▶ Reel' : '▤ Post'}
            </span>
          </a>
          {i.resource?.url ? (
            unlocked ? (
              <a href={i.resource.url} target="_blank" rel="noopener noreferrer"
                className="mt-1 inline-flex h-9 min-w-0 items-center justify-center rounded-md border border-heading px-1 font-heading text-[11px] font-semibold text-heading transition-colors duration-150 hover:bg-heading hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/60 sm:text-xs">
                Access resource
              </a>
            ) : (
              <button type="button" onClick={onLockedClick}
                className="mt-1 inline-flex h-9 min-w-0 items-center justify-center rounded-md border border-dashed border-subtle px-1 font-heading text-[11px] font-semibold text-subtle transition-colors duration-150 hover:border-heading hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/60 sm:text-xs">
                Unlock resource
              </button>
            )
          ) : (
            <a href={i.permalink} target="_blank" rel="noopener noreferrer"
              className="mt-1 inline-flex h-9 items-center justify-center rounded-md border border-subtle/50 px-1 font-heading text-[11px] font-semibold text-subtle hover:border-heading hover:text-heading sm:text-xs">
              Comment {i.trigger}
            </a>
          )}
        </li>
      ))}
    </ol>
  )
}
