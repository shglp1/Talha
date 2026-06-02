import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'لوحة التحكم | مكتب د. طلحة غوث',
  robots: { index: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: 'Tajawal, Arial, sans-serif', background: '#0A0A0A', color: '#F0EAE0', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
