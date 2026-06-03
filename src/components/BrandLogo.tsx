/** Shared brand logo — native img at full resolution for crisp header/footer display. */
export default function BrandLogo({
  className = '',
  priority = false,
}: {
  className?: string
  priority?: boolean
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
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
