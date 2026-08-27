import { CAL_URL } from '@/lib/constants'

export default function CTASection() {
  return (
    <section className="border-t border-[--ink]/10 bg-[--paper] py-20 text-[--ink] sm:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h2 className="display text-[--ink] text-[clamp(2.6rem,8vw,6rem)]">
          One call.<br /><span className="text-[--red]">One process automated.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-[--ink-dim]">
          A paid 1:1 where we pick the one manual process costing you the most and map exactly how to kill it. You leave with the plan either way.
        </p>
        <a href={CAL_URL} target="_blank" rel="noopener noreferrer"
          className="mt-10 inline-flex h-14 items-center rounded-md bg-[--red] px-10 font-body text-base font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--gold]">
          Book the 1:1 consultation →
        </a>
        <p className="mt-4 text-sm text-[--ink]/55">Free stuff instead? All my tools and workflows: <a href="/packs" className="underline underline-offset-2 hover:text-[--red]">architmittal.com/packs</a></p>
      </div>
    </section>
  )
}
