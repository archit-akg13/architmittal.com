import Image from 'next/image'
import { CAL_URL } from '@/lib/constants'
import WorkflowArt from './WorkflowArt'
import HeroCollage from './HeroCollage'

/* Hallmark · studied-DNA (Sprynt) · hero: giant Anton statement, red action, cream on near-black */
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[--paper] text-[--ink]">
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.09]"
        style={{ backgroundImage: 'linear-gradient(rgba(22,19,14,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(22,19,14,.5) 1px, transparent 1px)', backgroundSize: '54px 54px' }} />
      <HeroCollage />
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pb-20 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center">
        <div>
        <p className="eyebrow">AI &amp; automation consultant · India</p>
        <h1 className="display mt-5 text-[--ink] text-[clamp(3.4rem,11vw,9.5rem)]">
          I&nbsp;automate<br /><span className="text-[--red]">chaos.</span>
        </h1>
        <div className="mt-8 flex max-w-2xl flex-col gap-8 sm:mt-10 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
          <p className="max-w-md text-lg leading-relaxed text-[--ink-dim]">
            Custom algo trading systems, AI agents and business automation —
            built to cut real costs, measured in rupees and hours, not demos.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href={CAL_URL} className="inline-flex h-14 items-center rounded-md bg-[--red] px-8 font-body text-base font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--gold]">
            Book a 1:1 consultation →
          </a>
          <a href="/case-studies"
            className="inline-flex h-14 items-center rounded-md border-2 border-[--ink]/30 px-8 font-body text-base font-semibold text-[--ink] transition-colors duration-150 hover:border-[--ink] hover:bg-[--ink] hover:text-[--paper] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--gold]">
            See the numbers
          </a>
        </div>
        <p className="mt-4 text-sm text-[--ink]/55">The 1:1 call (₹2,999, 45 min) is the only paid thing here — and it&rsquo;s fully credited back on any done-for-you project. Everything else is free.</p>
        </div>
        <div className="relative hidden lg:block" aria-hidden>
          <div className="dcard -rotate-2 overflow-hidden p-3 transition-transform duration-300 hover:rotate-0">
            <Image src="/images/archit-headshot-800.jpg" alt="" width={420} height={420} priority className="w-full rounded-lg object-cover" />
            <p className="px-2 pb-1 pt-3 font-mono text-xs text-[--ink]/55">the person your workflows report to</p>
          </div>
          <WorkflowArt className="mx-auto mt-3 w-[74%] rotate-1" />
        </div>
      </div>
    </section>
  )
}
