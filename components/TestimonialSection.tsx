export default function TestimonialSection() {
  const testimonials = [
    {
      quote: 'Archit reduced our AI API costs by 97.5%. What we were spending ₹95K on now costs us ₹10K. The ROI was immediate.',
      name: 'SaaS Startup Founder',
      role: 'E-commerce Platform',
    },
    {
      quote: 'We automated 40+ workflows in our agency. The team saves 50+ hours every week on repetitive tasks.',
      name: 'Digital Agency Director',
      role: 'Marketing Agency',
    },
    {
      quote: 'The multi-agent content pipeline Archit built produces 10x more content with half the effort. Game changer.',
      name: 'Content Marketing Lead',
      role: 'B2B SaaS Company',
    },
  ]

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-heading text-center mb-10">
          What Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-lime text-2xl mb-3">&ldquo;</div>
              <p className="font-body text-body text-sm leading-relaxed mb-4">{t.quote}</p>
              <div>
                <div className="font-heading font-semibold text-heading text-sm">{t.name}</div>
                <div className="font-body text-subtle text-xs">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
