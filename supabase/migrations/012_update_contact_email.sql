-- Update contact email to the official domain
UPDATE site_content
SET value_ar = 'info@drtalha-law.com',
    value_en = 'info@drtalha-law.com'
WHERE section = 'hero' AND key = 'email';

UPDATE site_content
SET value_ar = 'info@drtalha-law.com',
    value_en = 'info@drtalha-law.com'
WHERE section = 'footer' AND key = 'email';
