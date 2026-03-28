'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const ANALYTICS_KEY = '3d41cd1243db05040507aedf51b6dfbcb0fdbb9cc8452014'
const TRACK_URL = '/api/v1/track'

function getVisitorId() {
  let id = localStorage.getItem('_vid')
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('_vid', id)
  }
  return id
}

function getSessionId() {
  let sid = sessionStorage.getItem('_sid')
  if (!sid) {
    sid = Math.random().toString(36).substring(2) + Date.now().toString(36)
    sessionStorage.setItem('_sid', sid)
  }
  return sid
}

export default function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const track = () => {
      fetch(TRACK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Analytics-Key': ANALYTICS_KEY,
        },
        body: JSON.stringify({
          event_type: 'pageview',
          page_url: window.location.pathname,
          referrer: document.referrer || '',
          visitor_id: getVisitorId(),
          session_id: getSessionId(),
        }),
        keepalive: true,
      }).catch(() => {})
    }

    // Small delay to avoid tracking during SSR hydration
    const timer = setTimeout(track, 100)
    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
