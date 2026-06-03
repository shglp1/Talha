-- Restore per-item icons when rows were seeded/saved without icon values
-- (causes every card to show the same fallback icon on the live site)

UPDATE content_items SET icon = 'Award'       WHERE section = 'goals' AND sort_order = 0 AND (icon IS NULL OR icon = '');
UPDATE content_items SET icon = 'UserCheck'   WHERE section = 'goals' AND sort_order = 1 AND (icon IS NULL OR icon = '');
UPDATE content_items SET icon = 'Lightbulb'   WHERE section = 'goals' AND sort_order = 2 AND (icon IS NULL OR icon = '');
UPDATE content_items SET icon = 'TrendingUp'  WHERE section = 'goals' AND sort_order = 3 AND (icon IS NULL OR icon = '');
UPDATE content_items SET icon = 'BookOpen'    WHERE section = 'goals' AND sort_order = 4 AND (icon IS NULL OR icon = '');
UPDATE content_items SET icon = 'Brain'       WHERE section = 'goals' AND sort_order = 5 AND (icon IS NULL OR icon = '');
UPDATE content_items SET icon = 'Gem'         WHERE section = 'goals' AND sort_order = 6 AND (icon IS NULL OR icon = '');

UPDATE content_items SET icon = 'Building2'   WHERE section = 'team_specializations' AND sort_order = 0 AND (icon IS NULL OR icon = '');
UPDATE content_items SET icon = 'Landmark'    WHERE section = 'team_specializations' AND sort_order = 1 AND (icon IS NULL OR icon = '');
UPDATE content_items SET icon = 'Scroll'      WHERE section = 'team_specializations' AND sort_order = 2 AND (icon IS NULL OR icon = '');
UPDATE content_items SET icon = 'Users'       WHERE section = 'team_specializations' AND sort_order = 3 AND (icon IS NULL OR icon = '');
UPDATE content_items SET icon = 'Gavel'       WHERE section = 'team_specializations' AND sort_order = 4 AND (icon IS NULL OR icon = '');
UPDATE content_items SET icon = 'TrendingUp'  WHERE section = 'team_specializations' AND sort_order = 5 AND (icon IS NULL OR icon = '');
