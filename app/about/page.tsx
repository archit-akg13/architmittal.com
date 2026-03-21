import type { Metadata } from 'next'
import { TOPMATE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About',
  description: 'Archit Mittal — AI Automation Expert. I Automate Chaos. Helping businesses save lakhs through intelligent automation.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <span className="text-subtle text-sm font-body">Photo</span>
        </div>
        <div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-heading mb-3">
            I&apos;m Archit Mittal
          </h1>
          <p className="text-lime font-heading font-semibold text-lg mb-4">I Automate Chaos</p>
          <p className="font-body text-body leading-relaxed mb-4">
            I&apos;m an AI automation expert based in India, helping businesses replace tedious manual processes
            with intelligent automated systems. From cutting AI API costs by 97.5% to building 40+ automation
            workflows, I specialize in turning operational chaos into streamlined, money-saving machines.
          </p>
          <p className="font-body text-body leading-relaxed">
            My toolkit includes Claude Code, n8n, MCP Protocol, multi-agent AI systems, and deep experience
            with LLM APIs. I write about automation on LinkedIn (9,400+ followers), Dev.to, and Hashnode,
            sharing practical insights that help businesses automate smarter.
          </p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="font-heading font-bold text-2xl text-heading mb-6">What I Automate</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { area: 'AI Workflow Automation', detail: 'End-to-end pipelines using n8n, Make, and custom scripts' },
            { area: 'AI API Cost Optimization', detail: 'Smart caching, model routing, and batching strategies' },
            { area: 'No-Code/Low-Code', detail: 'Powerful automations without writing code' },
            { area: 'Multi-Agent AI Systems', detail: 'Orchestrating AI agents with MCP protocol and Claude' },
            { area: 'Data Pipeline Automation', detail: 'ETL, data sync, and real-time processing workflows' },
            { area: 'Business Process Automation', detail: 'CRM, invoicing, reporting, and communication flows' },
          ].map((item) => (
            <div key={item.area} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-heading font-semibold text-heading text-sm mb-1">{item.area}</h3>
              <p className="font-body text-body text-xs">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Work With Me */}
      <section className="bg-lime/5 border border-lime/20 rounded-xl p-8 text-center">
        <h2 className="font-heading font-bold text-2xl text-heading mb-3">Work With Me</h2>
        <p className="font-body text-body mb-6 max-w-lg mx-auto">
          Ready to automate your chaos? Book a free consultation and let&apos;s explore how much time and money you can save.
        </p>
        <a
          href={TOPMATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-lime hover:bg-lime-dark text-white px-8 py-3 rounded-lg font-heading font-bold transition-colors"
        >
          Book a Free Consultation
        </a>
      </section>
    </div>
  )
}
