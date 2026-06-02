'use client'
import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useScrollReveal } from '@/hooks/useScrollReveal'

type FormState = { name: string; phone: string; email: string; message: string }
type Status = 'idle' | 'sending' | 'success' | 'error'

export default function Contact({ lang }: { lang: Lang }) {
  const tr = t[lang]
  const isAr = lang === 'ar'
  useScrollReveal()

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
    { Icon: Phone,  label: tr.contact.phone,   href: `tel:${tr.contact.phone}` },
    { Icon: Mail,   label: tr.contact.email,    href: `mailto:${tr.contact.email}` },
    { Icon: MapPin, label: tr.contact.address,  href: 'https://maps.app.goo.gl/XvGNUhfam29FPMS96' },
    { Icon: Clock,  label: tr.contact.hours,    href: undefined },
  ]

  return (
    <section id="contact" className="section-padding bg-obsidian" dir={tr.dir}>
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span className="section-badge mb-6 inline-flex">{tr.contact.badge}</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">{tr.contact.title}</h2>
          <div className="gold-divider mb-6" />
          <p className="text-cream-muted text-lg max-w-xl mx-auto">{tr.contact.subtitle}</p>
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
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                      className="text-sm text-cream-muted hover:text-gold transition-colors" dir="ltr">
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3713.123!2d39.1925!3d21.4858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDI5JzA4LjkiTiAzOcKwMTEnMzMuMCJF!5e0!3m2!1sar!2ssa!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={tr.contact.mapTitle}
              />
            </div>

            <a
              href="https://maps.app.goo.gl/XvGNUhfam29FPMS96"
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
                    {tr.contact.namePlaceholder}
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder={tr.contact.namePlaceholder}
                    required
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-cream-muted mb-2">
                    {tr.contact.phonePlaceholder}
                  </label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder={tr.contact.phonePlaceholder}
                    type="tel"
                    className="form-input"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-cream-muted mb-2">
                  {tr.contact.emailPlaceholder}
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={tr.contact.emailPlaceholder}
                  type="email"
                  className="form-input"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-cream-muted mb-2">
                  {tr.contact.messagePlaceholder}
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder={tr.contact.messagePlaceholder}
                  required
                  rows={5}
                  className="form-input resize-none"
                />
              </div>

              {/* Status messages */}
              {status === 'success' && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                  <CheckCircle2 size={18} />
                  {tr.contact.success}
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle size={18} />
                  {tr.contact.error}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-gold w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? (
                  tr.contact.sending
                ) : (
                  <>
                    <Send size={18} />
                    {tr.contact.send}
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
