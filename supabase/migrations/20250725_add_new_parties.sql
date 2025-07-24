-- 再生の道と日本保守党を追加
INSERT INTO parties (id, name, name_en, founded_year, description, created_at, updated_at)
VALUES 
  ('saisei', '再生の道', 'Saisei no Michi', 2025, '石丸伸二元安芸高田市長が設立した地域政党。', NOW(), NOW()),
  ('hoshuto', '日本保守党', 'Japan Conservative Party', 2023, '百田尚樹・有本香が設立した保守政党。', NOW(), NOW())
ON CONFLICT (id) DO UPDATE
SET 
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  founded_year = EXCLUDED.founded_year,
  description = EXCLUDED.description,
  updated_at = NOW();