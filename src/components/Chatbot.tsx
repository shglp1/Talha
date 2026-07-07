'use client'
import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Scale } from 'lucide-react'
import type { Lang } from '@/lib/translations'
import { t } from '@/lib/translations'
import { useContent } from '@/components/ContentProvider'
import { cmsField } from '@/lib/cms-attrs'

type Message = { role: 'user' | 'assistant'; content: string }

const BIDI_RE = /\+?\d[\d\s\-()]{7,}|[\w.+-]+@[\w.-]+\.\w+/g

/** Wrap phone numbers and emails in LTR spans so they display correctly in RTL chat. */
function wrapBidiInline(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = []
  let last = 0
  const re = new RegExp(BIDI_RE.source, 'g')
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    nodes.push(
      <span key={m.index} dir="ltr" className="inline-block">{m[0]}</span>,
    )
    last = m.index + m[0].length
  }
  if (last < text.length) nodes.push(text.slice(last))
  if (nodes.length === 0) return text
  if (nodes.length === 1) return nodes[0]
  return <>{nodes.map((n, i) => <React.Fragment key={i}>{n}</React.Fragment>)}</>
}

// Parse inline bold **text** into JSX
function inlineBold(text: string, key: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <span key={key}>
      {parts.map((p, j) =>
        p.startsWith('**') && p.endsWith('**')
          ? <strong key={j} className="font-semibold" style={{ color: 'var(--text)' }}>{p.slice(2, -2)}</strong>
          : <span key={j}>{wrapBidiInline(p)}</span>
      )}
    </span>
  )
}

type ListEntry = { num: number; title: string; bullets: string[] }

function renderMessage(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []

  // ── Structured block collector ──────────────────────────────────────────
  // Supports two AI formats:
  //   Format A (Arabic):  "1. **Title**: description"
  //   Format B (English): "1\nTitle\n- bullet\n- bullet"
  const entries: ListEntry[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    // Format A: "1. Title: desc"  or  "1. **Title**: desc"
    const fmtA = trimmed.match(/^(\d+)\.\s+(.+)$/)
    if (fmtA) {
      const clean = fmtA[2].replace(/\*\*/g, '')
      const colonIdx = clean.indexOf(':')
      const title = colonIdx > -1 ? clean.slice(0, colonIdx).trim() : clean.trim()
      const desc  = colonIdx > -1 ? clean.slice(colonIdx + 1).trim() : ''
      // Collect subsequent "- bullet" lines
      const bullets: string[] = desc ? [desc] : []
      i++
      while (i < lines.length && lines[i].trim().startsWith('-')) {
        bullets.push(lines[i].trim().slice(1).trim())
        i++
      }
      entries.push({ num: parseInt(fmtA[1], 10), title, bullets })
      continue
    }

    // Format B: lone digit(s) on its own line
    const fmtB = trimmed.match(/^(\d+)$/)
    if (fmtB) {
      i++
      const title = (lines[i]?.trim() || '').replace(/\*\*/g, '')
      i++
      const bullets: string[] = []
      while (i < lines.length && lines[i].trim().startsWith('-')) {
        bullets.push(lines[i].trim().slice(1).trim())
        i++
      }
      entries.push({ num: parseInt(fmtB[1], 10), title, bullets })
      continue
    }

    // ── Flush collected list before emitting a paragraph ──────────────
    if (entries.length) {
      elements.push(
        <ol key={`ol-${i}`} className="mt-2 mb-2 space-y-3">
          {entries.map(e => (
            <li key={e.num} className="flex gap-2 text-start">
              <span className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-[10px] font-bold flex items-center justify-center">
                {e.num}
              </span>
              <span className="text-[13px] leading-relaxed">
                <strong className="font-semibold block mb-0.5" style={{ color: 'var(--text)' }}>{e.title}</strong>
                {e.bullets.length > 0 && (
                  <ul className="mt-1 space-y-0.5">
                    {e.bullets.map((b, bi) => (
                      <li key={bi} className="flex gap-1.5 items-start text-cream-muted">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-gold/60 flex-shrink-0" />
                        <span>{wrapBidiInline(b)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </span>
            </li>
          ))}
        </ol>
      )
      entries.length = 0
    }

    // ── Regular line ──────────────────────────────────────────────────
    if (!trimmed) {
      if (elements.length) elements.push(<div key={`gap-${i}`} className="h-1" />)
    } else if (trimmed.startsWith('- ')) {
      // Orphan bullet (outside a numbered block)
      elements.push(
        <div key={`b-${i}`} className="flex gap-1.5 items-start text-[13px] text-cream-muted">
          <span className="mt-1.5 w-1 h-1 rounded-full bg-gold/60 flex-shrink-0" />
          <span>{wrapBidiInline(trimmed.slice(2))}</span>
        </div>
      )
    } else {
      elements.push(
        <p key={`p-${i}`} className="text-[13px] leading-relaxed text-cream-muted">
          {inlineBold(trimmed, `ib-${i}`)}
        </p>
      )
    }
    i++
  }

  // Flush any remaining list
  if (entries.length) {
    elements.push(
      <ol key="ol-end" className="mt-2 mb-2 space-y-3">
        {entries.map(e => (
          <li key={e.num} className="flex gap-2 text-start">
            <span className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-[10px] font-bold flex items-center justify-center">
              {e.num}
            </span>
            <span className="text-[13px] leading-relaxed">
              <strong className="font-semibold block mb-0.5" style={{ color: 'var(--text)' }}>{e.title}</strong>
              {e.bullets.length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {e.bullets.map((b, bi) => (
                    <li key={bi} className="flex gap-1.5 items-start text-cream-muted">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-gold/60 flex-shrink-0" />
                      <span>{wrapBidiInline(b)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </span>
          </li>
        ))}
      </ol>
    )
  }

  return elements
}

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
            <p className="text-sm font-semibold text-cream" {...cmsField('chat', 'title')}>{ov('chat', 'title', tr.chat.title)}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-cream-muted" {...cmsField('chat', 'subtitle')}>{ov('chat', 'subtitle', tr.chat.subtitle)}</span>
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
              <div
                className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}
                {...(m.role === 'assistant' && i === 0 ? cmsField('chat', 'welcome') : {})}
              >
                {m.role === 'assistant' ? renderMessage(m.content) : m.content}
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
            {...cmsField('chat', 'placeholder')}
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
