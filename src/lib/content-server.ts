import { getAdminClient } from '@/lib/supabase'
import type { SiteContent, ContentItem, Partner } from '@/lib/supabase'
import { extractManagedListSections, markListSectionManaged } from '@/lib/list-meta'

export type PublicContentPayload = {
  site_content: SiteContent[]
  content_items: ContentItem[]
  partners: Partner[]
  list_section_keys: string[]
  managed_list_sections: string[]
  partners_seeded: boolean
  fetched_at: string
}

/**
 * Server-side fetch of all live-site CMS data. Shared by /api/content and SSR layout.
 */
export async function getPublicContent(): Promise<PublicContentPayload> {
  const supabase = getAdminClient()

  const [contentRes, itemsRes, allItemsRes, partnersRes, allPartnersRes] = await Promise.all([
    supabase.from('site_content').select('*'),
    supabase
      .from('content_items')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true }),
    supabase.from('content_items').select('section'),
    supabase
      .from('partners')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true }),
    supabase.from('partners').select('id'),
  ])

  if (contentRes.error) throw new Error(contentRes.error.message)
  if (itemsRes.error) throw new Error(itemsRes.error.message)
  if (allItemsRes.error) throw new Error(allItemsRes.error.message)
  if (partnersRes.error) throw new Error(partnersRes.error.message)
  if (allPartnersRes.error) throw new Error(allPartnersRes.error.message)

  const listSectionKeys = [
    ...new Set((allItemsRes.data ?? []).map(r => r.section).filter(Boolean)),
  ]

  const managedListSections = extractManagedListSections(contentRes.data ?? [])

  return {
    site_content: contentRes.data ?? [],
    content_items: itemsRes.data ?? [],
    partners: partnersRes.data ?? [],
    list_section_keys: listSectionKeys,
    managed_list_sections: managedListSections,
    partners_seeded: (allPartnersRes.data ?? []).length > 0,
    fetched_at: new Date().toISOString(),
  }
}
