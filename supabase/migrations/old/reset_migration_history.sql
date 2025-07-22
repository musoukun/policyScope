-- マイグレーション履歴をリセット
-- 警告: これを実行すると、すべてのマイグレーション履歴が削除されます

-- 既存のマイグレーション履歴を削除
TRUNCATE supabase_migrations.schema_migrations;

-- または特定のマイグレーションのみを削除する場合
-- DELETE FROM supabase_migrations.schema_migrations WHERE version IN ('20250722', '00');