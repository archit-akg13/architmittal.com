import type { Metadata } from 'next'
import Link from 'next/link'
import { TOPMATE_URL } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Welcome',
  description: 'Welcome to the Archit Mittal automation community.',
  robots: { index: false, follow: false },
}

export default function WelcomePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
      <div className="text-5xl mb-6">🎉</div>
      <h1 className="font-heading font-bold text-3xl sm:text-4xl text-heading mb-4">
        Welcome to the Community!
      </h1>
      <p className="font-body text-body text-lg mb-8">
        You&apos;re now part of a growing group of business leaders who are automating their way to efficiency.
      </p>

      <div className="space-y-4 mb-10">
        <div className="bg-lime/5 border border-lime/20 rounded-xl p-6 text-left">
          <h3 className="font-heading font-semibold text-heading mb-2">What to expect:</h3>
          <ul className="font-body text-body text-sm space-y-2">
            <li>📧 Weekly automation insights — practical tips, not fluff</li>
            <li>💡 Case studies with real numbers (₹85K/month saved, etc.)</li>
            <li>🔧 Tool recommendations and comparison guides</li>
            <li>🤖 Early access to my automation templates</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={TOPMATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-lime hover:bg-lime-dark text-white px-6 py-3 rounded-lg font-heading font-semibold transition-colors"
        >
          Book a Free 1:1 Call
        </a>
        <Link
          href="/blog"
          className="border border-gray-300 hover:border-lime text-heading px-6 py-3 rounded-lg font-heading font-semibold transition-colors"
        >
          Read the Blog
        </Link>
      </div>

      <p className="font-body text-subtle text-sm mt-8">
        Connect with me: <a href="https://linkedin.com/in/automate-archit" className="text-lime hover:underline">LinkedIn</a> · <a href="https://x.com/automate_archit" className="text-lime hover:underline">Twitter</a>
      </p>
    </div>
  )
}
