-- ─────────────────────────────────────────────
-- Success Partners (شركاء النجاح) — logo marquee
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS partners (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  logo_url    TEXT,
  website     TEXT,
  icon        TEXT,
  sort_order  INT DEFAULT 0,
  active      BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Public can read only active partners (rendered in the marquee)
CREATE POLICY "public_read_partners" ON partners
  FOR SELECT TO anon USING (active = true);

-- Admins manage everything
CREATE POLICY "admin_all_partners" ON partners
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Correct seeded contact info to the Madinah office
UPDATE site_content SET
  value_ar = 'طريق الملك عبدالله، الخاتم، المدينة المنورة 42363',
  value_en = 'King Abdullah Rd, Al-Khatim, Madinah 42363'
WHERE section = 'hero' AND key = 'address';

UPDATE site_content SET
  value_ar = '+966 14 844 4555',
  value_en = '+966 14 844 4555'
WHERE section = 'hero' AND key = 'phone';
