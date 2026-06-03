'use client'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useContent } from '@/components/ContentProvider'
import SectionExtras from '@/components/SectionExtras'

const WHATSAPP_URL =
  'https://api.whatsapp.com/send/?phone=966148444555&text&type=phone_number&app_absent=0'

function WhatsAppIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.305-1.654a11.962 11.962 0 005.71 1.45h.005c6.582 0 11.945-5.335 11.948-11.896 0-3.176-1.24-6.165-3.495-8.411" />
    </svg>
  )
}

function FooterRow({
  icon: Icon,
  children,
  href,
}: {
  icon: typeof Phone
  children: ReactNode
  href?: string
}) {
  const inner = (
    <>
      <Icon size={12} className="text-gold-dark shrink-0" aria-hidden />
      <span className="min-w-0 leading-snug">{children}</span>
    </>
  )
  const className =
    'footer-link flex items-center justify-start gap-1.5 text-xs transition-colors'
  if (href) {
    return (
      <a href={href} className={className}>
        {inner}
      </a>
    )
  }
  return <div className={`footer-muted ${className}`}>{inner}</div>
}

export default function Footer({ lang }: { lang: Lang }) {
  const tr = t[lang]
  const year = new Date().getFullYear()
  const { ov, extras } = useContent()
  const phone   = ov('hero', 'phone',   tr.contact.phone)
  const email   = ov('hero', 'email',   tr.contact.email)
  const address = ov('hero', 'address', tr.contact.address)
  const hours   = ov('hero', 'hours',   tr.contact.hours)
  const tagline = ov('footer', 'tagline', tr.footer.tagline)
  const hasExtras = extras('footer').length > 0
  const mapsUrl =
    'https://www.google.com/maps/place/%D9%85%D9%83%D8%AA%D8%A8+%D8%AF.+%D8%B7%D9%84%D8%AD%D8%A9+%D8%BA%D9%88%D8%AB/@24.4211274,39.6229414,17z/data=!3m1!4b1!4m6!3m5!1s0x15bd959ebd59fe2b:0x5c3c0bd787f720b7!8m2!3d24.4211274!4d39.6229414!16s%2Fg%2F11cp7qx1nw'

  return (
    <footer className="footer-gold" dir={tr.dir}>
      <div className="section-container py-3 sm:py-4">
        <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Contact — far right in RTL (flex-1 start side) */}
          <div className="flex flex-col items-start gap-1.5 lg:flex-1 lg:min-w-0 order-2 lg:order-none">
            <div className="space-y-1">
              <FooterRow icon={Phone} href={`tel:${phone.replace(/\s/g, '')}`}>
                <span dir="ltr" className="inline-block">{phone}</span>
              </FooterRow>
              <FooterRow icon={Mail} href={`mailto:${email}`}>
                {email}
              </FooterRow>
              <FooterRow icon={MapPin}>{address}</FooterRow>
            </div>
            <div className="flex items-center justify-start gap-1.5 pt-0.5">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-7 h-7 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#1ebe57] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all"
              >
                <WhatsAppIcon />
              </a>
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                aria-label={lang === 'ar' ? 'اتصل بنا' : 'Call us'}
                className="footer-social-btn w-7 h-7 rounded-full flex items-center justify-center transition-all"
              >
                <Phone size={13} />
              </a>
              <a
                href={`mailto:${email}`}
                aria-label={lang === 'ar' ? 'راسلنا' : 'Email us'}
                className="footer-social-btn w-7 h-7 rounded-full flex items-center justify-center transition-all"
              >
                <Mail size={13} />
              </a>
            </div>
          </div>

          {/* Logo — centered between the two sides */}
          <div className="flex justify-center items-center shrink-0 px-2 sm:px-4 lg:px-8 order-1 lg:order-none py-1">
            <Link href={`/${lang}`} className="inline-flex justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-lg">
              <BrandLogo className="h-[5.5rem] sm:h-28 md:h-32 lg:h-[9.5rem] w-auto max-w-[min(92vw,280px)] sm:max-w-[300px] lg:max-w-[360px] object-contain mx-auto" />
            </Link>
          </div>

          {/* Hours — right-aligned on mobile (RTL); far left on desktop only */}
          <div className="flex flex-col items-start lg:items-end gap-1.5 w-full lg:flex-1 lg:min-w-0 order-3 border-t border-obsidian-border/70 pt-3 lg:border-t-0 lg:pt-0">
            <div
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              className={`flex flex-col gap-1 w-full lg:w-fit max-w-full ${
                lang === 'ar' ? 'items-start' : 'items-end'
              }`}
            >
              <h4 className="footer-heading text-xs font-bold text-gold-dark text-start w-full">
                {lang === 'ar' ? 'ساعات العمل' : 'Working Hours'}
              </h4>
              <div className="flex items-start justify-start gap-1.5 text-start">
                <Clock size={12} className="text-gold-dark shrink-0 mt-0.5" aria-hidden />
                <div className="text-xs leading-snug">
                  <p className="footer-muted">{hours}</p>
                  <p className="footer-muted opacity-75">
                    {lang === 'ar' ? 'الجمعة والسبت: مغلق' : 'Fri & Sat: Closed'}
                  </p>
                </div>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-map-btn inline-flex items-center justify-start gap-1 text-[11px] rounded px-2 py-1 transition-all border"
              >
                <MapPin size={11} aria-hidden />
                {lang === 'ar' ? 'عرض الموقع على الخريطة' : 'View on Google Maps'}
              </a>
            </div>
          </div>
        </div>

        {hasExtras && (
          <div className="mt-2 [&>div]:!mt-0 [&>div]:gap-2">
            <SectionExtras section="footer" align="start" />
          </div>
        )}

        <p className="footer-tagline text-center text-xs sm:text-sm leading-snug max-w-2xl mx-auto mt-3 px-1">
          {tagline}
        </p>
      </div>

      <div className="border-t border-obsidian-border">
        <div className="section-container py-2">
          <p className="text-[10px] sm:text-[11px] footer-muted opacity-75 text-center leading-snug">
            © {year}{' '}
            {lang === 'ar'
              ? 'مكتب د. طلحة غوث للمحاماة والاستشارات القانونية.'
              : 'Dr. Talha Ghawth Law Office.'}{' '}
            {ov('footer', 'rights', tr.footer.rights)}.
          </p>
        </div>
      </div>
    </footer>
  )
}
