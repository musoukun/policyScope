-- 政党管理システムのテーブル作成とRLS設定

-- partiesテーブル作成
CREATE TABLE parties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  founded_year INTEGER,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  color_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- party_summariesテーブル作成
CREATE TABLE party_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id TEXT NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
  summary_data JSONB NOT NULL,
  html_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(party_id)
);

-- インデックス作成
CREATE INDEX idx_parties_id ON parties(id);
CREATE INDEX idx_party_summaries_party_id ON party_summaries(party_id);

-- RLSを有効化
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_summaries ENABLE ROW LEVEL SECURITY;

-- partiesテーブルのRLSポリシー
CREATE POLICY "Allow public to read parties" ON parties
  FOR SELECT USING (true);

-- party_summariesテーブルのRLSポリシー（開発用に全アクセス許可）
CREATE POLICY "Allow public to read party_summaries" ON party_summaries
  FOR SELECT USING (true);

CREATE POLICY "Allow public to insert party_summaries" ON party_summaries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public to update party_summaries" ON party_summaries
  FOR UPDATE USING (true);

CREATE POLICY "Allow public to delete party_summaries" ON party_summaries
  FOR DELETE USING (true);

-- 初期データ投入
INSERT INTO parties (id, name, name_en, founded_year, description, color_code) VALUES
  ('ldp', '自由民主党', 'Liberal Democratic Party', 1955, '日本の保守政党。1955年の保守合同により誕生し、長期にわたり政権を担当。', '#DC143C'),
  ('komeito', '公明党', 'Komeito', 1964, '中道政党。創価学会を支持母体とし、生活者の視点を重視。', '#FFD700'),
  ('cdp', '立憲民主党', 'Constitutional Democratic Party', 2017, '中道左派政党。立憲主義と民主主義を基本理念とする。', '#1E90FF'),
  ('ishin', '日本維新の会', 'Japan Innovation Party', 2010, '改革保守政党。地方分権と規制改革を推進。大阪から全国へ展開。', '#90EE90'),
  ('jcp', '日本共産党', 'Japanese Communist Party', 1922, '左派政党。日本最古の政党の一つ。格差是正と平和主義を掲げる。', '#FF0000'),
  ('dpfp', '国民民主党', 'Democratic Party For the People', 2018, '中道政党。「対決より解決」を掲げ、現実的な政策提案を重視。', '#FFA500'),
  ('reiwa', 'れいわ新選組', 'Reiwa Shinsengumi', 2019, '左派ポピュリズム政党。積極財政と弱者救済を主張。', '#FF69B4'),
  ('sanseito', '参政党', 'Sanseito', 2020, '保守政党。教育改革と日本の伝統文化の重視を掲げる。', '#800080'),
  ('team_mirai', 'チームみらい', 'Team Mirai', 2022, '中道政党。若者と未来志向の政策を重視する新しい政治勢力。', '#00CED1');