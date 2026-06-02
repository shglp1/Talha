'use client'
import { useEffect } from 'react'
import type { Lang } from '@/lib/translations'

/**
 * Keeps <html lang/dir> in sync with the active locale. The root layout renders
 * a single <html> (default ar/rtl); this flips it to en/ltr on English routes
 * without nesting a second <html>/<body> (which caused hydration errors).
 */
export default function LangSync({ lang }: { lang: Lang }) {
  useEffect(() => {
    const el = document.documentElement
    el.lang = lang
    el.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])
  return null
}
