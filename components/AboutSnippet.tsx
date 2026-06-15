import Link from 'next/link'
import Image from 'next/image'

export default function AboutSnippet() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-shrink-0">
          <Image
            src="/images/archit-headshot-400.jpg"
            alt="Archit Mittal"
            width={200}
            height={200}
            loading="lazy"
            className="rounded-full border-[3px] border-lime object-cover"
          />
        </div>
        <div>
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-heading mb-3">
            Hi, I&apos;m Archit Mittal
          </h2>
          <p className="font-body text-body leading-relaxed mb-4">
            I&apos;m an AI &amp; automation consultant who builds custom algo trading systems, AI agents, and business automation.
            As a registered market professional (AMFI ARN holder &amp; Authorized Person) and AI engineer,
            I bring a rare combination — I understand both the technology and the domain. From saving a client ₹85K/month on AI API costs to building 40+ automation systems, I turn operational chaos into competitive advantage.
          </p>
          <Link href="/about" className="text-lime hover:text-lime-dark font-heading font-semibold text-sm transition-colors">
            Learn More &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
