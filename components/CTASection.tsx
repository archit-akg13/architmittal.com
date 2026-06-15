import { TOPMATE_URL } from '@/lib/constants'

export default function CTASection() {
  return (
    <section className="bg-lime py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-3">
          Ready to automate your chaos?
        </h2>
        <p className="font-body text-white/80 mb-8 text-lg">
          Let&apos;s talk about your project — algo trading, AI agents, or business automation. I only take on projects where I can deliver measurable ROI.
        </p>
        <a
          href={TOPMATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-lime hover:bg-gray-100 px-8 py-3 rounded-lg font-heading font-bold transition-colors"
        >
          Book a Consultation
        </a>
      </div>
    </section>
  )
}
