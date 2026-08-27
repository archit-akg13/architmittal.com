import type { Metadata } from 'next'
import { CAL_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'Real automation results — how I helped businesses save lakhs and hours through intelligent automation.',
}

const CASE_STUDIES = [
  {
    title: 'AI API Cost Slashed by 97.5%',
    client: 'SaaS Startup',
    problem: 'Spending ₹95K/month on AI API calls with no cost controls or optimization.',
    solution: 'Implemented smart caching, model tiering (GPT-4 for complex, GPT-3.5 for simple), request batching, and prompt optimization.',
    results: [
      { metric: '₹85K/mo', label: 'Monthly savings' },
      { metric: '97.5%', label: 'Cost reduction' },
      { metric: '3 days', label: 'Implementation time' },
    ],
  },
  {
    title: 'Custom Trading Backtesting Engine',
    client: 'Algo Trading Firm',
    problem: 'Manual backtesting taking days per strategy. No systematic way to evaluate, compare, or iterate on trading algorithms.',
    solution: 'Built a custom backtesting pipeline with automated data ingestion, strategy parameterization, walk-forward analysis, and visual performance reports.',
    results: [
      { metric: '100x', label: 'Faster backtests' },
      { metric: '50+', label: 'Strategies tested' },
      { metric: '₹0', label: 'Manual analysis cost' },
    ],
  },
  {
    title: '40+ Workflows Automated',
    client: 'Digital Agency',
    problem: 'Team spending 60+ hours/week on repetitive tasks — data entry, report generation, client communications.',
    solution: 'Built a comprehensive automation suite covering CRM sync, invoice generation, weekly reporting, and Slack notifications. All custom-built, zero per-task pricing.',
    results: [
      { metric: '40+', label: 'Workflows automated' },
      { metric: '50hrs/wk', label: 'Time saved' },
      { metric: '₹2L/mo', label: 'Labor cost saved' },
    ],
  },
  {
    title: 'Multi-Agent AI Client Onboarding',
    client: 'Fintech Startup',
    problem: 'Manual client onboarding taking 3 days per client. Document verification, KYC checks, and account setup all done by hand.',
    solution: 'Built a multi-agent AI system using MCP protocol — one agent handles document extraction, another runs verification, a third creates accounts and sends personalized welcome flows.',
    results: [
      { metric: '3hrs', label: 'Onboarding (was 3 days)' },
      { metric: '95%', label: 'Automation rate' },
      { metric: '₹1.5L/mo', label: 'Headcount saved' },
    ],
  },
]

const FINANCE_CASES = [
  {
    shot: { src: '/images/proof/btadmin.jpg', href: 'https://btadmin.architmittal.in', label: 'Strategy basket admin — btadmin.architmittal.in' },
    title: 'Options backtester made 30× faster',
    client: 'Crypto derivatives analytics',
    problem: 'Backtesting 40 symbols took 300 seconds per run — too slow to iterate on strategy ideas, and the grid optimizer multiplied that pain by thousands of runs.',
    solution: 'Re-engineered the engine over four versions: 2.3GB of raw tick data pre-aggregated to 1-minute Parquet, a numpy price grid for 40 symbols × 525K minutes, and the hot loops rebuilt after profiling named the real bottlenecks.',
    results: [
      { metric: '300s → 9.9s', label: '40-symbol backtest' },
      { metric: '30×', label: 'Faster iteration' },
      { metric: '18', label: 'Metrics per run' },
    ],
  },
  {
    shot: { src: '/images/proof/btfull.jpg', href: 'https://btfull.architmittal.in', label: 'The live platform — btfull.architmittal.in' },
    title: '64,320 backtests before one rupee at risk',
    client: 'Crypto signal advisory',
    problem: 'Picking strategies by eyeballing a handful of charts — no way to know if a "winner" was real edge or curve-fit luck.',
    solution: 'Built an optimization pipeline that swept 64,320 parameter combinations in ~90 minutes, then a walk-forward filter: five years in-sample, five months out-of-sample — only strategies whose out-of-sample results reproduce the in-sample ones go live.',
    results: [
      { metric: '64,320', label: 'Backtests in one sweep' },
      { metric: '~90 min', label: 'Sweep runtime' },
      { metric: '5yr / 5mo', label: 'In-sample / out-of-sample' },
    ],
  },
  {
    title: 'The audit that found fees eating the account',
    client: 'Proprietary trading account',
    problem: 'An account that felt like it was losing to the market. 178 real positions over six months said otherwise.',
    solution: 'Forensic audit of every fill: fees of ₹37,966 exceeded the net trading loss itself; low-conviction days alone cost ₹36,408; realised payoff was 1.78:1 against a believed 1:10. Rebuilt sizing (5% → 1% probes with halt tiers) and moved venues to halve the round-trip cost.',
    results: [
      { metric: '178', label: 'Real positions audited' },
      { metric: '₹37,966', label: 'Fees found > net loss' },
      { metric: '−50%', label: 'Round-trip cost after venue move' },
    ],
  },
  {
    title: 'A funding-rate bot the client fully owns',
    client: 'Private trading client',
    problem: 'Wanted to capture exchange funding-rate windows 24/7 — without handing his API keys or capital to a third-party platform.',
    solution: 'Delivered a funding-rate capture bot deployed on the client\u2019s own VPS with a password-protected dashboard: he sets notional, leverage and thresholds himself. Isolated release branch so his version never breaks when the core evolves. ~77% win rate in our testing of the capture mode.',
    results: [
      { metric: '24/7', label: 'Runs on his own server' },
      { metric: '~77%', label: 'Win rate in testing' },
      { metric: '100%', label: 'Client owns keys, capital, code' },
    ],
  },
]

export default function CaseStudiesPage() {
  return (
    <main className="bg-[--paper] text-[--ink]">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="eyebrow">Case studies</p>
        <h1 className="display mt-3 text-[--ink] text-[clamp(2.6rem,8vw,6rem)]">Receipts, not promises</h1>
        <p className="mt-5 max-w-xl text-lg text-[--ink-dim]">
          Four real projects, with the numbers they produced. Every figure below was measured after delivery, not projected before it.
        </p>

        <h2 className="eyebrow mt-14">Business automation</h2>
        <div className="mt-6 space-y-10">
          {CASE_STUDIES.map((cs, i) => (
            <article key={cs.title} data-reveal className="dcard overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <div className="p-8 sm:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[--ink]/50">
                    <span className="display mr-3 text-base text-[--ink]/30">0{i + 1}</span>{cs.client}
                  </p>
                  <h2 className="display mt-3 text-[--ink] text-[clamp(1.6rem,3.4vw,2.6rem)]">{cs.title}</h2>
                  <h3 className="mt-7 text-sm font-semibold uppercase tracking-wide text-[--red]">The problem</h3>
                  <p className="mt-2 leading-relaxed text-[--ink-dim]">{cs.problem}</p>
                  <h3 className="mt-6 text-sm font-semibold uppercase tracking-wide text-[--gold]">What I built</h3>
                  <p className="mt-2 leading-relaxed text-[--ink-dim]">{cs.solution}</p>
                </div>
                <div className="flex flex-col justify-center gap-8 border-t border-[--ink]/10 bg-[--paper3] p-8 sm:p-10 md:border-l md:border-t-0">
                  {cs.results.map((r) => (
                    <div key={r.label}>
                      <div className="display tnum text-4xl text-[--red]">{r.metric}</div>
                      <div className="mt-1 text-sm text-[--ink-dim]">{r.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        <h2 className="eyebrow mt-20">Trading &amp; finance engineering</h2>
        <div className="mt-6 space-y-10">
          {FINANCE_CASES.map((cs, i) => (
            <article key={cs.title} data-reveal className="dcard overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <div className="p-8 sm:p-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[--ink]/50">
                    <span className="display mr-3 text-base text-[--ink]/30">0{i + 5}</span>{cs.client}
                  </p>
                  <h3 className="display mt-3 text-[--ink] text-[clamp(1.6rem,3.4vw,2.6rem)]">{cs.title}</h3>
                  <h4 className="mt-7 text-sm font-semibold uppercase tracking-wide text-[--red]">The problem</h4>
                  <p className="mt-2 leading-relaxed text-[--ink-dim]">{cs.problem}</p>
                  <h4 className="mt-6 text-sm font-semibold uppercase tracking-wide text-[--gold]">What I built</h4>
                  <p className="mt-2 leading-relaxed text-[--ink-dim]">{cs.solution}</p>
                  {'shot' in cs && cs.shot && (
                    <a href={cs.shot.href} target="_blank" rel="noopener noreferrer" className="mt-6 block overflow-hidden rounded-lg border border-[--ink]/15 transition-transform duration-200 hover:-translate-y-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={cs.shot.src} alt={cs.shot.label} loading="lazy" className="w-full object-cover" />
                      <span className="block bg-[--paper3] px-3 py-2 font-mono text-xs text-[--ink]/60">{cs.shot.label} ↗</span>
                    </a>
                  )}
                </div>
                <div className="flex flex-col justify-center gap-8 border-t border-[--ink]/10 bg-[--paper3] p-8 sm:p-10 md:border-l md:border-t-0">
                  {cs.results.map((r) => (
                    <div key={r.label}>
                      <div className="display tnum text-4xl text-[--red]">{r.metric}</div>
                      <div className="mt-1 text-sm text-[--ink-dim]">{r.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-8 text-sm text-[--ink]/50">Engineering results from real systems — figures from project records. Nothing here is trading or investment advice.</p>

        <div className="mt-20 border-t border-[--ink]/10 pt-14 text-center">
          <h2 className="display text-[--ink] text-[clamp(2rem,5.5vw,3.6rem)]">Your process could be case study five</h2>
          <a href={CAL_URL}
            className="mt-8 inline-flex h-14 items-center rounded-md bg-[--red] px-10 font-body text-base font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--gold]">
            Book the paid 1:1 →
          </a>
          <p className="mt-4 text-sm text-[--ink]/55">One call, one process mapped for automation. The plan is yours either way.</p>
        </div>
      </div>
    </main>
  )
}
