'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Scale } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useContent } from '@/components/ContentProvider'

type Message = { role: 'user' | 'assistant'; content: string }

export default function Chatbot({ lang }: { lang: Lang }) {
  const tr = t[lang]
  const { ov } = useContent()
  const welcome = ov('chat', 'welcome', tr.chat.welcome)
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: welcome },
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef             = useRef<HTMLDivElement>(null)
  const inputRef              = useRef<HTMLInputElement>(null)

  // Reflect an admin-edited welcome message until the visitor starts chatting.
  useEffect(() => {
    setMessages(prev => (prev.length <= 1 ? [{ role: 'assistant', content: welcome }] : prev))
  }, [welcome])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, lang, history: messages }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || '...' }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: lang === 'ar'
          ? 'عذراً، حدث خطأ. يرجى المحاولة مجدداً.'
          : 'Sorry, an error occurred. Please try again.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className="fixed bottom-6 end-6 z-50 rounded-full flex items-center justify-center animate-pulse-gold transition-transform hover:scale-105 active:scale-95"
        style={{
          width: 60,
          height: 60,
          padding: 0,
          background: 'linear-gradient(135deg, #C4973A, #D5B874, #A27849)',
          boxShadow: '0 8px 28px rgba(196,151,58,0.45)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {open
          ? <X size={26} color="#FFFFFF" strokeWidth={2.4} />
          : <MessageCircle size={26} color="#FFFFFF" strokeWidth={2.2} />
        }
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-24 end-6 z-50 w-[340px] sm:w-[380px] max-h-[560px] flex flex-col rounded-2xl bg-obsidian-card border border-obsidian-border shadow-2xl transition-all duration-300 ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        dir={t[lang].dir}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-obsidian-border bg-obsidian-surface rounded-t-2xl">
          <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center flex-shrink-0">
            <Scale size={16} className="text-gold" />
          </div>
          <div>
            <p className="text-sm font-semibold text-cream">{ov('chat', 'title', tr.chat.title)}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-cream-muted">{ov('chat', 'subtitle', tr.chat.subtitle)}</span>
            </div>
          </div>
          <button onClick={() => setOpen(false)} className="ms-auto text-cream-muted hover:text-cream p-1">
            <X size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0" style={{ maxHeight: 360 }}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? (lang === 'ar' ? 'justify-start' : 'justify-end') : (lang === 'ar' ? 'justify-end' : 'justify-start')}`}>
              <div className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className={`flex ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
              <div className="chat-bubble-bot">
                <div className="dot-pulse flex items-center gap-1">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-obsidian-border p-3 flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={ov('chat', 'placeholder', tr.chat.placeholder)}
            className="form-input text-sm py-2.5 flex-1"
            disabled={loading}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 text-gold flex items-center justify-center hover:bg-gold hover:text-white hover:border-gold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label={tr.chat.send}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </>
  )
}
