export default function TestimonialSection() {
  const testimonials = [
    { quote: 'Archit reduced our AI API costs by 85.9%. What we were spending ₹85K on now costs us ₹12K. The ROI was immediate.', name: 'SaaS Startup Founder', role: 'E-commerce Platform' },
    { quote: 'The custom trading system Archit built handles our entire backtesting and signal pipeline. What used to take our quant team a full day now runs in minutes.', name: 'Prop Trading Desk Lead', role: 'Algorithmic Trading Firm' },
    { quote: 'We needed an AI agent that actually understood our business logic, not just a chatbot wrapper. Archit delivered a multi-agent system that automates our entire client onboarding.', name: 'Fintech CTO', role: 'Series A Startup' },
  ]
  return (
    <section className="bg-[--paper3] py-16 text-[--ink] sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow">In their words</p>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} data-reveal className="dcard p-7">
              <blockquote className="text-[15px] leading-relaxed text-[--ink]/85">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-6 text-sm">
                <span className="font-semibold">{t.name}</span>
                <span className="text-[--ink]/50"> · {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
