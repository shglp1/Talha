import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase'
import { readFile } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

const PHOTO_KEY = 'seo-icon'
const FALLBACK_PUBLIC = '/favicon-32x32.png'
const FALLBACK_FILES = ['favicon-32x32.png', 'apple-touch-icon.png', 'logo.svg']

async function getSeoIconUrl(): Promise<string | null> {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('site_content')
    .select('value_ar')
    .eq('section', 'photos')
    .eq('key', PHOTO_KEY)
    .maybeSingle()

  if (error || !data?.value_ar?.trim()) return null
  return data.value_ar.trim()
}

async function serveLocalFallback(request: NextRequest): Promise<NextResponse> {
  const publicDir = path.join(process.cwd(), 'public')

  for (const file of FALLBACK_FILES) {
    try {
      const filePath = path.join(publicDir, file)
      const bytes = await readFile(filePath)
      const ext = path.extname(file).slice(1).toLowerCase()
      const type =
        ext === 'svg' ? 'image/svg+xml'
        : ext === 'png' ? 'image/png'
        : ext === 'ico' ? 'image/x-icon'
        : 'application/octet-stream'

      return new NextResponse(bytes, {
        headers: {
          'Content-Type': type,
          'Cache-Control': 'public, max-age=86400',
        },
      })
    } catch {
      /* try next fallback */
    }
  }

  return NextResponse.redirect(new URL(FALLBACK_PUBLIC, request.url), 302)
}

export async function GET(request: NextRequest) {
  const customUrl = await getSeoIconUrl()

  if (!customUrl) {
    return serveLocalFallback(request)
  }

  try {
    const upstream = await fetch(customUrl, { next: { revalidate: 60 } })
    if (!upstream.ok) return serveLocalFallback(request)

    const bytes = await upstream.arrayBuffer()
    const contentType = upstream.headers.get('content-type') || 'image/png'

    return new NextResponse(bytes, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    })
  } catch {
    return serveLocalFallback(request)
  }
}
