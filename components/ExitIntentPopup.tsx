'use client'

import { useState, useEffect } from 'react'

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('_exit_dismissed')) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) {
        setShow(true)
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [dismissed])

  const handleDismiss = () => {
    setShow(false)
    setDismissed(true)
    sessionStorage.setItem('_exit_dismissed', '1')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage('You\'re in!')
        setTimeout(handleDismiss, 2000)
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong')
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={handleDismiss}>
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 relative shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={handleDismiss} className="absolute top-4 right-4 text-subtle hover:text-heading text-xl">&times;</button>

        {status === 'success' ? (
          <div className="text-center py-4">
            <span className="text-4xl animate-checkmark inline-block mb-2">&#10003;</span>
            <p className="font-heading font-bold text-heading">{message}</p>
          </div>
        ) : (
          <>
            <h3 className="font-heading font-bold text-xl text-heading mb-2">Wait — before you go!</h3>
            <p className="font-body text-body text-sm mb-5">
              Get my free <strong>Automation ROI Calculator</strong> + weekly insights on saving ₹lakhs with AI automation.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text" placeholder="Your name" value={name}
                onChange={e => setName(e.target.value)} required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-body focus:outline-none focus:border-lime"
              />
              <input
                type="email" placeholder="your@email.com" value={email}
                onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-body focus:outline-none focus:border-lime"
              />
              <button type="submit" disabled={status === 'loading'}
                className="w-full bg-lime hover:bg-lime-dark text-white py-3 rounded-lg font-heading font-semibold transition-colors disabled:opacity-50">
                {status === 'loading' ? 'Joining...' : 'Get Free Calculator'}
              </button>
              {status === 'error' && <p className="text-red-500 text-xs text-center">{message}</p>}
            </form>
            <p className="text-subtle text-xs text-center mt-3">No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </div>
  )
}
