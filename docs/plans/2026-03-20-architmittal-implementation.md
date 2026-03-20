# architmittal.com Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a fast, SEO-optimized personal brand website + MDX blog for Archit Mittal at architmittal.com, deploy to VPS on port 3002.

**Architecture:** Next.js 14 App Router with static generation, MDX blog system, Tailwind CSS styling. No database — fully SSG. Deployed via PM2 + Nginx on existing VPS.

**Tech Stack:** Next.js 14, Tailwind CSS, MDX (next-mdx-remote + gray-matter), Poppins + Lato fonts, PM2, Nginx

---

## Task Dependency Graph

```
T1 (scaffold) → T2 (brand/tailwind) → T3 (layout+header+footer)
                                          ↓
                    T4 (homepage sections) → T5 (blog lib)
                                               ↓
                              T6 (blog pages) → T7 (seed articles)
                                                    ↓
                              T8 (remaining pages) → T9 (SEO: sitemap+rss+robots)
                                                        ↓
                                          T10 (deploy configs) → T11 (deploy to VPS)
                                                                      ↓
                                                              T12 (STATUS.md + push)
```

Tasks 4, 5 can run in parallel after T3.
Tasks 8, 9 can run in parallel after T7.

---

### Task 1: Scaffold Next.js Project

**Files:**
- Create: `package.json`, `next.config.js`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `.gitignore`, `app/layout.tsx`, `app/page.tsx`

**Step 1: Initialize Next.js project**

```bash
cd /Users/architm/claude_projects/architmittal_website
npx create-next-app@14 . --typescript --tailwind --app --src-dir=false --import-alias="@/*" --use-npm --eslint
```

If directory not empty, scaffold in /tmp and rsync over (excluding .git, docs).

**Step 2: Configure next.config.js for standalone output**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['architmittal.com'],
  },
}
module.exports = nextConfig
```

**Step 3: Verify build works**

```bash
npm run build
```
Expected: Build completes without errors.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 14 project with standalone output"
```

---

### Task 2: Brand Design System + Tailwind Config

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Create: `lib/constants.ts`

**Step 1: Configure Tailwind with brand tokens**

In `tailwind.config.ts`, extend theme with:
- Colors: `lime: '#4CAF1E'`, `dark: '#0A0A0A'`, `heading: '#1E1E1E'`, `body: '#646464'`, `subtle: '#AAAAAA'`
- Fonts: `heading: ['Poppins', 'sans-serif']`, `body: ['Lato', 'sans-serif']`

**Step 2: Set up global CSS**

Import Poppins (400,500,600,700) and Lato (300,400,700) from Google Fonts in layout.tsx via `next/font/google`. Set base styles in globals.css.

**Step 3: Create constants file**

`lib/constants.ts` — social links array, SEO defaults (site name, description, url, author), service cards data, stats data. Single source of truth for all repeated content.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: configure brand design system with LIME green theme"
```

---

### Task 3: Layout + Header + Footer

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/Header.tsx`
- Create: `components/Footer.tsx`

**Step 1: Build Header component**

- Logo text "Archit Mittal" on left
- Nav links: Blog, Tools, About, Case Studies, Contact
- Mobile hamburger menu (client component for toggle state)
- Sticky header, white bg with subtle shadow on scroll

**Step 2: Build Footer component**

- Social links row (LinkedIn, Twitter, Dev.to, Hashnode, GitHub, Quora) with icons
- Quick links: Blog, About, Tools, Case Studies, Contact
- "Archit Mittal | I Automate Chaos"
- Copyright 2026
- Dark background (#0A0A0A)

**Step 3: Root layout**

- Poppins + Lato fonts via next/font/google
- Schema.org Person JSON-LD script in head
- Meta viewport, charset
- Header + children + Footer structure

**Step 4: Verify**

```bash
npm run dev
```
Check localhost:3000 — header and footer render, fonts load, mobile menu works.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add layout with header, footer, and Person schema"
```

---

### Task 4: Homepage (All 8 Sections)

**Files:**
- Modify: `app/page.tsx`
- Create: `components/Hero.tsx`
- Create: `components/SocialProofBar.tsx`
- Create: `components/ServiceCard.tsx`
- Create: `components/StatsSection.tsx`
- Create: `components/BlogPreview.tsx` (placeholder until blog lib exists)
- Create: `components/AboutSnippet.tsx`
- Create: `components/CTASection.tsx`

**Step 1: Hero section (dark bg)**

- Large "I Automate Chaos" heading (Poppins, bold)
- Subtitle: "AI Automation Expert — Helping businesses save ₹lakhs through intelligent automation with Claude Code, n8n & AI agents"
- Two CTAs: "Book a Consultation" (LIME bg) + "Read the Blog" (outline)
- Subtle animated grid/gradient background (CSS only, no JS — keep it lightweight for performance)

**Step 2: Social Proof Bar**

- Horizontal row of platform icons with labels + follower counts
- LinkedIn (9,400+), Twitter/X (43), Dev.to, Hashnode, GitHub, Quora
- Each links to the actual profile URL from constants.ts

**Step 3: What I Do — 4 service cards**

- AI Workflow Automation, AI API Cost Optimization, No-Code/Low-Code, Multi-Agent Systems
- Each card: relevant icon + title + 1-line description
- LIME accent on hover/border
- Grid layout: 2x2 on desktop, stack on mobile

**Step 4: Results/Stats section (dark bg)**

- 4 large stat numbers in LIME: ₹85K/month, 40+, 9,400+, 97.5%
- Each with a subtitle description
- Grid layout

**Step 5: Latest Blog Posts (placeholder)**

- Section heading "Latest Blog Posts"
- 3 placeholder cards (will be replaced when blog lib is built in T5/T6)
- "View All Posts →" link to /blog

**Step 6: About Snippet**

- Gray circle placeholder for photo
- Short bio text from spec
- "Learn More →" link to /about

**Step 7: CTA Section (LIME bg)**

- "Ready to automate your chaos?"
- Subtitle about free consultation
- "Book Now" button (links to /contact)
- White text on LIME background

**Step 8: Compose all sections in page.tsx**

Import all components, render in order. Add homepage-specific metadata export.

**Step 9: Verify**

Check all 8 sections render correctly on desktop and mobile.

**Step 10: Commit**

```bash
git add -A
git commit -m "feat: build homepage with all 8 sections"
```

---

### Task 5: Blog Library (MDX Parsing)

**Files:**
- Create: `lib/blog.ts`
- Create: `content/blog/.gitkeep`

**Step 1: Install MDX dependencies**

```bash
npm install next-mdx-remote gray-matter reading-time rehype-highlight rehype-slug
```

**Step 2: Build blog utility library**

`lib/blog.ts` — functions:
- `getAllPosts()` — read all .mdx files from content/blog, parse frontmatter with gray-matter, calculate reading time, sort by date desc
- `getPostBySlug(slug)` — read single post, return frontmatter + MDX source
- `getRelatedPosts(currentSlug, tags, limit=3)` — find posts with matching tags
- `getAllTags()` — extract unique tags across all posts

Frontmatter type:
```ts
type PostFrontmatter = {
  title: string
  description: string
  date: string
  tags: string[]
  image: string
  canonicalUrl: string
  readingTime?: string
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add MDX blog parsing library with reading time"
```

---

### Task 6: Blog Pages (Listing + Individual Post)

**Files:**
- Create: `app/blog/page.tsx`
- Create: `app/blog/[slug]/page.tsx`
- Create: `components/BlogCard.tsx`
- Create: `components/AuthorBox.tsx`
- Create: `components/ShareButtons.tsx`
- Create: `components/TableOfContents.tsx`

**Step 1: Blog listing page**

- Page title "Blog" with description
- Grid of BlogCard components (title, excerpt, date, reading time, tags)
- generateStaticParams for SSG
- Metadata export with SEO tags

**Step 2: BlogCard component**

- Card with title, description, date, reading time, tag pills
- LIME hover effect
- Links to /blog/[slug]

**Step 3: Individual blog post page**

- Render MDX content with next-mdx-remote
- Breadcrumb navigation (Home > Blog > Post Title)
- Table of contents (auto-generated from headings)
- Author box at bottom
- Share buttons (LinkedIn, Twitter, Copy link)
- Related posts section
- Previous/Next article links
- Schema.org Article JSON-LD
- Breadcrumb Schema.org
- Code syntax highlighting via rehype-highlight

**Step 4: AuthorBox component**

- Photo placeholder, "Archit Mittal", "AI Automation Expert | I Automate Chaos"
- Social links to LinkedIn, Twitter, GitHub

**Step 5: ShareButtons component (client component)**

- LinkedIn share, Twitter share, Copy link (with "Copied!" toast)
- Uses `navigator.clipboard` + `window.location.href`

**Step 6: TableOfContents component**

- Extracts H2/H3 from MDX content
- Sticky sidebar on desktop, collapsible on mobile
- Smooth scroll to heading on click

**Step 7: Update homepage BlogPreview**

Replace placeholder with real data from `getAllPosts().slice(0, 3)`.

**Step 8: Verify**

Create a dummy test.mdx to verify rendering works, then delete it.

**Step 9: Commit**

```bash
git add -A
git commit -m "feat: add blog listing, post pages, TOC, author box, share buttons"
```

---

### Task 7: Seed Blog Articles (4 MDX files)

**Files:**
- Create: `content/blog/how-i-saved-client-85k-on-ai-api-costs.mdx`
- Create: `content/blog/n8n-vs-zapier-real-cost-comparison.mdx`
- Create: `content/blog/what-is-mcp-protocol-usb-for-ai-agents.mdx`
- Create: `content/blog/claude-code-honest-developer-review.mdx`

**Step 1: Write article 1 — AI API Cost Optimization**

1200-1500 words. Keywords: AI API cost optimization, reduce AI costs, LLM API pricing India. Story: Client spending ₹95K/month → ₹10K/month via caching, model switching, batching.

**Step 2: Write article 2 — n8n vs Zapier**

1200-1500 words. Keywords: n8n vs Zapier, automation tools comparison. Real cost comparison with migration story.

**Step 3: Write article 3 — MCP Protocol**

1200-1500 words. Keywords: MCP protocol explained, Claude MCP, AI agent tools. USB analogy, real use cases.

**Step 4: Write article 4 — Claude Code Review**

1200-1500 words. Keywords: Claude Code review 2026, AI coding tools. Personal experience, comparison with Cursor/Codex.

**Step 5: Verify blog renders**

```bash
npm run build
```
All 4 posts should appear on /blog, each individual page renders correctly.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add 4 seed blog articles"
```

---

### Task 8: Remaining Pages (About, Tools, Case Studies, Contact)

**Files:**
- Create: `app/about/page.tsx`
- Create: `app/tools/page.tsx`
- Create: `app/case-studies/page.tsx`
- Create: `app/contact/page.tsx`

**Step 1: About page**

- Full bio + journey story
- Skills/expertise list
- Photo placeholder
- "What I Automate" section
- Metadata export with SEO

**Step 2: Tools page**

- Links to GitHub repos with descriptions
- Automation templates section
- Link cards with GitHub icon + description

**Step 3: Case Studies page**

- 2-3 client ROI stories (expanded from LinkedIn posts)
- Stats callouts (₹85K saved, 97.5% cost reduction, etc.)
- Card layout

**Step 4: Contact page**

- Simple contact form (name, email, message) — client-side only for now (no backend)
- OR Calendly embed placeholder
- "Book a free 30-minute consultation"
- Social links

**Step 5: Verify all pages**

Each page loads, has proper metadata, responsive layout.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add about, tools, case-studies, and contact pages"
```

---

### Task 9: SEO (Sitemap, RSS, Robots.txt, OG Images)

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`
- Create: `app/feed.xml/route.ts`
- Create: `public/og-default.jpg` (generated or placeholder)

**Step 1: Auto-generated sitemap**

`app/sitemap.ts` — Next.js Metadata API. Include all static pages + all blog post URLs from getAllPosts(). Set changeFrequency and priority.

**Step 2: Robots.txt**

`app/robots.ts` — allow all crawlers, reference sitemap URL.

**Step 3: RSS feed**

`app/feed.xml/route.ts` — GET handler returning XML RSS 2.0 feed. Include all blog posts with title, description, link, pubDate, guid. Content-Type: application/xml.

**Step 4: Add RSS link to layout head**

`<link rel="alternate" type="application/rss+xml" title="Archit Mittal Blog" href="/feed.xml" />`

**Step 5: Create OG default image**

Simple placeholder image with "Archit Mittal | I Automate Chaos" text. Can be a static SVG or generated PNG.

**Step 6: Verify**

- `/sitemap.xml` returns valid XML with all URLs
- `/robots.txt` returns valid robots file
- `/feed.xml` returns valid RSS with all 4 articles

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add sitemap, robots.txt, RSS feed, and OG image"
```

---

### Task 10: Deployment Configs

**Files:**
- Create: `ecosystem.config.js`
- Create: `deploy.sh`
- Create: `nginx/architmittal.com.conf`

**Step 1: PM2 ecosystem file**

```js
module.exports = {
  apps: [{
    name: 'architmittal-website',
    script: '.next/standalone/server.js',
    cwd: '/var/www/architmittal.com',
    env: {
      NODE_ENV: 'production',
      PORT: 3002,
      HOSTNAME: '0.0.0.0'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '256M'
  }]
}
```

**Step 2: Deploy script**

`deploy.sh` — git pull, npm ci, npm run build, copy public+static into standalone, pm2 restart.

**Step 3: Nginx config**

`nginx/architmittal.com.conf` — listen 80, server_name architmittal.com www.architmittal.com, proxy_pass to 127.0.0.1:3002, static file alias, gzip, SSL will be added by certbot.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add PM2 ecosystem, deploy script, and nginx config"
```

---

### Task 11: Deploy to VPS

**Step 1: Create GitHub repo and push**

```bash
curl -H "Authorization: token <PAT>" https://api.github.com/user/repos -d '{"name":"architmittal.com","public":true}'
git remote add origin https://github.com/archit-akg13/architmittal.com.git
git push -u origin main
```

**Step 2: Clone on VPS and build**

```bash
ssh root@103.216.146.213
cd /var/www
git clone https://github.com/archit-akg13/architmittal.com.git
cd architmittal.com
npm ci
npm run build
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
```

**Step 3: Start PM2**

```bash
PORT=3002 pm2 start .next/standalone/server.js --name architmittal-website --max-memory-restart 256M
pm2 save
```

**Step 4: Configure Nginx**

Copy nginx config to /etc/nginx/sites-available/architmittal.com, symlink to sites-enabled, nginx -t, systemctl reload nginx.

**Step 5: Add DNS A record**

Add A record for `architmittal.com` → `103.216.146.213` on GoDaddy.

**Step 6: SSL with Certbot**

```bash
certbot --nginx -d architmittal.com -d www.architmittal.com --non-interactive --agree-tos --email admin@architmittal.com --redirect
```

**Step 7: Verify**

Visit https://architmittal.com — site loads, SSL valid, all pages work.

**Step 8: Commit any deploy-related fixes**

---

### Task 12: STATUS.md + Final Push

**Files:**
- Create: `STATUS.md`

**Step 1: Create STATUS.md**

```markdown
# architmittal.com — Build Status

## Last Updated: March 20, 2026
## Current State: deployed

## What's Done:
- Homepage with all 8 sections (hero, social proof, services, stats, blog preview, about, CTA, footer)
- Blog system with MDX, TOC, author box, share buttons, related posts
- 4 seed blog articles published
- About, Tools, Case Studies, Contact pages
- SEO: sitemap.xml, robots.txt, RSS feed, Schema.org (Person + Article), Open Graph, Twitter Cards
- Deployed to VPS with PM2 + Nginx + SSL

## What's In Progress:
- Nothing currently

## What's Next:
- Add real profile photo
- Connect Calendly to contact page
- Write more blog articles
- Monitor SEO rankings

## Needs From Archit:
- Profile photo (save as /public/archit-photo.jpg)
- Calendly link for booking consultations
- Review the 4 blog articles for accuracy

## Blog Articles Ready for Cross-Post:
- "How I Saved a Client ₹85K/Month on AI API Costs" — /blog/how-i-saved-client-85k-on-ai-api-costs
- "n8n vs Zapier: Why I Switched and Saved ₹12K/Year" — /blog/n8n-vs-zapier-real-cost-comparison
- "What is MCP Protocol? The USB Port for AI Agents" — /blog/what-is-mcp-protocol-usb-for-ai-agents
- "Claude Code Changed How I Work — An Honest Developer Review" — /blog/claude-code-honest-developer-review
```

**Step 2: Final commit and push**

```bash
git add STATUS.md
git commit -m "docs: add STATUS.md for 3-way communication"
git push
```

