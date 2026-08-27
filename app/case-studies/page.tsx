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

export default function CaseStudiesPage() {
  return (
    <main className="bg-[--paper] text-[--ink]">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="eyebrow">Case studies</p>
        <h1 className="display mt-3 text-[--ink] text-[clamp(2.6rem,8vw,6rem)]">Receipts, not promises</h1>
        <p className="mt-5 max-w-xl text-lg text-[--ink-dim]">
          Four real projects, with the numbers they produced. Every figure below was measured after delivery, not projected before it.
        </p>

        <div className="mt-14 space-y-10">
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
