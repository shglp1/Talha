import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://talhaghawth.com'),
  title: 'د. طلحة غوث للمحاماة | Dr. Talha Ghouth Law Firm',
  description: 'د. طلحة غوث للمحاماة — مكتب قانوني متخصص في المدينة المنورة يقدم استشارات وخدمات قانونية متكاملة للأعمال والأفراد والأوقاف والتركات. Specialized law firm in Madinah offering comprehensive legal services.',
  keywords: 'محامي المدينة المنورة، مكتب محاماة، استشارات قانونية، أوقاف، تركات، قانون عمل، law firm madinah, legal consultations saudi arabia',
  authors: [{ name: 'Dr. Talha Ghouth Law Firm' }],
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    alternateLocale: 'en_US',
    title: 'د. طلحة غوث للمحاماة والاستشارات القانونية',
    description: 'شريككم القانوني الموثوق في حماية الحقوق وتحقيق العدالة',
    images: [{ url: '/assets/hero-banner.jpg', width: 1536, height: 589 }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preload" href="/fonts/thmanyah-sans-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/thmanyah-sans-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
