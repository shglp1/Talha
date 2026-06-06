-- Default homepage section order (admin can override via layout.homepage_sections)
INSERT INTO site_content (section, key, value_ar, value_en)
VALUES (
  'layout',
  'homepage_sections',
  '[{"id":"hero","order":1,"visible":true},{"id":"about","order":2,"visible":true},{"id":"visionMission","order":3,"visible":true},{"id":"services","order":4,"visible":true},{"id":"whyUs","order":5,"visible":true},{"id":"clients","order":6,"visible":true},{"id":"partners","order":7,"visible":true},{"id":"contact","order":8,"visible":true},{"id":"goals","order":9,"visible":true},{"id":"team","order":10,"visible":true},{"id":"closing","order":11,"visible":true}]',
  '[{"id":"hero","order":1,"visible":true},{"id":"about","order":2,"visible":true},{"id":"visionMission","order":3,"visible":true},{"id":"services","order":4,"visible":true},{"id":"whyUs","order":5,"visible":true},{"id":"clients","order":6,"visible":true},{"id":"partners","order":7,"visible":true},{"id":"contact","order":8,"visible":true},{"id":"goals","order":9,"visible":true},{"id":"team","order":10,"visible":true},{"id":"closing","order":11,"visible":true}]'
)
ON CONFLICT (section, key) DO NOTHING;
