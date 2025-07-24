# PolicyScope

日本の政党の政策を包括的に分析・比較するWebアプリケーション

## 概要

PolicyScopeは、日本の主要政党の政策情報をAIが分析し、わかりやすく提示するプラットフォームです。各政党の基本情報、政策詳細、最新ニュース、支持基盤などを一元的に閲覧できます。

## 主な機能

- **政党情報の閲覧**: 9つの主要政党の詳細情報
- **AI分析レポート**: Google Gemini 2.0による政策分析
- **最新ニュース**: 各政党の最新動向を自動収集
- **対話型AI**: 政党に関する質問に回答するチャットボット
- **比較機能**: 複数政党の政策を比較

## 技術スタック

### フロントエンド
- Next.js 15.3.2 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

### バックエンド
- Mastra Framework (AIエージェント管理)
- Supabase (データベース)
- Google Gemini 2.0 Flash (AI分析)

### デプロイ
- フロントエンド: Vercel
- バックエンド: Railway

## セットアップ

### 必要な環境
- Node.js 20.9.0以上
- npm または yarn

### 環境変数

`.env.local` (フロントエンド):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
MASTRA_API_URL=https://your-mastra-api.railway.app
```

`mastra/.env` (バックエンド):
```
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key
PORT=4111
```

### インストール

```bash
# フロントエンド
npm install
npm run dev

# バックエンド
cd mastra
npm install
npm run dev
```

## 開発

```bash
# フロントエンド開発サーバー (http://localhost:3000)
npm run dev

# バックエンド開発サーバー (http://localhost:4111)
cd mastra && npm run dev

# ビルド
npm run build
```

## 対応政党

- 自由民主党 (LDP)
- 公明党 (Komeito)
- 立憲民主党 (CDP)
- 日本維新の会 (Ishin)
- 日本共産党 (JCP)
- 国民民主党 (DPFP)
- れいわ新選組 (Reiwa)
- 参政党 (Sanseito)
- チームみらい (Team Mirai)

## ライセンス

MIT