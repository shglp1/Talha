-- ─────────────────────────────────────────────
-- Admin policy fixes for site_content upsert
-- ─────────────────────────────────────────────
--
-- Why:
-- The admin panel uses upsert on site_content. For INSERT paths, Postgres RLS
-- requires WITH CHECK. The previous policy used only USING, which can produce
-- 403 errors on writes even for authenticated users.

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_all_content" ON site_content;
CREATE POLICY "admin_all_content" ON site_content
  FOR ALL TO authenticated
  USING (true)
  WITH CHECK (true);

