'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]   = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.message?.toLowerCase().includes('email not confirmed')) {
        setError('الحساب غير مفعّل بعد. فعّل البريد الإلكتروني من لوحة Server Auth أو عطّل Email confirmation مؤقتاً.')
      } else {
        setError('تعذر تسجيل الدخول. تأكد من البريد وكلمة المرور، وأن المستخدم موجود في Server Auth.')
      }
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F5EF 100%)' }}>
      {/* Glow */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'rgba(196,151,58,0.10)', filter: 'blur(80px)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Image src="/logo.png" alt="الدكتور طلحة غوث للمحاماة | Dr. Talha Ghawth Law Firm" width={438} height={92} style={{ margin: '0 auto', objectFit: 'contain', width: 'min(100%, 300px)', height: 'auto' }} />
          <p style={{ color: '#5A5149', fontSize: 13, margin: 0 }}>لوحة إدارة الموقع</p>
        </div>

        {/* Card */}
        <div style={{ background: '#FFFFFF', border: '1px solid #ECE6DA', borderRadius: 16, padding: 32, boxShadow: '0 10px 40px rgba(26,22,15,0.06)' }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, textAlign: 'center', color: '#1A160F' }}>
            تسجيل الدخول
          </h1>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#5A5149', marginBottom: 8 }}>البريد الإلكتروني</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: 14, color: '#9B9387' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  dir="ltr"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#5A5149', marginBottom: 8 }}>كلمة المرور</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: 14, color: '#9B9387' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  dir="ltr"
                  style={{ ...inputStyle, paddingLeft: 44 }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 14, color: '#9B9387', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', color: '#DC2626', fontSize: 13, textAlign: 'center' }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px 24px',
                background: 'linear-gradient(135deg, #C4973A, #D5B874)',
                color: '#0A0A0A',
                fontWeight: 700,
                fontSize: 15,
                borderRadius: 10,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginTop: 4,
                fontFamily: 'inherit',
              }}
            >
              {loading ? 'جارٍ الدخول...' : 'دخول'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#9B9387' }}>
          <a href="/" style={{ color: '#A27849', textDecoration: 'none' }}>← العودة إلى الموقع</a>
        </p>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#FFFFFF',
  border: '1px solid #ECE6DA',
  borderRadius: 10,
  padding: '12px 44px 12px 16px',
  color: '#1A160F',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}
