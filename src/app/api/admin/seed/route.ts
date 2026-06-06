import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'
import { LIST_SECTIONS, defaultListItems } from '@/lib/contentSchema'
import { revalidatePublicSite } from '@/lib/revalidate-site'
import { markListSectionManaged } from '@/lib/list-meta'

/**
 * Imports the default card data into `content_items` for any section that is
 * currently empty. Idempotent: existing sections are left untouched.
 */
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ('error' in auth) return auth.error

  const body = await req.json().catch(() => ({}))
  const onlySection = typeof body?.section === 'string' ? body.section : null

  const supabase = getAdminClient()
  const { data: existing, error: readErr } = await supabase
    .from('content_items')
    .select('section')

  if (readErr) return NextResponse.json({ error: readErr.message }, { status: 500 })

  const populated = new Set((existing ?? []).map(r => r.section))
  const rows: Record<string, unknown>[] = []

  const targets = onlySection
    ? LIST_SECTIONS.filter(s => s.section === onlySection)
    : LIST_SECTIONS

  if (onlySection && targets.length === 0) {
    return NextResponse.json({ error: 'قسم غير معروف' }, { status: 400 })
  }

  for (const sec of targets) {
    if (populated.has(sec.section)) continue
    defaultListItems(sec.section).forEach((it, i) => {
      rows.push({ section: sec.section, ...it, sort_order: i, active: true })
    })
  }

  if (rows.length === 0) {
    return NextResponse.json({ success: true, inserted: 0 })
  }

  const { error } = await supabase.from('content_items').insert(rows)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const seededSections = [...new Set(rows.map(r => r.section as string))]
  await Promise.all(seededSections.map(section => markListSectionManaged(section)))

  revalidatePublicSite()
  return NextResponse.json({ success: true, inserted: rows.length })
}
