import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

/* Insta-tile blog wall: cover-style tiles in the carousel design language. */
const TILE = ['bg-[#16130E] text-[#FFF3E2]', 'bg-[--gold-fill] text-[#16130E]', 'bg-[--red] text-white', 'bg-white text-[#16130E] border border-[--ink]/15']

export default function BlogPreview() {
  const posts = getAllPosts().slice(0, 8)
  return (
    <section className="bg-[--paper] py-16 text-[--ink] sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">The blog</p>
            <h2 className="display mt-3 text-[--ink] text-[clamp(2.2rem,6vw,4.5rem)]">{getAllPosts().length} playbooks, free</h2>
          </div>
          <Link href="/blog" className="hidden shrink-0 font-body text-sm font-semibold text-[--ink]/60 underline-offset-4 hover:text-[--red] hover:underline sm:block">All posts →</Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {posts.map((p, i) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} data-reveal
              className={`group flex aspect-square flex-col justify-between overflow-hidden rounded-xl p-5 transition-transform duration-200 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--red] ${TILE[i % 4]}`}>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-60">{p.readingTime ?? 'Guide'}</span>
              <span className="display text-[clamp(1rem,2.2vw,1.5rem)] leading-[1.05] [overflow-wrap:anywhere]">{p.title}</span>
              <span className="text-xs font-semibold opacity-70 transition-opacity group-hover:opacity-100">Read →</span>
            </Link>
          ))}
        </div>
        <Link href="/blog" className="mt-8 block text-center font-body text-sm font-semibold text-[--ink]/60 underline-offset-4 hover:text-[--red] hover:underline sm:hidden">All posts →</Link>
      </div>
    </section>
  )
}
