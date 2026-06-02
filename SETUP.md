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
3. شغّل ملفات الهجرة **بالترتيب** (انسخ محتوى كل ملف، الصقه، ثم اضغط Run):
   1. `supabase/migrations/001_initial.sql`
   2. `supabase/migrations/002_partners.sql`
   3. `supabase/migrations/003_partner_logos_storage.sql`
   4. `supabase/migrations/004_content_items.sql`
   5. `supabase/migrations/005_admin_policy_fixes.sql`
   6. `supabase/migrations/006_custom_fields.sql`
   7. `supabase/migrations/007_table_grants.sql` — **مهم** لإصلاح `permission denied for table partners`
4. تأكّد من وجود مساحة التخزين (Bucket) باسم `partner-logos` (تُنشأ تلقائياً عند أول رفع شعار، أو أنشئها يدوياً من Storage واجعلها Public).
5. تأكد أن `SUPABASE_SERVICE_ROLE_KEY` في `.env.local` هو مفتاح **service_role** وليس مفتاح **anon**.

### 4. إنشاء حساب الأدمن
في Supabase → Authentication → Users → Invite user  
أضف بريدك الإلكتروني وكلمة مرور قوية.  
اختيارياً: ضع نفس البريد في `ADMIN_EMAIL` بملف `.env.local` لقصر دخول لوحة التحكم على هذا الحساب فقط.

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
أضف المتغيرات البيئية في لوحة تحكم Vercel (بما فيها `SUPABASE_SERVICE_ROLE_KEY` و`OPENAI_API_KEY` و`ADMIN_EMAIL` إن استخدمته).

---

## لوحة التحكم — كيف تعمل
- **رسائل التواصل**: الرسائل الواردة من نموذج الموقع.
- **نصوص الموقع**: تعديل كل النصوص. داخل أقسام «الخدمات/لماذا نحن/الأهداف/الفريق/العملاء» يمكنك إضافة وحذف وترتيب البطاقات مباشرةً، كما يمكنك زر «إضافة حقل نصي جديد» لإنشاء نص إضافي يظهر داخل نفس القسم.
- **الأقسام والبطاقات**: عرض موسّع لكل البطاقات + زر «استيراد البيانات الافتراضية» لتعبئة الأقسام الفارغة.
- **شركاء النجاح**: رفع شعار من الجهاز، اختيار أيقونة، ووضع أي رابط (يُكمَّل `https://` تلقائياً).

> جميع عمليات الحفظ والرفع تمر عبر مسارات `/api/admin/*` التي تتحقق من جلسة الأدمن في الخادم، لذا تأكد من تسجيل الدخول.

---

## حل المشكلات الشائعة
- **permission denied for table partners** (أو أي جدول): شغّل `007_table_grants.sql` وتأكد من `SUPABASE_SERVICE_ROLE_KEY` الصحيح.
- **ظهور خطأ 403 أو «الجلسة غير صالحة»**: سجّل الخروج ثم الدخول مجدداً من `/admin/login`. تأكد أيضاً من تشغيل ملفات الهجرة `005`–`007`.
- **التعديلات لا تظهر في الموقع**: احفظ من لوحة التحكم ثم افتح الموقع في تبويب جديد أو حدّث الصفحة (F5). الموقع يقرأ من `/api/content` مباشرة من قاعدة البيانات.
- **الأقسام تظهر «0 عنصر»**: من تبويب «الأقسام والبطاقات» اضغط «استيراد البيانات الافتراضية».
- **`ERR_CONNECTION_CLOSED` / `ERR_CONNECTION_RESET`**: تأكد أن مشروع Supabase ليس متوقفاً (Paused) في الخطة المجانية، وجرّب من دون VPN.
- **فشل رفع الشعار**: تأكد من وجود Bucket باسم `partner-logos` وأنه Public، ومن صحة `SUPABASE_SERVICE_ROLE_KEY`.
- **تسريب المفاتيح**: إذا شُورِك `SUPABASE_SERVICE_ROLE_KEY` أو مفاتيح أخرى علناً، أعد توليدها من لوحة Supabase فوراً.

---

## قائمة التحقق بعد الإعداد
1. سجّل الدخول من `/admin/login`.
2. تبويب «نصوص الموقع»: تظهر البطاقات داخل الأقسام، أضف بطاقة واحفظها.
3. عدّل نصاً واضغط «حفظ كل التعديلات» ثم تحقق من الموقع بالعربية والإنجليزية.
4. تبويب «شركاء النجاح»: ارفع شعاراً، وضع رابطاً مثل `example.com` وتأكد أنه يفتح `https://example.com`.
5. جرّب المساعد القانوني بالعربية والإنجليزية.
