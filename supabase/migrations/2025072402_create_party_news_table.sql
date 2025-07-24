-- 政党ニューステーブルの作成
CREATE TABLE IF NOT EXISTS party_news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  party_id TEXT NOT NULL,
  news_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT fk_party FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE CASCADE
);

-- インデックスの作成
CREATE INDEX idx_party_news_party_id ON party_news(party_id);
CREATE INDEX idx_party_news_created_at ON party_news(created_at DESC);

-- 更新時のタイムスタンプ自動更新
CREATE TRIGGER update_party_news_updated_at
  BEFORE UPDATE ON party_news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- コメント
COMMENT ON TABLE party_news IS '政党の最新ニュース情報';
COMMENT ON COLUMN party_news.party_id IS '政党ID';
COMMENT ON COLUMN party_news.news_data IS 'ニュースデータ（JSON形式）';
COMMENT ON COLUMN party_news.created_at IS '作成日時';
COMMENT ON COLUMN party_news.updated_at IS '更新日時';