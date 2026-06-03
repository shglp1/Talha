'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { SiteContent, ContentItem, Partner } from '@/lib/supabase'
import { defaultListItems } from '@/lib/contentSchema'
import type { Lang } from '@/lib/translations'

/**
 * Loads all CMS data from /api/content (server + service role) so the public
 * site always matches the database. Refetches when the tab gains focus so edits
 * from the admin panel appear after save + refresh/focus.
 */

export type LocalItem = { id?: string; title: string; desc: string; icon: string | null }
export type ExtraField = { key: string; slot: string; value: string }

type ContentValue = {
  lang: Lang
  loading: boolean
  refresh: () => void
  ov: (section: string, key: string, fallback: string) => string
  photoUrl: (key: string, fallback: string) => string
  hidden: (section: string, key: string) => boolean
  list: (section: string, fallback: LocalItem[]) => LocalItem[]
  extras: (section: string) => ExtraField[]
  partners: Partner[]
}

const ContentContext = createContext<ContentValue | null>(null)

type Payload = {
  site_content: SiteContent[]
  content_items: ContentItem[]
  partners: Partner[]
}

export function ContentProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const [scalars, setScalars] = useState<Record<string, SiteContent>>({})
  const [items, setItems] = useState<Record<string, ContentItem[]>>({})
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  const applyPayload = useCallback((payload: Payload) => {
    const nextScalars: Record<string, SiteContent> = {}
    for (const row of payload.site_content) {
      nextScalars[`${row.section}.${row.key}`] = row
    }
    setScalars(nextScalars)

    const nextItems: Record<string, ContentItem[]> = {}
    for (const row of payload.content_items) {
      ;(nextItems[row.section] ??= []).push(row)
    }
    setItems(nextItems)
    setPartners(payload.partners)
  }, [])

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch('/api/content', { cache: 'no-store' })
      if (!res.ok) return
      const payload = (await res.json()) as Payload
      applyPayload(payload)
    } catch {
      /* keep previous data on transient errors */
    } finally {
      setLoading(false)
    }
  }, [applyPayload])

  useEffect(() => {
    fetchContent()
    const onFocus = () => fetchContent()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [fetchContent])

  const hidden = useCallback(
    (section: string, key: string) => {
      const row = scalars[`${section}.${key}__vis`]
      return row?.value_ar === '0'
    },
    [scalars],
  )

  const ov = useCallback(
    (section: string, key: string, fallback: string) => {
      // Photo URLs must never be blanked by visibility flags or empty overrides.
      if (section === 'photos') {
        const row = scalars[`photos.${key}`]
        const v = row?.value_ar || row?.value_en
        return v && v.trim() ? v.trim() : fallback
      }
      if (hidden(section, key)) return ''
      const row = scalars[`${section}.${key}`]
      if (!row) return fallback
      const v = lang === 'ar' ? row.value_ar : row.value_en
      return v && v.trim() ? v : fallback
    },
    [scalars, lang, hidden],
  )

  const photoUrl = useCallback(
    (key: string, fallback: string) => ov('photos', key, fallback),
    [ov],
  )

  const list = useCallback(
    (section: string, fallback: LocalItem[]) => {
      const rows = items[section]
      if (!rows || rows.length === 0) return fallback
      const defaults = defaultListItems(section)
      return rows.map((r, i) => ({
        id: r.id,
        title: lang === 'ar' ? r.title_ar : r.title_en,
        desc: lang === 'ar' ? r.desc_ar : r.desc_en,
        icon: r.icon ?? defaults[i]?.icon ?? fallback[i]?.icon ?? null,
      }))
    },
    [items, lang],
  )

  const extras = useCallback(
    (section: string): ExtraField[] => {
      return Object.values(scalars)
        .filter(r => r.section === section && r.is_custom)
        .map(r => ({
          key: r.key,
          slot: r.slot ?? 'body',
          value: lang === 'ar' ? r.value_ar : r.value_en,
        }))
        .filter(e => e.value && e.value.trim())
        .sort((a, b) => {
          const ra = scalars[`${section}.${a.key}`]?.display_order ?? 0
          const rb = scalars[`${section}.${b.key}`]?.display_order ?? 0
          return ra - rb
        })
    },
    [scalars, lang],
  )

  return (
    <ContentContext.Provider value={{ lang, loading, refresh: fetchContent, ov, photoUrl, hidden, list, extras, partners }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent(): ContentValue {
  const ctx = useContext(ContentContext)
  if (!ctx) {
    return {
      lang: 'ar',
      loading: false,
      refresh: () => {},
      ov: (_s, _k, fallback) => fallback,
      photoUrl: (_k, fallback) => fallback,
      hidden: () => false,
      list: (_s, fallback) => fallback,
      extras: () => [],
      partners: [],
    }
  }
  return ctx
}
