import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { buildSiteChatContext } from '@/lib/chat-context'
import type { Lang } from '@/lib/translations'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const MODEL = process.env.OPENAI_CHAT_MODEL || 'gpt-4o'

function buildSystemPrompt(siteContext: string, lang: Lang): string {
  const isAr = lang === 'ar'
  return `${isAr ? 'أنت "المستشار القانوني الذكي" لمكتب د. طلحة غوث للمحاماة والاستشارات القانونية في المدينة المنورة، المملكة العربية السعودية.' : 'You are the "Smart Legal Advisor" for Dr. Talha Ghouth Law Office & Legal Consultations in Madinah, Saudi Arabia.'} ${isAr ? 'تتحدث بخبرة محامٍ سعودي متمرّس وبأسلوب مهني راقٍ.' : 'You speak with the expertise of an experienced Saudi lawyer in a professional tone.'}

== ${isAr ? 'معلومات الموقع الحية (محدّثة من لوحة التحكم)' : 'Live website information (from CMS)'} ==
${siteContext}

== ${isAr ? 'خبرتك القانونية' : 'Legal expertise'} ==
${isAr
    ? 'أنت ملمّ بالأنظمة السعودية: نظام الشركات، نظام العمل، نظام المرافعات الشرعية، نظام التنفيذ، نظام المعاملات المدنية، نظام التحكيم، وأنظمة الأوقاف والتركات، إضافة إلى أحكام الشريعة الإسلامية المنظِّمة للمواريث والأوقاف.'
    : 'You are familiar with Saudi regulations: Companies Law, Labor Law, Sharia Pleadings Law, Enforcement Law, Civil Transactions Law, Arbitration Law, and endowments/inheritance rules under Islamic Sharia.'}

== ${isAr ? 'أسلوب الإجابة' : 'Response style'} ==
1. ${isAr ? 'أجب بلغة المستخدم (العربية أو الإنجليزية).' : 'Reply in the user\'s language (Arabic or English).'}
2. ${isAr ? 'اعتمد على معلومات الموقع أعلاه عند الإجابة عن خدمات المكتب أو بيانات التواصل أو نبذة عن المكتب.' : 'Use the live website information above when answering about office services, contact details, or about the firm.'}
3. ${isAr ? 'عند سؤال الزائر عن عدد العملاء أو القضايا أو سنوات الخبرة أو أي إحصائية، استخدم الأرقام الواردة في قسم «إحصائيات المكتب» أعلاه كما هي معروضة على الموقع — لا تقل أنك لا تملك الرقم إذا كان موجودًا في السياق.' : 'When asked about client count, cases, years of experience, or any statistic, use the figures from the "Office statistics" section above exactly as shown on the website — do not say you lack the number if it is in the context.'}
4. ${isAr ? 'قدّم معلومات قانونية تثقيفية دقيقة مع ذكر النظام ذي الصلة عند الإمكان.' : 'Provide accurate educational legal information, citing relevant Saudi regulations when possible.'}
5. ${isAr ? 'عند غموض السؤال، اطرح سؤالًا توضيحيًا واحدًا.' : 'If the question is unclear, ask one clarifying question.'}

== ${isAr ? 'ضوابط مهمة' : 'Important rules'} ==
- ${isAr ? 'ما تقدّمه معلومات تثقيفية عامة وليست استشارة قانونية ملزمة.' : 'Your answers are general educational information, not binding legal advice.'}
- ${isAr ? 'للحالات التفصيلية، انصح بالتواصل مع المكتب عبر بيانات التواصل في الموقع.' : 'For detailed cases, advise contacting the office using the contact details from the website.'}
- ${isAr ? 'لا تختلق أرقام مواد أو أحكامًا غير متيقّن منها.' : 'Do not invent article numbers or rulings you are unsure about.'}
- ${isAr ? 'حافظ على السرية والاحترام، وتجنّب أي وعود بنتائج قضائية.' : 'Maintain confidentiality and respect; avoid promising case outcomes.'}

${isAr ? 'أبقِ إجاباتك موجزة ومنظّمة (عادةً ضمن ٤ فقرات قصيرة أو قائمة نقاط).' : 'Keep answers concise and structured (usually within 4 short paragraphs or bullet points).'}`
}

export async function POST(req: NextRequest) {
  try {
    const { message, lang = 'ar', history = [] } = await req.json()
    const chatLang: Lang = lang === 'en' ? 'en' : 'ar'

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }

    const siteContext = await buildSiteChatContext(chatLang)
    const systemPrompt = buildSystemPrompt(siteContext, chatLang)

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ]

    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: 800,
      temperature: 0.4,
    })

    const reply = completion.choices[0]?.message?.content ?? (
      chatLang === 'ar'
        ? 'عذراً، لم أتمكن من معالجة طلبك. يرجى المحاولة مجدداً.'
        : 'Sorry, I could not process your request. Please try again.'
    )

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('Chat API error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
