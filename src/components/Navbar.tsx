'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useContent } from '@/components/ContentProvider'

export default function Navbar({ lang }: { lang: Lang }) {
  const tr = t[lang]
  const otherLang  = lang === 'ar' ? 'en' : 'ar'
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const { ov, hidden } = useContent()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
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

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'navbar-scrolled' : 'bg-transparent'
      }`}
      dir={tr.dir}
    >
      <div className="section-container">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href={`/${lang}`} className="flex items-center gap-3 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="د. طلحة غوث للمحاماة | Dr. Talha Ghouth Law Firm"
              width={400}
              height={88}
              priority
              unoptimized
              className="h-14 sm:h-16 lg:h-20 w-auto max-w-[280px] sm:max-w-[360px] lg:max-w-[440px] object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg hover:text-gold hover:bg-gold/10 ${scrolled ? 'text-cream-muted' : 'text-white/90'}`}
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
              className={`text-sm font-medium hover:text-gold rounded-full px-4 py-1.5 transition-colors hover:border-gold/40 border ${scrolled ? 'text-cream-muted border-obsidian-border' : 'text-white/90 border-white/30'}`}
            >
              {tr.nav.en}
            </Link>
            <a
              href="#contact"
              className="btn-gold text-sm py-2.5 px-6"
            >
              {ov('nav', 'contact', tr.nav.contact)}
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
                className="px-4 py-3 text-base font-medium text-cream-muted hover:text-gold hover:bg-gold/5 rounded-lg transition-colors"
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
                {ov('nav', 'contact', tr.nav.contact)}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
