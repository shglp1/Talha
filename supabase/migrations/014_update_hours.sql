-- Update working hours to 9 AM – 4 PM
UPDATE site_content
SET value_ar = 'الأحد – الخميس: ٩ص – ٤م',
    value_en = 'Sun – Thu: 9 AM – 4 PM'
WHERE section = 'hero' AND key = 'hours';
