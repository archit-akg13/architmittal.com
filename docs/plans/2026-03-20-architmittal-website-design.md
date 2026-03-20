# architmittal.com — Design Document

## Last Updated: March 20, 2026

## Overview

Personal brand website for Archit Mittal — "The Automation Expert" / "I Automate Chaos". Central hub tying together LinkedIn, Twitter/X, Dev.to, Hashnode, GitHub, and Quora presence. Optimized for Google SEO and AI search engine citations (ChatGPT, Perplexity, Google AI Overviews).

Includes a multi-layer lead capture system (Topmate booking, email capture, contact form), social proof elements, and a Telegram bot system for 3-way communication between Claude Code, Cowork, and Archit.

---

## Deviations From Original Spec

These are the differences between the original `claude-code-prompt.md` and what we're actually building. Everything not listed here follows the original spec exactly.

| Item | Original Spec | Actual Implementation | Reason |
|------|--------------|----------------------|--------|
| **Port** | 3000 | **3002** | Port 3000 is taken by `analytics-dashboard`, port 3001 by `social.architmittal.com` (crypto hub) |
| **Telegram bot notification port** | 3001 (in telegram spec) | **3003** | Port 3001 is taken by `social.architmittal.com` |
| **Nginx config** | `/etc/nginx/sites-available/architmittal.com` | New file at same path — no conflict since old config was renamed to `architmittal.conf` (serves `social.architmittal.com`) |
| **DNS** | "A record already pointing to VPS" | **A record was deleted** to free domain; will **re-add** `architmittal.com` → `103.216.146.213` during deploy |
| **GitHub repo** | `architmittal.com` (public) | Same — separate from `archit-mittal-universe` (private, crypto hub) |
| **PM2 name** | `architmittal` | `architmittal-website` | Avoid conflict with crypto hub's pm2 process |
| **PM2 port** | `PORT: 3000` | `PORT: 3002` | Port 3000 occupied |
| **Nginx static alias** | `/var/www/architmittal.com/.next/static` | `/var/www/architmittal.com/.next/standalone/.next/static` | Standalone output nests differently |
| **VPS deploy path** | `/var/www/architmittal.com` | Same path, fresh clone |
| **Contact page** | Simple form / Calendly embed | **Detailed inquiry form** with company, budget, source fields + JSON storage | Lead capture addon spec |
| **Booking tool** | Calendly (unspecified) | **Topmate** (https://topmate.io/automate_archit) | Lead capture addon spec |

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
  ├── archit-telegram-bot (port 3003 notification server) ← NEW
  ├── architmittal (port 3001) — crypto social hub
  └── analytics-dashboard (port 3000)

  Telegram Bots:
  ├── @ArchitBrandMachineBot  — VPS bot (deploy, status, health, leads)
  └── @CoworkStrategistBot    — Cowork's bot (periodic checks, cross-post triggers)

  Data Storage (JSON files, no database):
  ├── /var/www/architmittal.com/data/subscribers.json  — email list
  └── /var/www/architmittal.com/data/inquiries.json    — contact form submissions
```

## Tech Stack

- **Framework:** Next.js 14+ (App Router) with `output: 'standalone'`
- **Styling:** Tailwind CSS
- **Blog:** MDX files in `/content/blog/`
- **Fonts:** Poppins (headings) + Lato (body) via Google Fonts
- **Data storage:** JSON files in `/data/` (subscribers, inquiries) — no database
- **Process manager:** PM2 (website + telegram bot)
- **Reverse proxy:** Nginx with SSL (Let's Encrypt)
- **Telegram:** node-telegram-bot-api for VPS bot

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

## Constants (`lib/constants.ts`)

```typescript
export const TOPMATE_URL = 'https://topmate.io/automate_archit'
export const SITE_EMAIL = 'archit.akg13@gmail.com'
export const TELEGRAM_NOTIFY_URL = 'http://localhost:3003/notify' // internal VPS only
```

## Site Structure

```
architmittal.com/
├── /                  Homepage (9 sections — added email capture)
├── /blog              Blog listing (paginated)
├── /blog/[slug]       Individual article (Schema.org Article)
├── /tools             GitHub repos + automation templates
├── /about             Bio + credentials + "Work With Me" section
├── /case-studies      Client ROI stories
├── /contact           Detailed inquiry form (company, budget, source)
├── /api/subscribe     POST — email capture (name + email → JSON + Telegram)
├── /api/contact       POST — inquiry form (full data → JSON + Telegram)
├── /sitemap.xml       Auto-generated
├── /robots.txt        Allow all crawlers
└── /feed.xml          RSS feed (Dev.to auto-import)
```

## Homepage Sections (in order)

1. **Hero** (dark bg) — "I Automate Chaos" + subtitle + 2 CTAs: "Book a Free Consultation" (→ Topmate) + "Read the Blog"
2. **Social Proof Bar** — Platform icons with follower counts + client results ticker ("₹85K/month saved" | "97.5% cost reduction" | "40+ workflows")
3. **What I Do** — 4 service cards (AI Workflows, API Cost Optimization, No-Code, Multi-Agent)
4. **Results/Stats** (dark bg) — ₹85K/month, 40+, 9400+, 97.5%
5. **Latest Blog Posts** — 3 most recent, card layout
6. **Email Capture Section** — "Join 500+ business leaders getting weekly automation insights" (name + email form)
7. **About Snippet** — Photo placeholder + short bio
8. **CTA Section** (LIME bg) — "Ready to automate your chaos?" → Topmate link
9. **Footer** — Social links, quick links, email subscribe field, copyright

## Lead Capture System

### Layer 1: Topmate Booking (Primary CTA — Everywhere)

URL: https://topmate.io/automate_archit

Placement:
- **Hero:** "Book a Free Consultation" button
- **CTA section:** "Ready to automate your chaos?" → Topmate
- **Header nav:** "Book a Call" button (LIME green, stands out)
- **Sticky floating button** (bottom-right): "Book a Call →" — visible on all pages, disappears on scroll-up, appears on scroll-down
- **Blog author box:** "Book a 1:1 with Archit" → Topmate
- **About page:** "Work With Me" section → Topmate
- **Contact page:** Link prominently

### Layer 2: Email Capture (Build Email List)

Form fields: name + email (minimal friction)

Placement:
- **Homepage section** (between Latest Posts and About): "Join 500+ business leaders getting weekly automation insights"
- **Blog posts** (after first 3 paragraphs): "Get my free Automation ROI Calculator"
- **Footer:** Simple email subscribe field

API: `POST /api/subscribe` → validates email → appends to `/data/subscribers.json` → sends Telegram notification

### Layer 3: Contact Form (Serious Inquiries)

On `/contact` page with detailed fields:
- Full Name (required)
- Company Name (required)
- Email (required)
- Phone (optional)
- What do you want to automate? (textarea, required)
- Estimated monthly budget: ₹10K-₹25K / ₹25K-₹50K / ₹50K-₹1L / ₹1L+ / Not sure yet
- How did you find me?: LinkedIn / Twitter / Google Search / Blog article / Referral / Other

API: `POST /api/contact` → validates required fields → saves to `/data/inquiries.json` → sends Telegram notification → shows thank-you message with Topmate link for urgent requests

### Layer 4: Social Proof & Trust Signals

- **Client results ticker/marquee** on homepage: "₹85K/month saved on AI API costs" | "97.5% cost reduction" | "40+ workflows built"
- **LinkedIn follower count badge** (9,400+ followers)
- **Testimonials section** (placeholder structure — Archit will add real testimonials later)

### Layer 5: Blog as Lead Funnel

Every blog post ends with:
1. **Author box** — Photo, name, bio, "Book a 1:1" Topmate link
2. **Related posts** — Keep visitors on site
3. **Email capture CTA** — "Get weekly automation insights"
4. **Share buttons** — LinkedIn, Twitter, Copy link

## Telegram Bot System

### Purpose

Real-time notifications and remote management. Two bots in a shared Telegram group "Archit Brand Machine":

### @ArchitBrandMachineBot (VPS, 24/7)

Commands:
- `/status` — Show site health (PM2 status, uptime, last deploy)
- `/deploy` — Pull latest code, build, restart PM2
- `/logs` — Show last 20 PM2 log lines
- `/health` — HTTP health check on architmittal.com
- `/leads` — Show recent contact form inquiries
- `/subscribers` — Show subscriber count + latest

Also handles `EXECUTE_TASK` messages from Cowork (feature requests, blog deployment triggers).

### @CoworkStrategistBot (Cowork's machine)

Periodic checks, cross-post triggers, strategy updates. Reads STATUS.md from GitHub repo.

### Notification Server

HTTP server on port **3003** (not 3001 — port conflict with crypto hub):
- `POST /notify` with `{ message: "..." }` body
- Forwards messages to Telegram group via bot API
- Called by website API routes when new subscriber or inquiry comes in

### Environment Variables (`.env` on VPS)

```
TELEGRAM_BOT_TOKEN=<from @BotFather>
TELEGRAM_CHAT_ID=<group chat ID>
SITE_DIR=/var/www/architmittal.com
NOTIFICATION_PORT=3003
```

## New Components Summary

| Component | Purpose |
|-----------|---------|
| `FloatingCTA.tsx` | Sticky "Book a Call" button, bottom-right, LIME green, scroll-aware |
| `EmailCapture.tsx` | Reusable email capture form (name + email), used in homepage + blog + footer |
| `ContactForm.tsx` | Detailed inquiry form with company/budget/source fields |
| `SocialProof.tsx` | Client results ticker/marquee + trust signals |
| `AuthorBox.tsx` | Blog author box with Topmate link (already in plan, updated) |

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
- Features: reading time, table of contents, author box (with Topmate link), share buttons (LinkedIn, Twitter, Copy), related posts, email capture CTA, code syntax highlighting, prev/next navigation
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
                    ┌────────────┴────────────┐
                    │  GitHub Repo             │
                    │  architmittal.com        │
                    │  + STATUS.md             │
                    │                          │
                    │  Telegram Group           │
                    │  "Archit Brand Machine"  │
                    │  @ArchitBrandMachineBot  │
                    │  @CoworkStrategistBot    │
                    └─────────────────────────┘
```

- `STATUS.md` in repo root updated after every session
- Blog articles flagged as "ready for cross-post" in STATUS.md
- Cowork reads from repo and cross-posts to Dev.to + Hashnode with canonical URLs
- Telegram group provides real-time notifications (new leads, deploy status, errors)
- Cowork can send EXECUTE_TASK messages to trigger builds/deploys

## Deployment Checklist

### Website
1. Build locally, push to `archit-akg13/architmittal.com` (public)
2. Clone on VPS at `/var/www/architmittal.com`
3. `npm ci && npm run build`
4. Copy public + static into standalone output
5. Create `/data/` directory with empty JSON files (subscribers.json, inquiries.json)
6. PM2 start on port 3002 as `architmittal-website`
7. Add Nginx config for `architmittal.com` → `localhost:3002`
8. Re-add DNS A record for `architmittal.com` → `103.216.146.213`
9. Certbot SSL for `architmittal.com`
10. Verify with Lighthouse (target: 95+ all metrics)

### Telegram Bot
11. Create @ArchitBrandMachineBot via @BotFather
12. Create Telegram group "Archit Brand Machine"
13. Add bot to group, get chat ID
14. Deploy bot.js to VPS at `/var/www/architmittal.com/bot/`
15. Create `.env` with TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, SITE_DIR, NOTIFICATION_PORT=3003
16. PM2 start bot as `archit-telegram-bot`
17. Test /status, /health, /leads commands
18. Test notification server (POST to :3003/notify)

## What Archit Needs To Provide

- Profile photo (`/public/archit-photo.jpg`)
- Telegram bot token (create @ArchitBrandMachineBot via @BotFather)
- Telegram group chat ID (after creating "Archit Brand Machine" group)
- Any corrections to bio/stats/service descriptions
- Review + approve blog articles before cross-posting
- Real testimonials for social proof section (placeholder for now)
