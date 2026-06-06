import { getAdminClient } from '@/lib/supabase'
import type { SiteContent } from '@/lib/supabase'

/** Mark a list section as admin-managed so an empty section stays empty on the public site. */
export async function markListSectionManaged(section: string) {
  const supabase = getAdminClient()
  await supabase.from('site_content').upsert(
    {
      section: 'list_meta',
      key: section,
      value_ar: '1',
      value_en: '1',
    },
    { onConflict: 'section,key' },
  )
}

export function extractManagedListSections(siteContent: SiteContent[]): string[] {
  return siteContent
    .filter(r => r.section === 'list_meta' && (r.value_ar === '1' || r.value_en === '1'))
    .map(r => r.key)
    .filter(Boolean)
}
