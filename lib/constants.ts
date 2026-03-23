export const TOPMATE_URL = 'https://topmate.io/automate_archit'
export const SITE_EMAIL = 'archit.akg13@gmail.com'
export const SITE_URL = 'https://architmittal.com'
export const SITE_NAME = 'Archit Mittal'
export const SITE_TAGLINE = 'I Automate Chaos'
export const SITE_DESCRIPTION = 'AI Automation Expert — Helping businesses save lakhs through intelligent automation with Claude Code, n8n & AI agents'
export const TELEGRAM_NOTIFY_URL = 'http://localhost:3003/notify'

export const SOCIAL_LINKS = [
  { name: 'LinkedIn', url: 'https://linkedin.com/in/automate-archit', followers: '9,500+', icon: 'linkedin' },
  { name: 'Twitter/X', url: 'https://x.com/automate_archit', followers: '50+', icon: 'twitter' },
  { name: 'Dev.to', url: 'https://dev.to/automate-archit', icon: 'devto' },
  { name: 'Hashnode', url: 'https://hashnode.com/@automate-archit', icon: 'hashnode' },
  { name: 'GitHub', url: 'https://github.com/archit-akg13', icon: 'github' },
  { name: 'Quora', url: 'https://quora.com/profile/Archit-Mittal-82', icon: 'quora' },
] as const

export const NAV_LINKS = [
  { name: 'Blog', href: '/blog' },
  { name: 'Tools', href: '/tools' },
  { name: 'About', href: '/about' },
  { name: 'Case Studies', href: '/case-studies' },
  { name: 'Contact', href: '/contact' },
] as const

export const SERVICES = [
  {
    title: 'AI Workflow Automation',
    description: 'End-to-end automation pipelines using n8n, Make, and custom scripts that save hours daily.',
    icon: '⚡',
  },
  {
    title: 'AI API Cost Optimization',
    description: 'Slash your LLM API bills by up to 97.5% with smart caching, model routing, and batching.',
    icon: '💰',
  },
  {
    title: 'No-Code/Low-Code Solutions',
    description: 'Build powerful automations without writing a single line of code. Ship faster, iterate faster.',
    icon: '🔧',
  },
  {
    title: 'Multi-Agent AI Systems',
    description: 'Orchestrate multiple AI agents working together using MCP protocol and Claude Code.',
    icon: '🤖',
  },
] as const

export const STATS = [
  { value: '₹85K/mo', label: 'Saved on AI API costs' },
  { value: '40+', label: 'Automation workflows built' },
  { value: '9,500+', label: 'LinkedIn followers' },
  { value: '97.5%', label: 'Cost reduction achieved' },
] as const

export const RESULTS_TICKER = [
  '₹85K/month saved on AI API costs',
  '97.5% cost reduction achieved',
  '40+ automation workflows built',
  '9,500+ LinkedIn followers and growing',
] as const

export const BUDGET_OPTIONS = [
  '₹10K - ₹25K',
  '₹25K - ₹50K',
  '₹50K - ₹1L',
  '₹1L+',
  'Not sure yet',
] as const

export const SOURCE_OPTIONS = [
  'LinkedIn',
  'Twitter',
  'Google Search',
  'Blog article',
  'Referral',
  'Other',
] as const

export const FAQ_ITEMS = [
  {
    question: 'What kind of automation do you build?',
    answer: 'I build AI workflow automation, API cost optimization systems, no-code/low-code solutions, and multi-agent AI systems using tools like Claude Code, n8n, and MCP protocol.',
  },
  {
    question: 'How much can I save with AI API cost optimization?',
    answer: 'Most clients see 50-97.5% reduction in AI API costs. My best case achieved a 97.5% reduction — from ₹95K/month to ₹10K/month — using semantic caching, model switching, and smart batching.',
  },
  {
    question: 'What is your consultation process?',
    answer: 'Book a free 30-minute consultation via Topmate. We discuss your current workflows, identify automation opportunities, and I provide a cost-benefit analysis with specific recommendations.',
  },
  {
    question: 'Do you work with businesses outside India?',
    answer: 'Yes, I work with businesses globally. All consultations are conducted online, and automation systems are deployed remotely.',
  },
  {
    question: 'What is MCP Protocol?',
    answer: 'MCP (Model Context Protocol) is a standardized way for AI agents to connect to external tools, databases, and APIs. Think of it as USB for AI — one standard protocol that connects everything.',
  },
] as const
