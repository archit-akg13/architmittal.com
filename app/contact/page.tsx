import type { Metadata } from 'next'
import { TOPMATE_URL, SITE_EMAIL } from '@/lib/constants'
import ContactForm from '@/components/ContactForm'
import SocialIcon from '@/components/SocialIcon'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch for AI & automation consulting — algo trading systems, custom AI agents, and business automation.',
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
              Book a 1:1 consultation directly.
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

      <section className="mt-16 pt-8 border-t border-gray-200">
        <h2 className="font-heading font-semibold text-lg text-heading mb-1">Contact Us</h2>
        <p className="font-body text-subtle text-xs mb-5">Last updated on 22-04-2026 09:33:38</p>
        <div className="font-body text-body text-sm space-y-2 max-w-2xl">
          <p>You may contact us using the information below:</p>
          <p><span className="font-semibold">Merchant Legal entity name:</span> AUTOMATE ALGOS PRIVATE LIMITED</p>
          <p><span className="font-semibold">Registered Address:</span> 32D/328A/20D SUBHASH NAGAR KARMYOGI, ROAD, Agra, Agra, UP, IN - 282005, Agra, UP, PIN: 282005</p>
          <p><span className="font-semibold">Operational Address:</span> 32D/328A/20D SUBHASH NAGAR KARMYOGI, ROAD, Agra, Agra, UP, IN - 282005, Agra, UP, PIN: 282005</p>
          <p><span className="font-semibold">Telephone No:</span> <a href="tel:+919258755461" className="text-lime hover:text-lime-dark transition-colors">9258755461</a></p>
          <p><span className="font-semibold">E-Mail ID:</span> <a href={`mailto:${SITE_EMAIL}`} className="text-lime hover:text-lime-dark transition-colors">{SITE_EMAIL}</a></p>
        </div>
      </section>
    </div>
  )
}
