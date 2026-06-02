-- ─────────────────────────────────────────────
-- Custom admin-defined text fields + defensive policy re-assertion
-- ─────────────────────────────────────────────

-- Extend site_content so the admin can create new bilingual fields that render
-- inside a specific section slot on the live site.
ALTER TABLE site_content
  ADD COLUMN IF NOT EXISTS label_ar      TEXT,
  ADD COLUMN IF NOT EXISTS label_en      TEXT,
  ADD COLUMN IF NOT EXISTS is_custom     BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS slot          TEXT DEFAULT 'body';
-- slot: badge | title | subtitle | body | link

-- ── Re-assert admin write policies (idempotent) so authenticated upserts work ──
DROP POLICY IF EXISTS "admin_all_content" ON site_content;
CREATE POLICY "admin_all_content" ON site_content
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_all_content_items" ON content_items;
CREATE POLICY "admin_all_content_items" ON content_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_all_partners" ON partners;
CREATE POLICY "admin_all_partners" ON partners
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow authenticated admins to delete contact messages too (read/update already exist).
DROP POLICY IF EXISTS "admin_delete_messages" ON contact_messages;
CREATE POLICY "admin_delete_messages" ON contact_messages
  FOR DELETE TO authenticated USING (true);

-- Public reads include custom fields (they have no `active` flag).
-- Existing public_read_content policy already allows SELECT for anon.
