import Link from 'next/link'
import Image from 'next/image'

export default function AboutSnippet() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] flex-shrink-0">
          <Image
            src="/images/archit-about-200.png"
            alt="Archit Mittal"
            width={200}
            height={200}
            loading="lazy"
            className="rounded-full"
          />
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
