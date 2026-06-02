-- ─────────────────────────────────────────────
-- مكتب د. طلحة غوث — Initial Supabase Schema
-- ─────────────────────────────────────────────

-- Contact messages (from the website contact form)
CREATE TABLE IF NOT EXISTS contact_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  phone       TEXT,
  email       TEXT,
  message     TEXT NOT NULL,
  lang        TEXT DEFAULT 'ar',
  read        BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Dynamic site content (edited via admin panel)
CREATE TABLE IF NOT EXISTS site_content (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section     TEXT NOT NULL,
  key         TEXT NOT NULL,
  value_ar    TEXT DEFAULT '',
  value_en    TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(section, key)
);

-- Default contact info
INSERT INTO site_content (section, key, value_ar, value_en) VALUES
  ('hero', 'phone',   '+966 54 XXX XXXX',           '+966 54 XXX XXXX'),
  ('hero', 'email',   'info@talhaghawth.com',        'info@talhaghawth.com'),
  ('hero', 'address', 'جدة، المملكة العربية السعودية', 'Jeddah, Saudi Arabia'),
  ('hero', 'hours',   'الأحد – الخميس: ٩ص – ٦م',    'Sun – Thu: 9 AM – 6 PM')
ON CONFLICT (section, key) DO NOTHING;

-- RLS: only authenticated admins can read/write
ALTER TABLE contact_messages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content       ENABLE ROW LEVEL SECURITY;

-- Public can INSERT contact messages (from contact form)
CREATE POLICY "public_insert_messages" ON contact_messages
  FOR INSERT TO anon WITH CHECK (true);

-- Only authenticated users (admins) can read messages
CREATE POLICY "admin_read_messages" ON contact_messages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "admin_update_messages" ON contact_messages
  FOR UPDATE TO authenticated USING (true);

-- Public can read site content
CREATE POLICY "public_read_content" ON site_content
  FOR SELECT TO anon USING (true);

-- Admins can update content
CREATE POLICY "admin_all_content" ON site_content
  FOR ALL TO authenticated USING (true);

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
