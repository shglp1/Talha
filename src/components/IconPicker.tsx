'use client'
import { useState, useRef, useEffect } from 'react'
import { Search, X, ChevronDown } from 'lucide-react'
import { ICON_MAP, ICON_NAMES, getIcon } from '@/lib/iconMap'

export default function IconPicker({
  value,
  onChange,
  recommended,
}: {
  value?: string | null
  onChange: (name: string | null) => void
  recommended?: string[]
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const Current = getIcon(value)
  const filtered = query
    ? ICON_NAMES.filter(n => n.toLowerCase().includes(query.toLowerCase()))
    : ICON_NAMES

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 w-full rounded-lg border border-obsidian-border bg-white px-3 py-2.5 text-sm text-cream hover:border-gold/40 transition-colors"
      >
        <span className="w-8 h-8 rounded-lg bg-gold-soft border border-gold/30 flex items-center justify-center flex-shrink-0">
          {Current ? <Current size={16} className="text-gold-dark" /> : <span className="text-xs text-cream-muted">—</span>}
        </span>
        <span className="flex-1 text-start text-cream-muted">{value || 'اختر أيقونة'}</span>
        <ChevronDown size={16} className="text-cream-muted flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full sm:w-80 rounded-xl border border-obsidian-border bg-white shadow-xl p-3">
          {recommended && recommended.length > 0 && (
            <div className="mb-3">
              <p className="text-[11px] text-cream-muted mb-1.5">أيقونات مقترحة</p>
              <div className="flex flex-wrap gap-1.5">
                {recommended.map(name => {
                  const Icon = ICON_MAP[name]
                  if (!Icon) return null
                  const selected = name === value
                  return (
                    <button
                      key={name}
                      type="button"
                      title={name}
                      onClick={() => { onChange(name); setOpen(false); setQuery('') }}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
                        selected
                          ? 'bg-gold/15 border-gold/50 text-gold-dark'
                          : 'bg-gold-soft/50 border-gold/20 text-gold-dark hover:bg-gold-soft hover:border-gold/40'
                      }`}
                    >
                      <Icon size={18} />
                    </button>
                  )
                })}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-2 flex-1 rounded-lg border border-obsidian-border px-2.5 py-2">
              <Search size={14} className="text-cream-muted flex-shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="بحث..."
                className="w-full bg-transparent text-sm text-cream outline-none placeholder:text-cream-muted/60"
              />
            </div>
            {value && (
              <button
                type="button"
                onClick={() => { onChange(null); setOpen(false) }}
                className="flex items-center gap-1 text-xs text-cream-muted hover:text-red-600 px-2 py-2"
                title="إزالة"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-6 gap-1.5 max-h-56 overflow-y-auto">
            {filtered.map(name => {
              const Icon = ICON_MAP[name]
              const selected = name === value
              return (
                <button
                  key={name}
                  type="button"
                  title={name}
                  onClick={() => { onChange(name); setOpen(false); setQuery('') }}
                  className={`aspect-square rounded-lg flex items-center justify-center border transition-colors ${
                    selected
                      ? 'bg-gold/15 border-gold/50 text-gold-dark'
                      : 'bg-white border-transparent text-cream-muted hover:bg-gold-soft hover:border-gold/30 hover:text-gold-dark'
                  }`}
                >
                  <Icon size={18} />
                </button>
              )
            })}
            {filtered.length === 0 && (
              <p className="col-span-6 text-center text-xs text-cream-muted py-6">لا توجد نتائج</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
