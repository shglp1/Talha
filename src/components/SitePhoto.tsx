'use client'
import { useEffect, useState } from 'react'
import Image, { type ImageProps } from 'next/image'

type SitePhotoProps = Omit<ImageProps, 'src'> & {
  src: string
  fallback: string
}

/** CMS photo with automatic fallback if the uploaded URL fails to load. */
export default function SitePhoto({ src, fallback, alt, ...rest }: SitePhotoProps) {
  const [current, setCurrent] = useState(src || fallback)

  useEffect(() => {
    setCurrent(src || fallback)
  }, [src, fallback])

  return (
    <Image
      {...rest}
      alt={alt}
      src={current || fallback}
      unoptimized={current.startsWith('http')}
      onError={() => {
        if (current !== fallback) setCurrent(fallback)
      }}
    />
  )
}
