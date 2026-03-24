import Link from 'next/link'
import Image from 'next/image'
import { TOPMATE_URL } from '@/lib/constants'

export default function Hero() {
  return (
    <section className="bg-dark text-white relative overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(76,175,30,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(76,175,30,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Headshot */}
          <div className="flex-shrink-0">
            <div className="relative w-[250px] h-[250px] sm:w-[300px] sm:h-[300px]">
              <Image
                src="/images/archit-hero-300.png"
                alt="Archit Mittal - The Automation Expert"
                width={300}
                height={300}
                priority
                className="rounded-full shadow-[0_0_40px_rgba(76,175,30,0.3)]"
              />
            </div>
          </div>

          {/* Text */}
          <div>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl text-white mb-4">
              I Automate <span className="text-lime">Chaos</span>
            </h1>
            <p className="font-body text-lg sm:text-xl text-gray-300 max-w-2xl mb-8 leading-relaxed">
              AI Automation Expert — Helping businesses save ₹lakhs through intelligent automation with Claude Code, n8n &amp; AI agents
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={TOPMATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-lime hover:bg-lime-dark text-white px-6 py-3 rounded-lg font-heading font-semibold text-center transition-colors"
              >
                Book a Free Consultation
              </a>
              <Link
                href="/blog"
                className="border border-white/30 hover:border-white text-white px-6 py-3 rounded-lg font-heading font-semibold text-center transition-colors"
              >
                Read the Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
