import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnon)

export function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing from .env.local')
  }
  if (serviceKey === process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY must not be the same as the anon key')
  }
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
  label_ar?: string | null
  label_en?: string | null
  is_custom?: boolean
  display_order?: number
  slot?: string | null
}

export type Partner = {
  id?: string
  name: string
  logo_url?: string | null
  website?: string | null
  icon?: string | null
  sort_order?: number
  active?: boolean
  created_at?: string
}

export type ContentItem = {
  id?: string
  section: string
  title_ar: string
  title_en: string
  desc_ar: string
  desc_en: string
  icon?: string | null
  sort_order?: number
  active?: boolean
  created_at?: string
}
