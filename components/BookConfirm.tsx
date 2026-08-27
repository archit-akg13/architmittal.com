'use client'
import { useEffect, useState } from 'react'

export default function BookConfirm() {
  const [state, setState] = useState<'checking' | 'paid' | 'unpaid' | 'error'>('checking')
  const [slotUrl, setSlotUrl] = useState<string | null>(null)

  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get('order_id')
    if (!orderId) { setState('error'); return }
    fetch(`/api/book/verify?order_id=${encodeURIComponent(orderId)}`)
      .then((r) => r.json())
      .then((d) => { setSlotUrl(d.slotUrl ?? null); setState(d.paid ? 'paid' : 'unpaid') })
      .catch(() => setState('error'))
  }, [])

  return (
    <main className="bg-[--paper] text-[--ink]">
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 sm:py-32">
        {state === 'checking' && <p className="text-lg text-[--ink-dim]">Confirming your payment…</p>}
        {state === 'paid' && (
          <>
            <p className="eyebrow">Payment received</p>
            <h1 className="display mt-3 text-[--ink] text-[clamp(2.2rem,7vw,4.5rem)]">Now pick your slot</h1>
            {slotUrl ? (
              <a href={slotUrl} className="mt-8 inline-flex h-14 items-center rounded-md bg-[--red] px-10 font-body text-base font-semibold text-white transition-transform hover:-translate-y-0.5">
                Choose a time on the calendar →
              </a>
            ) : (
              <p className="mx-auto mt-6 max-w-md text-lg text-[--ink-dim]">
                You&rsquo;ll get the calendar link on email within the hour — I&rsquo;m notified the moment you pay. Reply to that email with anything you want covered.
              </p>
            )}
            <p className="mt-6 text-sm text-[--ink]/55">Remember: the ₹2,999 comes off any done-for-you project we finalise.</p>
          </>
        )}
        {state === 'unpaid' && (
          <>
            <h1 className="display mt-3 text-[--ink] text-[clamp(2rem,6vw,3.5rem)]">Payment not completed</h1>
            <p className="mt-4 text-[--ink-dim]">If money left your account it will auto-refund. Otherwise:</p>
            <a href="/book" className="mt-6 inline-flex h-12 items-center rounded-md border-2 border-[--ink]/30 px-6 font-semibold hover:bg-[--ink] hover:text-[--paper]">Try again</a>
          </>
        )}
        {state === 'error' && <p className="text-lg text-[--ink-dim]">Could not check the order — write to archit.akg13@gmail.com with your payment screenshot.</p>}
      </div>
    </main>
  )
}
