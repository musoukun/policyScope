-- 統合セキュリティマイグレーション
-- このマイグレーションは以下を実行します：
-- 1. party_newsテーブルのRLS設定
-- 2. Mastraテーブルへのアクセス制限
-- 3. RLS状態の確認

-- =====================================================
-- 1. party_newsテーブルのRLS設定
-- =====================================================

-- party_newsテーブルのRLS有効化
ALTER TABLE party_news ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "Allow public read access to party_news" ON party_news;
DROP POLICY IF EXISTS "Allow public to manage party_news" ON party_news;
DROP POLICY IF EXISTS "Allow public to update party_news" ON party_news;
DROP POLICY IF EXISTS "Allow public to delete party_news" ON party_news;

-- 読み取り専用ポリシー（認証不要）
CREATE POLICY "Allow public read access to party_news" ON party_news
  FOR SELECT USING (true);

-- 書き込みは拒否（サービスロールキーのみ許可）
CREATE POLICY "Deny public write to party_news" ON party_news
  FOR INSERT WITH CHECK (false);

CREATE POLICY "Deny public update to party_news" ON party_news
  FOR UPDATE USING (false);

CREATE POLICY "Deny public delete to party_news" ON party_news
  FOR DELETE USING (false);

-- =====================================================
-- 2. Mastraテーブルへのアクセス制限
-- =====================================================

-- 既存のポリシーを削除（存在する場合）
DO $$
BEGIN
  -- mastra_evalsテーブル
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'mastra_evals') THEN
    DROP POLICY IF EXISTS "Allow all access to mastra_evals (dev)" ON mastra_evals;
  END IF;

  -- mastra_messagesテーブル  
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'mastra_messages') THEN
    DROP POLICY IF EXISTS "Allow all access to mastra_messages (dev)" ON mastra_messages;
  END IF;

  -- mastra_resourcesテーブル
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'mastra_resources') THEN
    DROP POLICY IF EXISTS "Allow all access to mastra_resources (dev)" ON mastra_resources;
  END IF;

  -- mastra_scorersテーブル
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'mastra_scorers') THEN
    DROP POLICY IF EXISTS "Allow all access to mastra_scorers (dev)" ON mastra_scorers;
  END IF;

  -- mastra_threadsテーブル
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'mastra_threads') THEN
    DROP POLICY IF EXISTS "Allow all access to mastra_threads (dev)" ON mastra_threads;
  END IF;

  -- mastra_tracesテーブル
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'mastra_traces') THEN
    DROP POLICY IF EXISTS "Allow all access to mastra_traces (dev)" ON mastra_traces;
  END IF;

  -- mastra_workflow_snapshotテーブル
  IF EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'mastra_workflow_snapshot') THEN
    DROP POLICY IF EXISTS "Allow all access to mastra_workflow_snapshot (dev)" ON mastra_workflow_snapshot;
  END IF;
END $$;

-- 新しい制限的なポリシーを作成（全アクセス拒否）
DO $$
BEGIN
  -- RLSを有効化し、全アクセスを拒否するポリシーを作成
  
  -- mastra_evalsテーブル
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'mastra_evals') THEN
    ALTER TABLE mastra_evals ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Deny all public access to mastra_evals" ON mastra_evals
      FOR ALL USING (false);
  END IF;

  -- mastra_messagesテーブル
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'mastra_messages') THEN
    ALTER TABLE mastra_messages ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Deny all public access to mastra_messages" ON mastra_messages
      FOR ALL USING (false);
  END IF;

  -- mastra_resourcesテーブル
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'mastra_resources') THEN
    ALTER TABLE mastra_resources ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Deny all public access to mastra_resources" ON mastra_resources
      FOR ALL USING (false);
  END IF;

  -- mastra_scorersテーブル
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'mastra_scorers') THEN
    ALTER TABLE mastra_scorers ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Deny all public access to mastra_scorers" ON mastra_scorers
      FOR ALL USING (false);
  END IF;

  -- mastra_threadsテーブル
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'mastra_threads') THEN
    ALTER TABLE mastra_threads ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Deny all public access to mastra_threads" ON mastra_threads
      FOR ALL USING (false);
  END IF;

  -- mastra_tracesテーブル
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'mastra_traces') THEN
    ALTER TABLE mastra_traces ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Deny all public access to mastra_traces" ON mastra_traces
      FOR ALL USING (false);
  END IF;

  -- mastra_workflow_snapshotテーブル
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'mastra_workflow_snapshot') THEN
    ALTER TABLE mastra_workflow_snapshot ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Deny all public access to mastra_workflow_snapshot" ON mastra_workflow_snapshot
      FOR ALL USING (false);
  END IF;
END $$;

-- =====================================================
-- 3. セキュリティ状態の確認
-- =====================================================

-- RLSが有効になっていないテーブルを確認
SELECT 
  '=== RLS無効のテーブル（セキュリティリスク） ===' as title
UNION ALL
SELECT 
  tablename || ' - RLSが無効です！'
FROM pg_tables t
WHERE t.schemaname = 'public'
  AND t.rowsecurity = false
  AND t.tablename NOT IN ('schema_migrations', 'ar_internal_metadata')
UNION ALL
SELECT 
  '=== RLS有効のテーブル ===' as title
UNION ALL
SELECT 
  tablename || ' - RLS有効（ポリシー数: ' || COALESCE(policy_count::text, '0') || ')'
FROM (
  SELECT 
    t.tablename,
    COUNT(p.policyname) as policy_count
  FROM pg_tables t
  LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
  WHERE t.schemaname = 'public'
    AND t.rowsecurity = true
  GROUP BY t.tablename
) as rls_tables
ORDER BY 1;

-- ポリシー詳細の確認
SELECT 
  tablename,
  policyname,
  CASE 
    WHEN qual = 'false' THEN '❌ アクセス拒否'
    WHEN qual = 'true' THEN '✅ アクセス許可'
    ELSE '⚠️ ' || qual
  END as policy_status,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
  AND (tablename LIKE 'mastra_%' OR tablename = 'party_news')
ORDER BY tablename, policyname;