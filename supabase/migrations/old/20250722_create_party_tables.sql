-- Create parties table
CREATE TABLE IF NOT EXISTS parties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  founded_year INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create party_summaries table
CREATE TABLE IF NOT EXISTS party_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  party_id TEXT NOT NULL REFERENCES parties(id) ON DELETE CASCADE,
  summary_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for party_id
CREATE INDEX IF NOT EXISTS idx_party_summaries_party_id ON party_summaries(party_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_parties_updated_at BEFORE UPDATE ON parties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_party_summaries_updated_at BEFORE UPDATE ON party_summaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial party data
INSERT INTO parties (id, name, name_en, founded_year, description) VALUES
  ('ldp', '自由民主党', 'Liberal Democratic Party', 1955, '日本の保守政党。長期にわたり政権を担当。'),
  ('cdp', '立憲民主党', 'Constitutional Democratic Party', 2020, '中道左派の野党第一党。'),
  ('komeito', '公明党', 'Komeito', 1964, '中道政党。自民党と連立政権を組む。'),
  ('jcp', '日本共産党', 'Japanese Communist Party', 1922, '日本最古の政党の一つ。'),
  ('dpfp', '国民民主党', 'Democratic Party for the People', 2020, '中道改革政党。'),
  ('reiwa', 'れいわ新選組', 'Reiwa Shinsengumi', 2019, '山本太郎が設立した政党。'),
  ('sanseito', '参政党', 'Sanseito', 2020, '保守系の新興政党。'),
  ('ishin', '日本維新の会', 'Japan Innovation Party', 2015, '改革志向の保守政党。'),
  ('team_mirai', 'チームみらい', 'Team Mirai', 2025, 'AIエンジニアの安野貴博氏が設立したテクノロジー政党。')
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_summaries ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to parties" ON parties
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to party_summaries" ON party_summaries
  FOR SELECT USING (true);

-- Create policies for authenticated write access
CREATE POLICY "Allow authenticated users to insert party_summaries" ON party_summaries
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated users to update party_summaries" ON party_summaries
  FOR UPDATE USING (auth.uid() IS NOT NULL);