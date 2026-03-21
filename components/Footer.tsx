'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SOCIAL_LINKS, NAV_LINKS, SITE_NAME, SITE_TAGLINE } from '@/lib/constants'
import SocialIcon from './SocialIcon'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async (e: React.FormEvent) => {
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
        setMessage('Subscribed!')
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

  return (
    <footer className="bg-dark text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading font-bold text-lg text-white mb-2">{SITE_NAME}</h3>
            <p className="text-subtle text-sm font-body">{SITE_TAGLINE}</p>
            <div className="flex gap-3 mt-4">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-subtle hover:text-lime transition-colors"
                  aria-label={link.name}
                >
                  <SocialIcon name={link.icon} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-white mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-subtle hover:text-lime text-sm font-body transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Email subscribe */}
          <div>
            <h4 className="font-heading font-semibold text-sm text-white mb-3">Stay Updated</h4>
            {status === 'success' ? (
              <p className="text-lime text-sm font-body flex items-center gap-2">
                <span className="animate-checkmark inline-block">&#10003;</span> {message}
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-subtle focus:outline-none focus:border-lime"
                />
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-subtle focus:outline-none focus:border-lime"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="bg-lime hover:bg-lime-dark text-white px-4 py-2 rounded-lg text-sm font-heading font-semibold transition-colors disabled:opacity-50"
                  >
                    {status === 'loading' ? '...' : 'Join'}
                  </button>
                </div>
                {status === 'error' && <p className="text-red-400 text-xs">{message}</p>}
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-subtle text-xs font-body">
          &copy; {new Date().getFullYear()} {SITE_NAME} | {SITE_TAGLINE}
        </div>
      </div>
    </footer>
  )
}
