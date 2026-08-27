const PREVIEWS = [
  // Same case-study facts, annualised — the yearly number is the honest big one.
  { title: 'AI API cost slashed 85.9%', client: 'SaaS startup', metric: '₹10L+/yr', label: 'saved on one API bill', accent: '#CF1134' },
  { title: '40+ workflows automated', client: 'Digital agency', metric: '2,600+ hrs', label: 'returned to the team, every year', accent: '#5B4BA6' },
  { title: 'Options backtester rebuilt', client: 'Crypto derivatives', metric: '30×', label: 'faster — 300s to 9.9s', accent: '#B8611B' },
]

export default function CaseStudyPreview() {
  return (
    <section className="bg-[--paper] py-16 text-[--ink] sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow">Case studies</p>
        <h2 className="display mt-3 max-w-3xl text-[--ink] text-[clamp(2.2rem,6vw,4.5rem)]">Work that pays for itself</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PREVIEWS.map((c) => (
            <a key={c.title} href="/case-studies" data-reveal className="dcard group relative block overflow-hidden p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--gold]">
              <span aria-hidden className="absolute inset-y-0 left-0 w-1" style={{ background: c.accent }} />
              <p className="text-xs uppercase tracking-[0.14em] text-[--ink]/50">{c.client}</p>
              <h3 className="mt-3 font-body text-lg font-semibold leading-snug">{c.title}</h3>
              <div className="display tnum mt-6 text-4xl" style={{ color: c.accent }}>{c.metric}</div>
              <p className="mt-1 text-sm text-[--ink-dim]">{c.label}</p>
              <p className="mt-6 text-sm font-semibold text-[--ink]/60 transition-colors group-hover:text-[--red]">Read the full story →</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
