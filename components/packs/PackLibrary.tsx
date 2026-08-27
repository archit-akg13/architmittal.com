'use client'
/* Hallmark · redesign (in-place) · macrostructure: Ecosystem Index · tone: utilitarian · anchor hue: site lime (preserved)
 * Instagram-profile layout: avatar header, stat row, tab bar, 3-col post grid; library lists behind tabs.
 * pre-emit critique: P4 H5 E4 S4 R5 V4
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import type { PackItem } from '@/app/packs/page'
import PackFeed, { type FeedItem } from './PackFeed'

type Tab = 'feed' | 'workflows' | 'skills'
const KEY = 'packs-unlocked'

export default function PackLibrary({ workflows, skills, feed = [] }: { workflows: PackItem[]; skills: PackItem[]; feed?: FeedItem[] }) {
  const total = workflows.length + skills.length
  const [unlocked, setUnlocked] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>(feed.length ? 'feed' : 'workflows')
  const [pillar, setPillar] = useState('All')
  const [q, setQ] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    try { if (localStorage.getItem(KEY)) setUnlocked(true) } catch {}
  }, [])

  const items = tab === 'skills' ? skills : workflows
  const pillars = useMemo(() => ['All', ...Array.from(new Set(items.map((i) => i.pillar))).sort()], [items])
  const visible = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return items.filter((i) => (pillar === 'All' || i.pillar === pillar) && (!needle || `${i.title} ${i.description ?? ''} ${(i.integrations ?? []).join(' ')}`.toLowerCase().includes(needle)))
  }, [items, pillar, q])

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
    } catch { setStatus('error'); setError('Network error — try once more.') }
  }

  function jumpToForm() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => formRef.current?.querySelector('input')?.focus(), 400)
  }

  const tabBtn = (t: Tab, label: string) => (
    <button key={t} role="tab" aria-selected={tab === t} onClick={() => { setTab(t); setPillar('All'); setQ('') }}
      className={`flex-1 border-t-2 py-3 font-heading text-xs font-semibold uppercase tracking-wide transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/60 sm:text-sm ${tab === t ? 'border-heading text-heading' : 'border-transparent text-subtle hover:text-heading'}`}>
      {label}
    </button>
  )

  return (
    <main className="bg-white text-body font-body">
      <div className="mx-auto max-w-4xl px-3 sm:px-5">

        {/* ── Instagram-style profile header ─────────────────── */}
        <header className="flex items-center gap-4 pt-8 sm:gap-8 sm:pt-12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/packs/avatar.png" alt="Archit Mittal" width={96} height={96}
            className="h-20 w-20 shrink-0 rounded-full border border-subtle/40 bg-lime/10 object-cover object-top sm:h-24 sm:w-24" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-heading text-xl font-bold text-heading">learnaiwitharchit</h1>
              <a href="https://www.instagram.com/learnaiwitharchit/" target="_blank" rel="noopener noreferrer"
                className="rounded-lg bg-lime px-4 py-1.5 font-heading text-sm font-semibold text-white transition-colors duration-150 hover:bg-lime-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/60 focus-visible:ring-offset-2">
                Follow
              </a>
            </div>
            <ul className="mt-2 flex gap-5 text-sm">
              <li><span className="font-heading font-bold tabular-nums text-heading">{feed.length}</span> posts</li>
              <li><span className="font-heading font-bold tabular-nums text-heading">{total}</span> free files</li>
            </ul>
            <p className="mt-2 hidden text-sm sm:block">Every tool from my reels — the name I hid in the post is one tap away here.</p>
          </div>
        </header>
        <p className="mt-3 text-sm sm:hidden">Every tool from my reels — the name I hid in the post is one tap away here.</p>

        {/* ── Gate: one email unlocks every button ───────────── */}
        {!unlocked ? (
          <form ref={formRef} onSubmit={submit} noValidate className="mt-6 rounded-xl border border-subtle/40 bg-lime/5 p-4">
            <label htmlFor="packs-email" className="block font-heading text-sm font-semibold text-heading">One email unlocks all {total} resources</label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input id="packs-email" type="email" inputMode="email" autoComplete="email" required
                value={email} onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle') }}
                placeholder="you@company.in" aria-invalid={status === 'error'} aria-describedby="packs-email-help"
                className={`h-12 min-h-[3rem] min-w-0 flex-1 rounded-lg border bg-white px-4 text-base text-heading placeholder:text-subtle outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-lime focus-visible:ring-2 focus-visible:ring-lime/40 ${status === 'error' ? 'border-red-500' : 'border-subtle/60 hover:border-heading/60'}`} />
              <button type="submit" disabled={status === 'loading'}
                className="h-12 shrink-0 rounded-lg border-2 border-heading px-5 font-heading text-base font-semibold text-heading transition-[background-color,color,transform] duration-150 hover:bg-heading hover:text-white active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/60 focus-visible:ring-offset-2 disabled:cursor-progress disabled:opacity-60">
                {status === 'loading' ? 'Unlocking…' : 'Unlock'}
              </button>
            </div>
            <p id="packs-email-help" className={`mt-2 min-h-[1.25rem] text-sm ${status === 'error' ? 'text-red-600' : 'text-subtle'}`} aria-live="polite">
              {status === 'error' ? error : 'Free. One email when a new pack drops; unsubscribe in one click.'}
            </p>
          </form>
        ) : (
          <p className="mt-6 inline-flex items-center gap-2 rounded-lg bg-lime/10 px-4 py-2 font-heading text-sm font-semibold text-lime-dark" role="status">
            <span aria-hidden>✓</span> Unlocked — every resource below is one tap away.
          </p>
        )}

        {/* ── IG-style tab bar ───────────────────────────────── */}
        <div role="tablist" aria-label="Sections" className="mt-6 flex border-t border-subtle/40">
          {tabBtn('feed', `⊞ Posts`)}
          {tabBtn('workflows', `n8n · ${workflows.length}`)}
          {tabBtn('skills', `Skills · ${skills.length}`)}
        </div>

        {/* ── Feed grid ──────────────────────────────────────── */}
        {tab === 'feed' && (
          <section className="pb-24 pt-3">
            <PackFeed items={feed} unlocked={unlocked} onLockedClick={jumpToForm} />
            {!feed.length && <p className="py-10 text-center text-subtle">Posts appear here the moment they publish.</p>}
          </section>
        )}

        {/* ── Library lists ──────────────────────────────────── */}
        {tab !== 'feed' && (
          <section className="pb-24 pt-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, tool, or keyword" aria-label="Search packs"
                className="h-11 min-h-[2.75rem] w-full rounded-lg border border-subtle/60 px-4 text-base text-heading placeholder:text-subtle outline-none transition-[border-color,box-shadow] duration-150 hover:border-heading/60 focus-visible:border-lime focus-visible:ring-2 focus-visible:ring-lime/40 sm:w-80" />
              <p className="text-sm text-subtle tabular-nums" aria-live="polite">{visible.length} of {items.length}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {pillars.map((p) => (
                <button key={p} aria-pressed={pillar === p} onClick={() => setPillar(p)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/60 ${pillar === p ? 'border-heading bg-heading text-white' : 'border-subtle/60 text-heading hover:border-heading'}`}>
                  {p}
                </button>
              ))}
            </div>
            <ol className="mt-4 border-t border-subtle/40">
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
                      Download {tab === 'workflows' ? 'JSON' : '.md'}
                    </a>
                  ) : (
                    <button type="button" onClick={jumpToForm}
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-dashed border-subtle px-4 font-heading text-sm font-semibold text-subtle transition-colors duration-150 hover:border-heading hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/60">
                      Unlock to download
                    </button>
                  )}
                </li>
              ))}
              {!visible.length && <li className="py-10 text-center text-subtle">Nothing matches — try a broader word.</li>}
            </ol>
            <p className="mt-10 max-w-xl text-sm text-subtle">
              Workflows import into n8n via <em>Import from file</em>. Skills drop into <code className="rounded bg-heading/5 px-1">.claude/skills/</code>.
            </p>
          </section>
        )}
      </div>
    </main>
  )
}
