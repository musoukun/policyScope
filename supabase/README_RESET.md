# Supabaseデータベースリセット手順

## 警告
この手順を実行すると、**既存のデータがすべて削除されます**。必要に応じて事前にバックアップを取ってください。

## 手順

### 1. Supabase CLIのインストール（未インストールの場合）
```bash
npm install -g supabase
```

### 2. 環境変数の設定
以下の情報が必要です：
- Supabase Access Token: `sbp_50864da4efdf3b8a2def3796cd76ded77bd061f3`
- Database Password: `RDWG2QUydwovAafm`
- Project ID: `bwjqnroagehrdcnmtkfb`

### 3. Supabase SQLエディタを使用する方法（推奨）

1. [Supabase Dashboard](https://app.supabase.com)にログイン
2. プロジェクト「policy scope」を選択
3. 左メニューから「SQL Editor」を選択
4. 新しいクエリを作成
5. `/supabase/migrations/00_reset_database.sql`の内容をコピー&ペースト
6. 「Run」ボタンをクリックして実行

### 4. Supabase CLIを使用する方法

```bash
# プロジェクトディレクトリに移動
cd /mnt/d/develop/PolicyScope

# Supabaseプロジェクトにリンク
npx supabase link --project-ref bwjqnroagehrdcnmtkfb

# アクセストークンを設定
export SUPABASE_ACCESS_TOKEN=sbp_50864da4efdf3b8a2def3796cd76ded77bd061f3

# データベースリセット（リモート実行）
npx supabase db push --password RDWG2QUydwovAafm

# または直接SQLを実行
npx supabase db execute --file supabase/migrations/00_reset_database.sql --password RDWG2QUydwovAafm
```

### 5. 実行後の確認

1. Supabase Dashboardで「Table Editor」を開く
2. 以下のテーブルが作成されていることを確認：
   - `parties`（8件のレコード）
   - `party_summaries`（空）

### トラブルシューティング

- **権限エラーの場合**: service_roleキーを使用してRLSをバイパス
- **接続エラーの場合**: プロジェクトIDとパスワードを再確認
- **SQL構文エラーの場合**: PostgreSQLバージョンの互換性を確認

### 注意事項

- このリセットスクリプトは開発環境用です
- 本番環境では必ずバックアップを取ってから実行してください
- RLS（Row Level Security）が有効になっているため、適切な認証が必要です