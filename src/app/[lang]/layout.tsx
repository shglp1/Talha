import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Chatbot from '@/components/Chatbot'
import { ContentProvider } from '@/components/ContentProvider'
import LangSync from '@/components/LangSync'
import { getPublicContent } from '@/lib/content-server'
import { getSeoMetadata } from '@/lib/seo-metadata'
import type { Lang } from '@/lib/translations'

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
  if (!validLangs.includes(lang)) return {}
  return getSeoMetadata(lang)
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

  let initialData = null
  try {
    initialData = await getPublicContent()
  } catch {
    /* fall back to client fetch */
  }

  return (
    <ContentProvider lang={lang} initialData={initialData}>
      <LangSync lang={lang} />
      <Navbar lang={lang} />
      <main className="w-full max-w-full overflow-x-clip">{children}</main>
      <Footer lang={lang} />
      <Chatbot lang={lang} />
    </ContentProvider>
  )
}
