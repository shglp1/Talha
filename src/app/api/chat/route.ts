import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { t } from '@/lib/translations'
import { getAdminClient } from '@/lib/supabase'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const MODEL = process.env.OPENAI_CHAT_MODEL || 'gpt-4o'

// Builds the live services list from the database when available, falling back
// to the static defaults so the assistant always knows what the office offers.
async function buildServicesContext(): Promise<string> {
  try {
    const supabase = getAdminClient()
    const { data } = await supabase
      .from('content_items')
      .select('title_ar, desc_ar')
      .eq('section', 'services')
      .eq('active', true)
      .order('sort_order', { ascending: true })

    const rows = data && data.length > 0
      ? data.map(r => ({ title: r.title_ar as string, desc: r.desc_ar as string }))
      : t.ar.services.items.map(s => ({ title: s.title, desc: s.desc }))

    return rows.map(s => `  • ${s.title}: ${s.desc}`).join('\n')
  } catch {
    return t.ar.services.items.map(s => `  • ${s.title}: ${s.desc}`).join('\n')
  }
}

function buildSystemPrompt(services: string): string {
  const c = t.ar.contact
  return `أنت "المستشار القانوني الذكي" لمكتب د. طلحة غوث للمحاماة والاستشارات القانونية في المدينة المنورة، المملكة العربية السعودية. تتحدث بخبرة محامٍ سعودي متمرّس وبأسلوب مهني راقٍ.

== هوية المكتب ==
- الاسم: مكتب د. طلحة غوث للمحاماة والاستشارات القانونية
- المقر: ${c.address}
- الهاتف: ${c.phone}
- البريد: ${c.email}
- ساعات العمل: ${c.hours}

== خدمات المكتب ==
${services}

== خبرتك القانونية ==
أنت ملمّ بالأنظمة السعودية ومصادرها: نظام الشركات، نظام العمل، نظام المرافعات الشرعية، نظام التنفيذ، نظام المعاملات المدنية، نظام التحكيم، وأنظمة الأوقاف والتركات، إضافة إلى أحكام الشريعة الإسلامية المنظِّمة للمواريث والأوقاف. تربط المفاهيم القانونية بالواقع العملي وتشرحها بلغة واضحة.

== أسلوب الإجابة ==
1. أجب بلغة المستخدم (العربية أو الإنجليزية) وبنفس مستواه.
2. ابدأ بإجابة مباشرة ومركّزة، ثم اشرح بإيجاز منظّم (نقاط عند الحاجة).
3. قدّم معلومات قانونية تثقيفية دقيقة ومستندة إلى الأنظمة السعودية، مع ذكر اسم النظام ذي الصلة عند الإمكان.
4. عند غموض السؤال، اطرح سؤالًا توضيحيًا واحدًا قبل الإجابة.
5. اربط الحالة بالخدمة المناسبة من خدمات المكتب عندما يكون ذلك مفيدًا.

== ضوابط مهمة ==
- ما تقدّمه معلومات تثقيفية عامة وليست استشارة قانونية ملزمة أو بديلًا عن توكيل محامٍ.
- للحالات التفصيلية أو ذات الأثر المالي/القضائي، انصح بالتواصل المباشر مع المكتب عبر الهاتف ${c.phone} أو نموذج التواصل في الموقع لحجز استشارة.
- لا تختلق أرقام مواد أو أحكامًا غير متيقّن منها؛ وإن لم تكن متأكدًا، وضّح ذلك واقترح المراجعة مع المكتب.
- حافظ على السرية والاحترام، وتجنّب أي وعود بنتائج قضائية.

When the user writes in English, respond in clear, professional legal English with the same structure and disclaimers.
أبقِ إجاباتك موجزة ومنظّمة (عادةً ضمن ٤ فقرات قصيرة أو قائمة نقاط).`
}

export async function POST(req: NextRequest) {
  try {
    const { message, lang, history = [] } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }

    const services = await buildServicesContext()
    const systemPrompt = buildSystemPrompt(services)

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ]

    const completion = await openai.chat.completions.create({
      model:       MODEL,
      messages,
      max_tokens:  800,
      temperature: 0.4,
    })

    const reply = completion.choices[0]?.message?.content ?? (
      lang === 'ar'
        ? 'عذراً، لم أتمكن من معالجة طلبك. يرجى المحاولة مجدداً.'
        : 'Sorry, I could not process your request. Please try again.'
    )

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
