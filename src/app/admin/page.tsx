'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard, MessageSquare, Settings, LogOut,
  CheckCircle2, AlertCircle, RefreshCw, Mail, Phone, Globe, Pen, ChevronRight,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { ContactMessage, SiteContent } from '@/lib/supabase'

type Tab = 'messages' | 'content' | 'settings'

const EDITABLE_SECTIONS = [
  { section: 'hero',    key: 'phone',   label_ar: 'رقم الهاتف',         label_en: 'Phone Number' },
  { section: 'hero',    key: 'email',   label_ar: 'البريد الإلكتروني',   label_en: 'Email Address' },
  { section: 'hero',    key: 'address', label_ar: 'العنوان',              label_en: 'Address' },
  { section: 'hero',    key: 'hours',   label_ar: 'ساعات العمل',          label_en: 'Working Hours' },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab]             = useState<Tab>('messages')
  const [messages, setMessages]   = useState<ContactMessage[]>([])
  const [content, setContent]     = useState<SiteContent[]>([])
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [loading, setLoading]     = useState(true)
  const [userEmail, setUserEmail] = useState('')

  const checkAuth = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { router.push('/admin/login'); return }
    setUserEmail(session.user.email ?? '')
  }, [router])

  const loadMessages = useCallback(async () => {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    setMessages(data ?? [])
  }, [])

  const loadContent = useCallback(async () => {
    const { data } = await supabase.from('site_content').select('*')
    if (data) {
      const merged = EDITABLE_SECTIONS.map(s => {
        const found = data.find(d => d.section === s.section && d.key === s.key)
        return found ?? { section: s.section, key: s.key, value_ar: '', value_en: '' }
      })
      setContent(merged)
    } else {
      setContent(EDITABLE_SECTIONS.map(s => ({ section: s.section, key: s.key, value_ar: '', value_en: '' })))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    checkAuth()
    loadMessages()
    loadContent()
  }, [checkAuth, loadMessages, loadContent])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  const handleContentChange = (section: string, key: string, field: 'value_ar' | 'value_en', val: string) => {
    setContent(prev => prev.map(c =>
      c.section === section && c.key === key ? { ...c, [field]: val } : c
    ))
  }

  const handleSaveContent = async () => {
    setSaveStatus('saving')
    try {
      for (const item of content) {
        await supabase.from('site_content').upsert({
          section: item.section, key: item.key,
          value_ar: item.value_ar, value_en: item.value_en,
        }, { onConflict: 'section,key' })
      }
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch {
      setSaveStatus('error')
    }
  }

  const markRead = async (id: string) => {
    await supabase.from('contact_messages').update({ read: true }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div style={{ display: 'flex', minHeight: '100vh', direction: 'rtl' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: '#111111', borderLeft: '1px solid #2A2A2A', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #2A2A2A' }}>
          <Image src="/logo.svg" alt="Logo" width={160} height={40} />
          <p style={{ color: '#4A4440', fontSize: 11, marginTop: 8 }}>لوحة التحكم</p>
        </div>

        <nav style={{ padding: '12px 12px', flex: 1 }}>
          {([
            { id: 'messages', label: 'رسائل التواصل', Icon: MessageSquare, badge: unreadCount },
            { id: 'content',  label: 'محتوى الموقع',  Icon: Settings, badge: 0 },
          ] as Array<{ id: Tab; label: string; Icon: React.ElementType; badge: number }>).map(item => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: tab === item.id ? 'rgba(196,151,58,0.1)' : 'transparent',
                color: tab === item.id ? '#C4973A' : '#8A8480',
                fontSize: 14, fontFamily: 'Tajawal, Arial, sans-serif',
                fontWeight: tab === item.id ? 600 : 400,
                marginBottom: 2, textAlign: 'right', justifyContent: 'flex-start',
              }}
            >
              <item.Icon size={18} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge > 0 && (
                <span style={{ background: '#C4973A', color: '#0A0A0A', borderRadius: 100, padding: '1px 8px', fontSize: 11, fontWeight: 700 }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '12px 12px', borderTop: '1px solid #2A2A2A' }}>
          <p style={{ fontSize: 11, color: '#4A4440', padding: '4px 14px', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</p>
          <button
            onClick={handleSignOut}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', color: '#8A8480', fontSize: 14, fontFamily: 'Tajawal, Arial, sans-serif', justifyContent: 'flex-start' }}
          >
            <LogOut size={16} />
            تسجيل الخروج
          </button>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, color: '#8A8480', fontSize: 14, textDecoration: 'none', marginTop: 2 }}>
            <Globe size={16} />
            عرض الموقع
          </a>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', background: '#0A0A0A' }}>
        {/* Top bar */}
        <div style={{ padding: '16px 28px', borderBottom: '1px solid #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#111111' }}>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>
            {tab === 'messages' ? 'رسائل التواصل' : 'تعديل محتوى الموقع'}
          </h1>
          <button
            onClick={tab === 'messages' ? loadMessages : loadContent}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid #2A2A2A', borderRadius: 8, color: '#8A8480', cursor: 'pointer', fontSize: 13, fontFamily: 'Tajawal, Arial, sans-serif' }}
          >
            <RefreshCw size={14} />
            تحديث
          </button>
        </div>

        <div style={{ padding: 28 }}>
          {/* ─── Messages Tab ─── */}
          {tab === 'messages' && (
            <div>
              {messages.length === 0 && !loading && (
                <EmptyState text="لا توجد رسائل حتى الآن" />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    style={{
                      background: msg.read ? '#111111' : 'rgba(196,151,58,0.05)',
                      border: `1px solid ${msg.read ? '#2A2A2A' : 'rgba(196,151,58,0.2)'}`,
                      borderRadius: 12, padding: '16px 20px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: '#F0EAE0' }}>{msg.name}</span>
                          {!msg.read && <span style={{ background: '#C4973A', color: '#0A0A0A', fontSize: 10, borderRadius: 100, padding: '2px 8px', fontWeight: 700 }}>جديد</span>}
                          <span style={{ fontSize: 11, color: '#4A4440', marginLeft: 'auto', marginRight: 0 }}>
                            {msg.created_at ? new Date(msg.created_at).toLocaleDateString('ar-SA') : ''}
                          </span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 10 }}>
                          {msg.phone && (
                            <a href={`tel:${msg.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#8A8480', fontSize: 13, textDecoration: 'none' }}>
                              <Phone size={13} />{msg.phone}
                            </a>
                          )}
                          {msg.email && (
                            <a href={`mailto:${msg.email}`} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#8A8480', fontSize: 13, textDecoration: 'none' }}>
                              <Mail size={13} />{msg.email}
                            </a>
                          )}
                        </div>
                        <p style={{ color: '#B8AFA6', fontSize: 14, lineHeight: 1.6, margin: 0 }}>{msg.message}</p>
                      </div>
                      {!msg.read && msg.id && (
                        <button
                          onClick={() => markRead(msg.id!)}
                          style={{ flexShrink: 0, padding: '6px 14px', background: 'rgba(196,151,58,0.1)', border: '1px solid rgba(196,151,58,0.2)', borderRadius: 8, color: '#C4973A', fontSize: 12, cursor: 'pointer', fontFamily: 'Tajawal, Arial, sans-serif', display: 'flex', alignItems: 'center', gap: 5 }}
                        >
                          <CheckCircle2 size={13} />
                          تمييز كمقروء
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Content Tab ─── */}
          {tab === 'content' && (
            <div>
              <div style={{ background: 'rgba(196,151,58,0.08)', border: '1px solid rgba(196,151,58,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 13, color: '#D5B874' }}>
                💡 يمكنك تعديل معلومات التواصل التي تظهر في الموقع من هنا. اضغط "حفظ التعديلات" بعد الانتهاء.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 700 }}>
                {EDITABLE_SECTIONS.map(section => {
                  const item = content.find(c => c.section === section.section && c.key === section.key)
                  return (
                    <div key={`${section.section}_${section.key}`} style={{ background: '#191919', border: '1px solid #2A2A2A', borderRadius: 12, padding: '20px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <Pen size={14} className="text-gold" style={{ color: '#C4973A', flexShrink: 0 }} />
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#F0EAE0' }}>{section.label_ar}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, color: '#8A8480', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>بالعربية</label>
                          <input
                            value={item?.value_ar ?? ''}
                            onChange={e => handleContentChange(section.section, section.key, 'value_ar', e.target.value)}
                            style={adminInputStyle}
                            dir="rtl"
                            placeholder={section.label_ar}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: 11, color: '#8A8480', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>English</label>
                          <input
                            value={item?.value_en ?? ''}
                            onChange={e => handleContentChange(section.section, section.key, 'value_en', e.target.value)}
                            style={adminInputStyle}
                            dir="ltr"
                            placeholder={section.label_en}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <button
                  onClick={handleSaveContent}
                  disabled={saveStatus === 'saving'}
                  style={{
                    padding: '14px 32px', background: 'linear-gradient(135deg, #C4973A, #D5B874)',
                    color: '#0A0A0A', fontWeight: 700, fontSize: 15, borderRadius: 10, border: 'none',
                    cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
                    opacity: saveStatus === 'saving' ? 0.7 : 1,
                    fontFamily: 'Tajawal, Arial, sans-serif',
                  }}
                >
                  {saveStatus === 'saving' ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
                </button>

                {saveStatus === 'saved' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4ade80', fontSize: 13 }}>
                    <CheckCircle2 size={16} /> تم الحفظ بنجاح
                  </div>
                )}
                {saveStatus === 'error' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f87171', fontSize: 13 }}>
                    <AlertCircle size={16} /> حدث خطأ أثناء الحفظ
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#4A4440' }}>
      <MessageSquare size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
      <p style={{ fontSize: 15 }}>{text}</p>
    </div>
  )
}

const adminInputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid #2A2A2A',
  borderRadius: 8, padding: '10px 14px', color: '#F0EAE0', fontSize: 14,
  outline: 'none', fontFamily: 'Tajawal, Arial, sans-serif', boxSizing: 'border-box',
}
