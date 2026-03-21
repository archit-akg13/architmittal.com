import type { Metadata } from 'next'
import { TOPMATE_URL, SITE_EMAIL } from '@/lib/constants'
import ContactForm from '@/components/ContactForm'
import SocialIcon from '@/components/SocialIcon'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch for automation consulting. Book a free consultation or send a detailed inquiry.',
}

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-heading font-bold text-3xl sm:text-4xl text-heading mb-3">
        Let&apos;s Work Together
      </h1>
      <p className="font-body text-body mb-10 max-w-2xl">
        Tell me about your automation needs and I&apos;ll get back to you within 24 hours.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        <div className="space-y-6">
          <div className="bg-lime/5 border border-lime/20 rounded-xl p-6">
            <h3 className="font-heading font-semibold text-heading mb-2">Need urgent help?</h3>
            <p className="font-body text-body text-sm mb-3">
              Book a free 1:1 consultation directly.
            </p>
            <a
              href={TOPMATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-lime hover:bg-lime-dark text-white px-5 py-2 rounded-lg font-heading font-semibold text-sm transition-colors"
            >
              Book on Topmate
            </a>
          </div>

          <div className="border border-gray-200 rounded-xl p-6">
            <h3 className="font-heading font-semibold text-heading mb-3">Direct Contact</h3>
            <p className="font-body text-body text-sm mb-4">
              Email: <a href={`mailto:${SITE_EMAIL}`} className="text-lime hover:text-lime-dark transition-colors">{SITE_EMAIL}</a>
            </p>
            <div className="flex gap-3">
              <a href="https://linkedin.com/in/automate-archit" target="_blank" rel="noopener noreferrer" className="text-subtle hover:text-lime transition-colors">
                <SocialIcon name="linkedin" className="w-5 h-5" />
              </a>
              <a href="https://x.com/automate_archit" target="_blank" rel="noopener noreferrer" className="text-subtle hover:text-lime transition-colors">
                <SocialIcon name="twitter" className="w-5 h-5" />
              </a>
              <a href="https://github.com/archit-akg13" target="_blank" rel="noopener noreferrer" className="text-subtle hover:text-lime transition-colors">
                <SocialIcon name="github" className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
