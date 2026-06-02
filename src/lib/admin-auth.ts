import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export type AdminUser = { id: string; email: string }

/**
 * Verifies the `Authorization: Bearer <access_token>` header against Supabase
 * Auth. Returns the user on success, or a ready-to-send 401 response on failure.
 * Optionally restricts access to ADMIN_EMAIL when that env var is set.
 */
export async function requireAdmin(
  req: NextRequest,
): Promise<{ user: AdminUser } | { error: NextResponse }> {
  const header = req.headers.get('authorization') ?? ''
  const token = header.toLowerCase().startsWith('bearer ')
    ? header.slice(7).trim()
    : ''

  if (!token) {
    return { error: NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 }) }
  }

  const client = createClient(supabaseUrl, supabaseAnon, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data, error } = await client.auth.getUser(token)

  if (error || !data.user) {
    return { error: NextResponse.json({ error: 'الجلسة غير صالحة — أعد تسجيل الدخول' }, { status: 401 }) }
  }

  const allowed = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  if (allowed && data.user.email?.toLowerCase() !== allowed) {
    return { error: NextResponse.json({ error: 'هذا الحساب غير مصرّح له بالدخول' }, { status: 403 }) }
  }

  return { user: { id: data.user.id, email: data.user.email ?? '' } }
}
