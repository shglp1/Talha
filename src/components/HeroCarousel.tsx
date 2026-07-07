'use client'
import { useEffect, useState } from 'react'
import SitePhoto from '@/components/SitePhoto'

type Props = {
  slides: string[]
  fallback: string
  alt: string
  intervalMs?: number
}

/** Cross-fading hero background slideshow. */
export default function HeroCarousel({ slides, fallback, alt, intervalMs = 6000 }: Props) {
  const urls = slides.length > 0 ? slides : [fallback]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (urls.length <= 1) return
    const id = window.setInterval(() => {
      setIndex(i => (i + 1) % urls.length)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [urls.length, intervalMs])

  return (
    <div className="absolute inset-0 z-0 h-full w-full">
      {urls.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className="absolute inset-0 h-full w-full transition-opacity duration-[1800ms] ease-in-out"
          style={{ opacity: i === index ? 1 : 0, zIndex: i === index ? 1 : 0 }}
        >
          <SitePhoto
            src={src}
            fallback={fallback}
            alt={alt}
            fill
            priority={i === 0}
            quality={95}
            sizes="100vw"
            className="object-cover max-sm:object-[50%_28%] sm:object-[center_22%] lg:object-center"
          />
        </div>
      ))}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black/55 via-transparent to-transparent max-sm:from-black/65" />
      {urls.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-10 hidden justify-center gap-2 opacity-60 sm:bottom-8 sm:flex">
          {urls.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-gold' : 'w-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
