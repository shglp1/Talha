'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Scale } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'

type Message = { role: 'user' | 'assistant'; content: string }

export default function Chatbot({ lang }: { lang: Lang }) {
  const tr = t[lang]
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: tr.chat.welcome },
  ])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef             = useRef<HTMLDivElement>(null)
  const inputRef              = useRef<HTMLInputElement>(null)

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
        className="fixed bottom-6 end-6 z-50 w-14 h-14 rounded-full btn-gold p-0 flex items-center justify-center shadow-2xl animate-pulse-gold"
        style={{ minWidth: 56, minHeight: 56 }}
      >
        {open
          ? <X size={22} />
          : <MessageCircle size={22} />
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
            <p className="text-sm font-semibold text-cream">{tr.chat.title}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-cream-muted">{tr.chat.subtitle}</span>
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
            placeholder={tr.chat.placeholder}
            className="form-input text-sm py-2.5 flex-1"
            disabled={loading}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center hover:bg-gold hover:text-obsidian transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label={tr.chat.send}
          >
            <Send size={16} className="text-gold" />
          </button>
        </div>
      </div>
    </>
  )
}
