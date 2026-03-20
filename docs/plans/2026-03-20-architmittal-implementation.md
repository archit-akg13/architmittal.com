# architmittal.com Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a fast, SEO-optimized personal brand website + MDX blog + lead capture system + Telegram bot for Archit Mittal at architmittal.com, deploy to VPS on port 3002.

**Architecture:** Next.js 14 App Router with static generation, MDX blog system, Tailwind CSS styling. Multi-layer lead capture with JSON file storage (no database). Telegram bot for VPS management and real-time notifications. Deployed via PM2 + Nginx on existing VPS.

**Tech Stack:** Next.js 14, Tailwind CSS, MDX (next-mdx-remote + gray-matter), Poppins + Lato fonts, PM2, Nginx, node-telegram-bot-api

---

## Task Dependency Graph

```
T1 (scaffold) → T2 (brand/tailwind) → T3 (layout+header+footer+FloatingCTA)
                                          ↓
                    T4 (homepage sections) → T5 (blog lib)
                                               ↓
                              T6 (blog pages) → T7 (seed articles)
                                                    ↓
                         T8 (lead capture API routes) → T9 (contact page + form)
                                                           ↓
                              T10 (remaining pages) → T11 (SEO: sitemap+rss+robots)
                                                          ↓
                                          T12 (deploy configs) → T13 (deploy to VPS)
                                                                      ↓
                                                T14 (telegram bot) → T15 (STATUS.md + push)
```

Tasks 4, 5 can run in parallel after T3.
Tasks 10, 11 can run in parallel after T9.
Task 14 can run in parallel with T12/T13 (bot code is separate).

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

`lib/constants.ts` — single source of truth:

```ts
export const TOPMATE_URL = 'https://topmate.io/automate_archit'
export const SITE_EMAIL = 'archit.akg13@gmail.com'
export const TELEGRAM_NOTIFY_URL = 'http://localhost:3003/notify'

export const SOCIAL_LINKS = [
  { name: 'LinkedIn', url: 'https://linkedin.com/in/automate-archit', followers: '9,400+' },
  { name: 'Twitter', url: 'https://x.com/automate_archit', followers: '43' },
  { name: 'Dev.to', url: 'https://dev.to/automate-archit' },
  { name: 'Hashnode', url: 'https://hashnode.com/@automate-archit' },
  { name: 'GitHub', url: 'https://github.com/archit-akg13' },
  { name: 'Quora', url: 'https://quora.com/profile/Archit-Mittal-82' },
]

export const SERVICES = [
  { title: 'AI Workflow Automation', description: '...' },
  { title: 'AI API Cost Optimization', description: '...' },
  { title: 'No-Code/Low-Code Solutions', description: '...' },
  { title: 'Multi-Agent Systems', description: '...' },
]

export const STATS = [
  { value: '₹85K/month', label: 'Saved on AI API costs' },
  { value: '40+', label: 'Automation workflows built' },
  { value: '9,400+', label: 'LinkedIn followers' },
  { value: '97.5%', label: 'Cost reduction achieved' },
]

export const BUDGET_OPTIONS = [
  '₹10K - ₹25K',
  '₹25K - ₹50K',
  '₹50K - ₹1L',
  '₹1L+',
  'Not sure yet',
]

export const SOURCE_OPTIONS = [
  'LinkedIn',
  'Twitter',
  'Google Search',
  'Blog article',
  'Referral',
  'Other',
]
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: configure brand design system with LIME green theme"
```

---

### Task 3: Layout + Header + Footer + FloatingCTA

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/Header.tsx`
- Create: `components/Footer.tsx`
- Create: `components/FloatingCTA.tsx`
- Create: `components/EmailCapture.tsx` (small version for footer)

**Step 1: Build Header component**

- Logo text "Archit Mittal" on left
- Nav links: Blog, Tools, About, Case Studies, Contact
- **"Book a Call" button** — LIME green (`#4CAF1E`), white text, stands out from other nav items, links to TOPMATE_URL
- Mobile hamburger menu (client component for toggle state)
- Sticky header, white bg with subtle shadow on scroll

**Step 2: Build Footer component**

- Social links row (LinkedIn, Twitter, Dev.to, Hashnode, GitHub, Quora) with icons
- Quick links: Blog, About, Tools, Case Studies, Contact
- **Email subscribe field** — simple name + email inline form, calls `/api/subscribe`
- "Archit Mittal | I Automate Chaos"
- Copyright 2026
- Dark background (#0A0A0A)

**Step 3: Build FloatingCTA component (client component)**

- Sticky bottom-right corner button: "Book a Call →"
- LIME green background, white text, rounded, subtle shadow
- Links to TOPMATE_URL
- **Scroll-aware:** disappears on scroll-up, appears on scroll-down
- Visible on ALL pages (added to root layout)
- z-index high enough to float above content

```tsx
'use client'
import { useState, useEffect } from 'react'
import { TOPMATE_URL } from '@/lib/constants'

export default function FloatingCTA() {
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setVisible(currentScrollY > lastScrollY || currentScrollY < 100)
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <a
      href={TOPMATE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 bg-lime text-white px-6 py-3 rounded-full shadow-lg font-heading font-semibold z-50 transition-transform duration-300 hover:scale-105 ${
        visible ? 'translate-y-0' : 'translate-y-24'
      }`}
    >
      Book a Call →
    </a>
  )
}
```

**Step 4: Root layout**

- Poppins + Lato fonts via next/font/google
- Schema.org Person JSON-LD script in head
- Meta viewport, charset
- Header + children + Footer + **FloatingCTA** structure

**Step 5: Verify**

```bash
npm run dev
```
Check localhost:3000 — header with "Book a Call" button, footer with email subscribe, floating CTA visible, mobile menu works.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add layout with header, footer, floating CTA, and Person schema"
```

---

### Task 4: Homepage (All 9 Sections)

**Files:**
- Modify: `app/page.tsx`
- Create: `components/Hero.tsx`
- Create: `components/SocialProofBar.tsx`
- Create: `components/SocialProof.tsx` (client results ticker)
- Create: `components/ServiceCard.tsx`
- Create: `components/StatsSection.tsx`
- Create: `components/BlogPreview.tsx` (placeholder until blog lib exists)
- Create: `components/EmailCapture.tsx` (full version — reusable)
- Create: `components/AboutSnippet.tsx`
- Create: `components/CTASection.tsx`

**Step 1: Hero section (dark bg)**

- Large "I Automate Chaos" heading (Poppins, bold)
- Subtitle: "AI Automation Expert — Helping businesses save ₹lakhs through intelligent automation with Claude Code, n8n & AI agents"
- Two CTAs:
  - **"Book a Free Consultation"** (LIME bg) → links to `TOPMATE_URL`
  - **"Read the Blog"** (outline) → links to /blog
- Subtle animated grid/gradient background (CSS only, no JS)

**Step 2: Social Proof Bar + Results Ticker**

- Horizontal row of platform icons with labels + follower counts
- **Client results ticker/marquee** below: "₹85K/month saved on AI API costs" | "97.5% cost reduction" | "40+ workflows built"
- CSS animation marquee, infinite scroll

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

**Step 6: Email Capture Section**

- "Join 500+ business leaders getting weekly automation insights"
- Name + email form (calls `/api/subscribe`)
- LIME submit button
- Success/error states with green checkmark animation
- Reusable `EmailCapture` component with variant props (inline, block, blog)

**Step 7: About Snippet**

- Gray circle placeholder for photo
- Short bio text from spec
- "Learn More →" link to /about

**Step 8: CTA Section (LIME bg)**

- "Ready to automate your chaos?"
- Subtitle about free consultation
- **"Book Now" button** → links to `TOPMATE_URL`
- White text on LIME background

**Step 9: Compose all sections in page.tsx**

Import all components, render in order. Add homepage-specific metadata export.

**Step 10: Verify**

Check all 9 sections render correctly on desktop and mobile.

**Step 11: Commit**

```bash
git add -A
git commit -m "feat: build homepage with all 9 sections including lead capture"
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

### Task 6: Blog Pages (Listing + Individual Post + Lead Funnel)

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
- **After first 3 paragraphs:** Inline EmailCapture CTA — "Get my free Automation ROI Calculator"
- **At bottom, in order:**
  1. Author box with Topmate link
  2. Email capture CTA — "Get weekly automation insights"
  3. Related posts section
  4. Share buttons (LinkedIn, Twitter, Copy link)
  5. Previous/Next article links
- Schema.org Article JSON-LD
- Breadcrumb Schema.org
- Code syntax highlighting via rehype-highlight

**Step 4: AuthorBox component**

- Photo placeholder, "Archit Mittal", "AI Automation Expert | I Automate Chaos"
- Social links to LinkedIn, Twitter, GitHub
- **"Book a 1:1 with Archit →"** button linking to `TOPMATE_URL`

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
git commit -m "feat: add blog pages with lead funnel CTAs, author box, share buttons"
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

### Task 8: Lead Capture API Routes

**Files:**
- Create: `app/api/subscribe/route.ts`
- Create: `app/api/contact/route.ts`
- Create: `data/.gitkeep`

**Step 1: Create data directory**

```bash
mkdir -p data
echo '[]' > data/subscribers.json
echo '[]' > data/inquiries.json
touch data/.gitkeep
```

Add `data/subscribers.json` and `data/inquiries.json` to `.gitignore` (keep .gitkeep).

**Step 2: Email subscribe API route**

`app/api/subscribe/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'subscribers.json')

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json()

    // Validate
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Read existing
    let subscribers = []
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8')
      subscribers = JSON.parse(data)
    } catch { /* file doesn't exist yet */ }

    // Check duplicate
    if (subscribers.some((s: any) => s.email === email)) {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 409 })
    }

    // Append
    subscribers.push({ name, email, subscribedAt: new Date().toISOString() })
    await fs.writeFile(DATA_FILE, JSON.stringify(subscribers, null, 2))

    // Send Telegram notification (fire and forget)
    try {
      await fetch('http://localhost:3003/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `📧 New subscriber!\nName: ${name}\nEmail: ${email}` }),
      })
    } catch { /* telegram bot may not be running yet */ }

    return NextResponse.json({ success: true, message: 'Subscribed successfully!' })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
```

**Step 3: Contact form API route**

`app/api/contact/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const DATA_FILE = path.join(process.cwd(), 'data', 'inquiries.json')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, company, email, phone, automationNeeds, budget, source } = body

    // Validate required fields
    if (!fullName || !company || !email || !automationNeeds) {
      return NextResponse.json({ error: 'Please fill all required fields' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Read existing
    let inquiries = []
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8')
      inquiries = JSON.parse(data)
    } catch { /* file doesn't exist yet */ }

    // Save
    const inquiry = {
      fullName, company, email, phone: phone || '',
      automationNeeds, budget: budget || 'Not specified',
      source: source || 'Not specified',
      submittedAt: new Date().toISOString(),
    }
    inquiries.push(inquiry)
    await fs.writeFile(DATA_FILE, JSON.stringify(inquiries, null, 2))

    // Send Telegram notification
    try {
      await fetch('http://localhost:3003/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `🔔 New inquiry!\nName: ${fullName}\nCompany: ${company}\nEmail: ${email}\nBudget: ${budget}\nNeeds: ${automationNeeds.substring(0, 200)}`,
        }),
      })
    } catch { /* telegram bot may not be running yet */ }

    return NextResponse.json({ success: true, message: 'Thanks! I\'ll get back to you within 24 hours.' })
  } catch {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
```

**Step 4: Verify**

```bash
npm run build
# Test with curl:
curl -X POST http://localhost:3000/api/subscribe -H "Content-Type: application/json" -d '{"name":"Test","email":"test@test.com"}'
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add subscribe and contact API routes with JSON storage"
```

---

### Task 9: Contact Page with Detailed Form

**Files:**
- Create: `app/contact/page.tsx`
- Create: `components/ContactForm.tsx`

**Step 1: ContactForm component (client component)**

Full inquiry form with:
- Full Name (required, text input)
- Company Name (required, text input)
- Email (required, email input)
- Phone (optional, tel input)
- "What do you want to automate?" (required, textarea)
- Estimated monthly budget (required, select dropdown with BUDGET_OPTIONS from constants)
- "How did you find me?" (required, select dropdown with SOURCE_OPTIONS from constants)
- Submit button (LIME green)
- Loading state, validation errors, success message
- On success: "Thanks! I'll get back to you within 24 hours. For urgent requests, book a slot directly: [Topmate link]"

```tsx
'use client'
import { useState } from 'react'
import { TOPMATE_URL, BUDGET_OPTIONS, SOURCE_OPTIONS } from '@/lib/constants'
// ... form implementation with fetch to /api/contact
```

**Step 2: Contact page**

- Page heading "Let's Work Together"
- ContactForm component
- Side panel with:
  - "For urgent requests" → Topmate link
  - Email: archit.akg13@gmail.com
  - Social links
- Metadata export with SEO

**Step 3: Verify**

Form submits, data saves to `/data/inquiries.json`, success message shows.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add contact page with detailed inquiry form"
```

---

### Task 10: Remaining Pages (About, Tools, Case Studies)

**Files:**
- Create: `app/about/page.tsx`
- Create: `app/tools/page.tsx`
- Create: `app/case-studies/page.tsx`

**Step 1: About page**

- Full bio + journey story
- Skills/expertise list
- Photo placeholder
- "What I Automate" section
- **"Work With Me" section** — "Ready to automate your chaos?" + link to TOPMATE_URL
- Metadata export with SEO

**Step 2: Tools page**

- Links to GitHub repos with descriptions
- Automation templates section
- Link cards with GitHub icon + description

**Step 3: Case Studies page**

- 2-3 client ROI stories (expanded from LinkedIn posts)
- Stats callouts (₹85K saved, 97.5% cost reduction, etc.)
- Card layout

**Step 4: Verify all pages**

Each page loads, has proper metadata, responsive layout.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add about, tools, and case-studies pages"
```

---

### Task 11: SEO (Sitemap, RSS, Robots.txt, OG Images)

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

### Task 12: Deployment Configs

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

`deploy.sh` — git pull, npm ci, npm run build, copy public+static into standalone, create data dir if missing, pm2 restart.

```bash
#!/bin/bash
set -e
cd /var/www/architmittal.com

echo "📦 Pulling latest code..."
git pull origin main

echo "📥 Installing dependencies..."
npm ci

echo "🔨 Building..."
npm run build

echo "📁 Copying static files..."
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

echo "📁 Ensuring data directory exists..."
mkdir -p data
[ -f data/subscribers.json ] || echo '[]' > data/subscribers.json
[ -f data/inquiries.json ] || echo '[]' > data/inquiries.json

echo "🔄 Restarting PM2..."
pm2 restart architmittal-website || pm2 start ecosystem.config.js

echo "✅ Deploy complete!"
```

**Step 3: Nginx config**

`nginx/architmittal.com.conf` — listen 80, server_name architmittal.com www.architmittal.com, proxy_pass to 127.0.0.1:3002, static file alias, gzip, SSL will be added by certbot.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add PM2 ecosystem, deploy script, and nginx config"
```

---

### Task 13: Deploy to VPS

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
mkdir -p data
echo '[]' > data/subscribers.json
echo '[]' > data/inquiries.json
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

Visit https://architmittal.com — site loads, SSL valid, all pages work, lead forms submit.

**Step 8: Commit any deploy-related fixes**

---

### Task 14: Telegram Bot Setup

**Files:**
- Create: `bot/bot.js`
- Create: `bot/package.json`
- Create: `bot/ecosystem.config.js`

**Prerequisites from Archit:**
1. Create @ArchitBrandMachineBot via @BotFather on Telegram
2. Create "Archit Brand Machine" group on Telegram
3. Add the bot to the group
4. Get the chat ID (send a message in group, then check `https://api.telegram.org/bot<TOKEN>/getUpdates`)

**Step 1: Bot package.json**

```json
{
  "name": "archit-telegram-bot",
  "version": "1.0.0",
  "dependencies": {
    "node-telegram-bot-api": "^0.66.0",
    "dotenv": "^16.4.5"
  }
}
```

**Step 2: Bot code**

`bot/bot.js` — implements:

Commands:
- `/status` — check PM2 status of architmittal-website, show uptime
- `/deploy` — run deploy.sh, stream output to Telegram
- `/logs` — show last 20 lines of PM2 logs
- `/health` — HTTP GET to https://architmittal.com, report status code + response time
- `/leads` — read /data/inquiries.json, show last 5 entries
- `/subscribers` — read /data/subscribers.json, show count + last 3

Notification HTTP server on port 3003:
- `POST /notify` with `{ message: "..." }`
- Forwards message to TELEGRAM_CHAT_ID via bot.sendMessage()

EXECUTE_TASK handler:
- Listens for messages starting with "EXECUTE_TASK:" from Cowork
- Parses task type and executes (deploy, build, etc.)

```js
require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const { exec } = require('child_process')
const fs = require('fs')
const http = require('http')
const path = require('path')

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })
const CHAT_ID = process.env.TELEGRAM_CHAT_ID
const SITE_DIR = process.env.SITE_DIR || '/var/www/architmittal.com'
const PORT = parseInt(process.env.NOTIFICATION_PORT || '3003')

// /status command
bot.onText(/\/status/, (msg) => {
  exec('pm2 jlist', (err, stdout) => {
    if (err) return bot.sendMessage(msg.chat.id, '❌ Error getting status')
    try {
      const processes = JSON.parse(stdout)
      const site = processes.find(p => p.name === 'architmittal-website')
      if (site) {
        const uptime = Math.floor((Date.now() - site.pm2_env.pm_uptime) / 1000 / 60)
        bot.sendMessage(msg.chat.id,
          `📊 Status:\n• ${site.name}: ${site.pm2_env.status}\n• Uptime: ${uptime} minutes\n• Restarts: ${site.pm2_env.restart_time}\n• Memory: ${Math.round(site.monit.memory / 1024 / 1024)}MB`)
      } else {
        bot.sendMessage(msg.chat.id, '⚠️ architmittal-website not found in PM2')
      }
    } catch { bot.sendMessage(msg.chat.id, '❌ Error parsing PM2 output') }
  })
})

// /deploy command
bot.onText(/\/deploy/, (msg) => {
  bot.sendMessage(msg.chat.id, '🚀 Starting deploy...')
  exec(`cd ${SITE_DIR} && bash deploy.sh 2>&1`, { maxBuffer: 1024 * 1024 }, (err, stdout) => {
    if (err) {
      bot.sendMessage(msg.chat.id, `❌ Deploy failed:\n${stdout.slice(-500)}`)
    } else {
      bot.sendMessage(msg.chat.id, `✅ Deploy complete!\n${stdout.slice(-300)}`)
    }
  })
})

// /logs command
bot.onText(/\/logs/, (msg) => {
  exec('pm2 logs architmittal-website --lines 20 --nostream', (err, stdout) => {
    bot.sendMessage(msg.chat.id, `📋 Recent logs:\n\`\`\`\n${(stdout || 'No logs').slice(-3000)}\n\`\`\``, { parse_mode: 'Markdown' })
  })
})

// /health command
bot.onText(/\/health/, async (msg) => {
  try {
    const start = Date.now()
    const res = await fetch('https://architmittal.com')
    const ms = Date.now() - start
    bot.sendMessage(msg.chat.id, `🏥 Health: ${res.status === 200 ? '✅ UP' : '⚠️ ' + res.status}\n• Response: ${ms}ms`)
  } catch (e) {
    bot.sendMessage(msg.chat.id, `🏥 Health: ❌ DOWN\n• Error: ${e.message}`)
  }
})

// /leads command
bot.onText(/\/leads/, (msg) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(SITE_DIR, 'data/inquiries.json'), 'utf-8'))
    const recent = data.slice(-5).reverse()
    if (recent.length === 0) return bot.sendMessage(msg.chat.id, '📭 No inquiries yet')
    const text = recent.map(i => `• ${i.fullName} (${i.company}) — ${i.budget}\n  ${i.email}`).join('\n')
    bot.sendMessage(msg.chat.id, `📋 Recent inquiries (${data.length} total):\n${text}`)
  } catch { bot.sendMessage(msg.chat.id, '📭 No inquiries file found') }
})

// /subscribers command
bot.onText(/\/subscribers/, (msg) => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(SITE_DIR, 'data/subscribers.json'), 'utf-8'))
    const recent = data.slice(-3).reverse()
    const text = recent.map(s => `• ${s.name} — ${s.email}`).join('\n')
    bot.sendMessage(msg.chat.id, `📧 Subscribers: ${data.length} total\nRecent:\n${text || 'None'}`)
  } catch { bot.sendMessage(msg.chat.id, '📧 No subscribers file found') }
})

// Notification HTTP server
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/notify') {
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      try {
        const { message } = JSON.parse(body)
        bot.sendMessage(CHAT_ID, message)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ success: true }))
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid JSON' }))
      }
    })
  } else {
    res.writeHead(404)
    res.end('Not found')
  }
})

server.listen(PORT, () => console.log(`🔔 Notification server on port ${PORT}`))
console.log('🤖 @ArchitBrandMachineBot is running...')
```

**Step 3: Bot PM2 config**

```js
module.exports = {
  apps: [{
    name: 'archit-telegram-bot',
    script: 'bot.js',
    cwd: '/var/www/architmittal.com/bot',
    env: {
      TELEGRAM_BOT_TOKEN: '',  // Archit provides
      TELEGRAM_CHAT_ID: '',    // Archit provides
      SITE_DIR: '/var/www/architmittal.com',
      NOTIFICATION_PORT: 3003,
    },
    autorestart: true,
    max_memory_restart: '128M',
  }]
}
```

**Step 4: Deploy bot to VPS**

```bash
cd /var/www/architmittal.com/bot
npm install
# Create .env with tokens from Archit
pm2 start ecosystem.config.js
pm2 save
```

**Step 5: Test**

- Send `/status` in Telegram group → should get PM2 status
- Send `/health` → should get site health
- `curl -X POST http://localhost:3003/notify -H "Content-Type: application/json" -d '{"message":"test"}'` → should appear in Telegram group

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Telegram bot with deploy, status, health, and notification server"
```

---

### Task 15: STATUS.md + Final Push

**Files:**
- Create: `STATUS.md`

**Step 1: Create STATUS.md**

```markdown
# architmittal.com — Build Status

## Last Updated: March 20, 2026
## Current State: deployed

## What's Done:
- Homepage with all 9 sections (hero, social proof, services, stats, blog preview, email capture, about, CTA, footer)
- Blog system with MDX, TOC, author box (with Topmate link), share buttons, related posts, in-blog email CTA
- 4 seed blog articles published
- About (with "Work With Me"), Tools, Case Studies pages
- Contact page with detailed inquiry form (company, budget, source)
- Lead capture: email subscribe API (/api/subscribe) + contact form API (/api/contact)
- JSON file storage for subscribers and inquiries
- Floating "Book a Call" CTA on all pages → Topmate
- Header "Book a Call" button → Topmate
- Footer email subscribe form
- SEO: sitemap.xml, robots.txt, RSS feed, Schema.org (Person + Article), Open Graph, Twitter Cards
- Deployed to VPS with PM2 + Nginx + SSL on port 3002
- Telegram bot (@ArchitBrandMachineBot) with /status, /deploy, /health, /leads, /subscribers
- Notification server on port 3003 (receives lead alerts from website)

## What's In Progress:
- Nothing currently

## What's Next:
- Add real profile photo
- Add real testimonials to social proof section
- Write more blog articles
- Monitor SEO rankings
- Set up @CoworkStrategistBot for Cowork's machine

## Needs From Archit:
- Profile photo (save as /public/archit-photo.jpg)
- Review the 4 blog articles for accuracy
- Real testimonials for social proof section
- Telegram bot token + chat ID (if not provided yet)

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
