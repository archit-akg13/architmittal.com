import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles on AI automation, algo trading, AI agents, cost optimization, MCP protocol, and building intelligent systems.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <main className="bg-[--paper] text-[--ink]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="eyebrow">The blog</p>
        <h1 className="display mt-3 text-[--ink] text-[clamp(2.6rem,8vw,6rem)]">{posts.length} playbooks, free</h1>
        <p className="mt-4 max-w-xl text-lg text-[--ink-dim]">Practical guides on AI automation, cost optimisation and building systems that hold up.</p>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {posts.map((post, i) => {
            const tile = ['bg-[#16130E] text-[#FFF3E2]', 'bg-[--gold-fill] text-[#16130E]', 'bg-[--red] text-white', 'bg-white text-[#16130E] border border-[--ink]/15'][i % 4]
            return (
              <Link key={post.slug} href={`/blog/${post.slug}`}
                className={`group flex aspect-square flex-col justify-between overflow-hidden rounded-xl p-5 transition-transform duration-200 hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--red] ${tile}`}>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] opacity-60">{post.readingTime}</span>
                <span className="display text-[clamp(1rem,2vw,1.4rem)] leading-[1.05] [overflow-wrap:anywhere]">{post.title}</span>
                <span className="text-xs font-semibold opacity-70 transition-opacity group-hover:opacity-100">Read →</span>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
