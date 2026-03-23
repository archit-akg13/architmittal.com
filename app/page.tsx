import Hero from '@/components/Hero'
import SocialProofBar from '@/components/SocialProofBar'
import ServicesSection from '@/components/ServiceCard'
import StatsSection from '@/components/StatsSection'
import BlogPreview from '@/components/BlogPreview'
import EmailCapture from '@/components/EmailCapture'
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
      <SocialProofBar />
      <ServicesSection />
      <StatsSection />
      <BlogPreview />
      <EmailCapture />
      <AboutSnippet />
      <CTASection />
    </>
  )
}
