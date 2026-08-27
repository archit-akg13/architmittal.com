import type { Metadata } from 'next'
import BookForm from '@/components/BookForm'

export const metadata: Metadata = {
  title: '1:1 Automation Consultation — ₹2,999',
  description: '45 minutes, one manual process mapped for automation. Fully credited back against any done-for-you project.',
}

// Honest scarcity: a real cap Archit honours — 10 calls/month alongside client work.
const SLOTS_PER_MONTH = 10

const GETS = [
  'One process picked apart and mapped for automation, live on the call',
  'Build-vs-buy verdict with real Indian pricing, not US-tool defaults',
  'The exact stack I would use, with per-unit cost estimates',
  'Written summary after the call — the plan is yours either way',
]

export default function BookPage() {
  return (
    <main className="bg-[--paper] text-[--ink]">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="eyebrow">Paid 1:1 · the only paid thing on this site · {SLOTS_PER_MONTH} calls a month, no more</p>
        <h1 className="display mt-3 text-[--ink] text-[clamp(2.4rem,7vw,5.5rem)]">45 minutes.<br />One process, automated on paper.</h1>
        <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <ul className="space-y-4">
              {GETS.map((g) => (
                <li key={g} className="flex gap-3 text-[17px] leading-relaxed text-[--ink-dim]">
                  <span aria-hidden className="mt-1 text-[--red]">→</span>{g}
                </li>
              ))}
            </ul>
            <div className="dcard mt-10 p-6">
              <p className="font-body text-base font-semibold text-[--ink]">₹2,999 is fully credited back</p>
              <p className="mt-2 text-[15px] leading-relaxed text-[--ink-dim]">
                Finalise any done-for-you project with us afterwards and the consultation fee is deducted from it, in full. The call only costs money if you take the plan and walk.
              </p>
            </div>
          </div>
          <BookForm />
        </div>
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { q: 'Archit reduced our AI API costs by 85.9%. What we were spending \u20b995K on now costs us \u20b910K.', a: 'SaaS Startup Founder' },
            { q: 'What used to take our quant team a full day now runs in minutes.', a: 'Prop Trading Desk Lead' },
            { q: 'A multi-agent system that automates our entire client onboarding.', a: 'Fintech CTO' },
          ].map((t) => (
            <figure key={t.a} className="dcard p-6">
              <blockquote className="text-[15px] leading-relaxed text-[--ink]/85">&ldquo;{t.q}&rdquo;</blockquote>
              <figcaption className="mt-4 text-sm font-semibold">{t.a}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </main>
  )
}
