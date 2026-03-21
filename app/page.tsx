import Hero from '@/components/Hero'
import SocialProofBar from '@/components/SocialProofBar'
import ServicesSection from '@/components/ServiceCard'
import StatsSection from '@/components/StatsSection'
import BlogPreview from '@/components/BlogPreview'
import EmailCapture from '@/components/EmailCapture'
import AboutSnippet from '@/components/AboutSnippet'
import CTASection from '@/components/CTASection'

export default function Home() {
  return (
    <>
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
