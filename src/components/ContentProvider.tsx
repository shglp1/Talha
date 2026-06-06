'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { SiteContent, ContentItem, Partner } from '@/lib/supabase'
import { defaultListItems, parseHomepageLayout } from '@/lib/contentSchema'
import type { PublicContentPayload } from '@/lib/content-server'
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
  heroCarousel: (fallback?: string) => string[]
  enabled: (section: string, key: string, defaultOn?: boolean) => boolean
  hidden: (section: string, key: string) => boolean
  list: (section: string, fallback: LocalItem[]) => LocalItem[]
  extras: (section: string) => ExtraField[]
  partners: Partner[]
  partnersSeeded: boolean
  sectionLayout: () => { id: string; order: number; visible: boolean }[]
}

const ContentContext = createContext<ContentValue | null>(null)

type Payload = PublicContentPayload

function buildStateFromPayload(payload: Payload) {
  const nextScalars: Record<string, SiteContent> = {}
  for (const row of payload.site_content) {
    nextScalars[`${row.section}.${row.key}`] = row
  }

  const nextItems: Record<string, ContentItem[]> = {}
  for (const row of payload.content_items) {
    ;(nextItems[row.section] ??= []).push(row)
  }

  return {
    scalars: nextScalars,
    items: nextItems,
    partners: payload.partners,
    seededSections: new Set(payload.list_section_keys ?? []),
    managedSections: new Set(payload.managed_list_sections ?? []),
    partnersSeeded: payload.partners_seeded ?? false,
  }
}

export function ContentProvider({
  lang,
  children,
  initialData,
}: {
  lang: Lang
  children: React.ReactNode
  initialData?: Payload | null
}) {
  const initial = initialData ? buildStateFromPayload(initialData) : null
  const [scalars, setScalars] = useState<Record<string, SiteContent>>(initial?.scalars ?? {})
  const [items, setItems] = useState<Record<string, ContentItem[]>>(initial?.items ?? {})
  const [partners, setPartners] = useState<Partner[]>(initial?.partners ?? [])
  const [seededSections, setSeededSections] = useState<Set<string>>(initial?.seededSections ?? new Set())
  const [managedSections, setManagedSections] = useState<Set<string>>(initial?.managedSections ?? new Set())
  const [partnersSeeded, setPartnersSeeded] = useState(initial?.partnersSeeded ?? false)
  const [loading, setLoading] = useState(!initialData)

  const applyPayload = useCallback((payload: Payload) => {
    const next = buildStateFromPayload(payload)
    setScalars(next.scalars)
    setItems(next.items)
    setPartners(next.partners)
    setSeededSections(next.seededSections)
    setManagedSections(next.managedSections)
    setPartnersSeeded(next.partnersSeeded)
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

  const heroCarousel = useCallback(
    (fallback = '/assets/hero-banner.jpg') => {
      const defaultUrl = scalars['photos.hero-banner']?.value_ar?.trim() || fallback
      let extras: string[] = []
      const row = scalars['photos.hero-carousel']
      if (row?.value_ar) {
        try {
          const parsed = JSON.parse(row.value_ar) as unknown
          if (Array.isArray(parsed)) {
            extras = parsed.filter((u): u is string => typeof u === 'string' && u.trim().length > 0)
          }
        } catch { /* invalid JSON */ }
      }
      const seen = new Set<string>()
      const merged: string[] = []
      for (const url of [defaultUrl, ...extras]) {
        if (url && !seen.has(url)) {
          seen.add(url)
          merged.push(url)
        }
      }
      return merged
    },
    [scalars],
  )

  const enabled = useCallback(
    (section: string, key: string, defaultOn = true) => {
      const row = scalars[`${section}.${key}`]
      const v = (row?.value_ar ?? row?.value_en ?? '').trim().toLowerCase()
      if (v === '0' || v === 'false' || v === 'off') return false
      if (v === '1' || v === 'true' || v === 'on') return true
      return defaultOn
    },
    [scalars],
  )

  const list = useCallback(
    (section: string, fallback: LocalItem[]) => {
      const rows = items[section]
      const isKnown = seededSections.has(section) || managedSections.has(section)
      if (isKnown && (!rows || rows.length === 0)) return []
      if (!rows || rows.length === 0) return fallback
      const defaults = defaultListItems(section)
      return rows.map((r, i) => ({
        id: r.id,
        title: lang === 'ar' ? r.title_ar : r.title_en,
        desc: lang === 'ar' ? r.desc_ar : r.desc_en,
        icon: r.icon ?? defaults[i]?.icon ?? fallback[i]?.icon ?? null,
      }))
    },
    [items, lang, seededSections, managedSections],
  )

  const sectionLayout = useCallback(() => {
    const row = scalars['layout.homepage_sections']
    const raw = row?.value_ar || row?.value_en || ''
    return parseHomepageLayout(raw)
  }, [scalars])

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
    <ContentContext.Provider value={{ lang, loading, refresh: fetchContent, ov, photoUrl, heroCarousel, enabled, hidden, list, extras, partners, partnersSeeded, sectionLayout }}>
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
      heroCarousel: (fallback = '/assets/hero-banner.jpg') => [fallback],
      enabled: (_s, _k, defaultOn = true) => defaultOn,
      hidden: () => false,
      list: (_s, fallback) => fallback,
      extras: () => [],
      partners: [],
      partnersSeeded: false,
      sectionLayout: () => parseHomepageLayout(''),
    }
  }
  return ctx
}
