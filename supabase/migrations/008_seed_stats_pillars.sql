-- Seed hero stats, about pillars, and client stats when those sections are still empty
-- (migration 004 only seeded services / whyUs / goals / team / sectors)

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM content_items WHERE section = 'hero_stats') THEN
    INSERT INTO content_items (section, title_ar, title_en, desc_ar, desc_en, sort_order) VALUES
      ('hero_stats', '15+', '15+', 'سنة خبرة', 'Years Experience', 0),
      ('hero_stats', '500+', '500+', 'قضية منجزة', 'Cases Completed', 1),
      ('hero_stats', '1000+', '1000+', 'عميل راضٍ', 'Satisfied Clients', 2);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM content_items WHERE section = 'about_pillars') THEN
    INSERT INTO content_items (section, title_ar, title_en, icon, sort_order) VALUES
      ('about_pillars', 'الثقة والأمانة', 'Trust & Integrity', 'ShieldCheck', 0),
      ('about_pillars', 'الاحترافية العالية', 'High Professionalism', 'Award', 1),
      ('about_pillars', 'الشفافية التامة', 'Complete Transparency', 'ScanEye', 2),
      ('about_pillars', 'الحلول المبتكرة', 'Innovative Solutions', 'Lightbulb', 3);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM content_items WHERE section = 'clients_stats') THEN
    INSERT INTO content_items (section, title_ar, title_en, desc_ar, desc_en, sort_order) VALUES
      ('clients_stats', '500+', '500+', 'عميل راضٍ', 'Satisfied Clients', 0),
      ('clients_stats', '8+', '8+', 'قطاعات خدمية', 'Service Sectors', 1),
      ('clients_stats', '15+', '15+', 'سنة خبرة', 'Years Experience', 2),
      ('clients_stats', '100%', '100%', 'سرية تامة', 'Full Confidentiality', 3);
  END IF;
END $$;
