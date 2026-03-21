import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles on AI automation, cost optimization, n8n, MCP protocol, Claude Code, and building intelligent workflows.',
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-heading font-bold text-3xl sm:text-4xl text-heading mb-3">Blog</h1>
      <p className="font-body text-body mb-10">
        Practical guides on AI automation, cost optimization, and building intelligent workflows.
      </p>

      {posts.length === 0 ? (
        <p className="text-body font-body">No posts yet. Check back soon!</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block border border-gray-200 rounded-xl p-6 hover:border-lime transition-colors group"
            >
              <div className="text-subtle text-xs font-body mb-2">
                {post.date} &middot; {post.readingTime}
              </div>
              <h2 className="font-heading font-semibold text-lg text-heading group-hover:text-lime transition-colors mb-2">
                {post.title}
              </h2>
              <p className="font-body text-body text-sm leading-relaxed">
                {post.description}
              </p>
              {post.tags && (
                <div className="flex gap-2 mt-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-body text-xs px-2 py-1 rounded font-body">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
