# إعداد موقع مكتب د. طلحة غوث

## خطوات التشغيل

### 1. تثبيت الحزم
```bash
npm install
```

### 2. إعداد المتغيرات البيئية
انسخ الملف `.env.local.example` إلى `.env.local` وأضف قيمك:
```bash
cp .env.local.example .env.local
```

ثم أضف:
- **NEXT_PUBLIC_SUPABASE_URL**: من لوحة تحكم Supabase → Settings → API
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: مفتاح anon من Supabase  
- **SUPABASE_SERVICE_ROLE_KEY**: مفتاح service_role من Supabase (سري — لا تشاركه)
- **OPENAI_API_KEY**: مفتاح OpenAI API

### 3. إعداد قاعدة البيانات Supabase
1. أنشئ مشروعاً جديداً على [supabase.com](https://supabase.com)
2. اذهب إلى SQL Editor
3. انسخ محتوى `supabase/migrations/001_initial.sql` والصقه واضغط Run

### 4. إنشاء حساب الأدمن
في Supabase → Authentication → Users → Invite user  
أضف بريدك الإلكتروني وكلمة مرور قوية

### 5. تشغيل المشروع
```bash
npm run dev
```
افتح [http://localhost:3000](http://localhost:3000)

---

## روابط مهمة
- **الموقع**: http://localhost:3000/ar
- **الموقع بالإنجليزية**: http://localhost:3000/en  
- **لوحة التحكم**: http://localhost:3000/admin
- **تسجيل دخول الأدمن**: http://localhost:3000/admin/login

---

## الخط العربي
الموقع يستخدم خط **Tajawal** من Google Fonts.  
إذا أردت استخدام **خط ثمانية** المخصص، ضع ملف الخط في `public/fonts/` وأضف في `globals.css`:
```css
@font-face {
  font-family: 'Thamanya';
  src: url('/fonts/Thamanya.woff2') format('woff2');
  font-weight: 400 900;
  font-display: swap;
}
```
ثم استبدل `Tajawal` بـ `Thamanya` في `tailwind.config.ts`.

---

## النشر على Vercel
```bash
npm i -g vercel
vercel
```
أضف المتغيرات البيئية في لوحة تحكم Vercel.
