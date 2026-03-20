# architmittal.com — Design Document

## Last Updated: March 20, 2026

## Overview

Personal brand website for Archit Mittal — "The Automation Expert" / "I Automate Chaos". Central hub tying together LinkedIn, Twitter/X, Dev.to, Hashnode, GitHub, and Quora presence. Optimized for Google SEO and AI search engine citations (ChatGPT, Perplexity, Google AI Overviews).

---

## Deviations From Original Spec

These are the differences between the original `claude-code-prompt.md` and what we're actually building. Everything not listed here follows the original spec exactly.

| Item | Original Spec | Actual Implementation | Reason |
|------|--------------|----------------------|--------|
| **Port** | 3000 | **3002** | Port 3000 is taken by `analytics-dashboard`, port 3001 by `social.architmittal.com` (crypto hub) |
| **Nginx config** | `/etc/nginx/sites-available/architmittal.com` | New file at same path — no conflict since old config was renamed to `architmittal.conf` (serves `social.architmittal.com`) |
| **DNS** | "A record already pointing to VPS" | **A record was deleted** to free domain; will **re-add** `architmittal.com` → `103.216.146.213` during deploy |
| **GitHub repo** | `architmittal.com` (public) | Same — separate from `archit-mittal-universe` (private, crypto hub) |
| **PM2 name** | `architmittal` | `architmittal-website` | Avoid conflict with crypto hub's pm2 process |
| **PM2 port** | `PORT: 3000` | `PORT: 3002` | Port 3000 occupied |
| **Nginx static alias** | `/var/www/architmittal.com/.next/static` | `/var/www/architmittal.com/.next/standalone/.next/static` | Standalone output nests differently |
| **VPS deploy path** | `/var/www/architmittal.com` | Same path, fresh clone |

---

## Architecture

```
VPS (103.216.146.213)

  Nginx (port 80/443)
  ├── architmittal.com        → localhost:3002 (THIS PROJECT)
  ├── social.architmittal.com → localhost:3001 (crypto social hub)
  └── [analytics-dashboard]   → localhost:3000

  PM2 Processes:
  ├── architmittal-website (port 3002) ← NEW
  ├── architmittal (port 3001) — crypto social hub
  └── analytics-dashboard (port 3000)
```

## Tech Stack

- **Framework:** Next.js 14+ (App Router) with `output: 'standalone'`
- **Styling:** Tailwind CSS
- **Blog:** MDX files in `/content/blog/`
- **Fonts:** Poppins (headings) + Lato (body) via Google Fonts
- **No database** — fully static/SSG
- **Process manager:** PM2
- **Reverse proxy:** Nginx with SSL (Let's Encrypt)

## Brand Design System

| Token | Value |
|-------|-------|
| Primary accent | LIME Green `#4CAF1E` |
| Background | White `#FFFFFF` |
| Dark sections | `#0A0A0A` |
| Heading text | `#1E1E1E` |
| Body text | `#646464` |
| Subtle elements | `#AAAAAA` |
| Heading font | Poppins (bold/medium) |
| Body font | Lato (regular/light) |
| Tagline | "I Automate Chaos" |

## Site Structure

```
architmittal.com/
├── /                  Homepage (8 sections)
├── /blog              Blog listing (paginated)
├── /blog/[slug]       Individual article (Schema.org Article)
├── /tools             GitHub repos + automation templates
├── /about             Bio + credentials + journey
├── /case-studies      Client ROI stories
├── /contact           Booking form / Calendly embed
├── /sitemap.xml       Auto-generated
├── /robots.txt        Allow all crawlers
└── /feed.xml          RSS feed (Dev.to auto-import)
```

## Homepage Sections (in order)

1. **Hero** (dark bg) — "I Automate Chaos" + subtitle + 2 CTAs
2. **Social Proof Bar** — Platform icons with follower counts
3. **What I Do** — 4 service cards (AI Workflows, API Cost Optimization, No-Code, Multi-Agent)
4. **Results/Stats** (dark bg) — ₹85K/month, 40+, 9400+, 97.5%
5. **Latest Blog Posts** — 3 most recent, card layout
6. **About Snippet** — Photo placeholder + short bio
7. **CTA Section** (LIME bg) — "Ready to automate your chaos?"
8. **Footer** — Social links, quick links, copyright

## SEO Requirements

Every page gets:
- Unique `<title>` (50-60 chars) + meta description (150-160 chars)
- Open Graph tags (title, description, image, url, type)
- Twitter Card tags
- Canonical URL
- Schema.org structured data (Person on homepage, Article on blog posts)
- Proper heading hierarchy (H1 → H2 → H3)

Additional:
- Auto-generated `/sitemap.xml` with all pages + blog posts
- `/robots.txt` allowing all crawlers
- `/feed.xml` RSS feed with `<link rel="alternate">` in head
- Breadcrumb Schema.org on blog posts
- Next/Previous navigation on blog posts

## Blog System

- MDX files in `/content/blog/` with YAML frontmatter
- Features: reading time, table of contents, author box, share buttons (LinkedIn, Twitter, Copy), related posts, code syntax highlighting, prev/next navigation
- 4 seed articles:
  1. "How I Saved a Client ₹85K/Month on AI API Costs"
  2. "n8n vs Zapier: Why I Switched and Saved ₹12K/Year"
  3. "What is MCP Protocol? The USB Port for AI Agents"
  4. "Claude Code Changed How I Work — An Honest Developer Review"

## 3-Way Communication

```
COWORK (Browser Auto)     CLAUDE CODE (Site Dev)     ARCHIT (Phone/Laptop)
├── Cross-post blogs      ├── Build site             ├── Approvals
├── LinkedIn/Twitter      ├── Blog posts             ├── Strategy
└── Quora answers         └── SEO optimize           └── Recording
       │                         │                         │
       └─────────────────────────┴─────────────────────────┘
                                 │
                        ┌────────┴────────┐
                        │  GitHub Repo     │
                        │  architmittal.com│
                        │  + STATUS.md     │
                        └─────────────────┘
```

- `STATUS.md` in repo root updated after every session
- Blog articles flagged as "ready for cross-post" in STATUS.md
- Cowork reads from repo and cross-posts to Dev.to + Hashnode with canonical URLs

## Deployment Checklist

1. Build locally, push to `archit-akg13/architmittal.com` (public)
2. Clone on VPS at `/var/www/architmittal.com`
3. `npm ci && npm run build`
4. Copy public + static into standalone output
5. PM2 start on port 3002 as `architmittal-website`
6. Add Nginx config for `architmittal.com` → `localhost:3002`
7. Re-add DNS A record for `architmittal.com` → `103.216.146.213`
8. Certbot SSL for `architmittal.com`
9. Verify with Lighthouse (target: 95+ all metrics)

## What Archit Needs To Provide (Later)

- Profile photo (`/public/archit-photo.jpg`)
- Calendly link (or preferred booking tool) for /contact
- Any corrections to bio/stats/service descriptions
- Review + approve blog articles before cross-posting
