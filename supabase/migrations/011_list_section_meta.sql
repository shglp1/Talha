-- Backfill list_meta markers for sections that already have content_items rows.
INSERT INTO site_content (section, key, value_ar, value_en)
SELECT DISTINCT 'list_meta', ci.section, '1', '1'
FROM content_items ci
WHERE ci.section IS NOT NULL AND ci.section <> ''
ON CONFLICT (section, key) DO NOTHING;
