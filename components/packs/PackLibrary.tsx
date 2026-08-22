'use client'
/* Hallmark · macrostructure: Stat-Led · tone: utilitarian · anchor hue: site lime (preserved)
 * nav: site Header · footer: site Footer · enrichment: none (typography only)
 * pre-emit critique: P4 H5 E4 S4 R5 V4
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import type { PackItem } from '@/app/packs/page'

type Kind = 'workflows' | 'skills'
const KEY = 'packs-unlocked'

function useCounter(target: number, ms = 500) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(target); return }
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms)
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return n
}

export default function PackLibrary({ workflows, skills }: { workflows: PackItem[]; skills: PackItem[] }) {
  const total = workflows.length + skills.length
  const shown = useCounter(total)
  const [unlocked, setUnlocked] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  const [error, setError] = useState('')
  const [kind, setKind] = useState<Kind>('workflows')
  const [pillar, setPillar] = useState('All')
  const [q, setQ] = useState('')
  const libraryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try { if (localStorage.getItem(KEY)) setUnlocked(true) } catch {}
  }, [])

  const items = kind === 'workflows' ? workflows : skills
  const pillars = useMemo(() => ['All', ...Array.from(new Set(items.map((i) => i.pillar))).sort()], [items])
  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return items.filter((i) => (pillar === 'All' || i.pillar === pillar) && (!needle || `${i.title} ${i.description ?? ''} ${(i.integrations ?? []).join(' ')}`.toLowerCase().includes(needle)))
  }, [items, pillar, q])

  const pillarCounts = useMemo(() => {
    const m = new Map<string, number>()
    for (const i of [...workflows, ...skills]) m.set(i.pillar, (m.get(i.pillar) ?? 0) + 1)
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1])
  }, [workflows, skills])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading'); setError('')
    try {
      const res = await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, source: 'packs' }) })
      const data = await res.json()
      if (!res.ok) { setStatus('error'); setError(data.error || 'Could not save that email.'); return }
      try { localStorage.setItem(KEY, new Date().toISOString()) } catch {}
      setStatus('success'); setUnlocked(true)
      setTimeout(() => libraryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
    } catch { setStatus('error'); setError('Network error — try once more.') }
  }

  return (
    <main className="bg-white text-body font-body">
      {/* ── Stat hero ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-5xl px-5 pt-20 pb-12 sm:pt-28 sm:pb-16">
        <p className="font-heading text-sm font-semibold tracking-wide text-lime-dark">Free · no card · one email</p>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-heading font-bold text-heading leading-none tabular-nums text-[6.5rem] sm:text-[9rem] md:text-[11rem]" aria-label={`${total} files`}>{shown}</span>
          <span className="font-heading text-xl sm:text-2xl text-subtle">files</span>
        </div>
        <p className="mt-4 max-w-xl text-lg sm:text-xl text-heading">
          <span className="tabular-nums font-semibold">{workflows.length}</span> n8n workflows and <span className="tabular-nums font-semibold">{skills.length}</span> Claude skills — everything I post on Instagram, in one place.
        </p>

        {!unlocked ? (
          <form onSubmit={submit} noValidate className="mt-8 max-w-md">
            <label htmlFor="packs-email" className="block text-sm font-heading font-semibold text-heading">Where should I send updates?</label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id="packs-email" type="email" inputMode="email" autoComplete="email" required
                value={email} onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
                placeholder="you@company.in" aria-invalid={status === 'error'} aria-describedby="packs-email-help"
                className={`h-12 min-h-[3rem] min-w-0 flex-1 rounded-lg border bg-white px-4 text-base text-heading placeholder:text-subtle outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-lime focus-visible:ring-2 focus-visible:ring-lime/40 ${status === 'error' ? 'border-red-500' : 'border-subtle/60 hover:border-heading/60'}`}
              />
              <button
                type="submit" disabled={status === 'loading'}
                className="h-12 shrink-0 rounded-lg border-2 border-heading px-5 font-heading text-base font-semibold text-heading transition-[background-color,color,transform] duration-150 hover:bg-heading hover:text-white active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/60 focus-visible:ring-offset-2 disabled:cursor-progress disabled:opacity-60"
              >
                {status === 'loading' ? 'Unlocking…' : 'Unlock all files'}
              </button>
            </div>
            <p id="packs-email-help" className={`mt-2 min-h-[1.25rem] text-sm ${status === 'error' ? 'text-red-600' : 'text-subtle'}`} aria-live="polite">
              {status === 'error' ? error : 'One email when a new pack drops. Unsubscribe in one click.'}
            </p>
          </form>
        ) : (
          <p className="mt-8 inline-flex items-center gap-2 rounded-lg bg-lime/10 px-4 py-2 font-heading text-sm font-semibold text-lime-dark" role="status">
            <span aria-hidden>✓</span> Unlocked — every download below is live.
          </p>
        )}
      </section>

      {/* ── Supporting stats: what's inside, by pillar ─────────── */}
      <section className="mx-auto max-w-5xl px-5 pb-12">
        <div className="border-t border-subtle/40">
          <h2 className="py-4 font-heading text-sm font-semibold uppercase tracking-wide text-subtle">What&rsquo;s inside</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {pillarCounts.map(([name, n]) => (
              <li key={name} className="flex items-baseline justify-between border-t border-subtle/30 py-3 pr-6">
                <span className="text-heading">{name}</span>
                <span className="font-heading font-semibold tabular-nums text-heading">{n}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Library ───────────────────────────────────────────── */}
      <section ref={libraryRef} className="mx-auto max-w-5xl scroll-mt-6 px-5 pb-24">
        <div className="flex flex-col gap-3 border-t border-subtle/40 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div role="tablist" aria-label="Pack type" className="inline-flex rounded-lg border border-subtle/60 p-1">
            {(['workflows', 'skills'] as Kind[]).map((k) => (
              <button key={k} role="tab" aria-selected={kind === k} onClick={() => { setKind(k); setPillar('All') }}
                className={`rounded-md px-4 py-2 font-heading text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/60 ${kind === k ? 'bg-heading text-white' : 'text-heading hover:bg-heading/5'}`}>
                {k === 'workflows' ? `n8n workflows · ${workflows.length}` : `Claude skills · ${skills.length}`}
              </button>
            ))}
          </div>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, tool, or keyword" aria-label="Search packs"
            className="h-11 min-h-[2.75rem] w-full rounded-lg border border-subtle/60 px-4 text-base text-heading placeholder:text-subtle outline-none transition-[border-color,box-shadow] duration-150 hover:border-heading/60 focus-visible:border-lime focus-visible:ring-2 focus-visible:ring-lime/40 sm:w-80" />
        </div>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {pillars.map((p) => (
            <button key={p} aria-pressed={pillar === p} onClick={() => setPillar(p)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/60 ${pillar === p ? 'border-heading bg-heading text-white' : 'border-subtle/60 text-heading hover:border-heading'}`}>
              {p}
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm text-subtle tabular-nums" aria-live="polite">{visible.length} of {items.length}</p>

        <ol className="mt-2 border-t border-subtle/40">
          {visible.map((i) => (
            <li key={i.id} className="grid grid-cols-1 gap-2 border-b border-subtle/30 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6">
              <div className="min-w-0">
                <h3 className="font-heading font-semibold text-heading [overflow-wrap:anywhere]">{i.title}</h3>
                {i.description && <p className="mt-1 line-clamp-2 text-sm text-body">{i.description}</p>}
                <p className="mt-1 text-xs text-subtle">
                  {i.pillar}
                  {typeof i.nodes === 'number' && <> · <span className="tabular-nums">{i.nodes}</span> nodes</>}
                  {i.integrations?.length ? <> · {i.integrations.slice(0, 4).join(', ')}{i.integrations.length > 4 ? ` +${i.integrations.length - 4}` : ''}</> : null}
                </p>
              </div>
              {unlocked ? (
                <a href={i.file} download className="inline-flex h-10 items-center justify-center rounded-lg border border-heading px-4 font-heading text-sm font-semibold text-heading transition-[background-color,color] duration-150 hover:bg-heading hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/60 focus-visible:ring-offset-2">
                  Download {kind === 'workflows' ? 'JSON' : '.md'}
                </a>
              ) : (
                <button type="button" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => document.getElementById('packs-email')?.focus(), 400) }}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-dashed border-subtle px-4 font-heading text-sm font-semibold text-subtle transition-colors duration-150 hover:border-heading hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/60">
                  Unlock to download
                </button>
              )}
            </li>
          ))}
          {!visible.length && <li className="py-10 text-center text-subtle">Nothing matches — try a broader word.</li>}
        </ol>

        <p className="mt-10 max-w-xl text-sm text-subtle">
          Workflows import into n8n via <em>Import from file</em>. Skills drop into <code className="rounded bg-heading/5 px-1">.claude/skills/</code>. New ones land here first, then on <a href="https://www.instagram.com/learnaiwitharchit/" className="underline decoration-subtle underline-offset-2 hover:text-heading">@learnaiwitharchit</a>.
        </p>
      </section>
    </main>
  )
}
