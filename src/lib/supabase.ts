import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnon)

export function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export type ContactMessage = {
  id?: string
  name: string
  phone: string
  email: string
  message: string
  created_at?: string
  read?: boolean
}

export type SiteContent = {
  id?: string
  section: string
  key: string
  value_ar: string
  value_en: string
}
