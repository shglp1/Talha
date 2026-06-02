-- ─────────────────────────────────────────────
-- Repeating content lists (services, why-us, goals,
-- team specializations, client sectors) — full CRUD from admin
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS content_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section     TEXT NOT NULL,
  title_ar    TEXT DEFAULT '',
  title_en    TEXT DEFAULT '',
  desc_ar     TEXT DEFAULT '',
  desc_en     TEXT DEFAULT '',
  icon        TEXT,
  sort_order  INT DEFAULT 0,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS content_items_section_idx ON content_items (section, sort_order);

ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

-- Public can read only active items (rendered on the site)
DROP POLICY IF EXISTS "public_read_content_items" ON content_items;
CREATE POLICY "public_read_content_items" ON content_items
  FOR SELECT TO anon USING (active = true);

-- Admins manage everything
DROP POLICY IF EXISTS "admin_all_content_items" ON content_items;
CREATE POLICY "admin_all_content_items" ON content_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed the current site content so the admin sees and can edit existing items.
-- Runs only once (skips if the table already has rows).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM content_items) THEN

    -- ── Services ──
    INSERT INTO content_items (section, title_ar, title_en, desc_ar, desc_en, icon, sort_order) VALUES
      ('services', 'استشارات الشركات والأعمال', 'Corporate & Business Advisory', 'تأسيس الشركات، هيكلة العقود، الحوكمة المؤسسية، والاستشارات التجارية الشاملة.', 'Company formation, contract structuring, corporate governance, and comprehensive commercial consulting.', 'Building2', 0),
      ('services', 'الأوقاف وإدارة التركات', 'Endowments & Estate Management', 'حماية أموال الأوقاف، ضمان حقوق الورثة، إدارة التركات وفق الأنظمة الشرعية والنظامية.', 'Protection of waqf assets, ensuring heirs'' rights, and estate management under Sharia and regulatory frameworks.', 'Landmark', 1),
      ('services', 'تسوية النزاعات والتحكيم', 'Dispute Resolution & Arbitration', 'التمثيل القضائي، التحكيم التجاري، والوساطة في حل النزاعات خارج إطار القضاء.', 'Judicial representation, commercial arbitration, and mediation outside the court system.', 'Scale', 2),
      ('services', 'حقوق العمل والموارد البشرية', 'Labor Law & HR Rights', 'حفظ الحقوق العمالية، تسوية النزاعات العمالية، والاستشارات في قانون العمل السعودي.', 'Preserving labor rights, resolving labor disputes, and consulting on Saudi Labor Law.', 'Users', 3),
      ('services', 'العقود والصفقات التجارية', 'Contracts & Commercial Deals', 'صياغة العقود، مراجعة الاتفاقيات، والتفاوض في الصفقات الاستثمارية والتجارية.', 'Contract drafting, agreement reviews, and negotiation of investment and commercial transactions.', 'FileText', 4),
      ('services', 'الاستشارات القضائية والتمثيل', 'Litigation & Representation', 'تمثيل العملاء أمام جميع محاكم المملكة، وتقديم الدعم القانوني الكامل في جميع مراحل التقاضي.', 'Representing clients before all courts in the Kingdom and providing full legal support at all litigation stages.', 'ShieldCheck', 5);

    -- ── Why Us ──
    INSERT INTO content_items (section, title_ar, title_en, desc_ar, desc_en, icon, sort_order) VALUES
      ('whyUs', 'الدقة والعملية', 'Precision & Practicality', 'صياغة حلول قانونية مبتكرة وفعّالة تناسب معطيات كل قضية.', 'Crafting innovative and effective legal solutions tailored to the specifics of each case.', 'Target', 0),
      ('whyUs', 'الشفافية المطلقة', 'Absolute Transparency', 'دراسة الموقف القانوني بعناية قبل قبول القضية لضمان الأحقية والوضوح.', 'Carefully studying the legal position before accepting a case to ensure clarity and eligibility.', 'Eye', 1),
      ('whyUs', 'الفهم العميق', 'Deep Understanding', 'استيعاب طبيعة أنشطة عملائنا واحتياجاتهم التجارية، الوقفية، والأسرية.', 'Grasping the nature of clients'' activities and their commercial, endowment, and family needs.', 'Brain', 2),
      ('whyUs', 'السرعة والفاعلية', 'Speed & Effectiveness', 'الاستجابة الفورية وسرعة إنجاز المعاملات دون المساس بجودة الأداء.', 'Immediate response and swift transaction completion without compromising performance quality.', 'Zap', 3),
      ('whyUs', 'السرية والخصوصية', 'Confidentiality & Privacy', 'حماية بيانات ومصالح عملائنا باعتبارها خطاً أحمر لا نقبل المساومة فيه.', 'Protecting clients'' data and interests as a red line we will never compromise on.', 'Lock', 4),
      ('whyUs', 'المعايير المهنية', 'Professional Standards', 'تقديم استشارات وخدمات قانونية تواكب أحدث التطورات التشريعية والتنظيمية.', 'Providing legal consultations and services aligned with the latest legislative and regulatory developments.', 'Award', 5),
      ('whyUs', 'الشراكة المستدامة', 'Sustainable Partnership', 'بناء علاقات وثيقة طويلة الأمد قائمة على الثقة المتبادلة والمصداقية.', 'Building close, long-term relationships based on mutual trust and credibility.', 'Handshake', 6);

    -- ── Strategic Goals ──
    INSERT INTO content_items (section, title_ar, title_en, desc_ar, desc_en, icon, sort_order) VALUES
      ('goals', 'الريادة والامتياز', 'Leadership & Excellence', 'تعزيز جودة الخدمات والاستشارات القانونية بما يتطابق مع أعلى المعايير المهنية العالمية.', 'Enhancing the quality of legal services and consultations to match the highest global professional standards.', 'Award', 0),
      ('goals', 'محورية العميل', 'Client Centricity', 'تحقيق أعلى مستويات رضا العملاء من خلال المتابعة الدقيقة، والشفافية، والسرعة في الإنجاز.', 'Achieving the highest client satisfaction through precise follow-up, transparency, and swift delivery.', 'UserCheck', 1),
      ('goals', 'الابتكار القانوني', 'Legal Innovation', 'تقديم حلول قانونية مبتكرة وفعّالة خارج الأطر التقليدية لتلائم التحديات المعاصرة والمستقبلية.', 'Providing innovative and effective legal solutions beyond traditional frameworks to meet contemporary challenges.', 'Lightbulb', 2),
      ('goals', 'التمكين الاقتصادي', 'Economic Empowerment', 'دعم قطاعات الأعمال والاستثمار وتوفير البيئة القانونية الآمنة لحوكمة الشركات واستقرار الأوقاف.', 'Supporting business and investment sectors and providing a safe legal environment for corporate governance.', 'TrendingUp', 3),
      ('goals', 'المواكبة التشريعية', 'Legislative Alignment', 'التطوير المستمر لأدواتنا القانونية لمواكبة المتغيرات والتطورات التشريعية والتنظيمية المتسارعة.', 'Continuously developing our legal tools to keep pace with rapidly changing legislative and regulatory developments.', 'BookOpen', 4),
      ('goals', 'المسؤولية المعرفية', 'Knowledge Responsibility', 'رفع مستوى الوعي القانوني لدى الأفراد والمؤسسات لحماية الحقوق والوقاية من النزاعات.', 'Raising legal awareness among individuals and institutions to protect rights and prevent disputes.', 'Brain', 5),
      ('goals', 'السمو المهني', 'Professional Excellence', 'ترسيخ مبادئ العدالة، والنزاهة، والأمانة، كمحرك أساسي لكافة أعمالنا وممارساتنا القانونية.', 'Entrenching the principles of justice, integrity, and honesty as the core driver of all our legal work.', 'Gem', 6);

    -- ── Team Specializations (label only) ──
    INSERT INTO content_items (section, title_ar, title_en, icon, sort_order) VALUES
      ('team_specializations', 'قانون الشركات والأعمال', 'Corporate & Business Law', 'Building2', 0),
      ('team_specializations', 'الأوقاف والعقارات', 'Endowments & Real Estate', 'Landmark', 1),
      ('team_specializations', 'قانون التركات والأسرة', 'Family & Inheritance Law', 'Scroll', 2),
      ('team_specializations', 'القضايا العمالية', 'Labor Cases', 'Users', 3),
      ('team_specializations', 'التحكيم التجاري', 'Commercial Arbitration', 'Gavel', 4),
      ('team_specializations', 'الاستشارات الاستثمارية', 'Investment Consulting', 'TrendingUp', 5);

    -- ── Client Sectors (label only) ──
    INSERT INTO content_items (section, title_ar, title_en, icon, sort_order) VALUES
      ('clients_sectors', 'أصحاب السمو والذوات', 'Royal Highnesses & VIPs', 'Crown', 0),
      ('clients_sectors', 'الأفراد والعائلات', 'Individuals & Families', 'Users', 1),
      ('clients_sectors', 'نظّار الأوقاف', 'Waqf Administrators', 'Landmark', 2),
      ('clients_sectors', 'الورثة وقضايا التركات', 'Heirs & Estate Cases', 'GitBranch', 3),
      ('clients_sectors', 'رواد الأعمال والشركات', 'Entrepreneurs & Corporations', 'Briefcase', 4),
      ('clients_sectors', 'الشركات المحلية والدولية', 'Local & International Companies', 'Globe', 5),
      ('clients_sectors', 'القطاع الفندقي والخدمي', 'Hospitality & Service Sector', 'Hotel', 6),
      ('clients_sectors', 'قطاع الاستثمار والعقار', 'Investment & Real Estate', 'BarChart2', 7);

  END IF;
END $$;
