-- チームみらいを追加するマイグレーション
INSERT INTO parties (id, name, name_en, founded_year, description) 
VALUES ('team_mirai', 'チームみらい', 'Team Mirai', 2025, 'AIエンジニアの安野貴博氏が設立したテクノロジー政党。')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  name_en = EXCLUDED.name_en,
  founded_year = EXCLUDED.founded_year,
  description = EXCLUDED.description;