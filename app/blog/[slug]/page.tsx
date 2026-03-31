import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/blog'
import { SITE_URL } from '@/lib/constants'
import { BLOG_FAQS } from '@/lib/blog-faqs'
import AuthorBox from '@/components/AuthorBox'
import ShareButtons from '@/components/ShareButtons'
import EmailCapture from '@/components/EmailCapture'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug)
  if (!post) return {}

  const { frontmatter } = post
  return {
    title: frontmatter.title,
    description: frontmatter.description,
    openGraph: {
      type: 'article',
      title: frontmatter.title,
      description: frontmatter.description,
      url: `${SITE_URL}/blog/${frontmatter.slug}`,
      images: frontmatter.image ? [{ url: frontmatter.image }] : [{ url: '/og-default.jpg' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.description,
    },
    alternates: {
      canonical: frontmatter.canonicalUrl || `${SITE_URL}/blog/${frontmatter.slug}`,
    },
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)
  if (!post) notFound()

  const { frontmatter, content } = post
  const allPosts = getAllPosts()
  const currentIndex = allPosts.findIndex((p) => p.slug === params.slug)
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null
  const relatedPosts = getRelatedPosts(params.slug, frontmatter.tags || [])

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    author: {
      '@type': 'Person',
      name: 'Archit Mittal',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'Archit Mittal',
    },
    mainEntityOfPage: `${SITE_URL}/blog/${frontmatter.slug}`,
  }

  const faqs = BLOG_FAQS[params.slug] || []
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: frontmatter.title, item: `${SITE_URL}/blog/${frontmatter.slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* Breadcrumb */}
        <nav className="text-sm font-body text-subtle mb-6">
          <Link href="/" className="hover:text-lime transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-lime transition-colors">Blog</Link>
          <span className="mx-2">/</span>
          <span className="text-body">{frontmatter.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-heading mb-3">
            {frontmatter.title}
          </h1>
          <div className="text-subtle text-sm font-body">
            {frontmatter.date} &middot; {frontmatter.readingTime}
          </div>
          {frontmatter.tags && (
            <div className="flex gap-2 mt-3">
              {frontmatter.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-body text-xs px-2 py-1 rounded font-body">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none font-body text-body prose-headings:font-heading prose-headings:text-heading prose-a:text-lime prose-code:text-heading prose-pre:bg-dark prose-pre:text-gray-300">
          <MDXRemote
            source={content}
            options={{
              mdxOptions: {
                rehypePlugins: [rehypeHighlight, rehypeSlug],
              },
            }}
          />
        </div>

        {/* Blog lead funnel */}
        <AuthorBox />

        <EmailCapture
          variant="blog"
          heading="Get weekly automation insights"
          subheading="Join 500+ business leaders who receive practical automation tips every week."
        />

        <ShareButtons title={frontmatter.title} slug={frontmatter.slug} />

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h3 className="font-heading font-semibold text-heading mb-4">Related Posts</h3>
            <div className="space-y-3">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="block text-body hover:text-lime font-body text-sm transition-colors"
                >
                  &rarr; {rp.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Prev/Next */}
        <div className="flex justify-between mt-10 pt-8 border-t border-gray-200">
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`} className="text-body hover:text-lime font-body text-sm transition-colors">
              &larr; {prevPost.title}
            </Link>
          ) : <span />}
          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`} className="text-body hover:text-lime font-body text-sm transition-colors text-right">
              {nextPost.title} &rarr;
            </Link>
          ) : <span />}
        </div>
      </article>
    </>
  )
}
