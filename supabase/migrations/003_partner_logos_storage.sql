-- ─────────────────────────────────────────────
-- Storage bucket for partner logos (admin upload)
-- Run once in the Supabase SQL editor / CLI.
-- ─────────────────────────────────────────────

-- Public bucket so logos render in the marquee without signed URLs.
INSERT INTO storage.buckets (id, name, public)
VALUES ('partner-logos', 'partner-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Anyone can view the logos.
CREATE POLICY "public_read_partner_logos" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'partner-logos');

-- Only signed-in admins can upload / replace / delete logos.
CREATE POLICY "admin_insert_partner_logos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'partner-logos');

CREATE POLICY "admin_update_partner_logos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'partner-logos')
  WITH CHECK (bucket_id = 'partner-logos');

CREATE POLICY "admin_delete_partner_logos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'partner-logos');
