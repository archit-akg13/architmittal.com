'use client'
import { useState } from 'react'
import Script from 'next/script'

declare global { interface Window { Cashfree?: (opts: { mode: string }) => { checkout: (o: { paymentSessionId: string; redirectTarget: string }) => void } } }

export default function BookForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [error, setError] = useState('')
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => { setForm({ ...form, [k]: e.target.value }); if (status === 'error') setStatus('idle') }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading'); setError('')
    try {
      const res = await fetch('/api/book/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok || !data.paymentSessionId) { setStatus('error'); setError(data.error || 'Could not start the payment.'); return }
      // Same flow as the live indicators store: Cashfree JS SDK v3 hosted checkout.
      const cf = typeof window.Cashfree === 'function' ? window.Cashfree({ mode: data.mode || 'production' }) : null
      if (cf?.checkout) cf.checkout({ paymentSessionId: data.paymentSessionId, redirectTarget: '_self' })
      else { setStatus('error'); setError('Checkout script did not load — refresh and try again.') }
    } catch { setStatus('error'); setError('Network error — try once more.') }
  }

  const input = 'h-12 w-full rounded-lg border border-[--ink]/25 bg-white px-4 text-base text-[--ink] placeholder:text-[--ink]/40 outline-none transition-[border-color,box-shadow] duration-150 hover:border-[--ink]/50 focus-visible:border-[--red] focus-visible:ring-2 focus-visible:ring-[--red]/30'
  return (
    <>
    <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="afterInteractive" />
    <form onSubmit={submit} noValidate className="dcard h-fit p-7">
      <div className="flex items-baseline justify-between">
        <span className="display tnum text-4xl text-[--red]">₹2,999</span>
        <span className="text-sm text-[--ink-dim]">45 min · Google Meet</span>
      </div>
      <div className="mt-6 space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Name</span>
          <input className={input} value={form.name} onChange={set('name')} autoComplete="name" placeholder="Your name" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Email</span>
          <input className={input} type="email" required value={form.email} onChange={set('email')} autoComplete="email" placeholder="you@company.in" aria-invalid={status === 'error'} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Phone (for the invoice)</span>
          <input className={input} type="tel" inputMode="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" placeholder="98765 43210" />
        </label>
      </div>
      <button type="submit" disabled={status === 'loading'}
        className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-md bg-[--red] font-body text-base font-semibold text-white transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--gold] disabled:cursor-progress disabled:opacity-60">
        {status === 'loading' ? 'Taking you to payment…' : 'Pay ₹2,999 & pick a slot →'}
      </button>
      <p className="mt-3 min-h-[1.25rem] text-sm text-red-600" aria-live="polite">{status === 'error' ? error : ''}</p>
      <p className="mt-1 text-xs text-[--ink]/50">Cashfree secure checkout · UPI, cards, netbanking. After payment you pick your slot on the calendar.</p>
    </form>
    </>
  )
}
