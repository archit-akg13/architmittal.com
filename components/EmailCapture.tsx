'use client'

import { useState } from 'react'

type Variant = 'block' | 'inline' | 'blog'

export default function EmailCapture({
  variant = 'block',
  heading = 'Join 500+ business leaders getting weekly automation insights',
  subheading,
}: {
  variant?: Variant
  heading?: string
  subheading?: string
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

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
        setMessage(data.message || 'Subscribed successfully!')
        setName('')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong')
    }
  }

  if (status === 'success') {
    return (
      <div className={`text-center py-8 ${variant === 'blog' ? 'bg-lime/5 border border-lime/20 rounded-xl px-6' : ''}`}>
        <span className="text-lime text-4xl animate-checkmark inline-block mb-2">&#10003;</span>
        <p className="font-heading font-semibold text-heading">{message}</p>
      </div>
    )
  }

  if (variant === 'blog') {
    return (
      <div className="bg-lime/5 border border-lime/20 rounded-xl p-6 my-8">
        <h4 className="font-heading font-semibold text-heading mb-1">{heading}</h4>
        {subheading && <p className="text-body text-sm font-body mb-4">{subheading}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-body focus:outline-none focus:border-lime flex-1"
          />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-body focus:outline-none focus:border-lime flex-1"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-lime hover:bg-lime-dark text-white px-5 py-2 rounded-lg font-heading font-semibold text-sm transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Joining...' : 'Get It Free'}
          </button>
        </form>
        {status === 'error' && <p className="text-red-500 text-xs mt-2">{message}</p>}
      </div>
    )
  }

  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="max-w-xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-heading font-bold text-2xl sm:text-3xl text-heading mb-3">
          {heading}
        </h2>
        {subheading && <p className="text-body font-body mb-6">{subheading}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg text-sm font-body focus:outline-none focus:border-lime flex-1"
          />
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-lg text-sm font-body focus:outline-none focus:border-lime flex-1"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-lime hover:bg-lime-dark text-white px-6 py-3 rounded-lg font-heading font-semibold text-sm transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {status === 'loading' ? 'Joining...' : 'Join Free'}
          </button>
        </form>
        {status === 'error' && <p className="text-red-500 text-xs mt-2">{message}</p>}
      </div>
    </section>
  )
}
