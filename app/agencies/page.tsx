import type { Metadata } from 'next'
import OfferPage, { type OfferPageData } from '@/components/OfferPage'

export const metadata: Metadata = {
  title: 'White-label AI automation builds for agencies',
  description:
    'Your client wants AI. We build it under your brand. $1,500 pilot: one automation, live in 7 days. Case studies, sample workflows and a free 15-minute call.',
  alternates: { canonical: 'https://architmittal.com/agencies' },
}

const ITR_CASE = {
  client: 'Accounting firm',
  title: '209 hours saved in one tax season',
  problem: '340 tax returns a season, each needing 38 minutes of manual data entry from client PDFs before an accountant could review it.',
  built: 'A script that reads every tax-form PDF (scans included), validates the numbers and pre-fills a review-ready sheet. Data work per return fell from 38 minutes to 6.',
  results: [['209 hrs', 'Saved in one season'], ['38 → 6 min', 'Data work per return']] as [string, string][],
  link: { href: '/blog/weekend-python-script-ca-firm-209-hours-itr', label: 'Read the full write-up' },
}

const DATA: OfferPageData = {
  eyebrow: 'For agencies · white-label · NDA',
  h1: ['Your client wants AI.', 'We build it under your brand.'],
  sub: 'A small dev team that builds AI agents and automations for agencies. Start with a $1,500 pilot: one automation, live in 7 days. You keep the client, the margin and the credit.',
  ctaNote: 'Free call, no deck. Bring one client request that is stuck waiting on a developer.',
  stats: [['7 days', 'From kickoff to live'], ['209 hrs', 'Saved for one firm in one season'], ['50 hrs/wk', 'Returned to one agency team'], ['85.9%', 'Biggest cost cut delivered']],
  offers: [
    { name: 'Pilot', price: '$1,500', line: 'One automation, live in 7 days.', points: ['Fixed price, fixed scope', 'Delivered under your brand', 'You own the code and the accounts'] },
    { name: 'Sprint', price: '$4,500', line: 'One full client workflow, live in 7 days. Two for $7,500.', points: ['White-label, NDA signed', '50% to start, 50% on delivery', 'Not live in 7 working days? We keep working free until it is'] },
    { name: 'Retainer', price: '$1,500–2,000/mo', line: 'After a sprint: maintenance plus one new automation a month.', points: ['Fixes and changes included', 'One new build every month', 'Cancel any month'] },
  ],
  buildsTitle: 'What we build',
  builds: [
    { t: 'Lead intake to booked call', d: 'Form or ad lead comes in, AI qualifies it, the CRM is updated and a call is booked. No human in the loop.' },
    { t: 'AI chat and voice agents', d: 'Answers inbound enquiries and missed calls, logs every conversation to the CRM, hands off when a human is needed.' },
    { t: 'Client reporting on autopilot', d: 'Ad and CRM numbers pulled, reconciled and written up into the report your client reads on Monday.' },
    { t: 'Proposals and onboarding docs', d: 'Generated from the discovery call notes, in your template, ready to send.' },
    { t: 'Inbox and support triage', d: 'Every email classified, routed and answered with a drafted reply for your team to approve.' },
    { t: 'Custom CRMs and internal tools', d: 'When the off-the-shelf tool does not fit, we build the system from scratch and connect it to what you already run.' },
  ],
  cases: [
    {
      client: 'Digital agency',
      title: '40+ workflows automated',
      problem: 'The team spent 60+ hours a week on data entry, report generation and client communications.',
      built: 'An automation suite covering CRM sync, invoice generation, weekly reporting and Slack notifications. All custom-built, zero per-task pricing.',
      results: [['40+', 'Workflows automated'], ['50 hrs/wk', 'Returned to the team']],
    },
    ITR_CASE,
    {
      client: 'Fintech startup',
      title: 'Client onboarding: 3 days to 3 hours',
      problem: 'Document verification, KYC checks and account setup were all done manually for every new client.',
      built: 'A multi-agent AI system: one agent extracts documents, one runs verification, one creates accounts and sends the welcome flow.',
      results: [['3 hrs', 'Onboarding (was 3 days)'], ['95%', 'Automation rate']],
    },
    {
      client: 'SaaS startup',
      title: 'AI API bill cut by 85.9%',
      problem: 'AI API spend was growing every month with no cost controls.',
      built: 'Smart caching, model tiering, request batching and prompt optimisation.',
      results: [['85.9%', 'Cost reduction'], ['3 days', 'To implement']],
    },
    {
      client: 'Private trading client',
      title: 'A bot the client fully owns',
      problem: 'Wanted a 24/7 trading bot without handing API keys or capital to a third-party platform.',
      built: 'A bot deployed on the client’s own server with a password-protected dashboard. He controls every setting.',
      results: [['24/7', 'On his own server'], ['100%', 'Client owns keys and code']],
    },
  ],
  samples: [
    'AI lead qualifier with auto-drafted reply',
    'AI web researcher for sales',
    'WhatsApp chatbot for text, voice, images and PDFs',
    'Meta ads analysis into Google Sheets',
    'Auto client brief analyzer',
    'Inbound email assistant with smart classification',
  ],
  steps: [
    ['15-minute call', 'You describe one client request. We tell you how we would build it and what it costs.'],
    ['Fixed scope, fixed price', 'One page: what gets built, what "live" means, the date. You approve it, we start.'],
    ['Live in 7 days', 'Built, tested and handed over under your brand, with a walkthrough for your team.'],
  ],
  faq: [
    { q: 'Do you work inside GoHighLevel or HubSpot?', a: 'We build the AI agents and automations as custom code or n8n workflows, then connect them to the CRM you already run through its API and webhooks. Your client keeps using the tool they know.' },
    { q: 'Will my client know you exist?', a: 'No. Everything ships under your brand, and we sign an NDA before the first call with your team if you want one.' },
    { q: 'What if it is not live in 7 days?', a: 'On a Sprint, if it is not live in 7 working days we keep working at no extra cost until it is.' },
    { q: 'Who owns the build?', a: 'You do. Code, workflows and accounts are handed over on delivery.' },
    { q: 'How do we start?', a: 'A 15-minute call. Bring one client request that is stuck. You leave with how we would build it and a fixed price.' },
  ],
  closing: ['One stuck client request.', 'Live in 7 days.'],
}

export default function AgenciesPage() {
  return <OfferPage d={DATA} />
}
