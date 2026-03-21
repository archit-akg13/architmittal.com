import Link from 'next/link'

// Placeholder blog cards — will be replaced with real data from getAllPosts() in Task 6
const PLACEHOLDER_POSTS = [
  {
    slug: 'how-i-saved-client-85k-on-ai-api-costs',
    title: 'How I Saved a Client ₹85K/Month on AI API Costs',
    description: 'A practical guide to reducing LLM API costs by 97.5% using caching, model switching, and smart batching.',
    date: '2026-03-15',
    readingTime: '7 min read',
  },
  {
    slug: 'n8n-vs-zapier-real-cost-comparison',
    title: 'n8n vs Zapier: Why I Switched and Saved ₹12K/Year',
    description: 'A real cost comparison between n8n and Zapier, with migration tips for Indian businesses.',
    date: '2026-03-10',
    readingTime: '6 min read',
  },
  {
    slug: 'what-is-mcp-protocol-usb-for-ai-agents',
    title: 'What is MCP Protocol? The USB Port for AI Agents',
    description: 'MCP Protocol explained simply — what it is, why it matters, and how to use it with Claude.',
    date: '2026-03-05',
    readingTime: '8 min read',
  },
]

export default function BlogPreview() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-heading">
          Latest Blog Posts
        </h2>
        <Link href="/blog" className="text-lime hover:text-lime-dark font-heading font-semibold text-sm transition-colors">
          View All Posts &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLACEHOLDER_POSTS.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="border border-gray-200 rounded-xl p-6 hover:border-lime transition-colors group block"
          >
            <div className="text-subtle text-xs font-body mb-2">
              {post.date} &middot; {post.readingTime}
            </div>
            <h3 className="font-heading font-semibold text-heading group-hover:text-lime transition-colors mb-2">
              {post.title}
            </h3>
            <p className="font-body text-body text-sm leading-relaxed">
              {post.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
