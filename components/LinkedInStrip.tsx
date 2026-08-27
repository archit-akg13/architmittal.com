import Image from 'next/image'

/* The show-off band — everything on it is verifiable on the LinkedIn profile. */
const PROOF = [
  { n: '10,300+', l: 'LinkedIn followers' },
  { n: '10,000+', l: 'traders & businesses automated' },
  { n: '2', l: 'companies founded — Automate Algos · Coingreeks' },
  { n: '40+', l: 'automation systems shipped' },
]

export default function LinkedInStrip() {
  return (
    <section className="border-y border-[--ink]/10 bg-[#16130E] py-14 text-[#FFF3E2] sm:py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 sm:px-6 md:flex-row md:gap-14">
        <div className="shrink-0 text-center">
          <span className="inline-block rounded-2xl bg-gradient-to-tr from-[#F4BD45] to-[#CF1134] p-[3px]">
            <Image src="/images/archit-headshot-800.jpg" alt="Archit Mittal" width={224} height={224}
              className="h-44 w-44 rounded-2xl object-cover sm:h-56 sm:w-56" />
          </span>
          <p className="mt-4 font-body text-sm text-[#FFF3E2]/60">Building in public, daily</p>
        </div>
        <div className="min-w-0">
          <p className="eyebrow">Who you&rsquo;re booking</p>
          <h2 className="display mt-3 text-[#FFF3E2] text-[clamp(1.9rem,5vw,3.4rem)]">The person behind 10,000+ automated desks</h2>
          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
            {PROOF.map((p) => (
              <div key={p.l} className="border-l-2 border-[#F4BD45] pl-4" data-reveal>
                <div className="display tnum text-3xl text-[#F4BD45]">{p.n}</div>
                <div className="mt-1 text-sm text-[#FFF3E2]/65">{p.l}</div>
              </div>
            ))}
          </div>
          <a href="https://linkedin.com/in/automate-archit" target="_blank" rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 items-center rounded-md border border-[#FFF3E2]/30 px-6 font-body text-sm font-semibold transition-colors hover:border-[#F4BD45] hover:text-[#F4BD45]">
            Verify all of it on LinkedIn →
          </a>
        </div>
      </div>
    </section>
  )
}
