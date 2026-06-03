'use client'
import { useEffect } from 'react'

const REVEAL_SEL = '.reveal, .reveal-left, .reveal-right'

let observer: IntersectionObserver | null = null
let scrollBound = false
let subscribers = 0

/** Show elements whose bounding box intersects the viewport (iOS Safari fallback). */
function revealInViewport() {
  document.querySelectorAll(`${REVEAL_SEL}:not(.visible)`).forEach(el => {
    const rect = el.getBoundingClientRect()
    const buffer = 60
    if (rect.top < window.innerHeight + buffer && rect.bottom > -buffer) {
      el.classList.add('visible')
    }
  })
}

function observeNewTargets() {
  if (typeof window === 'undefined') return

  const isMobile = window.matchMedia('(max-width: 768px)').matches

  if (!observer) {
    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      {
        threshold: isMobile ? 0.01 : 0.08,
        rootMargin: isMobile ? '0px' : '0px 0px -40px 0px',
      },
    )
  }

  document.querySelectorAll(`${REVEAL_SEL}:not(.visible)`).forEach(el => observer!.observe(el))

  if (!scrollBound) {
    scrollBound = true
    window.addEventListener('scroll', revealInViewport, { passive: true })
    window.addEventListener('touchstart', revealInViewport, { passive: true })
    window.addEventListener('resize', revealInViewport, { passive: true })
  }

  revealInViewport()
  if (isMobile) {
    window.setTimeout(revealInViewport, 400)
    window.setTimeout(revealInViewport, 1500)
  }
}

function teardown() {
  observer?.disconnect()
  observer = null
  if (scrollBound) {
    window.removeEventListener('scroll', revealInViewport)
    window.removeEventListener('touchstart', revealInViewport)
    window.removeEventListener('resize', revealInViewport)
    scrollBound = false
  }
}

export function useScrollReveal() {
  useEffect(() => {
    subscribers++
    const raf = requestAnimationFrame(observeNewTargets)
    return () => {
      cancelAnimationFrame(raf)
      subscribers--
      if (subscribers <= 0) teardown()
    }
  }, [])
}
