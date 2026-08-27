import { STATS } from '@/lib/constants'

export default function StatsSection() {
  return (
    <section className="border-y border-[--ink]/10 bg-[--paper] py-14 text-[--ink] sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow mb-8">Measured, not promised</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} data-reveal>
              <div className="display tnum text-[clamp(2.2rem,4.5vw,3.6rem)] text-[--red]" data-count={s.value}>{s.value}</div>
              <div className="mt-2 text-sm text-[--ink-dim]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
