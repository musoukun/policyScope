# PolicyScope

日本の政党の政策を包括的に分析・比較するAI搭載Webアプリケーション

## 機能

- 11の日本の政党情報の管理・表示
- Google Gemini AIによる政党政策の詳細分析
- チャットインターフェースによる対話的な情報検索
- リアルタイムニュース取得・表示

## 技術スタック

- **Frontend**: Next.js 15.4, React 19, TypeScript, Tailwind CSS
- **Backend**: Mastra Framework (AIエージェント管理)
- **AI**: Google Gemini 2.5 Flash, OpenAI API
- **Database**: Supabase (PostgreSQL)
- **UI**: shadcn/ui, Assistant UI, Framer Motion

## セットアップ

### 必要要件

- Node.js 20.9.0以上
- npm

### インストール

```bash
# フロントエンドの依存関係
npm install

# バックエンドの依存関係
cd mastra && npm install
```

### 環境変数

1. フロントエンド用 `.env.local` を作成:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
MASTRA_API_URL=mastra_url
```

2. バックエンド用 `mastra/.env` を作成:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
PORT=4111
```

### 開発サーバー起動

1. バックエンドサーバー起動:
```bash
cd mastra
npm run dev
```

2. フロントエンドサーバー起動（新しいターミナルで）:
```bash
npm run dev
```

アプリケーションは http://localhost:3000 でアクセス可能

## 主要コマンド

```bash
# 開発
npm run dev          # フロントエンド開発サーバー (localhost:3000)
npm run lint         # ESLint実行

# ビルド・本番
npm run build        # プロダクションビルド
npm run start        # プロダクションサーバー起動

# バックエンド (mastra/ディレクトリ内)
npm run dev          # Mastra開発サーバー (localhost:4111)
npm run build        # Mastraビルド
npm run start        # Mastraプロダクション起動
```

## プロジェクト構成

```
PolicyScope/
├── app/              # Next.js App Router
│   ├── actions/      # Server Actions
│   ├── api/          # API Routes
│   └── policy-wiki/  # メインアプリケーション
├── components/       # 共通UIコンポーネント
├── lib/             # ユーティリティ・スキーマ定義
├── mastra/          # バックエンド (AIエージェント)
└── supabase/        # データベースマイグレーション
```

## 対応政党

自由民主党、公明党、立憲民主党、日本維新の会、日本共産党、国民民主党、れいわ新選組、参政党、チームみらい、再生の道、日本保守党
