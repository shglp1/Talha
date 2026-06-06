'use client'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useContent } from '@/components/ContentProvider'
import SectionExtras from '@/components/SectionExtras'
import { cmsField } from '@/lib/cms-attrs'

const DEFAULT_WHATSAPP_URL =
  'https://api.whatsapp.com/send/?phone=966148444555&text&type=phone_number&app_absent=0'

function WhatsAppIcon({ size = 14 }: { size?: number }) {
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
      <Icon size={12} className="text-gold shrink-0" aria-hidden />
      <span className="min-w-0 leading-tight">{children}</span>
    </>
  )
  const base = 'footer-link inline-flex items-center gap-1.5 text-[11px] sm:text-xs transition-colors'
  if (href) {
    return (
      <a href={href} className={base}>
        {inner}
      </a>
    )
  }
  return <div className={`footer-muted ${base}`}>{inner}</div>
}

function resolveFooterText(
  ov: (section: string, key: string, fallback: string) => string,
  hidden: (section: string, key: string) => boolean,
  key: 'phone' | 'email' | 'address',
  fallback: string,
): string {
  if (hidden('footer', key)) return ''
  const fromFooter = ov('footer', key, fallback).trim()
  if (fromFooter) return fromFooter
  if (!hidden('hero', key)) {
    const legacy = ov('hero', key, '').trim()
    if (legacy) return legacy
  }
  return fallback
}

export default function Footer({ lang }: { lang: Lang }) {
  const tr = t[lang]
  const year = new Date().getFullYear()
  const { ov, hidden, extras } = useContent()

  const phone = resolveFooterText(ov, hidden, 'phone', tr.contact.phone)
  const email = resolveFooterText(ov, hidden, 'email', tr.contact.email)
  const address = resolveFooterText(ov, hidden, 'address', tr.contact.address)
  const whatsapp = hidden('footer', 'whatsapp')
    ? ''
    : ov('footer', 'whatsapp', DEFAULT_WHATSAPP_URL).trim()
  const tagline = hidden('footer', 'tagline')
    ? ''
    : ov('footer', 'tagline', tr.footer.tagline).trim()
  const officeName = hidden('footer', 'officeName')
    ? ''
    : ov(
        'footer',
        'officeName',
        lang === 'ar'
          ? 'مكتب د. طلحة غوث للمحاماة والاستشارات القانونية.'
          : 'Dr. Talha Ghawth Law Office.',
      ).trim()
  const rights = hidden('footer', 'rights')
    ? ''
    : ov('footer', 'rights', tr.footer.rights).trim()

  const hasContactLines = !!(phone || email || address)
  const hasSocial = !!(whatsapp || phone || email)
  const hasContactSection = hasContactLines || hasSocial
  const hasExtras = extras('footer').length > 0
  const hasCopyright = !!(officeName || rights)

  return (
    <footer className="footer-gold footer-compact" dir={tr.dir}>
      <div className="section-container py-4 sm:py-5">
        {/* Logo + tagline — compact center block */}
        <div className="flex flex-col items-center text-center gap-1">
          <Link
            href={`/${lang}`}
            className="inline-flex justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-lg"
          >
            <BrandLogo variant="footer" className="h-14 sm:h-16 w-auto max-w-[200px] sm:max-w-[220px] object-contain" />
          </Link>
          {tagline && (
            <p className="footer-tagline text-[11px] sm:text-xs leading-snug max-w-md mx-auto px-2 mt-0.5" {...cmsField('footer', 'tagline')}>
              {tagline}
            </p>
          )}
        </div>

        {hasContactSection && (
          <div className="mt-3 pt-3 border-t border-obsidian-border/70">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5 sm:gap-y-1.5 max-w-4xl mx-auto">
              {phone && (
                <FooterRow icon={Phone} href={`tel:${phone.replace(/\s/g, '')}`}>
                  <span dir="ltr" className="inline-block" {...cmsField('footer', 'phone')}>{phone}</span>
                </FooterRow>
              )}
              {email && (
                <FooterRow icon={Mail} href={`mailto:${email}`}>
                  <span {...cmsField('footer', 'email')}>{email}</span>
                </FooterRow>
              )}
              {address && (
                <FooterRow icon={MapPin}>
                  <span {...cmsField('footer', 'address')}>{address}</span>
                </FooterRow>
              )}
              {hasSocial && (
                <div className="flex items-center justify-center gap-1.5 sm:ms-1">
                  {whatsapp && (
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp"
                      className="w-7 h-7 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#1ebe57] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all"
                    >
                      <WhatsAppIcon />
                    </a>
                  )}
                  {phone && (
                    <a
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      aria-label={lang === 'ar' ? 'اتصل بنا' : 'Call us'}
                      className="footer-social-btn w-7 h-7 rounded-full flex items-center justify-center transition-all"
                    >
                      <Phone size={12} className="text-gold" />
                    </a>
                  )}
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      aria-label={lang === 'ar' ? 'راسلنا' : 'Email us'}
                      className="footer-social-btn w-7 h-7 rounded-full flex items-center justify-center transition-all"
                    >
                      <Mail size={12} className="text-gold" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {hasExtras && (
          <div className="mt-2 max-w-3xl mx-auto [&>div]:!mt-0 [&>div]:gap-1">
            <SectionExtras section="footer" align="center" />
          </div>
        )}
      </div>

      {hasCopyright && (
        <div className="border-t border-obsidian-border/80">
          <div className="section-container py-1.5 sm:py-2">
            <p className="text-[10px] footer-muted opacity-75 text-center leading-tight">
              © {year}{' '}
              {officeName && <span {...cmsField('footer', 'officeName')}>{officeName}</span>}{' '}
              {rights && <span {...cmsField('footer', 'rights')}>{rights}.</span>}
            </p>
          </div>
        </div>
      )}
    </footer>
  )
}
