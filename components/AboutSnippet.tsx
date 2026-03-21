import Link from 'next/link'

export default function AboutSnippet() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Photo placeholder */}
        <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          <span className="text-subtle text-sm font-body">Photo</span>
        </div>

        <div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-heading mb-3">
            Hi, I&apos;m Archit Mittal
          </h2>
          <p className="font-body text-body leading-relaxed mb-4">
            I&apos;m an AI automation expert who helps businesses replace repetitive work with intelligent systems.
            From saving a client ₹85K/month on AI API costs to building 40+ automation workflows,
            I turn operational chaos into streamlined processes using tools like Claude Code, n8n, and multi-agent AI systems.
          </p>
          <Link
            href="/about"
            className="text-lime hover:text-lime-dark font-heading font-semibold text-sm transition-colors"
          >
            Learn More &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
