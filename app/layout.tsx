import type { Metadata } from 'next'
import { Poppins, Lato } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import { SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE} | AI Automation Expert`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [{ url: '/og', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    creator: '@automate_archit',
    images: ['/og'],
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Archit Mittal',
  jobTitle: 'AI Automation Expert',
  description: 'I Automate Chaos — helping businesses save lakhs through intelligent automation using Claude Code, n8n, and AI agents',
  knowsAbout: ['Business Automation', 'AI Agents', 'Claude Code', 'MCP Protocol', 'n8n', 'Workflow Automation', 'AI API Cost Optimization'],
  url: SITE_URL,
  image: `${SITE_URL}/archit-photo.jpg`,
  sameAs: [
    'https://linkedin.com/in/automate-archit',
    'https://x.com/automate_archit',
    'https://github.com/archit-akg13',
    'https://dev.to/automate-archit',
    'https://hashnode.com/@automate-archit',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body className={`${poppins.variable} ${lato.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingCTA />
        <AnalyticsTracker />
      </body>
    </html>
  )
}
