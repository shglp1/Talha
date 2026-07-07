export type Lang = 'ar' | 'en'

export const t = {
  ar: {
    dir: 'rtl' as const,
    lang: 'ar',

    // Nav
    nav: {
      home:    'الرئيسية',
      about:   'من نحن',
      services:'خدماتنا',
      vision:  'رؤيتنا',
      team:    'فريقنا',
      clients: 'عملاؤنا',
      partners:'شركاء النجاح',
      contact: 'تواصل معنا',
      whyUs:   'لماذا نحن',
      en:      'English',
    },

    // Hero
    hero: {
      badge:    'مكتب قانوني متخصص — المدينة المنورة، المملكة العربية السعودية',
      title1:   'مكتب',
      title2:   'د. طلحة غوث',
      title3:   'للمحاماة والاستشارات القانونية',
      subtitle: 'شريككم القانوني الموثوق في حماية الحقوق وتحقيق العدالة',
      cta1:     'تواصل معنا',
      cta2:     'اعرف أكثر',
      stat1:    'سنة خبرة',
      stat2:    'عميل راضٍ',
      stat3:    'قضية ناجحة',
    },

    // About
    about: {
      badge:  'من نحن',
      title:  'رسالتنا أمانة ومسؤولية',
      body1:  'في مكتبنا نؤمن بأن العمل القانوني رسالة سامية تقوم على الثقة، الاحترافية، والأمانة. ومن هذا المنطلق، نحرص على تقديم خدمات واستشارات قانونية متكاملة لقطاعات الأعمال، الشركات، الأفراد، الأوقاف، والورثة، بالإضافة إلى تسوية النزاعات وحفظ الحقوق العمالية، وفق أعلى المعايير المهنية ومنهجية حديثة تواكب التطورات التشريعية والتنظيمية.',
      body2:  'نتميز بتقديم حلول قانونية فعّالة وعملية تجمع بين الخبرة العميقة والفهم الدقيق لاحتياجات العملاء، بما يضمن تحقيق أفضل النتائج وبناء شراكات موثوقة طويلة الأمد. كما نلتزم بدراسة كل قضية بعناية وشفافية مطلقة قبل قبولها؛ إيماناً منا بأن العدالة تبدأ من وضوح الموقف القانوني وأحقية العميل.',
      body3:  'إن قضايا عملائنا ليست مجرد ملفات عابرة، بل هي مسؤوليات وأمانات نضعها في مقدمة أولوياتنا، ونتعامل معها بعناية واهتمام كاملين يماثلان اهتمامنا بمصالحنا الخاصة.',
    },

    // Services
    services: {
      badge:  'خدماتنا',
      title:  'خدمات قانونية متكاملة',
      subtitle: 'نقدم منظومة شاملة من الخدمات القانونية المتخصصة التي تلبي احتياجات الأفراد والشركات والكيانات التجارية',
      items: [
        { icon: 'Building2',    title: 'استشارات الشركات والأعمال',       desc: 'تأسيس الشركات، هيكلة العقود، الحوكمة المؤسسية، والاستشارات التجارية الشاملة.' },
        { icon: 'Landmark',     title: 'الأوقاف وإدارة التركات',          desc: 'حماية أموال الأوقاف، ضمان حقوق الورثة، إدارة التركات وفق الأنظمة الشرعية والنظامية.' },
        { icon: 'Scale',        title: 'تسوية النزاعات والتحكيم',         desc: 'التمثيل القضائي، التحكيم التجاري، والوساطة في حل النزاعات خارج إطار القضاء.' },
        { icon: 'Users',        title: 'حقوق العمل والموارد البشرية',     desc: 'حفظ الحقوق العمالية، تسوية النزاعات العمالية، والاستشارات في قانون العمل السعودي.' },
        { icon: 'FileText',     title: 'العقود والصفقات التجارية',        desc: 'صياغة العقود، مراجعة الاتفاقيات، والتفاوض في الصفقات الاستثمارية والتجارية.' },
        { icon: 'ShieldCheck',  title: 'الاستشارات القضائية والتمثيل',    desc: 'تمثيل العملاء أمام جميع محاكم المملكة، وتقديم الدعم القانوني الكامل في جميع مراحل التقاضي.' },
      ],
    },

    // Vision & Mission
    visionMission: {
      badge:         'رؤيتنا ورسالتنا',
      visionTitle:   'الرؤية',
      visionText:    'أن نكون الشريك القانوني الأكثر موثوقية للأفراد وقطاع الأعمال والكيانات التجارية، من خلال تقديم خدمات واستشارات قانونية متخصصة وفق حلول احترافية مبتكرة تعزز الثقة، وتحمي المصالح، وتحقق قيمة مستدامة لعملائنا.',
      missionTitle:  'الرسالة',
      missionText:   'تقديم استشارات وخدمات قانونية متكاملة لقطاعات الأعمال والأفراد والكيانات التجارية، وحماية أموال الأوقاف، وضمان حقوق ومصالح الورثة، وتسوية النزاعات وحفظ الحقوق العمالية، بكفاءة مهنية عالية ومنهجية دقيقة يقودها فريق متخصص يلتزم بالعدالة والسرية التامة.',
    },

    // Why Us
    whyUs: {
      badge:  'لماذا نحن؟',
      title:  'ما يميزنا عن غيرنا',
      subtitle: 'لأننا نؤمن بأن نجاح عملائنا هو الامتداد الحقيقي لنجاحنا، نلتزم بتقديم تجربة قانونية فريدة ترتكز على:',
      items: [
        { icon: 'Target',       title: 'الدقة والعملية',        desc: 'صياغة حلول قانونية مبتكرة وفعّالة تناسب معطيات كل قضية.' },
        { icon: 'Eye',          title: 'الشفافية المطلقة',       desc: 'دراسة الموقف القانوني بعناية قبل قبول القضية لضمان الأحقية والوضوح.' },
        { icon: 'Brain',        title: 'الفهم العميق',           desc: 'استيعاب طبيعة أنشطة عملائنا واحتياجاتهم التجارية، الوقفية، والأسرية.' },
        { icon: 'Zap',          title: 'السرعة والفاعلية',       desc: 'الاستجابة الفورية وسرعة إنجاز المعاملات دون المساس بجودة الأداء.' },
        { icon: 'Lock',         title: 'السرية والخصوصية',       desc: 'حماية بيانات ومصالح عملائنا باعتبارها خطاً أحمر لا نقبل المساومة فيه.' },
        { icon: 'Award',        title: 'المعايير المهنية',        desc: 'تقديم استشارات وخدمات قانونية تواكب أحدث التطورات التشريعية والتنظيمية.' },
        { icon: 'Handshake',    title: 'الشراكة المستدامة',      desc: 'بناء علاقات وثيقة طويلة الأمد قائمة على الثقة المتبادلة والمصداقية.' },
      ],
    },

    // Strategic Goals
    goals: {
      badge:  'أهدافنا الاستراتيجية',
      title:  'نمضي نحوها بخطى ثابتة',
      subtitle: 'يسعى مكتب د. طلحة غوث للمحاماة إلى تحقيق حزمة من الأهداف الاستراتيجية التي تصنع الفارق لعملائنا:',
      items: [
        { title: 'الريادة والامتياز',     desc: 'تعزيز جودة الخدمات والاستشارات القانونية بما يتطابق مع أعلى المعايير المهنية العالمية.' },
        { title: 'محورية العميل',         desc: 'تحقيق أعلى مستويات رضا العملاء من خلال المتابعة الدقيقة، والشفافية، والسرعة في الإنجاز.' },
        { title: 'الابتكار القانوني',     desc: 'تقديم حلول قانونية مبتكرة وفعّالة خارج الأطر التقليدية لتلائم التحديات المعاصرة والمستقبلية.' },
        { title: 'التمكين الاقتصادي',    desc: 'دعم قطاعات الأعمال والاستثمار وتوفير البيئة القانونية الآمنة لحوكمة الشركات واستقرار الأوقاف.' },
        { title: 'المواكبة التشريعية',   desc: 'التطوير المستمر لأدواتنا القانونية لمواكبة المتغيرات والتطورات التشريعية والتنظيمية المتسارعة.' },
        { title: 'المسؤولية المعرفية',   desc: 'رفع مستوى الوعي القانوني لدى الأفراد والمؤسسات لحماية الحقوق والوقاية من النزاعات.' },
        { title: 'السمو المهني',          desc: 'ترسيخ مبادئ العدالة، والنزاهة، والأمانة، كمحرك أساسي لكافة أعمالنا وممارساتنا القانونية.' },
      ],
    },

    // Team
    team: {
      badge:  'فريقنا',
      title:  'نخبة من الكفاءات القانونية',
      body:   'نفخر في مكتب د. طلحة غوث للمحاماة بضم نخبة من المحامين والمستشارين والخبراء ذوي الكفاءة العالية في مختلف التخصصات (الشركات، الأوقاف، التركات، والقضايا العمالية). يعمل فريقنا بروح الجسد الواحد ومنهجية دقيقة لتقديم دعم قانوني واحترافي يحقق تطلعات عملائنا ويواكب تسارع البيئة التشريعية وقطاع الأعمال.',
      specializations: [
        'قانون الشركات والأعمال',
        'الأوقاف والعقارات',
        'قانون التركات والأسرة',
        'القضايا العمالية',
        'التحكيم التجاري',
        'الاستشارات الاستثمارية',
      ],
    },

    // Clients
    clients: {
      badge:   'عملاؤنا',
      title:   'القطاعات التي نخدمها',
      body:    'نتشرف بخدمة شريحة واسعة وممتدة من العملاء تشمل: أصحاب السمو، الأفراد، الورثة، نظّار الأوقاف، رواد الأعمال، والشركات المحلية والدولية. نمتد بخدماتنا عبر مختلف القطاعات التجارية، الاستثمارية، العقارية، الخدمية، الفندقية، والوقفية.',
      sectors: [
        { icon: 'Crown',       label: 'أصحاب السمو والذوات' },
        { icon: 'Users',       label: 'الأفراد والعائلات' },
        { icon: 'Landmark',    label: 'نظّار الأوقاف' },
        { icon: 'GitBranch',   label: 'الورثة وقضايا التركات' },
        { icon: 'Briefcase',   label: 'رواد الأعمال والشركات' },
        { icon: 'Globe',       label: 'الشركات المحلية والدولية' },
        { icon: 'Hotel',       label: 'القطاع الفندقي والخدمي' },
        { icon: 'BarChart2',   label: 'قطاع الاستثمار والعقار' },
      ],
    },

    // Partners (logo marquee)
    partners: {
      badge:    'شركاء النجاح',
      title:    'نفخر بثقة شركائنا',
      subtitle: 'نخبة من الجهات والمؤسسات التي وضعت ثقتها في خدماتنا القانونية',
    },

    // Closing Statement
    closing: {
      quote:  'في مكتب د. طلحة غوث للمحاماة، نعمل برؤية طموحة لنكون الشريك القانوني الأكثر موثوقية لعملائنا. نحن ملتزمون بتقديم منظومة متكاملة من الخدمات والاستشارات القانونية التي تدمج بين عمق الخبرة، ودقة المنهجية، واحترافية الأداء. نسعى جاهدين لتحقيق أفضل النتائج القضائية والتنظيمية، واضعين حماية حقوق ومصالح عملائنا في مقدمة أولوياتنا، ومستندين في كل خطوة إلى أعلى المعايير المهنية والأخلاقية التي تضمن استدامة النجاح وإرساء قيم العدالة.',
      author: 'د. طلحة غوث',
      role:   'المؤسس والمحامي الرئيسي',
    },

    // Contact
    contact: {
      badge:       'تواصل معنا',
      title:       'نحن هنا لمساعدتك',
      subtitle:    'تواصل مع فريقنا القانوني المتخصص وسنرد عليك في أقرب وقت ممكن',
      namePlaceholder:    'الاسم الكامل',
      phonePlaceholder:   'رقم الجوال',
      emailPlaceholder:   'البريد الإلكتروني',
      messagePlaceholder: 'كيف يمكننا مساعدتك؟',
      send:        'أرسل رسالتك',
      sending:     'جارٍ الإرسال...',
      success:     'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.',
      error:       'حدث خطأ، يرجى المحاولة مرة أخرى.',
      phone:       '+966 14 844 4555',
      email:       'info@drtalha-law.com',
      address:     'طريق الملك عبدالله، الخاتم، المدينة المنورة 42363',
      hours:       'الأحد – الخميس: ٩ص – ٤م',
      mapTitle:    'موقعنا على الخريطة',
    },

    // Footer
    footer: {
      tagline:   'شريككم القانوني الموثوق في حماية حقوقكم وتحقيق العدالة',
      rights:    'جميع الحقوق محفوظة',
      quickLinks:'روابط سريعة',
      services:  'خدماتنا',
    },

    // Chatbot
    chat: {
      title:       'المساعد القانوني',
      subtitle:    'متاح ٢٤/٧',
      placeholder: 'اكتب سؤالك هنا...',
      send:        'إرسال',
      welcome:     'مرحباً بك! أنا مساعد مكتب د. طلحة غوث للمحاماة. كيف يمكنني مساعدتك اليوم؟',
      thinking:    'جارٍ الكتابة...',
    },
  },

  en: {
    dir: 'ltr' as const,
    lang: 'en',

    nav: {
      home:    'Home',
      about:   'About',
      services:'Services',
      vision:  'Vision',
      team:    'Team',
      clients: 'Clients',
      partners:'Partners',
      contact: 'Contact',
      whyUs:   'Why Us',
      en:      'عربي',
    },

    hero: {
      badge:    'Specialized Law Firm — Madinah, Saudi Arabia',
      title1:   'Dr. Talha Ghawth',
      title2:   '',
      title3:   'Law Office & Legal Consultations',
      subtitle: 'Your trusted legal partner in protecting rights and achieving justice',
      cta1:     'Contact Us',
      cta2:     'Learn More',
      stat1:    'Years Experience',
      stat2:    'Satisfied Clients',
      stat3:    'Successful Cases',
    },

    about: {
      badge:  'About Us',
      title:  'Our Mission is a Trust & Responsibility',
      body1:  'At our firm, we believe that legal work is a noble mission built on trust, professionalism, and integrity. We provide comprehensive legal services and consultations for businesses, corporations, individuals, endowments, and heirs, in addition to dispute resolution and labor rights preservation, in accordance with the highest professional standards.',
      body2:  'We excel at delivering effective, practical legal solutions that combine deep expertise with a precise understanding of our clients\' needs, ensuring the best outcomes and building reliable long-term partnerships. We commit to studying every case carefully and with absolute transparency before acceptance.',
      body3:  'Our clients\' cases are not mere files — they are responsibilities and trusts that we place at the top of our priorities, handling them with the same care and attention we would give to our own interests.',
    },

    services: {
      badge:  'Our Services',
      title:  'Comprehensive Legal Services',
      subtitle: 'We offer a comprehensive suite of specialized legal services that meet the needs of individuals, businesses, and commercial entities',
      items: [
        { icon: 'Building2',   title: 'Corporate & Business Advisory',  desc: 'Company formation, contract structuring, corporate governance, and comprehensive commercial consulting.' },
        { icon: 'Landmark',    title: 'Endowments & Estate Management', desc: 'Protection of waqf assets, ensuring heirs\' rights, and estate management under Sharia and regulatory frameworks.' },
        { icon: 'Scale',       title: 'Dispute Resolution & Arbitration',desc: 'Judicial representation, commercial arbitration, and mediation outside the court system.' },
        { icon: 'Users',       title: 'Labor Law & HR Rights',          desc: 'Preserving labor rights, resolving labor disputes, and consulting on Saudi Labor Law.' },
        { icon: 'FileText',    title: 'Contracts & Commercial Deals',   desc: 'Contract drafting, agreement reviews, and negotiation of investment and commercial transactions.' },
        { icon: 'ShieldCheck', title: 'Litigation & Representation',    desc: 'Representing clients before all courts in the Kingdom and providing full legal support at all litigation stages.' },
      ],
    },

    visionMission: {
      badge:         'Vision & Mission',
      visionTitle:   'Vision',
      visionText:    'To be the most trusted legal partner for individuals, businesses, and commercial entities, by delivering specialized legal services and consultations through innovative professional solutions that build trust, protect interests, and create sustainable value for our clients.',
      missionTitle:  'Mission',
      missionText:   'To provide comprehensive legal consultations and services for business sectors, individuals, and commercial entities; to protect endowment assets; to ensure the rights and interests of heirs; and to resolve disputes and preserve labor rights — with high professional competence and precise methodology led by a specialized team committed to justice and absolute confidentiality.',
    },

    whyUs: {
      badge:  'Why Us?',
      title:  'What Sets Us Apart',
      subtitle: 'Because we believe that our clients\' success is the true extension of our success, we commit to delivering a unique legal experience based on:',
      items: [
        { icon: 'Target',     title: 'Precision & Practicality',   desc: 'Crafting innovative and effective legal solutions tailored to the specifics of each case.' },
        { icon: 'Eye',        title: 'Absolute Transparency',      desc: 'Carefully studying the legal position before accepting a case to ensure clarity and eligibility.' },
        { icon: 'Brain',      title: 'Deep Understanding',         desc: 'Grasping the nature of clients\' activities and their commercial, endowment, and family needs.' },
        { icon: 'Zap',        title: 'Speed & Effectiveness',      desc: 'Immediate response and swift transaction completion without compromising performance quality.' },
        { icon: 'Lock',       title: 'Confidentiality & Privacy',  desc: 'Protecting clients\' data and interests as a red line we will never compromise on.' },
        { icon: 'Award',      title: 'Professional Standards',     desc: 'Providing legal consultations and services aligned with the latest legislative and regulatory developments.' },
        { icon: 'Handshake',  title: 'Sustainable Partnership',    desc: 'Building close, long-term relationships based on mutual trust and credibility.' },
      ],
    },

    goals: {
      badge:  'Strategic Goals',
      title:  'Moving Forward with Firm Steps',
      subtitle: 'Dr. Talha Ghawth Law Office strives to achieve a set of strategic goals that make a difference for our clients:',
      items: [
        { title: 'Leadership & Excellence',    desc: 'Enhancing the quality of legal services and consultations to match the highest global professional standards.' },
        { title: 'Client Centricity',          desc: 'Achieving the highest client satisfaction through precise follow-up, transparency, and swift delivery.' },
        { title: 'Legal Innovation',           desc: 'Providing innovative and effective legal solutions beyond traditional frameworks to meet contemporary challenges.' },
        { title: 'Economic Empowerment',       desc: 'Supporting business and investment sectors and providing a safe legal environment for corporate governance.' },
        { title: 'Legislative Alignment',      desc: 'Continuously developing our legal tools to keep pace with rapidly changing legislative and regulatory developments.' },
        { title: 'Knowledge Responsibility',   desc: 'Raising legal awareness among individuals and institutions to protect rights and prevent disputes.' },
        { title: 'Professional Excellence',    desc: 'Entrenching the principles of justice, integrity, and honesty as the core driver of all our legal work.' },
      ],
    },

    team: {
      badge:  'Our Team',
      title:  'Elite Legal Professionals',
      body:   'Dr. Talha Ghawth Law Office is proud to have an elite team of highly qualified lawyers, consultants, and experts across various specializations — corporate law, endowments, estates, and labor cases. Our team works as one body with precise methodology to provide professional legal support that meets our clients\' aspirations.',
      specializations: [
        'Corporate & Business Law',
        'Endowments & Real Estate',
        'Family & Inheritance Law',
        'Labor Cases',
        'Commercial Arbitration',
        'Investment Consulting',
      ],
    },

    clients: {
      badge:   'Our Clients',
      title:   'Sectors We Serve',
      body:    'We are honored to serve a wide range of clients including: Royal Highnesses, individuals, heirs, waqf administrators, entrepreneurs, and local and international companies, across commercial, investment, real estate, hospitality, and endowment sectors.',
      sectors: [
        { icon: 'Crown',       label: 'Royal Highnesses & VIPs' },
        { icon: 'Users',       label: 'Individuals & Families' },
        { icon: 'Landmark',    label: 'Waqf Administrators' },
        { icon: 'GitBranch',   label: 'Heirs & Estate Cases' },
        { icon: 'Briefcase',   label: 'Entrepreneurs & Corporations' },
        { icon: 'Globe',       label: 'Local & International Companies' },
        { icon: 'Hotel',       label: 'Hospitality & Service Sector' },
        { icon: 'BarChart2',   label: 'Investment & Real Estate' },
      ],
    },

    partners: {
      badge:    'Success Partners',
      title:    'Trusted by Our Partners',
      subtitle: 'A select group of entities and institutions that place their trust in our legal services',
    },

    closing: {
      quote:  'At Dr. Talha Ghawth Law Office, we work with an ambitious vision to be the most trusted legal partner for our clients. We are committed to providing a comprehensive system of legal services and consultations that integrates depth of experience, methodological precision, and professional performance — always placing the protection of our clients\' rights and interests at the forefront.',
      author: 'Dr. Talha Ghawth',
      role:   'Founder & Principal Attorney',
    },

    contact: {
      badge:       'Contact Us',
      title:       'We Are Here to Help',
      subtitle:    'Reach out to our specialized legal team and we will respond as soon as possible',
      namePlaceholder:    'Full Name',
      phonePlaceholder:   'Phone Number',
      emailPlaceholder:   'Email Address',
      messagePlaceholder: 'How can we help you?',
      send:        'Send Message',
      sending:     'Sending...',
      success:     'Your message has been sent successfully! We will be in touch soon.',
      error:       'An error occurred. Please try again.',
      phone:       '+966 14 844 4555',
      email:       'info@drtalha-law.com',
      address:     'King Abdullah Rd, Al-Khatim, Madinah 42363',
      hours:       'Sun – Thu: 9 AM – 4 PM',
      mapTitle:    'Our Location',
    },

    footer: {
      tagline:   'Your trusted legal partner in protecting your rights and achieving justice',
      rights:    'All Rights Reserved',
      quickLinks:'Quick Links',
      services:  'Services',
    },

    chat: {
      title:       'Legal Assistant',
      subtitle:    'Available 24/7',
      placeholder: 'Type your question here...',
      send:        'Send',
      welcome:     'Welcome! I am the assistant of Dr. Talha Ghawth Law Office. How can I help you today?',
      thinking:    'Typing...',
    },
  },
}
