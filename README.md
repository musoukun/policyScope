# PolicyScope

政党の政策を包括的に分析・比較するWebアプリケーションです。

## アーキテクチャ

- **フロントエンド**: Next.js 15 (App Router) + TypeScript
- **バックエンド**: Mastra Framework (AIエージェント・ワークフロー)
- **データベース**: Supabase (PostgreSQL)
- **AI**: Google Gemini 2.5 Flash (Grounding機能付き)

## セットアップ

### 1. バックエンドの起動

```bash
cd backend
npm install
cp .env.example .env
# .envファイルを編集してGOOGLE_GENERATIVE_AI_API_KEYを設定
npm run dev
```

バックエンドは http://localhost:8000 で起動します。

### 2. フロントエンドの起動

```bash
cd frontend
npm install
cp .env.local.example .env.local
# .env.localファイルを編集して必要な環境変数を設定
npm run dev
```

フロントエンドは http://localhost:3000 で起動します。

## 主な機能

- 9つの主要政党の詳細情報を表示
- AIエージェントによる政党情報の包括的な調査
  - 基本情報と最新動向
  - 政策分析と実現可能性評価
  - 支持基盤の分析
  - 国際比較
  - 多角的な評価
- リアルタイムチャットインターフェース
- Server Actions による効率的なデータ管理

## 環境変数

### バックエンド (.env)
- `GOOGLE_GENERATIVE_AI_API_KEY`: Google AI APIキー（必須）
- `PORT`: サーバーポート（デフォルト: 8000）

### フロントエンド (.env.local)
- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの公開キー
- `OPENAI_API_KEY`: OpenAI APIキー（チャット機能用）
- `MASTRA_API_URL`: バックエンドAPIのURL（デフォルト: http://localhost:8000）