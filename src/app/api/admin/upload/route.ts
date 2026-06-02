import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

const BUCKET = 'partner-logos'
const OK_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml']
const MAX_SIZE = 4 * 1024 * 1024

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if ('error' in auth) return auth.error

  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'لم يتم إرفاق ملف' }, { status: 400 })
  }
  if (!OK_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'الصيغة غير مدعومة — استخدم JPG أو PNG أو WEBP' }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'حجم الصورة كبير جداً — الحد الأقصى 4 ميجابايت' }, { status: 400 })
  }

  const supabase = getAdminClient()

  // Ensure the bucket exists (idempotent) so a missing bucket is not a hard failure.
  await supabase.storage.createBucket(BUCKET, { public: true }).catch(() => {})

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `partners/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const bytes = Buffer.from(await file.arrayBuffer())

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, { cacheControl: '3600', upsert: false, contentType: file.type })

  if (error) {
    return NextResponse.json({ error: `تعذّر رفع الصورة: ${error.message}` }, { status: 500 })
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
