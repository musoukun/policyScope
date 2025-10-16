-- API呼び出し制限管理テーブル
CREATE TABLE api_call_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_type TEXT NOT NULL UNIQUE, -- 'wiki_generation' または 'news_fetch'
  daily_limit INTEGER NOT NULL DEFAULT 10,
  current_count INTEGER NOT NULL DEFAULT 0,
  last_reset_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX idx_api_call_limits_call_type ON api_call_limits(call_type);
CREATE INDEX idx_api_call_limits_last_reset_date ON api_call_limits(last_reset_date);

-- RLSを有効化
ALTER TABLE api_call_limits ENABLE ROW LEVEL SECURITY;

-- RLSポリシー（開発用に全アクセス許可）
CREATE POLICY "Allow public to read api_call_limits" ON api_call_limits
  FOR SELECT USING (true);

CREATE POLICY "Allow public to insert api_call_limits" ON api_call_limits
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public to update api_call_limits" ON api_call_limits
  FOR UPDATE USING (true);

CREATE POLICY "Allow public to delete api_call_limits" ON api_call_limits
  FOR DELETE USING (true);

-- 初期データ投入
INSERT INTO api_call_limits (call_type, daily_limit, current_count, last_reset_date) VALUES
  ('wiki_generation', 10, 0, CURRENT_DATE),
  ('news_fetch', 20, 0, CURRENT_DATE);

-- 自動更新のトリガー関数
CREATE OR REPLACE FUNCTION update_api_call_limits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガー設定
CREATE TRIGGER update_api_call_limits_updated_at_trigger
  BEFORE UPDATE ON api_call_limits
  FOR EACH ROW
  EXECUTE FUNCTION update_api_call_limits_updated_at();

-- カウントリセット用の関数（日付が変わったら自動リセット）
CREATE OR REPLACE FUNCTION reset_api_call_count_if_needed()
RETURNS TRIGGER AS $$
BEGIN
  -- 最終リセット日が今日でない場合、カウントをリセット
  IF NEW.last_reset_date < CURRENT_DATE THEN
    NEW.current_count = 0;
    NEW.last_reset_date = CURRENT_DATE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- カウント更新前にリセットチェック
CREATE TRIGGER reset_api_call_count_trigger
  BEFORE UPDATE ON api_call_limits
  FOR EACH ROW
  EXECUTE FUNCTION reset_api_call_count_if_needed();
