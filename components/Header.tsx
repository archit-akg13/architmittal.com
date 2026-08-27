'use client'

import { useState } from 'react'
import Link from 'next/link'
import { NAV_LINKS, CAL_URL } from '@/lib/constants'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-[--ink]/10 bg-[#FBF7EF]/97 backdrop-blur-md shadow-[0_1px_0_rgba(22,19,14,.08)]">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="display text-xl text-[--ink]">
          Archit Mittal
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-body text-[--ink-dim] transition-colors hover:text-[--ink]"
            >
              {link.name}
            </Link>
          ))}
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-[--red] px-4 py-2 font-body text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Book a Call
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[--ink]"
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
        <div className="md:hidden space-y-3 border-t border-[--ink]/10 bg-[#FBF7EF] px-4 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block font-body text-[--ink-dim] transition-colors hover:text-[--ink]"
            >
              {link.name}
            </Link>
          ))}
          <a
            href={CAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-md bg-[--red] px-4 py-2 text-center font-body font-semibold text-white"
          >
            Book a Call
          </a>
        </div>
      )}
    </header>
  )
}
