import type { Metadata } from 'next'
import Image from 'next/image'
import { TOPMATE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About',
  description: 'Archit Mittal — AI & Automation Consultant. Registered market professional + AI engineer. I build custom algo trading systems, AI agents, and business automation.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
        <div className="w-[150px] h-[150px] flex-shrink-0">
          <Image
            src="/images/archit-headshot-400.jpg"
            alt="Archit Mittal"
            width={150}
            height={150}
            loading="lazy"
            className="rounded-full border-[3px] border-lime object-cover"
          />
        </div>
        <div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-heading mb-3">
            I&apos;m Archit Mittal
          </h1>
          <p className="text-lime font-heading font-semibold text-lg mb-4">I Automate Chaos</p>
          <p className="font-body text-body leading-relaxed mb-4">
            I&apos;m an AI &amp; automation consultant based in India. I build custom algo trading systems,
            AI agents, and business automation for founders, trading firms, and startups globally.
            From cutting AI API costs by 97.5% to building 40+ automation systems, I turn operational chaos
            into competitive advantage.
          </p>
          <p className="font-body text-body leading-relaxed">
            What makes me different: I&apos;m a registered market professional (AMFI ARN holder &amp; Authorized Person)
            who also builds AI systems. That rare combination means I understand both the technology and the financial domain.
            I write about AI and automation on LinkedIn (10,000+ followers), Dev.to, and Hashnode.
          </p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="font-heading font-bold text-2xl text-heading mb-6">What I Automate</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { area: 'Algo Trading Systems', detail: 'Custom strategy development, backtesting, and live execution pipelines' },
            { area: 'Custom AI Agents', detail: 'Purpose-built AI agents using MCP protocol and multi-agent architectures' },
            { area: 'AI API Cost Optimization', detail: 'Smart caching, model routing, and batching — up to 97.5% savings' },
            { area: 'Business Automation', detail: 'End-to-end automation that replaces manual processes and saves headcount' },
            { area: 'Data Pipeline Automation', detail: 'ETL, data sync, and real-time processing workflows' },
            { area: 'AI Consultancy', detail: 'Architecture reviews, build-vs-buy decisions, and implementation roadmaps' },
          ].map((item) => (
            <div key={item.area} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-heading font-semibold text-heading text-sm mb-1">{item.area}</h3>
              <p className="font-body text-body text-xs">{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-lime/5 border border-lime/20 rounded-xl p-8 text-center">
        <h2 className="font-heading font-bold text-2xl text-heading mb-3">Work With Me</h2>
        <p className="font-body text-body mb-6 max-w-lg mx-auto">
          Have a project in mind? Let&apos;s talk — algo trading, AI agents, or business automation.
          I only take on projects where I can deliver measurable ROI.
        </p>
        <a
          href={TOPMATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-lime hover:bg-lime-dark text-white px-8 py-3 rounded-lg font-heading font-bold transition-colors"
        >
          Book a Consultation
        </a>
      </section>
    </div>
  )
}
