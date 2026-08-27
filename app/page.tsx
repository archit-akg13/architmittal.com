import Hero from '@/components/Hero'
import ServicesSection from '@/components/ServiceCard'
import StatsSection from '@/components/StatsSection'
import CaseStudyPreview from '@/components/CaseStudyPreview'
import CollageMarquee from '@/components/CollageMarquee'
import LinkedInStrip from '@/components/LinkedInStrip'
import ProofCollage from '@/components/ProofCollage'
import BlogPreview from '@/components/BlogPreview'
import EmailCapture from '@/components/EmailCapture'
import TestimonialSection from '@/components/TestimonialSection'
import AboutSnippet from '@/components/AboutSnippet'
import CTASection from '@/components/CTASection'
import { FAQ_ITEMS } from '@/lib/constants'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Hero />
      <CollageMarquee />
      <StatsSection />
      <CaseStudyPreview />
      <LinkedInStrip />
      <ServicesSection />
      <ProofCollage />
      <BlogPreview />
      <EmailCapture />
      <TestimonialSection />
      <AboutSnippet />
      <CTASection />
    </>
  )
}
