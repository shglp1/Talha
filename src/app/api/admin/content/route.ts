import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'
import { revalidatePublicSite } from '@/lib/revalidate-site'

type Row = {
  section: string
  key: string
  value_ar?: string
  value_en?: string
  label_ar?: string | null
  label_en?: string | null
  is_custom?: boolean
  slot?: string | null
  display_order?: number
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ('error' in auth) return auth.error

  const supabase = getAdminClient()
  const { data, error } = await supabase.from('site_content').select('*')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ('error' in auth) return auth.error

  const body = await req.json().catch(() => null)
  const rows: Row[] = body?.rows
  if (!Array.isArray(rows)) {
    return NextResponse.json({ error: 'rows مطلوبة' }, { status: 400 })
  }

  const supabase = getAdminClient()
  const { error } = await supabase
    .from('site_content')
    .upsert(rows, { onConflict: 'section,key' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePublicSite()
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ('error' in auth) return auth.error

  const { searchParams } = new URL(req.url)
  const section = searchParams.get('section')
  const key = searchParams.get('key')
  if (!section || !key) {
    return NextResponse.json({ error: 'section و key مطلوبان' }, { status: 400 })
  }

  const supabase = getAdminClient()
  const { error } = await supabase
    .from('site_content')
    .delete()
    .eq('section', section)
    .eq('key', key)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePublicSite()
  return NextResponse.json({ success: true })
}
