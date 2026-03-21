'use client'

import { useState } from 'react'

export default function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false)
  const url = `https://architmittal.com/blog/${slug}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-3 my-6">
      <span className="text-sm font-heading text-subtle">Share:</span>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-body hover:text-lime transition-colors text-sm font-body"
      >
        LinkedIn
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-body hover:text-lime transition-colors text-sm font-body"
      >
        Twitter
      </a>
      <button
        onClick={copyLink}
        className="text-body hover:text-lime transition-colors text-sm font-body"
      >
        {copied ? 'Copied!' : 'Copy Link'}
      </button>
    </div>
  )
}
