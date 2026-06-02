'use client'
import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useContent } from '@/components/ContentProvider'
import SectionExtras from '@/components/SectionExtras'

type FormState = { name: string; phone: string; email: string; message: string }
type Status = 'idle' | 'sending' | 'success' | 'error'

// Exact office location — Dr. Talha Ghawth Law Office, Madinah
const MAPS_URL = 'https://www.google.com/maps/place/%D9%85%D9%83%D8%AA%D8%A8+%D8%AF.+%D8%B7%D9%84%D8%AD%D8%A9+%D8%BA%D9%88%D8%AB/@24.4211274,39.6229414,17z/data=!3m1!4b1!4m6!3m5!1s0x15bd959ebd59fe2b:0x5c3c0bd787f720b7!8m2!3d24.4211274!4d39.6229414!16s%2Fg%2F11cp7qx1nw'
const MAPS_EMBED = 'https://www.google.com/maps?q=24.4211274,39.6229414&z=17&output=embed'
const WHATSAPP_URL = 'https://api.whatsapp.com/send/?phone=966148444555&text&type=phone_number&app_absent=0'

export default function Contact({ lang }: { lang: Lang }) {
  const tr = t[lang]
  const isAr = lang === 'ar'
  useScrollReveal()
  const { ov } = useContent()

  const phone   = ov('hero', 'phone',   tr.contact.phone)
  const email   = ov('hero', 'email',   tr.contact.email)
  const address = ov('hero', 'address', tr.contact.address)
  const hours   = ov('hero', 'hours',   tr.contact.hours)

  const namePh    = ov('contact', 'namePlaceholder',    tr.contact.namePlaceholder)
  const phonePh   = ov('contact', 'phonePlaceholder',   tr.contact.phonePlaceholder)
  const emailPh   = ov('contact', 'emailPlaceholder',   tr.contact.emailPlaceholder)
  const messagePh = ov('contact', 'messagePlaceholder', tr.contact.messagePlaceholder)

  const [form, setForm]   = useState<FormState>({ name: '', phone: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lang }),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', phone: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const info = [
    { Icon: Phone,  label: phone,   href: `tel:${phone.replace(/\s/g, '')}` },
    { Icon: Mail,   label: email,   href: `mailto:${email}` },
    { Icon: MapPin, label: address, href: MAPS_URL },
    { Icon: Clock,  label: hours,   href: undefined },
  ]

  return (
    <section id="contact" className="section-padding bg-obsidian" dir={tr.dir}>
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="section-badge mb-6 inline-flex">{ov('contact', 'badge', tr.contact.badge)}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">{ov('contact', 'title', tr.contact.title)}</h2>
          <div className="gold-divider mb-6" />
          <p className="text-cream-muted text-lg max-w-xl mx-auto">{ov('contact', 'subtitle', tr.contact.subtitle)}</p>
          <SectionExtras section="contact" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact info + map — 2 cols */}
          <div className={`lg:col-span-2 space-y-6 ${isAr ? 'reveal-right' : 'reveal-left'} reveal`}>
            {/* Info cards */}
            <div className="space-y-4">
              {info.map(({ Icon, label, href }) => (
                <div key={label} className="flex items-center gap-4 glass-card p-4">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-gold" />
                  </div>
                  {Icon === Phone ? (
                    <div className="flex flex-col items-start gap-2">
                      <a
                        href={href}
                        className="text-sm text-cream-muted hover:text-gold transition-colors"
                        dir="ltr"
                      >
                        {label}
                      </a>
                      <a
                        href={WHATSAPP_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs sm:text-sm px-3 py-1.5 rounded-full bg-[#25D366]/10 text-[#1ebe57] border border-[#25D366]/30 hover:bg-[#25D366] hover:text-white transition-all"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885" />
                        </svg>
                        {isAr ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}
                      </a>
                    </div>
                  ) : href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-sm text-cream-muted hover:text-gold transition-colors" dir={Icon === Mail ? 'ltr' : undefined}>
                      {label}
                    </a>
                  ) : (
                    <span className="text-sm text-cream-muted">{label}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Embedded map */}
            <div className="rounded-2xl overflow-hidden border border-obsidian-border h-56">
              <iframe
                src={MAPS_EMBED}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={ov('contact', 'mapTitle', tr.contact.mapTitle)}
              />
            </div>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full justify-center text-sm"
            >
              <MapPin size={16} />
              {lang === 'ar' ? 'عرض الموقع الكامل على خرائط جوجل' : 'Open in Google Maps'}
            </a>
          </div>

          {/* Form — 3 cols */}
          <div className={`lg:col-span-3 ${isAr ? 'reveal-left' : 'reveal-right'} reveal`}>
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-cream-muted mb-2">
                    {namePh}
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={namePh}
                    required
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cream-muted mb-2">
                    {phonePh}
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={phonePh}
                    type="tel"
                    className="form-input"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cream-muted mb-2">
                  {emailPh}
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={emailPh}
                  type="email"
                  className="form-input"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cream-muted mb-2">
                  {messagePh}
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={messagePh}
                  required
                  rows={5}
                  className="form-input resize-none"
                />
              </div>

              {/* Status messages */}
              {status === 'success' && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-sm">
                  <CheckCircle2 size={18} />
                  {ov('contact', 'success', tr.contact.success)}
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-700 text-sm">
                  <AlertCircle size={18} />
                  {ov('contact', 'error', tr.contact.error)}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-gold w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? (
                  ov('contact', 'sending', tr.contact.sending)
                ) : (
                  <>
                    <Send size={18} />
                    {ov('contact', 'send', tr.contact.send)}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
