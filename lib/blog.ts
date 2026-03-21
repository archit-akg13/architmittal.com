import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export type PostFrontmatter = {
  title: string
  description: string
  date: string
  tags: string[]
  image: string
  canonicalUrl: string
  readingTime: string
  slug: string
}

export type Post = {
  frontmatter: PostFrontmatter
  content: string
}

export function getAllPosts(): PostFrontmatter[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  const posts = files.map((file) => {
    const slug = file.replace('.mdx', '')
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8')
    const { data, content } = matter(raw)
    const rt = readingTime(content)

    return {
      ...data,
      slug,
      readingTime: rt.text,
    } as PostFrontmatter
  })

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const rt = readingTime(content)

  return {
    frontmatter: {
      ...data,
      slug,
      readingTime: rt.text,
    } as PostFrontmatter,
    content,
  }
}

export function getRelatedPosts(currentSlug: string, tags: string[], limit = 3): PostFrontmatter[] {
  const allPosts = getAllPosts()
  return allPosts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => ({
      post: p,
      score: p.tags?.filter((t) => tags.includes(t)).length || 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((p) => p.post)
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tags = new Set<string>()
  posts.forEach((p) => p.tags?.forEach((t) => tags.add(t)))
  return Array.from(tags).sort()
}
