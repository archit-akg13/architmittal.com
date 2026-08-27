import { CAL_URL } from '@/lib/constants'

/* Hallmark · studied-DNA (Sprynt) · hero: giant Anton statement, red action, cream on near-black */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[--paper] text-[--ink]">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{ backgroundImage: 'linear-gradient(rgba(22,19,14,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(22,19,14,.5) 1px, transparent 1px)', backgroundSize: '72px 72px' }} />
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-32">
        <p className="eyebrow">AI &amp; automation consultant · India</p>
        <h1 className="display mt-5 text-[--ink] text-[clamp(3.4rem,11vw,9.5rem)]">
          I automate<br /><span className="text-[--red]">chaos.</span>
        </h1>
        <div className="mt-8 flex max-w-2xl flex-col gap-8 sm:mt-10 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
          <p className="max-w-md text-lg leading-relaxed text-[--ink-dim]">
            Custom algo trading systems, AI agents and business automation —
            built to cut real costs, measured in rupees and hours, not demos.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex h-14 items-center rounded-md bg-[--red] px-8 font-body text-base font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--gold]">
            Book a 1:1 consultation →
          </a>
          <a href="/case-studies"
            className="inline-flex h-14 items-center rounded-md border-2 border-[--ink]/30 px-8 font-body text-base font-semibold text-[--ink] transition-colors duration-150 hover:border-[--ink] hover:bg-[--ink] hover:text-[--paper] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--gold]">
            See the numbers
          </a>
        </div>
        <p className="mt-4 text-sm text-[--ink]/55">The 1:1 call is the only paid thing here — everything else on this site is free.</p>
      </div>
    </section>
  )
}
