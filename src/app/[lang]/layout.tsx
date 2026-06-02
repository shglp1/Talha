import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Chatbot from '@/components/Chatbot'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'

const validLangs: Lang[] = ['ar', 'en']

export async function generateStaticParams() {
  return validLangs.map(lang => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang: rawLang } = await params
  const lang = rawLang as Lang

  if (lang === 'ar') {
    return {
      title: 'مكتب د. طلحة غوث للمحاماة والاستشارات القانونية | جدة',
      description: 'مكتب قانوني متخصص في جدة يقدم استشارات وخدمات قانونية متكاملة للأعمال والأفراد والأوقاف والتركات. خبرة أكثر من 15 عاماً في القانون السعودي.',
      alternates: { canonical: '/ar', languages: { 'en': '/en' } },
    }
  }
  return {
    title: 'Dr. Talha Ghawth Law Office | Jeddah, Saudi Arabia',
    description: 'Specialized law office in Jeddah providing comprehensive legal services for businesses, individuals, endowments and estates. Over 15 years of Saudi law expertise.',
    alternates: { canonical: '/en', languages: { 'ar': '/ar' } },
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang: rawLang } = await params
  if (!validLangs.includes(rawLang as Lang)) notFound()
  const lang = rawLang as Lang
  const tr = t[lang]

  return (
    <html lang={tr.lang} dir={tr.dir}>
      <body>
        <Navbar lang={lang} />
        <main>{children}</main>
        <Footer lang={lang} />
        <Chatbot lang={lang} />
      </body>
    </html>
  )
}
