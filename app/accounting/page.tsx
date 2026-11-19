import type { Metadata } from 'next'
import OfferPage, { type OfferPageData } from '@/components/OfferPage'

export const metadata: Metadata = {
  title: 'Tax-season automation for accounting firms',
  description:
    'One accounting firm saved 209 hours in a single tax season. $1,500 pilot: one intake automation, first working version in 7 days, ready before the season starts.',
  alternates: { canonical: 'https://architmittal.com/accounting' },
}

const DATA: OfferPageData = {
  eyebrow: 'For accounting, tax and bookkeeping firms',
  h1: ['Tax season without', 'the data-entry marathon.'],
  sub: 'One firm we built for got 209 hours back in a single season: data work per return went from 38 minutes to 6. Start with a $1,500 pilot, first working version in 7 days, ready before your busy season starts.',
  ctaNote: 'Free call, no deck. Bring the one task your team dreads every season.',
  stats: [['209 hrs', 'Saved in one tax season'], ['38 → 6 min', 'Data work per return'], ['340', 'Returns processed that season'], ['7 days', 'To a first working version']],
  offers: [
    { name: 'Pilot', price: '$1,500', line: 'One intake automation. First working version in 7 days.', points: ['Fixed price, fixed scope', 'Tested side by side against your manual process first', 'You own the code'] },
    { name: 'Sprint', price: 'From $4,500', line: 'One full workflow end to end, scoped and priced on the call.', points: ['NDA signed before we see a document', '50% to start, 50% on delivery', 'No working version in 7 days? You do not pay the second half'] },
    { name: 'Retainer', price: 'Monthly', line: 'After the first build: maintenance plus one new automation a month. Quoted once we have worked together.', points: ['New form layouts and rule changes handled', 'One new build every month', 'Cancel any month'] },
  ],
  buildsTitle: 'What we build for firms',
  builds: [
    { t: 'Tax document intake', d: 'Client PDFs and scans are read, the numbers extracted and checked, and a review-ready sheet is pre-filled for your preparer.' },
    { t: 'Automatic validation', d: 'Totals cross-checked and ID numbers verified on every document. Anything that does not add up is flagged for a person, never passed through silently.' },
    { t: 'Document chasing', d: 'Clients are reminded for missing documents on a schedule until the file is complete, and you see who is still outstanding.' },
    { t: 'Bank statement processing', d: 'Statements read and transactions categorised, ready for your bookkeeper to review.' },
    { t: 'Client onboarding', d: 'Engagement letters and onboarding documents generated from the intake form, in your template.' },
    { t: 'Inbox triage', d: 'Client emails sorted and routed, with a drafted reply waiting for your team to approve.' },
  ],
  cases: [
    {
      client: 'Accounting firm, 340 individual returns a season',
      title: '209 hours saved in one tax season',
      problem: 'Every season the firm hired three temporary data-entry staff for two months. Each return needed 38 minutes of typing from client PDFs before an accountant could look at it, and a senior accountant spent 40+ more hours fixing entry mistakes.',
      built: 'A script that reads every tax-form PDF, including scans and phone photos, validates ID numbers and salary totals, and pre-fills a sheet mapped to the return. Before go-live we ran it side by side with the staff on 50 returns: it matched on 47 and was more accurate on the other 3. It handled 92% of returns automatically and flagged the rest for manual processing.',
      results: [['209 hrs', 'Saved in one season'], ['38 → 6 min', 'Data work per return'], ['3', 'Seasonal hires no longer needed']],
      link: { href: '/blog/weekend-python-script-ca-firm-209-hours-itr', label: 'Read the full write-up' },
    },
    {
      client: 'Fintech startup',
      title: 'Client onboarding: 3 days to 3 hours',
      problem: 'Document verification, KYC checks and account setup were all done manually for every new client.',
      built: 'A multi-agent AI system: one agent extracts documents, one runs verification, one creates accounts and sends the welcome flow.',
      results: [['3 hrs', 'Onboarding (was 3 days)'], ['95%', 'Automation rate']],
    },
    {
      client: 'Digital agency',
      title: '40+ workflows automated',
      problem: 'The team spent 60+ hours a week on data entry, report generation and client communications.',
      built: 'An automation suite covering CRM sync, invoice generation, weekly reporting and Slack notifications.',
      results: [['40+', 'Workflows automated'], ['50 hrs/wk', 'Returned to the team']],
    },
  ],
  samples: [
    'Analyze invoices from Google Drive into structured data',
    'AI contract summary bot',
    'Inbound email assistant with smart classification',
    'AI email reply assistant with approval step',
    'Advanced document parsing and text extraction',
    'Auto client brief analyzer',
  ],
  steps: [
    ['15-minute call', 'You describe the task that eats your season. We tell you how we would automate it and what it costs.'],
    ['Side-by-side test', 'We run the automation next to your manual process on real files, and compare the outputs line by line.'],
    ['Working version in 7 days', 'You see it running on real files within a week, then it is handed over with a walkthrough for your team. Your accountants still review and sign every return.'],
  ],
  faq: [
    { q: 'Where does our client data go?', a: 'Nowhere new. The build runs on your own machines or your own cloud account, and we sign an NDA before we see a single document.' },
    { q: 'Does it replace our accountants or our tax software?', a: 'No. It removes the typing. Your preparers review every return, apply their judgment and file with the software you already use.' },
    { q: 'How do we know the numbers are right?', a: 'We test it side by side with your current process before it goes live, and anything that fails a check is flagged for a person.' },
    { q: 'The case study is from India. Does it apply to us?', a: 'The firm was in India and the documents were Indian salary tax forms. The work is the same anywhere: reading client tax documents, checking them and pre-filling the return. We build it around your forms and your process.' },
    { q: 'Can it be ready before our busy season?', a: 'A pilot has a first working version in 7 days from kickoff. Starting now leaves time to test it on last year’s files first.' },
  ],
  closing: ['One dreaded task.', 'Gone before the season starts.'],
}

export default function AccountingPage() {
  return <OfferPage d={DATA} />
}
