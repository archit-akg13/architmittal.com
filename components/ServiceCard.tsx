import { SERVICES } from '@/lib/constants'

export default function ServicesSection() {
  return (
    <section className="border-t border-[--ink]/10 bg-[--paper] py-16 text-[--ink] sm:py-24" id="services">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow">What I build</p>
        <h2 className="display mt-3 text-[--ink] text-[clamp(2.2rem,6vw,4.5rem)]">Four ways in</h2>
        <ol className="mt-10 grid grid-cols-1 gap-x-10 border-t border-[--ink]/10 sm:grid-cols-2">
          {SERVICES.map((s, i) => (
            <li key={s.title} className="border-b border-[--ink]/10 py-8">
              <div className="flex items-baseline gap-4">
                <span className="display text-2xl text-[--ink]/30">0{i + 1}</span>
                <h3 className="font-body text-xl font-semibold">{s.title}</h3>
              </div>
              <p className="mt-3 pl-12 text-[15px] leading-relaxed text-[--ink-dim]">{s.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
