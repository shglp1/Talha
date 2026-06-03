'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useContent } from '@/components/ContentProvider'

const SCROLL_THRESHOLD = 48

export default function Navbar({ lang }: { lang: Lang }) {
  const tr = t[lang]
  const otherLang = lang === 'ar' ? 'en' : 'ar'
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { ov, hidden } = useContent()

  const onHero = !scrolled

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#about',    key: 'about',    label: ov('nav', 'about',    tr.nav.about) },
    { href: '#services', key: 'services', label: ov('nav', 'services', tr.nav.services) },
    { href: '#vision',   key: 'vision',   label: ov('nav', 'vision',   tr.nav.vision) },
    { href: '#whyus',    key: 'whyUs',    label: ov('nav', 'whyUs',    tr.nav.whyUs) },
    { href: '#team',     key: 'team',     label: ov('nav', 'team',     tr.nav.team) },
    { href: '#clients',  key: 'clients',  label: ov('nav', 'clients',  tr.nav.clients) },
  ].filter(l => !hidden('nav', l.key))

  const linkClass = onHero && !menuOpen
    ? 'px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg text-white/95 hover:text-gold-pale hover:bg-white/10'
    : 'px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg text-cream-muted hover:text-gold hover:bg-gold/10'

  const langClass = onHero && !menuOpen
    ? 'text-sm font-medium rounded-full px-4 py-1.5 transition-colors duration-200 border border-white/50 text-white/95 hover:text-white hover:border-white hover:bg-white/10'
    : 'text-sm font-medium rounded-full px-4 py-1.5 transition-colors duration-200 border border-obsidian-border text-cream-muted hover:text-gold hover:border-gold/40 hover:bg-gold/5'

  const menuBtnClass = onHero && !menuOpen
    ? 'lg:hidden p-2 text-white/95 hover:text-gold-pale transition-colors'
    : 'lg:hidden p-2 text-cream-muted hover:text-gold transition-colors'

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled || menuOpen ? 'navbar-scrolled' : 'navbar-hero'}`}
      dir={tr.dir}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-20 lg:h-[5.5rem]">
          <Link href={`/${lang}`} className="flex items-center gap-3 flex-shrink-0">
            <BrandLogo
              priority
              className="h-[3.25rem] sm:h-[3.75rem] lg:h-[5rem] w-auto max-w-[min(100%,320px)] sm:max-w-[380px] lg:max-w-[460px] object-contain object-right"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link href={`/${otherLang}`} className={langClass}>
              {tr.nav.en}
            </Link>
            <a href="#contact" className="btn-gold text-sm py-2.5 px-6" style={{ color: '#1A160F' }}>
              {ov('nav', 'contact', tr.nav.contact)}
            </a>
          </div>

          <button
            className={menuBtnClass}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-obsidian-border bg-white">
          <nav className="section-container py-4 flex flex-col gap-1">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 text-cream-muted hover:text-gold hover:bg-gold/10"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="pt-3 border-t border-obsidian-border mt-2 flex gap-3">
              <Link
                href={`/${otherLang}`}
                className="flex-1 text-center text-sm font-medium rounded-lg py-2.5 border border-obsidian-border text-cream-muted hover:text-gold hover:bg-gold/10 transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                {tr.nav.en}
              </Link>
              <a
                href="#contact"
                className="flex-1 btn-gold text-sm py-2.5 justify-center"
                style={{ color: '#1A160F' }}
                onClick={() => setMenuOpen(false)}
              >
                {ov('nav', 'contact', tr.nav.contact)}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
