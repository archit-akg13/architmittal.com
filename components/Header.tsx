'use client'

import { useState } from 'react'
import Link from 'next/link'
import { NAV_LINKS, TOPMATE_URL } from '@/lib/constants'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-heading font-bold text-xl text-heading">
          Archit Mittal
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-body hover:text-heading transition-colors text-sm font-body"
            >
              {link.name}
            </Link>
          ))}
          <a
            href={TOPMATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-lime hover:bg-lime-dark text-white px-4 py-2 rounded-lg text-sm font-heading font-semibold transition-colors"
          >
            Book a Call
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-heading"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-body hover:text-heading transition-colors font-body"
            >
              {link.name}
            </Link>
          ))}
          <a
            href={TOPMATE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-lime text-white px-4 py-2 rounded-lg text-center font-heading font-semibold"
          >
            Book a Call
          </a>
        </div>
      )}
    </header>
  )
}
