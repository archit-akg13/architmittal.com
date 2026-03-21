import { TOPMATE_URL } from '@/lib/constants'

export default function CTASection() {
  return (
    <section className="bg-lime py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-3">
          Ready to automate your chaos?
        </h2>
        <p className="font-body text-white/80 mb-8 text-lg">
          Book a free consultation and let&apos;s find out how much time and money you can save with intelligent automation.
        </p>
        <a
          href={TOPMATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-lime hover:bg-gray-100 px-8 py-3 rounded-lg font-heading font-bold transition-colors"
        >
          Book Now — It&apos;s Free
        </a>
      </div>
    </section>
  )
}
