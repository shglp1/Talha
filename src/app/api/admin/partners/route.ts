import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'
import { normalizeUrl } from '@/lib/url'
import { revalidatePublicSite } from '@/lib/revalidate-site'

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ('error' in auth) return auth.error

  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ('error' in auth) return auth.error

  const body = await req.json().catch(() => null)
  if (!body?.name?.trim()) {
    return NextResponse.json({ error: 'اسم الشريك مطلوب' }, { status: 400 })
  }

  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('partners')
    .insert({
      name: body.name.trim(),
      logo_url: body.logo_url || null,
      website: normalizeUrl(body.website),
      icon: body.icon || null,
      active: body.active ?? true,
      sort_order: body.sort_order ?? 0,
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
  if (!body?.id) return NextResponse.json({ error: 'id مطلوب' }, { status: 400 })

  const supabase = getAdminClient()
  const { error } = await supabase
    .from('partners')
    .update({
      name: body.name,
      logo_url: body.logo_url || null,
      website: normalizeUrl(body.website),
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
  const { error } = await supabase.from('partners').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  revalidatePublicSite()
  return NextResponse.json({ success: true })
}
