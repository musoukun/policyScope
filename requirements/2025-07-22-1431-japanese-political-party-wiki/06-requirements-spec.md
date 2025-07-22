# 日本政党情報Wiki要件仕様書

## 1. 問題提起と解決策の概要

### 問題
- 日本の政党情報が各所に散在しており、統一的に閲覧・比較することが困難
- 政策の実現可能性や詳細な分析を含む包括的な情報源が不足
- 最新の選挙結果や政党動向を視覚的に理解しづらい

### 解決策
DeepWikiのコンセプトを基にした、日本の政党情報を体系的に表示するインタラクティブなWikiシステムを構築する。Google Gemini 2.0 Flash（Grounding機能付き）とMastraを活用し、包括的な政党情報を自動収集・表示する。

## 2. 機能要件

### 2.1 政党情報表示機能
- **タブ切り替え**：各政党をタブで切り替えて個別に閲覧
- **Grid形式レイアウト**：
  - 左側3幅：政党の要約情報
  - 右側2幅：最新ニュース（今日を含む前後1週間の5件）
- **視覚的データ表示**：
  - 最新選挙の得票数・得票率をグラフで表示
  - 支持率推移のチャート
  - 議席数の可視化

### 2.2 政党データ管理
- **自動取得**：Google Gemini 2.0 Flash（Grounding ON）で政党情報を検索・生成
- **キャッシュ機能**：
  - 初回表示時：Supabaseに存在しない場合はAIで取得→保存
  - 2回目以降：Supabaseから読み込み
- **手動更新**：更新ボタンによる手動データ更新（API料金管理のため）
- **専門用語解説**：政治・経済用語に自動で解説を付与

### 2.3 チャットインターフェース（UI実装のみ）
- **DeepWiki風デザイン**：ページ下部に固定表示
- **透過率20%**：コンテンツが透けて見える
- **スクロール対応**：チャット欄の高さ分、追加でスクロール可能

### 2.4 対応政党（初期実装）
主要8政党の情報を管理・表示

## 3. 技術要件

### 3.1 フロントエンド
- **フレームワーク**: Next.js 15.3.2（App Router）
- **UI**: React 19、Tailwind CSS v4、shadcn/ui、Framer Motion
- **状態管理**: nuqs（URL状態管理）
- **フォーム**: react-hook-form + zod

### 3.2 AI統合
- **LLMプロバイダー**: Google Gemini 2.0 Flash
- **AIフレームワーク**: Mastra
- **機能**: 
  - Grounding（Google Search）を使用した最新情報取得
  - 包括的政党調査レポートの生成

### 3.3 データベース
- **Supabase**（PostgreSQL）
- **テーブル構成**:
  - `parties`: 政党基本情報
  - `party_summaries`: JSON形式の包括的調査データ

### 3.4 実装ファイル構造
```
frontend/
├── app/
│   ├── policy-wiki/              # 新規作成
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── PartyTabs.tsx
│   │       ├── PartySummary.tsx
│   │       ├── PartyNews.tsx
│   │       └── ChatInterface.tsx
│   ├── actions/                  # 新規作成
│   │   ├── parties.ts
│   │   └── gemini.ts
│   └── demo/                     # 新規作成
│       └── party-data-test/
├── lib/
│   ├── supabase.ts              # 新規作成
│   ├── mastra.ts                # 新規作成
│   └── parties.ts               # 新規作成
└── types/
    └── party.ts                 # 新規作成
```

## 4. 実装の詳細

### 4.1 Mastra設定（Google Gemini統合）
```typescript
import { Mastra } from "@mastra/core";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || "");

export const mastra = new Mastra({
  // Gemini設定
  llm: genAI.getGenerativeModel({
    model: "gemini-2.0-flash-001",
    tools: [{
      googleSearch: {}  // Grounding機能
    }]
  }),
  // その他の設定...
});
```

### 4.2 政党データスキーマ
提供されたJSON構造に基づく包括的調査レポート形式で保存

### 4.3 UI実装方針
- BentoGridレイアウトサンプルを活用
- AI Input Searchサンプルをチャット欄に適用
- shadcn/uiコンポーネントの最大活用

## 5. 実装手順

1. **環境設定**
   - 必要パッケージのインストール
   - 環境変数設定（GOOGLE_GEMINI_API、Supabase認証情報）

2. **データベース準備**
   - Supabaseプロジェクト作成
   - テーブル作成（parties、party_summaries）

3. **基本UI実装**
   - `/app/policy-wiki/`ディレクトリ作成
   - レイアウトとコンポーネント実装

4. **AI統合**
   - Mastra設定
   - Server Actions実装

5. **デモページ作成**
   - 手動テスト機能の実装

## 6. 受け入れ基準

- [ ] 8政党の情報がタブで切り替えて表示できる
- [ ] Grid形式で政党要約と最新ニュースが表示される
- [ ] 初回アクセス時にAIで政党情報を取得・保存できる
- [ ] 2回目以降はSupabaseから高速に読み込める
- [ ] 手動更新ボタンで最新情報を取得できる
- [ ] チャットUIがページ下部に固定表示される
- [ ] 専門用語に解説が付与される
- [ ] 選挙結果の数値データが視覚的に表示される

## 7. 前提条件と制約

### 前提条件
- Google Gemini APIキーが利用可能
- Supabaseアカウントが作成済み
- 政党データの初期登録は手動で実施

### 制約
- 管理画面は実装しない（今回のスコープ外）
- チャット機能は見た目のみ（実際の応答機能は未実装）
- 政党間の横断比較機能は実装しない
- API料金管理のため自動更新は実装しない

## 8. 次期実装候補

- チャット機能の実装（AIによる質問応答）
- 管理画面の実装
- 政党間比較機能
- ニュースの自動更新機能
- より詳細な分析機能（政策実現性の詳細評価など）