-- Storage bucket for site photos (hero, sections, logos)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-photos', 'site-photos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public_read_site_photos" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'site-photos');

CREATE POLICY "admin_insert_site_photos" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'site-photos');

CREATE POLICY "admin_update_site_photos" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'site-photos')
  WITH CHECK (bucket_id = 'site-photos');

CREATE POLICY "admin_delete_site_photos" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'site-photos');
