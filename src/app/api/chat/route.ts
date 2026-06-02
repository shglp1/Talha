import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `
أنت مساعد ذكي لمكتب د. طلحة غوث للمحاماة والاستشارات القانونية في جدة، المملكة العربية السعودية.

معلومات المكتب:
- الاسم: مكتب د. طلحة غوث للمحاماة والاستشارات القانونية
- الموقع: جدة، المملكة العربية السعودية
- الخدمات الرئيسية:
  • استشارات الشركات والأعمال
  • الأوقاف وإدارة التركات والميراث
  • تسوية النزاعات والتحكيم التجاري
  • حقوق العمل والموارد البشرية
  • العقود والصفقات التجارية
  • التمثيل القضائي أمام المحاكم

قواعد المساعد:
1. أجب باللغة التي يكتب بها المستخدم (عربي أو إنجليزي)
2. كن مهنياً، ودوداً، وموجزاً
3. للأسئلة القانونية العامة يمكنك تقديم معلومات تثقيفية
4. للاستشارات التفصيلية، وجّه المستخدم للتواصل المباشر مع المكتب
5. لا تقدم مشورة قانونية ملزمة
6. إذا طُلب التواصل: اذكر إمكانية التواصل عبر نموذج الاتصال في الموقع

You are also fluent in English. When users write in English, respond in professional English.
Always be concise — keep responses under 3 paragraphs.
`

export async function POST(req: NextRequest) {
  try {
    const { message, lang, history = [] } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-8).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ]

    const completion = await openai.chat.completions.create({
      model:       'gpt-4o-mini',
      messages,
      max_tokens:  500,
      temperature: 0.7,
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
