import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * Public read of all live-site content. Uses the service role server-side so
 * the website always reflects what is in the database (no RLS/client JWT issues).
 */
export async function GET() {
  try {
    const supabase = getAdminClient()

    const [contentRes, itemsRes, partnersRes] = await Promise.all([
      supabase.from('site_content').select('*'),
      supabase
        .from('content_items')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true }),
      supabase
        .from('partners')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true }),
    ])

    if (contentRes.error) {
      console.error('content API site_content:', contentRes.error)
      return NextResponse.json({ error: contentRes.error.message }, { status: 500 })
    }
    if (itemsRes.error) {
      console.error('content API content_items:', itemsRes.error)
      return NextResponse.json({ error: itemsRes.error.message }, { status: 500 })
    }
    if (partnersRes.error) {
      console.error('content API partners:', partnersRes.error)
      return NextResponse.json({ error: partnersRes.error.message }, { status: 500 })
    }

    return NextResponse.json(
      {
        site_content: contentRes.data ?? [],
        content_items: itemsRes.data ?? [],
        partners: partnersRes.data ?? [],
        fetched_at: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      },
    )
  } catch (err) {
    console.error('content API error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
