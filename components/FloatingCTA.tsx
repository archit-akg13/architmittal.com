'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { callUrlFor } from '@/lib/constants'

export default function FloatingCTA() {
  const callUrl = callUrlFor(usePathname())
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setVisible(currentScrollY > lastScrollY || currentScrollY < 100)
      setLastScrollY(currentScrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <a
      href={callUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 bg-[--red] hover:bg-[#123a85] text-white px-5 py-3 rounded-full shadow-lg font-heading font-semibold z-50 transition-all duration-300 hover:scale-105 text-sm ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
    >
      Book a Call &rarr;
    </a>
  )
}
