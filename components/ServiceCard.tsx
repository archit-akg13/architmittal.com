import Link from 'next/link'
import { SERVICES } from '@/lib/constants'

export default function ServicesSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <h2 className="font-heading font-bold text-2xl sm:text-3xl text-heading text-center mb-10">
        What I Do
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {SERVICES.map((service) => (
          <Link
            key={service.title}
            href="/case-studies"
            className="border border-gray-200 rounded-xl p-6 hover:border-lime transition-colors group block"
          >
            <span className="text-3xl mb-3 block">{service.icon}</span>
            <h3 className="font-heading font-semibold text-lg text-heading mb-2 group-hover:text-lime transition-colors">
              {service.title}
            </h3>
            <p className="font-body text-body text-sm leading-relaxed">
              {service.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
