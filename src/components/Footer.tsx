import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'

export default function Footer({ lang }: { lang: Lang }) {
  const tr = t[lang]
  const year = new Date().getFullYear()

  const services = [
    { href: '#services', label: lang === 'ar' ? 'استشارات الشركات' : 'Corporate Advisory' },
    { href: '#services', label: lang === 'ar' ? 'الأوقاف والتركات' : 'Endowments & Estates' },
    { href: '#services', label: lang === 'ar' ? 'تسوية النزاعات' : 'Dispute Resolution' },
    { href: '#services', label: lang === 'ar' ? 'حقوق العمل' : 'Labor Law' },
    { href: '#services', label: lang === 'ar' ? 'العقود التجارية' : 'Commercial Contracts' },
    { href: '#services', label: lang === 'ar' ? 'التمثيل القضائي' : 'Litigation' },
  ]

  const quickLinks = [
    { href: '#about',   label: tr.nav.about },
    { href: '#vision',  label: tr.nav.vision },
    { href: '#whyus',   label: tr.nav.whyUs },
    { href: '#team',    label: tr.nav.team },
    { href: '#clients', label: tr.nav.clients },
    { href: '#contact', label: tr.nav.contact },
  ]

  return (
    <footer className="bg-obsidian-surface border-t border-obsidian-border" dir={tr.dir}>
      {/* Main footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Image src="/logo.svg" alt="مكتب د. طلحة غوث" width={200} height={50} className="mb-5" />
            <p className="text-cream-muted text-sm leading-relaxed mb-6 max-w-xs">{tr.footer.tagline}</p>
            {/* Contact quick info */}
            <div className="space-y-3">
              <a href={`tel:${tr.contact.phone}`} className="flex items-center gap-3 text-sm text-cream-muted hover:text-gold transition-colors group">
                <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Phone size={14} className="text-gold" />
                </span>
                <span dir="ltr">{tr.contact.phone}</span>
              </a>
              <a href={`mailto:${tr.contact.email}`} className="flex items-center gap-3 text-sm text-cream-muted hover:text-gold transition-colors group">
                <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Mail size={14} className="text-gold" />
                </span>
                <span>{tr.contact.email}</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-cream-muted">
                <span className="w-8 h-8 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <MapPin size={14} className="text-gold" />
                </span>
                <span>{tr.contact.address}</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-cream font-semibold mb-5 text-base">{tr.footer.quickLinks}</h4>
            <ul className="space-y-3">
              {quickLinks.map(l => (
                <li key={l.href + l.label}>
                  <a href={l.href} className="text-sm text-cream-muted hover:text-gold transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-gold/40 group-hover:bg-gold transition-colors" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-cream font-semibold mb-5 text-base">{tr.footer.services}</h4>
            <ul className="space-y-3">
              {services.map(s => (
                <li key={s.label}>
                  <a href={s.href} className="text-sm text-cream-muted hover:text-gold transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 rounded-full bg-gold/40 group-hover:bg-gold transition-colors" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-cream font-semibold mb-5 text-base">
              {lang === 'ar' ? 'ساعات العمل' : 'Working Hours'}
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-gold mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-cream-muted">{tr.contact.hours}</p>
                  <p className="text-xs text-cream/40 mt-1">
                    {lang === 'ar' ? 'الجمعة والسبت: مغلق' : 'Fri & Sat: Closed'}
                  </p>
                </div>
              </div>
              {/* Google Maps link */}
              <a
                href="https://maps.app.goo.gl/XvGNUhfam29FPMS96"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gold hover:text-gold-light border border-gold/20 rounded-lg px-4 py-2.5 hover:bg-gold/5 transition-all mt-2"
              >
                <MapPin size={14} />
                {lang === 'ar' ? 'عرض الموقع على الخريطة' : 'View on Google Maps'}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-obsidian-border">
        <div className="section-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-cream/30 text-center sm:text-start">
            © {year} {lang === 'ar' ? 'مكتب د. طلحة غوث للمحاماة والاستشارات القانونية.' : 'Dr. Talha Ghawth Law Office.'} {tr.footer.rights}.
          </p>
          <Link href="/admin" className="text-xs text-cream/20 hover:text-cream/40 transition-colors">
            {lang === 'ar' ? 'لوحة التحكم' : 'Admin'}
          </Link>
        </div>
      </div>
    </footer>
  )
}
