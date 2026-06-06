'use client'
import { useContent } from '@/components/ContentProvider'

const LOGO_KEYS = {
  header: 'logo-header',
  footer: 'logo-footer',
} as const

/** Brand logo — header and footer can use different uploads from admin (صور الموقع). */
export default function BrandLogo({
  className = '',
  priority = false,
  variant = 'header',
}: {
  className?: string
  priority?: boolean
  variant?: 'header' | 'footer'
}) {
  const { photoUrl } = useContent()
  const src = photoUrl(LOGO_KEYS[variant], '/logo.png')

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      width={777}
      height={631}
      alt="د. طلحة غوث للمحاماة | Dr. Talha Ghouth Law Firm"
      className={className}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      draggable={false}
      style={{ imageRendering: 'auto' }}
    />
  )
}
