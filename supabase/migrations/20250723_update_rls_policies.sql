-- RLSポリシーを更新して、認証なしでも一時的に書き込み可能にする
-- 注意: これは開発用の設定です。本番環境では適切な認証を実装してください

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Allow authenticated users to insert party_summaries" ON party_summaries;
DROP POLICY IF EXISTS "Allow authenticated users to update party_summaries" ON party_summaries;

-- 新しいポリシー: 誰でも挿入可能（開発用）
CREATE POLICY "Allow public to insert party_summaries" ON party_summaries
  FOR INSERT WITH CHECK (true);

-- 新しいポリシー: 誰でも更新可能（開発用）
CREATE POLICY "Allow public to update party_summaries" ON party_summaries
  FOR UPDATE USING (true);

-- 新しいポリシー: 誰でも削除可能（開発用）
CREATE POLICY "Allow public to delete party_summaries" ON party_summaries
  FOR DELETE USING (true);