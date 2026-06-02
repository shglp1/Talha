'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'

export default function Navbar({ lang }: { lang: Lang }) {
  const tr = t[lang]
  const otherLang  = lang === 'ar' ? 'en' : 'ar'
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#about',    label: tr.nav.about },
    { href: '#services', label: tr.nav.services },
    { href: '#vision',   label: tr.nav.vision },
    { href: '#whyus',    label: tr.nav.whyUs },
    { href: '#team',     label: tr.nav.team },
    { href: '#clients',  label: tr.nav.clients },
  ]

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'navbar-scrolled' : 'bg-transparent'
      }`}
      dir={tr.dir}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex-shrink-0">
            <Image src="/logo.svg" alt="مكتب د. طلحة غوث" width={220} height={55} priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="px-4 py-2 text-sm font-medium text-cream-muted hover:text-gold transition-colors duration-200 rounded-lg hover:bg-white/5"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={`/${otherLang}`}
              className="text-sm font-medium text-cream-muted hover:text-gold border border-obsidian-border rounded-full px-4 py-1.5 transition-colors hover:border-gold/40"
            >
              {tr.nav.en}
            </Link>
            <a
              href="#contact"
              className="btn-gold text-sm py-2.5 px-6"
            >
              {tr.nav.contact}
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-cream-muted hover:text-gold"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-obsidian-surface border-t border-obsidian-border">
          <nav className="section-container py-4 flex flex-col gap-1">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="px-4 py-3 text-base font-medium text-cream-muted hover:text-gold hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="pt-3 border-t border-obsidian-border mt-2 flex gap-3">
              <Link
                href={`/${otherLang}`}
                className="flex-1 text-center text-sm font-medium text-cream-muted border border-obsidian-border rounded-lg py-2.5 hover:border-gold/40 hover:text-gold transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {tr.nav.en}
              </Link>
              <a
                href="#contact"
                className="flex-1 btn-gold text-sm py-2.5 justify-center"
                onClick={() => setMenuOpen(false)}
              >
                {tr.nav.contact}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
