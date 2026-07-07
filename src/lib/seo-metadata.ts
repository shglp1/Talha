import type { Metadata } from 'next'
import type { SiteContent } from '@/lib/supabase'
import type { Lang } from '@/lib/translations'
import { getPublicContent } from '@/lib/content-server'
import { defaultFor } from '@/lib/contentSchema'

const DEFAULT_SITE_URL = 'https://www.drtalha-law.com'

function seoText(rows: SiteContent[], key: string, lang: Lang): string {
  const row = rows.find(r => r.section === 'seo' && r.key === key)
  const fallback = defaultFor('seo', key, lang)
  if (!row) return fallback
  const val = lang === 'ar' ? row.value_ar : row.value_en
  return val?.trim() || fallback
}

function seoSingle(rows: SiteContent[], key: string, fallback = ''): string {
  const row = rows.find(r => r.section === 'seo' && r.key === key)
  if (!row) return fallback
  return row.value_ar?.trim() || row.value_en?.trim() || fallback
}

function resolveOgImage(rows: SiteContent[], siteUrl: string): string {
  const custom = seoSingle(rows, 'og_image')
  if (custom) return custom
  const hero = rows.find(r => r.section === 'photos' && r.key === 'hero-banner')
  if (hero?.value_ar?.trim()) return hero.value_ar.trim()
  return '/assets/hero-banner.jpg'
}

export async function getSeoMetadata(lang: Lang): Promise<Metadata> {
  let rows: SiteContent[] = []
  try {
    const data = await getPublicContent()
    rows = data.site_content
  } catch {
    /* use schema defaults */
  }

  const title = seoText(rows, 'title', lang)
  const description = seoText(rows, 'description', lang)
  const ogTitle = seoText(rows, 'og_title', lang) || title
  const ogDescription = seoText(rows, 'og_description', lang) || description
  const siteUrl = seoSingle(rows, 'site_url', DEFAULT_SITE_URL)
  const ogImage = resolveOgImage(rows, siteUrl)

  const imageEntry = ogImage.startsWith('http')
    ? { url: ogImage }
    : { url: ogImage, width: 1536, height: 589 }

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    icons: {
      icon: '/site-icon.png',
      apple: '/site-icon.png',
    },
    alternates: {
      canonical: `/${lang}`,
      languages: { ar: '/ar', en: '/en' },
    },
    openGraph: {
      type: 'website',
      locale: lang === 'ar' ? 'ar_SA' : 'en_US',
      alternateLocale: lang === 'ar' ? 'en_US' : 'ar_SA',
      url: `/${lang}`,
      title: ogTitle,
      description: ogDescription,
      images: [imageEntry],
    },
    twitter: { card: 'summary_large_image', title: ogTitle, description: ogDescription },
  }
}
