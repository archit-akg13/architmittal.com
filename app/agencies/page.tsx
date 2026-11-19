import type { Metadata } from 'next'
import Link from 'next/link'
import { AGENCY_CALL_URL as CALL_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'White-label AI automation builds for agencies',
  description:
    'Your client wants AI. We build it under your brand. $1,500 pilot: one automation, live in 7 days. Case studies, sample workflows and a free 15-minute call.',
  alternates: { canonical: 'https://architmittal.com/agencies' },
}

// Add { title, url } entries (Loom / YouTube embed URLs) and the section appears.
const DEMOS: { title: string; url: string }[] = []

const OFFERS = [
  {
    name: 'Pilot',
    price: '$1,500',
    line: 'One automation, live in 7 days.',
    points: ['Fixed price, fixed scope', 'Delivered under your brand', 'You own the code and the accounts'],
  },
  {
    name: 'Sprint',
    price: '$4,500',
    line: 'One full client workflow, live in 7 days. Two for $7,500.',
    points: ['White-label, NDA signed', '50% to start, 50% on delivery', 'Not live in 7 working days? We keep working free until it is'],
  },
  {
    name: 'Retainer',
    price: '$1,500–2,000/mo',
    line: 'After a sprint: maintenance plus one new automation a month.',
    points: ['Fixes and changes included', 'One new build every month', 'Cancel any month'],
  },
]

const BUILDS = [
  { t: 'Lead intake to booked call', d: 'Form or ad lead comes in, AI qualifies it, the CRM is updated and a call is booked. No human in the loop.' },
  { t: 'AI chat and voice agents', d: 'Answers inbound enquiries and missed calls, logs every conversation to the CRM, hands off when a human is needed.' },
  { t: 'Client reporting on autopilot', d: 'Ad and CRM numbers pulled, reconciled and written up into the report your client reads on Monday.' },
  { t: 'Proposals and onboarding docs', d: 'Generated from the discovery call notes, in your template, ready to send.' },
  { t: 'Inbox and support triage', d: 'Every email classified, routed and answered with a drafted reply for your team to approve.' },
  { t: 'Custom CRMs and internal tools', d: 'When the off-the-shelf tool does not fit, we build the system from scratch and connect it to what you already run.' },
]

const CASES = [
  {
    client: 'Digital agency',
    title: '40+ workflows automated',
    problem: 'The team spent 60+ hours a week on data entry, report generation and client communications.',
    built: 'An automation suite covering CRM sync, invoice generation, weekly reporting and Slack notifications. All custom-built, zero per-task pricing.',
    results: [['40+', 'Workflows automated'], ['50 hrs/wk', 'Returned to the team']],
  },
  {
    client: 'Accounting firm',
    title: '209 hours saved in one tax season',
    problem: 'Client intake and tax-return preparation were handled by hand, document by document.',
    built: 'An intake automation that collects client documents, extracts the data and prepares the return for review.',
    results: [['209 hrs', 'Saved in one season']],
  },
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
]

const SAMPLES = [
  'AI lead qualifier with auto-drafted reply',
  'AI web researcher for sales',
  'WhatsApp chatbot for text, voice, images and PDFs',
  'Meta ads analysis into Google Sheets',
  'Auto client brief analyzer',
  'Inbound email assistant with smart classification',
]

const FAQ = [
  { q: 'Do you work inside GoHighLevel or HubSpot?', a: 'We build the AI agents and automations as custom code or n8n workflows, then connect them to the CRM you already run through its API and webhooks. Your client keeps using the tool they know.' },
  { q: 'Will my client know you exist?', a: 'No. Everything ships under your brand, and we sign an NDA before the first call with your team if you want one.' },
  { q: 'What if it is not live in 7 days?', a: 'On a Sprint, if it is not live in 7 working days we keep working at no extra cost until it is.' },
  { q: 'Who owns the build?', a: 'You do. Code, workflows and accounts are handed over on delivery.' },
  { q: 'How do we start?', a: 'A 15-minute call. Bring one client request that is stuck. You leave with how we would build it and a fixed price.' },
]

const btn =
  'inline-flex h-14 items-center rounded-md bg-[--red] px-8 font-body text-base font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--gold]'

export default function AgenciesPage() {
  return (
    <main className="bg-[--paper] text-[--ink]">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="eyebrow">For agencies · white-label · NDA</p>
        <h1 className="display mt-3 text-[--ink] text-[clamp(2.4rem,7vw,5.5rem)]">
          Your client wants AI.<br /><span className="text-[--red]">We build it under your brand.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[--ink-dim]">
          A small dev team that builds AI agents and automations for agencies. Start with a $1,500 pilot: one automation, live in 7 days. You keep the client, the margin and the credit.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href={CALL_URL} className={btn}>Book a free 15-min call →</a>
          <a href="#work" className="inline-flex h-14 items-center rounded-md border-2 border-[--ink]/30 px-8 font-body text-base font-semibold text-[--ink] transition-colors duration-150 hover:border-[--ink] hover:bg-[--ink] hover:text-[--paper]">
            See the builds
          </a>
        </div>
        <p className="mt-4 text-sm text-[--ink]/55">Free call, no deck. Bring one client request that is stuck waiting on a developer.</p>

        <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[['7 days', 'From kickoff to live'], ['209 hrs', 'Saved for one firm in one season'], ['50 hrs/wk', 'Returned to one agency team'], ['85.9%', 'Biggest cost cut delivered']].map(([v, l]) => (
            <div key={l} className="dcard p-5">
              <div className="display tnum text-3xl text-[--red]">{v}</div>
              <div className="mt-1 text-sm text-[--ink-dim]">{l}</div>
            </div>
          ))}
        </div>

        <h2 className="eyebrow mt-20">Pricing</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {OFFERS.map((o) => (
            <div key={o.name} className="dcard flex flex-col p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[--ink]/50">{o.name}</p>
              <div className="display tnum mt-2 text-4xl text-[--red]">{o.price}</div>
              <p className="mt-3 text-[15px] leading-relaxed text-[--ink]">{o.line}</p>
              <ul className="mt-5 space-y-2 text-[15px] text-[--ink-dim]">
                {o.points.map((p) => (
                  <li key={p} className="flex gap-2"><span aria-hidden className="text-[--red]">→</span>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="eyebrow mt-20">What we build</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {BUILDS.map((b) => (
            <div key={b.t} className="dcard p-6">
              <h3 className="font-body text-lg font-semibold text-[--ink]">{b.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[--ink-dim]">{b.d}</p>
            </div>
          ))}
        </div>

        {DEMOS.length > 0 && (
          <>
            <h2 className="eyebrow mt-20">Watch a build</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {DEMOS.map((d) => (
                <figure key={d.url} className="dcard overflow-hidden">
                  <div className="aspect-video">
                    <iframe src={d.url} title={d.title} loading="lazy" allowFullScreen className="h-full w-full" />
                  </div>
                  <figcaption className="p-4 text-sm font-semibold">{d.title}</figcaption>
                </figure>
              ))}
            </div>
          </>
        )}

        <h2 id="work" className="eyebrow mt-20 scroll-mt-24">Case studies</h2>
        <p className="mt-3 max-w-xl text-[--ink-dim]">Real projects. Every figure was measured after delivery, not projected before it.</p>
        <div className="mt-6 space-y-8">
          {CASES.map((cs, i) => (
            <article key={cs.title} className="dcard overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <div className="p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[--ink]/50">
                    <span className="display mr-3 text-base text-[--ink]/30">0{i + 1}</span>{cs.client}
                  </p>
                  <h3 className="display mt-3 text-[--ink] text-[clamp(1.5rem,3vw,2.2rem)]">{cs.title}</h3>
                  <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-[--red]">The problem</p>
                  <p className="mt-2 leading-relaxed text-[--ink-dim]">{cs.problem}</p>
                  <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-[--gold]">What we built</p>
                  <p className="mt-2 leading-relaxed text-[--ink-dim]">{cs.built}</p>
                </div>
                <div className="flex flex-col justify-center gap-7 border-t border-[--ink]/10 bg-[--paper3] p-8 md:border-l md:border-t-0">
                  {cs.results.map(([m, l]) => (
                    <div key={l}>
                      <div className="display tnum text-4xl text-[--red]">{m}</div>
                      <div className="mt-1 text-sm text-[--ink-dim]">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-[--ink]/55">More, including trading systems: <Link href="/case-studies" className="underline underline-offset-2 hover:text-[--red]">all case studies</Link></p>

        <h2 className="eyebrow mt-20">Free samples</h2>
        <div className="dcard mt-6 p-7">
          <p className="text-[17px] leading-relaxed text-[--ink]">
            140 ready-to-import n8n workflows, free. Open one and judge the quality of the work before you talk to us.
          </p>
          <ul className="mt-5 grid grid-cols-1 gap-2 text-[15px] text-[--ink-dim] md:grid-cols-2">
            {SAMPLES.map((s) => (
              <li key={s} className="flex gap-2"><span aria-hidden className="text-[--red]">→</span>{s}</li>
            ))}
          </ul>
          <Link href="/packs" className="mt-6 inline-block font-semibold underline underline-offset-2 hover:text-[--red]">Browse the sample library →</Link>
        </div>

        <h2 className="eyebrow mt-20">How it works</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            ['1', '15-minute call', 'You describe one client request. We tell you how we would build it and what it costs.'],
            ['2', 'Fixed scope, fixed price', 'One page: what gets built, what "live" means, the date. You approve it, we start.'],
            ['3', 'Live in 7 days', 'Built, tested and handed over under your brand, with a walkthrough for your team.'],
          ].map(([n, t, d]) => (
            <div key={n} className="dcard p-6">
              <div className="display text-3xl text-[--ink]/30">{n}</div>
              <h3 className="mt-2 font-body text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[--ink-dim]">{d}</p>
            </div>
          ))}
        </div>

        <h2 className="eyebrow mt-20">Who builds it</h2>
        <div className="dcard mt-6 p-7">
          <p className="text-[17px] leading-relaxed text-[--ink]">
            Archit Mittal. Former prop-shop quant, now building AI agents and automation systems full time. Speaker at IIT Bombay Techfest, featured on CNBC Awaaz, followed by 10,000+ people on LinkedIn for automation builds.
          </p>
          <a href="https://linkedin.com/in/automate-archit" className="mt-4 inline-block font-semibold underline underline-offset-2 hover:text-[--red]">LinkedIn →</a>
        </div>

        <h2 className="eyebrow mt-20">Questions agencies ask</h2>
        <div className="mt-6 space-y-4">
          {FAQ.map((f) => (
            <details key={f.q} className="dcard p-6">
              <summary className="cursor-pointer font-body text-lg font-semibold">{f.q}</summary>
              <p className="mt-3 leading-relaxed text-[--ink-dim]">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="display text-[--ink] text-[clamp(2.2rem,6vw,4.5rem)]">One stuck client request.<br /><span className="text-[--red]">Live in 7 days.</span></h2>
          <a href={CALL_URL} className={`${btn} mt-8`}>Book a free 15-min call →</a>
          <p className="mt-4 text-sm text-[--ink]/55">Or email <a href="mailto:archit.akg13@gmail.com" className="underline underline-offset-2">archit.akg13@gmail.com</a></p>
        </div>
      </div>
    </main>
  )
}
