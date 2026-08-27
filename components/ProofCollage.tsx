import Image from 'next/image'

/* Real receipts, Sprynt-collage style: tilted screenshots of the actual profiles. */
const SHOTS = [
  { src: '/images/proof/linkedin.jpg', alt: 'Archit Mittal on LinkedIn — 10,300 followers', label: 'linkedin.com/in/automate-archit', tilt: '-rotate-2', href: 'https://linkedin.com/in/automate-archit' },
  { src: '/images/proof/github.jpg', alt: 'Open-source repositories on GitHub', label: 'github.com — the actual code', tilt: 'rotate-1', href: 'https://github.com/archit-akg13' },
]

export default function ProofCollage() {
  return (
    <section className="overflow-hidden bg-[--paper] py-16 text-[--ink] sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow">Public, verifiable</p>
        <h2 className="display mt-3 text-[--ink] text-[clamp(2.2rem,6vw,4.5rem)]">Everything here is on the record</h2>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {SHOTS.map((s) => (
            <a key={s.src} href={s.href} target="_blank" rel="noopener noreferrer" data-reveal
              className={`dcard block overflow-hidden p-3 ${s.tilt} transition-transform duration-300 hover:rotate-0`}>
              <Image src={s.src} alt={s.alt} width={692} height={445} className="w-full rounded-lg border border-[--ink]/10 object-cover" />
              <p className="px-2 pb-1 pt-3 font-mono text-xs text-[--ink]/55">{s.label}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
