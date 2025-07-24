-- RLSセキュリティテスト用SQL
-- Supabase SQL Editorで実行してください

-- 1. RLS状態の確認
SELECT 
  tablename,
  CASE 
    WHEN rowsecurity = true THEN '✅ RLS有効'
    ELSE '❌ RLS無効'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('parties', 'party_summaries', 'party_news')
  OR tablename LIKE 'mastra_%'
ORDER BY tablename;

-- 2. ポリシーの確認
SELECT 
  tablename,
  policyname,
  CASE 
    WHEN qual = 'false' THEN '🔒 アクセス拒否'
    WHEN qual = 'true' THEN '🔓 アクセス許可'
    ELSE qual
  END as access_type,
  cmd as operation
FROM pg_policies
WHERE schemaname = 'public'
  AND (tablename = 'party_news' OR tablename LIKE 'mastra_%')
ORDER BY tablename, policyname;

-- 3. anon roleでのテスト（RLSが効いているか確認）
-- 注意: これはSupabase Dashboardでanon roleに切り替えて実行
SET ROLE anon;

-- party_newsの読み取りテスト（成功するはず）
SELECT COUNT(*) as readable_count FROM party_news;

-- party_newsへの書き込みテスト（失敗するはず）
-- INSERT INTO party_news (party_id, news_data) VALUES ('test', '{}');

-- Mastraテーブルへのアクセステスト（失敗するはず）
-- SELECT COUNT(*) FROM mastra_messages;

-- ロールを戻す
RESET ROLE;