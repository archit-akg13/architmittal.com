import { STATS } from '@/lib/constants'

export default function StatsSection() {
  return (
    <section className="bg-dark py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading font-bold text-3xl sm:text-4xl text-lime mb-2">
                {stat.value}
              </div>
              <div className="font-body text-gray-400 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
