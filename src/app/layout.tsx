import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://talhaghawth.com'),
  title: 'مكتب د. طلحة غوث للمحاماة | Dr. Talha Ghawth Law Office',
  description: 'مكتب قانوني متخصص في جدة يقدم استشارات وخدمات قانونية متكاملة للأعمال والأفراد والأوقاف والتركات. Specialized law office in Jeddah offering comprehensive legal services.',
  keywords: 'محامي جدة، مكتب محاماة، استشارات قانونية، أوقاف، تركات، قانون عمل، law firm jeddah, legal consultations saudi arabia',
  authors: [{ name: 'Dr. Talha Ghawth Law Office' }],
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
    title: 'مكتب د. طلحة غوث للمحاماة والاستشارات القانونية',
    description: 'شريككم القانوني الموثوق في حماية الحقوق وتحقيق العدالة',
    images: [{ url: '/assets/hero-banner.jpg', width: 1536, height: 589 }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
