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
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      setLoading(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0A0A0A 0%, #111111 100%)' }}>
      {/* Glow */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'rgba(196,151,58,0.05)', filter: 'blur(80px)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Image src="/logo.svg" alt="مكتب د. طلحة غوث" width={200} height={50} style={{ margin: '0 auto' }} />
          <p style={{ color: '#8A8480', fontSize: 13, marginTop: 8 }}>لوحة إدارة الموقع</p>
        </div>

        {/* Card */}
        <div style={{ background: '#191919', border: '1px solid #2A2A2A', borderRadius: 16, padding: 32 }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24, textAlign: 'center', color: '#F0EAE0' }}>
            تسجيل الدخول
          </h1>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#8A8480', marginBottom: 8 }}>البريد الإلكتروني</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: 14, color: '#8A8480' }} />
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
              <label style={{ display: 'block', fontSize: 13, color: '#8A8480', marginBottom: 8 }}>كلمة المرور</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: 14, color: '#8A8480' }} />
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
                  style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 14, color: '#8A8480', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', color: '#f87171', fontSize: 13, textAlign: 'center' }}>
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
                fontFamily: 'Tajawal, Arial, sans-serif',
              }}
            >
              {loading ? 'جارٍ الدخول...' : 'دخول'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#4A4440' }}>
          <a href="/" style={{ color: '#C4973A', textDecoration: 'none' }}>← العودة إلى الموقع</a>
        </p>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid #2A2A2A',
  borderRadius: 10,
  padding: '12px 44px 12px 16px',
  color: '#F0EAE0',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'Tajawal, Arial, sans-serif',
  boxSizing: 'border-box',
}
