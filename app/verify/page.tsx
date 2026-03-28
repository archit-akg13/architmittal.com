'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function VerifyContent() {
  const params = useSearchParams()
  const token = params.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid verification link.')
      return
    }
    fetch(`/api/v1/subscribe/verify?token=${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.verified) {
          setStatus('success')
          setMessage('Your email is verified!')
        } else {
          setStatus('error')
          setMessage(data.error || 'Verification failed. The link may have expired.')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      })
  }, [token])

  if (status === 'loading') {
    return (
      <div className="text-center">
        <div className="text-4xl mb-4 animate-spin">⏳</div>
        <p className="font-body text-body">Verifying your email...</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="text-5xl mb-4 animate-checkmark">✅</div>
        <h1 className="font-heading font-bold text-2xl text-heading mb-2">{message}</h1>
        <p className="font-body text-body mb-6">You&apos;re now on the list. Expect weekly automation insights.</p>
        <Link href="/welcome" className="bg-lime hover:bg-lime-dark text-white px-6 py-3 rounded-lg font-heading font-semibold transition-colors">
          See What&apos;s Next →
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="text-5xl mb-4">❌</div>
      <h1 className="font-heading font-bold text-2xl text-heading mb-2">Verification Failed</h1>
      <p className="font-body text-body mb-6">{message}</p>
      <Link href="/" className="text-lime hover:text-lime-dark font-heading font-semibold transition-colors">
        Go to Homepage →
      </Link>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-center"><p className="font-body text-body">Loading...</p></div>}>
        <VerifyContent />
      </Suspense>
    </div>
  )
}
