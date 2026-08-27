import Link from 'next/link'
import Image from 'next/image'

export default function AboutSnippet() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 text-[--ink] sm:px-6 sm:py-20">
      <div className="flex flex-col items-center gap-10 md:flex-row md:gap-14">
        <div className="shrink-0">
          <Image src="/images/archit-headshot-800.jpg" alt="Archit Mittal" width={300} height={300} loading="lazy"
            className="h-56 w-56 rounded-2xl border-2 border-[--ink]/10 object-cover shadow-[0_18px_40px_rgba(22,19,14,.15)] sm:h-72 sm:w-72" />
        </div>
        <div>
          <h2 className="display text-[--ink] text-[clamp(1.9rem,5vw,3.2rem)]">Hi, I&rsquo;m Archit</h2>
          <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-[--ink-dim]">
            Founder of Automate Algos and Coingreeks. I spent years on trading desks learning that the boring, reliable system beats the clever demo — then started building exactly those systems for founders and firms across India.
          </p>
          <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-[--ink-dim]">
            Everything I run — including the Instagram engine that publishes daily and the site you&rsquo;re reading — is automation I built myself. The case studies are the receipts.
          </p>
          <Link href="/about" className="mt-6 inline-block font-body text-sm font-semibold text-[--red] underline-offset-4 hover:underline">More about me →</Link>
        </div>
      </div>
    </section>
  )
}
