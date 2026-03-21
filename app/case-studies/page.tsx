import type { Metadata } from 'next'
import { TOPMATE_URL } from '@/lib/constants'

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
    title: '40+ Workflows Automated',
    client: 'Digital Agency',
    problem: 'Team spending 60+ hours/week on repetitive tasks — data entry, report generation, client communications.',
    solution: 'Built a comprehensive n8n automation suite covering CRM sync, invoice generation, weekly reporting, and Slack notifications.',
    results: [
      { metric: '40+', label: 'Workflows automated' },
      { metric: '50hrs/wk', label: 'Time saved' },
      { metric: '₹2L/mo', label: 'Labor cost saved' },
    ],
  },
  {
    title: 'Multi-Agent Content Pipeline',
    client: 'Content Marketing Team',
    problem: 'Content creation bottleneck — 1 article per week, manual research, no cross-platform distribution.',
    solution: 'Built a multi-agent system using Claude + MCP protocol for research, writing, editing, and auto-publishing to 5 platforms.',
    results: [
      { metric: '10x', label: 'Content output' },
      { metric: '5', label: 'Platforms automated' },
      { metric: '2hrs', label: 'Per article (was 8hrs)' },
    ],
  },
]

export default function CaseStudiesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-heading font-bold text-3xl sm:text-4xl text-heading mb-3">Case Studies</h1>
      <p className="font-body text-body mb-10">
        Real results from real automation projects. Here&apos;s how I&apos;ve helped businesses save time and money.
      </p>

      <div className="space-y-8">
        {CASE_STUDIES.map((cs) => (
          <div key={cs.title} className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-dark p-6">
              <span className="text-lime text-xs font-heading font-semibold uppercase tracking-wider">{cs.client}</span>
              <h2 className="font-heading font-bold text-xl text-white mt-1">{cs.title}</h2>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <h3 className="font-heading font-semibold text-sm text-heading mb-1">The Problem</h3>
                <p className="font-body text-body text-sm">{cs.problem}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-heading font-semibold text-sm text-heading mb-1">The Solution</h3>
                <p className="font-body text-body text-sm">{cs.solution}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
                {cs.results.map((r) => (
                  <div key={r.label} className="text-center">
                    <div className="font-heading font-bold text-xl text-lime">{r.metric}</div>
                    <div className="font-body text-body text-xs">{r.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="font-body text-body mb-4">Want results like these for your business?</p>
        <a
          href={TOPMATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-lime hover:bg-lime-dark text-white px-8 py-3 rounded-lg font-heading font-bold transition-colors"
        >
          Book a Free Consultation
        </a>
      </div>
    </div>
  )
}
