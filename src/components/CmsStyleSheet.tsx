'use client'
import { useMemo } from 'react'
import { buildCmsStyleCss } from '@/lib/text-style'
import type { SiteContent } from '@/lib/supabase'

/** Injects admin-controlled color/font-size for [data-cms] and [data-cms-item] nodes. */
export default function CmsStyleSheet({ rows }: { rows: SiteContent[] }) {
  const css = useMemo(
    () => buildCmsStyleCss(rows.map(r => ({ section: r.section, key: r.key, value_ar: r.value_ar }))),
    [rows],
  )
  if (!css) return null
  return <style id="cms-field-styles" dangerouslySetInnerHTML={{ __html: css }} />
}
