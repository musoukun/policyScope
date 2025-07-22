# Supabase VectorDB セットアップガイド

## 1. Supabase CLIでのマイグレーション実行

### 方法1: Supabase CLIを使用（推奨）
```bash
# 1. Supabaseにログイン（アクセストークンが必要）
export SUPABASE_ACCESS_TOKEN=your_access_token

# 2. データベースのパスワードを使用してマイグレーションを実行
npx supabase db push --password your_database_password
```

### 方法2: Supabaseダッシュボードから実行
1. [Supabaseダッシュボード](https://supabase.com/dashboard/project/bwjqnroagehrdcnmtkfb/sql)にアクセス
2. SQL Editorを開く
3. `supabase/migrations/20250720_create_parties_vector_tables.sql`の内容をコピー＆ペースト
4. "Run"ボタンをクリック

## 2. 環境変数の設定

`.env`ファイルに以下を追加：
```env
# Google AI API Key（政策分析と埋め込み生成用）
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Cron Job Secret（Vercel Cronジョブ用）
CRON_SECRET=your_random_secret_string
```

## 3. 初回データ同期

1. 開発サーバーを起動：
```bash
npm run dev
```

2. デモページにアクセス：
```
http://localhost:3000/demo/vector-search
```

3. 「政党情報を同期」ボタンをクリック

## 4. 自動更新の設定（Vercel環境のみ）

Vercelにデプロイすると、`vercel.json`の設定により1時間ごとに自動更新されます。

## 注意事項

- pgvector拡張機能が有効になっていることを確認してください
- Google AI APIキーが必要です（text-embedding-004 モデルを使用）
- 埋め込みベクトルは768次元（Gemini標準）
- データベースのRLSポリシーにより、読み取りは誰でも可能ですが、書き込みは制限されています