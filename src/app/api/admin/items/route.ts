import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'
import { revalidatePublicSite } from '@/lib/revalidate-site'

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ('error' in auth) return auth.error

  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('content_items')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ('error' in auth) return auth.error

  const body = await req.json().catch(() => null)
  if (!body?.section) {
    return NextResponse.json({ error: 'section مطلوب' }, { status: 400 })
  }

  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('content_items')
    .insert({
      section: body.section,
      title_ar: body.title_ar ?? '',
      title_en: body.title_en ?? '',
      desc_ar: body.desc_ar ?? '',
      desc_en: body.desc_en ?? '',
      icon: body.icon ?? null,
      sort_order: body.sort_order ?? 0,
      active: body.active ?? true,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePublicSite()
  return NextResponse.json({ data })
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ('error' in auth) return auth.error

  const body = await req.json().catch(() => null)

  // Batch reorder: { reorder: [{ id, sort_order }] }
  if (Array.isArray(body?.reorder)) {
    const supabase = getAdminClient()
    const results = await Promise.all(
      body.reorder.map((r: { id: string; sort_order: number }) =>
        supabase.from('content_items').update({ sort_order: r.sort_order }).eq('id', r.id),
      ),
    )
    const failed = results.find(r => r.error)
    if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 500 })
    revalidatePublicSite()
    return NextResponse.json({ success: true })
  }

  if (!body?.id) {
    return NextResponse.json({ error: 'id مطلوب' }, { status: 400 })
  }

  const supabase = getAdminClient()
  const { error } = await supabase
    .from('content_items')
    .update({
      title_ar: body.title_ar,
      title_en: body.title_en,
      desc_ar: body.desc_ar,
      desc_en: body.desc_en,
      icon: body.icon || null,
      active: body.active,
      sort_order: body.sort_order,
    })
    .eq('id', body.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePublicSite()
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ('error' in auth) return auth.error

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 })

  const supabase = getAdminClient()
  const { error } = await supabase.from('content_items').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePublicSite()
  return NextResponse.json({ success: true })
}
