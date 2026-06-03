'use client'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useContent } from '@/components/ContentProvider'
import SectionExtras from '@/components/SectionExtras'

const WHATSAPP_URL =
  'https://api.whatsapp.com/send/?phone=966148444555&text&type=phone_number&app_absent=0'

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.305-1.654a11.962 11.962 0 005.71 1.45h.005c6.582 0 11.945-5.335 11.948-11.896 0-3.176-1.24-6.165-3.495-8.411" />
    </svg>
  )
}

export default function Footer({ lang }: { lang: Lang }) {
  const tr = t[lang]
  const year = new Date().getFullYear()
  const { ov, hidden } = useContent()
  const phone   = ov('hero', 'phone',   tr.contact.phone)
  const email   = ov('hero', 'email',   tr.contact.email)
  const address = ov('hero', 'address', tr.contact.address)
  const hours   = ov('hero', 'hours',   tr.contact.hours)
  const mapsUrl =
    'https://www.google.com/maps/place/%D9%85%D9%83%D8%AA%D8%A8+%D8%AF.+%D8%B7%D9%84%D8%AD%D8%A9+%D8%BA%D9%88%D8%AB/@24.4211274,39.6229414,17z/data=!3m1!4b1!4m6!3m5!1s0x15bd959ebd59fe2b:0x5c3c0bd787f720b7!8m2!3d24.4211274!4d39.6229414!16s%2Fg%2F11cp7qx1nw'

  const services = [
    { href: '#services', label: lang === 'ar' ? 'استشارات الشركات' : 'Corporate Advisory' },
    { href: '#services', label: lang === 'ar' ? 'الأوقاف والتركات' : 'Endowments & Estates' },
    { href: '#services', label: lang === 'ar' ? 'تسوية النزاعات' : 'Dispute Resolution' },
    { href: '#services', label: lang === 'ar' ? 'حقوق العمل' : 'Labor Law' },
    { href: '#services', label: lang === 'ar' ? 'العقود التجارية' : 'Commercial Contracts' },
    { href: '#services', label: lang === 'ar' ? 'التمثيل القضائي' : 'Litigation' },
  ]

  const quickLinks = [
    { href: '#about',   key: 'about',   label: ov('nav', 'about',   tr.nav.about) },
    { href: '#vision',  key: 'vision',  label: ov('nav', 'vision',  tr.nav.vision) },
    { href: '#whyus',   key: 'whyUs',   label: ov('nav', 'whyUs',   tr.nav.whyUs) },
    { href: '#team',    key: 'team',    label: ov('nav', 'team',    tr.nav.team) },
    { href: '#clients', key: 'clients', label: ov('nav', 'clients', tr.nav.clients) },
    { href: '#contact', key: 'contact', label: ov('nav', 'contact', tr.nav.contact) },
  ].filter(l => !hidden('nav', l.key))

  return (
    <footer className="footer-gold" dir={tr.dir}>
      {/* Main footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <BrandLogo className="h-14 sm:h-16 w-auto max-w-[300px] sm:max-w-[340px] object-contain object-right" />
            </div>
            <p className="footer-muted text-sm leading-relaxed mb-6 max-w-xs">{ov('footer', 'tagline', tr.footer.tagline)}</p>
            {/* Contact quick info */}
            <div className="space-y-3">
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="footer-link flex items-center gap-3 text-sm transition-colors group">
                <span className="footer-icon-ring w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-white/35 transition-colors flex-shrink-0">
                  <Phone size={14} />
                </span>
                <span dir="ltr">{phone}</span>
              </a>
              <a href={`mailto:${email}`} className="footer-link flex items-center gap-3 text-sm transition-colors group">
                <span className="footer-icon-ring w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-white/35 transition-colors flex-shrink-0">
                  <Mail size={14} />
                </span>
                <span>{email}</span>
              </a>
              <div className="footer-muted flex items-start gap-3 text-sm">
                <span className="footer-icon-ring w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} />
                </span>
                <span className="mt-1.5">{address}</span>
              </div>
            </div>
            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#1ebe57] flex items-center justify-center hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-all"
              >
                <WhatsAppIcon size={18} />
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                aria-label={lang === 'ar' ? 'اتصل بنا' : 'Call us'}
                className="footer-social-btn w-10 h-10 rounded-full flex items-center justify-center transition-all"
              >
                <Phone size={16} />
              </a>
              <a
                href={`mailto:${email}`}
                aria-label={lang === 'ar' ? 'راسلنا' : 'Email us'}
                className="footer-social-btn w-10 h-10 rounded-full flex items-center justify-center transition-all"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="footer-heading font-semibold mb-5 text-base">{ov('footer', 'quickLinks', tr.footer.quickLinks)}</h4>
            <ul className="space-y-3">
              {quickLinks.map(l => (
                <li key={l.href + l.label}>
                  <a href={l.href} className="footer-link text-sm transition-colors flex items-center gap-2 group">
                    <span className="footer-bullet w-1 h-1 rounded-full transition-colors" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="footer-heading font-semibold mb-5 text-base">{ov('footer', 'services', tr.footer.services)}</h4>
            <ul className="space-y-3">
              {services.map(s => (
                <li key={s.label}>
                  <a href={s.href} className="footer-link text-sm transition-colors flex items-center gap-2 group">
                    <span className="footer-bullet w-1 h-1 rounded-full transition-colors" />
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="footer-heading font-semibold mb-5 text-base">
              {lang === 'ar' ? 'ساعات العمل' : 'Working Hours'}
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-[#646A6D] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm footer-muted">{hours}</p>
                  <p className="text-xs footer-muted opacity-80 mt-1">
                    {lang === 'ar' ? 'الجمعة والسبت: مغلق' : 'Fri & Sat: Closed'}
                  </p>
                </div>
              </div>
              {/* Google Maps link */}
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-map-btn inline-flex items-center gap-2 text-sm rounded-lg px-4 py-2.5 transition-all mt-2 border"
              >
                <MapPin size={14} />
                {lang === 'ar' ? 'عرض الموقع على الخريطة' : 'View on Google Maps'}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <SectionExtras section="footer" align="start" />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-divider border-t">
        <div className="section-container py-5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <p className="text-xs footer-muted opacity-80 text-center">
            © {year} {lang === 'ar' ? 'مكتب د. طلحة غوث للمحاماة والاستشارات القانونية.' : 'Dr. Talha Ghawth Law Office.'} {ov('footer', 'rights', tr.footer.rights)}.
          </p>
        </div>
      </div>
    </footer>
  )
}
