import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

const BUCKET   = 'site-photos'
const SECTION  = 'photos'
const OK_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_SIZE = 8 * 1024 * 1024 // 8 MB

// POST /api/admin/photos — upload & save URL to site_content
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ('error' in auth) return auth.error

  const form = await req.formData().catch(() => null)
  const file    = form?.get('file')
  const photoKey = form?.get('key') as string | null

  if (!(file instanceof File)) return NextResponse.json({ error: 'لم يتم إرفاق صورة' }, { status: 400 })
  if (!photoKey)               return NextResponse.json({ error: 'مفتاح الصورة مفقود' }, { status: 400 })
  if (!OK_TYPES.includes(file.type)) return NextResponse.json({ error: 'صيغة غير مدعومة — استخدم JPG أو PNG أو WEBP' }, { status: 400 })
  if (file.size > MAX_SIZE)   return NextResponse.json({ error: 'حجم الصورة كبير جداً — الحد الأقصى 8 ميجابايت' }, { status: 400 })

  const supabase = getAdminClient()
  await supabase.storage.createBucket(BUCKET, { public: true }).catch(() => {})

  const ext  = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${photoKey}-${Date.now()}.${ext}`
  const bytes = Buffer.from(await file.arrayBuffer())

  const { error: uploadErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { cacheControl: '31536000', upsert: true, contentType: file.type })

  if (uploadErr) return NextResponse.json({ error: `فشل الرفع: ${uploadErr.message}` }, { status: 500 })

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
  const url = urlData.publicUrl

  // Save URL to site_content so ContentProvider serves it
  const { error: dbErr } = await supabase
    .from('site_content')
    .upsert(
      { section: SECTION, key: photoKey, value_ar: url, value_en: url, is_custom: false },
      { onConflict: 'section,key' },
    )

  if (dbErr) return NextResponse.json({ error: `تم الرفع لكن فشل الحفظ: ${dbErr.message}` }, { status: 500 })

  return NextResponse.json({ url })
}

// DELETE /api/admin/photos?key=hero-banner — restore original (remove DB row)
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ('error' in auth) return auth.error

  const photoKey = req.nextUrl.searchParams.get('key')
  if (!photoKey) return NextResponse.json({ error: 'مفتاح مفقود' }, { status: 400 })

  const supabase = getAdminClient()
  await supabase.from('site_content').delete().eq('section', SECTION).eq('key', photoKey)

  return NextResponse.json({ ok: true })
}
