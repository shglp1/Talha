'use client'
import { useContent } from '@/components/ContentProvider'
import { normalizeUrl } from '@/lib/url'

/**
 * Renders admin-defined custom fields for a section in fixed, theme-consistent
 * slots so new content never breaks the existing layout. Mounted once per
 * section at a designated position.
 */
export default function SectionExtras({
  section,
  align = 'center',
}: {
  section: string
  align?: 'center' | 'start'
}) {
  const { extras } = useContent()
  const fields = extras(section)
  if (fields.length === 0) return null

  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-start'

  return (
    <div className={`reveal mt-8 flex flex-col gap-3 ${align === 'center' ? 'items-center' : 'items-start'}`}>
      {fields.map(f => {
        if (f.slot === 'badge') {
          return (
            <span key={f.key} className="section-badge inline-flex">
              {f.value}
            </span>
          )
        }
        if (f.slot === 'title') {
          return (
            <h3 key={f.key} className={`text-2xl sm:text-3xl font-black text-cream ${alignClass}`}>
              {f.value}
            </h3>
          )
        }
        if (f.slot === 'subtitle') {
          return (
            <p key={f.key} className={`text-cream-muted text-base sm:text-lg max-w-2xl ${alignClass}`}>
              {f.value}
            </p>
          )
        }
        if (f.slot === 'link') {
          const href = normalizeUrl(f.value) ?? '#'
          return (
            <a
              key={f.key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold inline-flex"
            >
              {f.value}
            </a>
          )
        }
        // default: body
        return (
          <p key={f.key} className={`text-cream-muted text-[15px] sm:text-base leading-loose max-w-2xl ${alignClass}`}>
            {f.value}
          </p>
        )
      })}
    </div>
  )
}
