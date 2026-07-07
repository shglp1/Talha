'use client'
import { FIELD_GROUPS } from '@/lib/contentSchema'

/** Nav link keys derived from the schema (excludes contact CTA and href companion fields). */
export const NAV_LINK_KEYS = (FIELD_GROUPS.find(g => g.id === 'nav')?.fields ?? [])
  .filter(f => !f.isLinkField && f.key !== 'contact')
  .map(f => f.key)
