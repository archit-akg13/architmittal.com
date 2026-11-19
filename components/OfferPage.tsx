import Link from 'next/link'
import { AGENCY_CALL_URL as CALL_URL } from '@/lib/constants'

export type OfferPageData = {
  eyebrow: string
  h1: [string, string]
  sub: string
  ctaNote: string
  stats: [string, string][]
  offers: { name: string; price: string; line: string; points: string[] }[]
  buildsTitle: string
  builds: { t: string; d: string }[]
  // Add { title, url } entries (Loom / YouTube embed URLs) and the section appears.
  demos?: { title: string; url: string }[]
  cases: { client: string; title: string; problem: string; built: string; results: [string, string][]; link?: { href: string; label: string } }[]
  samples: string[]
  steps: [string, string][]
  faq: { q: string; a: string }[]
  closing: [string, string]
}

const btn =
  'inline-flex h-14 items-center rounded-md bg-[--red] px-8 font-body text-base font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--gold]'

export default function OfferPage({ d }: { d: OfferPageData }) {
  return (
    <main className="bg-[--paper] text-[--ink]">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="eyebrow">{d.eyebrow}</p>
        <h1 className="display mt-3 text-[--ink] text-[clamp(2.4rem,7vw,5.5rem)]">
          {d.h1[0]}<br /><span className="text-[--red]">{d.h1[1]}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[--ink-dim]">{d.sub}</p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a href={CALL_URL} className={btn}>Book a free 15-min call →</a>
          <a href="#work" className="inline-flex h-14 items-center rounded-md border-2 border-[--ink]/30 px-8 font-body text-base font-semibold text-[--ink] transition-colors duration-150 hover:border-[--ink] hover:bg-[--ink] hover:text-[--paper]">
            See the builds
          </a>
        </div>
        <p className="mt-4 text-sm text-[--ink]/55">{d.ctaNote}</p>

        <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
          {d.stats.map(([v, l]) => (
            <div key={l} className="dcard p-5">
              <div className="display tnum text-3xl text-[--red]">{v}</div>
              <div className="mt-1 text-sm text-[--ink-dim]">{l}</div>
            </div>
          ))}
        </div>

        <h2 className="eyebrow mt-20">Pricing</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {d.offers.map((o) => (
            <div key={o.name} className="dcard flex flex-col p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[--ink]/50">{o.name}</p>
              <div className="display tnum mt-2 text-4xl text-[--red]">{o.price}</div>
              <p className="mt-3 text-[15px] leading-relaxed text-[--ink]">{o.line}</p>
              <ul className="mt-5 space-y-2 text-[15px] text-[--ink-dim]">
                {o.points.map((p) => (
                  <li key={p} className="flex gap-2"><span aria-hidden className="text-[--red]">→</span>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="eyebrow mt-20">{d.buildsTitle}</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {d.builds.map((b) => (
            <div key={b.t} className="dcard p-6">
              <h3 className="font-body text-lg font-semibold text-[--ink]">{b.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[--ink-dim]">{b.d}</p>
            </div>
          ))}
        </div>

        {d.demos && d.demos.length > 0 && (
          <>
            <h2 className="eyebrow mt-20">Watch a build</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {d.demos.map((v) => (
                <figure key={v.url} className="dcard overflow-hidden">
                  <div className="aspect-video">
                    <iframe src={v.url} title={v.title} loading="lazy" allowFullScreen className="h-full w-full" />
                  </div>
                  <figcaption className="p-4 text-sm font-semibold">{v.title}</figcaption>
                </figure>
              ))}
            </div>
          </>
        )}

        <h2 id="work" className="eyebrow mt-20 scroll-mt-24">Case studies</h2>
        <p className="mt-3 max-w-xl text-[--ink-dim]">Real projects. Every figure was measured after delivery, not projected before it.</p>
        <div className="mt-6 space-y-8">
          {d.cases.map((cs, i) => (
            <article key={cs.title} className="dcard overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <div className="p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[--ink]/50">
                    <span className="display mr-3 text-base text-[--ink]/30">0{i + 1}</span>{cs.client}
                  </p>
                  <h3 className="display mt-3 text-[--ink] text-[clamp(1.5rem,3vw,2.2rem)]">{cs.title}</h3>
                  <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-[--red]">The problem</p>
                  <p className="mt-2 leading-relaxed text-[--ink-dim]">{cs.problem}</p>
                  <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-[--gold]">What we built</p>
                  <p className="mt-2 leading-relaxed text-[--ink-dim]">{cs.built}</p>
                  {cs.link && (
                    <Link href={cs.link.href} className="mt-5 inline-block font-semibold underline underline-offset-2 hover:text-[--red]">{cs.link.label} →</Link>
                  )}
                </div>
                <div className="flex flex-col justify-center gap-7 border-t border-[--ink]/10 bg-[--paper3] p-8 md:border-l md:border-t-0">
                  {cs.results.map(([m, l]) => (
                    <div key={l}>
                      <div className="display tnum text-4xl text-[--red]">{m}</div>
                      <div className="mt-1 text-sm text-[--ink-dim]">{l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-[--ink]/55">More, including trading systems: <Link href="/case-studies" className="underline underline-offset-2 hover:text-[--red]">all case studies</Link></p>

        <h2 className="eyebrow mt-20">Free samples</h2>
        <div className="dcard mt-6 p-7">
          <p className="text-[17px] leading-relaxed text-[--ink]">
            140 ready-to-import n8n workflows, free. Open one and judge the quality of the work before you talk to us.
          </p>
          <ul className="mt-5 grid grid-cols-1 gap-2 text-[15px] text-[--ink-dim] md:grid-cols-2">
            {d.samples.map((s) => (
              <li key={s} className="flex gap-2"><span aria-hidden className="text-[--red]">→</span>{s}</li>
            ))}
          </ul>
          <Link href="/packs" className="mt-6 inline-block font-semibold underline underline-offset-2 hover:text-[--red]">Browse the sample library →</Link>
        </div>

        <h2 className="eyebrow mt-20">How it works</h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {d.steps.map(([t, s], i) => (
            <div key={t} className="dcard p-6">
              <div className="display text-3xl text-[--ink]/30">{i + 1}</div>
              <h3 className="mt-2 font-body text-lg font-semibold">{t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-[--ink-dim]">{s}</p>
            </div>
          ))}
        </div>

        <h2 className="eyebrow mt-20">Who builds it</h2>
        <div className="dcard mt-6 p-7">
          <p className="text-[17px] leading-relaxed text-[--ink]">
            Archit Mittal. Former prop-shop quant, now building AI agents and automation systems full time. Speaker at IIT Bombay Techfest, featured on CNBC Awaaz, followed by 10,000+ people on LinkedIn for automation builds.
          </p>
          <a href="https://linkedin.com/in/automate-archit" className="mt-4 inline-block font-semibold underline underline-offset-2 hover:text-[--red]">LinkedIn →</a>
        </div>

        <h2 className="eyebrow mt-20">Common questions</h2>
        <div className="mt-6 space-y-4">
          {d.faq.map((f) => (
            <details key={f.q} className="dcard p-6">
              <summary className="cursor-pointer font-body text-lg font-semibold">{f.q}</summary>
              <p className="mt-3 leading-relaxed text-[--ink-dim]">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="display text-[--ink] text-[clamp(2.2rem,6vw,4.5rem)]">{d.closing[0]}<br /><span className="text-[--red]">{d.closing[1]}</span></h2>
          <a href={CALL_URL} className={`${btn} mt-8`}>Book a free 15-min call →</a>
          <p className="mt-4 text-sm text-[--ink]/55">Or email <a href="mailto:archit.akg13@gmail.com" className="underline underline-offset-2">archit.akg13@gmail.com</a></p>
        </div>
      </div>
    </main>
  )
}
