# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# start
日本語ですべて回答して下さい

- すぐにプログラムや、資料のサンプルを作成せずに、端的に結論を回答する。
- 嘘をつかない
- 憶測も嘘に当たる。

過去にあなたついた嘘の例：2019年の事例から～は合法です。→実際にそんな事例はなく、勝手に作成して回答していた。

- 不要なたとえを書かない：一言で言うと「風邪薬1錠で治るのに、10錠飲むようなもの。治るどころか毒になる」 ←こういうのいらない

- 実装する前に実装する内容が最新のものか、APIの使い方が正しいかを必ずuse Context7で検索する。
- mastraは標準でAPIサーバーになるためよほど特殊なカスタムAPI以外は実装不要です。

# PolicyScope コードベース概要

PolicyScopeは政党政策分析Wikiアプリケーションで、Next.jsベースのフルスタックアプリケーションです。

## 開発コマンド

### フロントエンド (/frontend)
```bash
npm run dev        # 開発サーバー起動 (http://localhost:3000) - Turbopack使用
npm run build      # プロダクションビルド
npm run start      # プロダクションサーバー起動
npm run lint       # ESLint実行
```

## アーキテクチャ

- **フレームワーク**: Next.js 15.3.2 (App Router)
- **UI**: React 19、Tailwind CSS、shadcn/ui、Framer Motion
- **AI統合**: 
  - Vercel AI SDK (ai) - ストリーミングチャット
  - @assistant-ui - チャットUIコンポーネント
  - Google Gemini (@ai-sdk/google) - 政策分析AI
  - Mastra Framework - AIエージェント管理
- **データベース**: Supabase (PostgreSQL + pgvector拡張)
- **主要ディレクトリ**:
  - `frontend/app/actions/` - Server Actions（parties.ts - 政党データCRUD）
  - `frontend/app/api/` - API Routes（chat、research-party - Server Actionsへ移行推奨）
  - `frontend/app/demo/` - 手動テスト用ページ（現在party-data-testのみ）
  - `frontend/app/policy-wiki/` - メインアプリケーション
  - `frontend/lib/` - ユーティリティ（supabase.ts、parties.ts、mastra/）
  - `frontend/lib/mastra/agents/` - AIエージェント設定とスキーマ
  - `frontend/components/` - 共通UIコンポーネント（shadcn/ui、assistant-ui）
  - `frontend/types/` - 型定義（party.ts）
  - `supabase/migrations/` - データベースマイグレーション
  - `requirements/` - 要件定義ドキュメント
  - `doc/` - プロジェクトドキュメント（画像など）

## 環境変数

必須の環境変数（`.env.local`ファイル）:
```
GOOGLE_GENERATIVE_AI_API_KEY=  # Google Gemini API（政策分析）
NEXT_PUBLIC_SUPABASE_URL=      # Supabase URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Supabase公開キー
OPENAI_API_KEY=                # OpenAI API（チャット機能で使用）
CRON_SECRET=                   # Vercel Cronジョブ認証用（未実装）
```

## データベース構造

Supabaseで以下のテーブルを管理:
- `parties` - 政党基本情報（id、name、name_en、founded_year、description）
- `party_summaries` - 政党の要約データ（JSONB形式）

注意：
Supabaseはversionカラムをプライマリキーとして使用しており、同じ日付（20250722）で複数のマイグレーションを作成するとエラーが発生します。

必要な拡張機能:
- pgvector（ベクトル検索 - 将来実装予定）
- pg_cron（定期タスク - 将来実装予定）
- pg_net（HTTPリクエスト - 将来実装予定）

マイグレーション実行:
```bash
cd supabase
export SUPABASE_ACCESS_TOKEN=your_token
npx supabase db push --password your_password
```

## 政党データ

9つの政党情報を管理（`lib/parties.ts`）:
- 自由民主党 (ldp) - #DC143C
- 公明党 (komeito) - #FFD700
- 立憲民主党 (cdp) - #1E90FF
- 日本維新の会 (ishin) - #90EE90
- 日本共産党 (jcp) - #FF0000
- 国民民主党 (dpfp) - #FFA500
- れいわ新選組 (reiwa) - #FF69B4
- 参政党 (sanseito) - #800080
- チームみらい (team_mirai) - #00CED1

各政党には専用のカラーコードが`PARTY_COLORS`で定義されています。

## Mastra FrameworkとAIエージェント

### 政策研究エージェント
`/api/research-party` エンドポイントで使用される政策研究エージェントは、5つの段階で詳細な政党情報を収集します：

1. **基本情報と速報** (`basicInfoSchema`)
   - 最新選挙結果、重要動向、党首情報、国会議席数

2. **政策分析** (`policyAnalysisSchema`)
   - 基本理念、重点政策（実現可能性スコア付き）、カテゴリー別政策

3. **支持基盤分析** (`supportAnalysisSchema`)
   - 支持率推移、支持層特徴（年齢、職業、地域別）、組織基盤

4. **最新動向と国際比較** (`currentStatusSchema`)
   - 直近3ヶ月の活動、メディア露出、海外類似政党との比較

5. **評価と総括** (`evaluationSchema`)
   - 多角的評価（支持、批判、中立）、専門家分析、将来展望

各スキーマはZodで厳密に型定義され、構造化されたデータを返します。

## 現在の実装状況

### 実装済み
- 政党基本データのCRUD操作（Server Actions）
- AI チャットインターフェース（Assistant UI）
- 政党情報研究API（Mastra Framework使用）
  - `/api/research-party` - 段階的に5つのスキーマで政党情報を取得
  - 基本情報、政策分析、支持基盤、最新動向、評価の5段階
- 基本的なUIコンポーネント（shadcn/ui統合）

### 未実装（CLAUDE.mdに記載されているが未実装）
- Vector DB検索機能（pgvector）
- Cronジョブによる自動更新（`/api/cron/update-party-embeddings`）
- デモページ（db-setup、fix-rls、update-test、vector-search）

## 依存パッケージ状況

### インストール済み
- react-hook-form ✓
- nuqs ✓
- framer-motion ✓
- lucide-react ✓
- @radix-ui/* ✓
- tailwind-merge ✓

### 未インストール
なし（zodを含む必要なパッケージはすべてインストール済み）

# 開発全般ルール&作業ガイドライン

## コマンドライン・プログラム開発の基本方針
- **コマンドライン**：PowerShellで返答
- **プログラム**：できるだけ簡単で複雑でないものを出力
- **開発手法**：一気に大量のプログラムを生成せず、小さくファイルを生成し、生成したものが動くことをスモールステップで確認し、徐々に大きなプログラムを開発

## 開発ドキュメントについて
- 指示されていない資料を作成しないでください。
- setup用のbatやshellスクリプトは作成しないでください。
- セットアップ方法はREADMEに記載すればよいです。
- EXAMPLE.mdやSETUP.mdやWORKFLOW.ｍdなど指示されていない資料を作成するのは、文字数の無駄遣いになるので、簡潔に使い方を回答してくれたらよいです。

## 全体的な哲学：保守的、良心的、失敗を恐れる

### 保守的であること
- 明確に要求されたことのみを実装する
- 推測、憶測、「親切な」追加を避ける
- タスク完了に必要なファイルのみを読む
- 可能性や将来の考慮事項ではなく、事実を文書化する
- 推測するのではなく、質問することをデフォルトとする

### 良心的であること
- 人間はあなたの上級協力者であり指導者である
- すべての重要な決定とマイルストーンに彼らを含める
- 承認、テスト、検証のために作業を彼らに戻す
- 彼らに何をしてもらう必要があるかを明確に伝える
- 準備をし、具体的な要求をすることで彼らの時間を尊重する

### 失敗を恐れること
**コードがビルドできても実装で失敗する可能性があることを認識する：**
- 間違ったライブラリや劣悪なソフトウェアパターンの使用
- 貧弱な組織化や不必要な肥大化の追加
- 動作するが良くない技術的決定

**暗示された情報を誤読する可能性があることを認識する：**
- いつチェックインすべきか vs いつ暗示が十分明確かを知ること
- 「明らかな」要件についてのあなたの判断が間違っている可能性

**失敗が意図せず認識されない可能性があることを理解する：**
- 手遅れになるまで失敗していることに気づかない可能性
- 明らかな症状なしに問題が忍び込む可能性

**問題が定着する前に捉えるためのレビューと確認プロセスを使用する：**
- 不確実性、破壊的ステップ、奇妙な発見について人間に相談
- 計画と重要な決定について確認を得る
- 重要なチェックポイントでのテストを要求

**厳密にタスクに集中する：**
- スコープクリープや将来のニーズの先取りをしない（YAGNI）
- 自分の判断で先制的な改善をしない
- 人間に最初に相談していなければ、実行しない

## 重要：明示的な許可なしに進行してはならない
**人間からの明示的な許可なしに、作業の次のステップや段階を開始してはならない。**

これは以下を意味する：
- 計画作成後に実装を開始しない - 明示的な承認を待つ
- チェックポイント完了後に次の段階に移らない - 明示的な指示を待つ
- 新機能を開始しない - 明示的な指示を待つ
- 完了報告後に作業を続けない - 進行への明示的な確認を待つ
- 暗示された許可を想定したり、続行すべきと推測しない

**次のステップが明らかに見えたり、以前に議論されていても、人間があなたに進行を明示的に指示するまで常に停止して待つ。** これによりスコープクリープを防ぎ、整合性を確保し、開発プロセスの人間による制御を維持する。

# Next.jsを利用するときの戦略

## コア原則
- **App Router** を標準採用
- **TypeScript** 必須（ESLint／型エラーは常にゼロ）
- **API Routes は使用しない**。あらゆるサーバー処理は Server Actions で実装

## ディレクトリレイアウト

```
app/         ルーティング & ページ  
components/  汎用 UI（再利用可能・ロジックなし）  
lib/         ユーティリティ関数  
hooks/       カスタムフック  
types/       型定義  
constants/   定数  
config/      設定値・環境変数ラッパー  
services/    外部 API ラッパーやビジネスロジック  
demo/        フロントエンドから実行できる手動テストページ
```

- **専用（機能固有）コンポーネント** … 対応する page.tsx と同階層
- **汎用（再利用可能）コンポーネント** … components/ に配置

## データハンドリング

| 依存条件 | 実装方法 |
|---------|---------|
| ユーザー操作に依存しない | server components + Server Actions |
| ユーザー操作に依存する | client components + Server Actions + useSWR |

- 更新は Server Actions、即時反映は useSWR.mutate で楽観的更新
- Supabase は RLS + auth.uid() を利用し、user.id 明示は不要

## 表示と状態管理
- UI は極力自作せず、必ず **shadcn/ui** のコンポーネントを利用
- アイコンは **lucide-react** を統一使用
- URL 状態は **nuqs** に統一
- グローバル状態ライブラリは **使用しない**（必要時は React Context + useReducer などで最小構成）

## パフォーマンス
- use client / useEffect / useState は最小限、まず RSC
- クライアント側は Suspense でフォールバック
- 動的 import で遅延読み込み、画像は next/image、リンクは next/link
- ルートベースのコード分割を徹底

## フォームとバリデーション
- 制御コンポーネント + **react-hook-form**
- スキーマ検証は **Zod**
- クライアント／サーバー両方で入力チェック

## 品質・セキュリティ・テスト

### エラーハンドリング
- ガード節で **早期 return**、成功パスは最後にまとめる

### アクセシビリティ
- セマンティック HTML + ARIA、キーボード操作サポート

### Server Actions のセキュリティ指針
- ユーザーが許可された操作だけを Server Action として実装
- 汎用的・多目的なサーバー関数は実装しない
- RLS と auth.uid() により **最小権限** を担保

### テスト
- **demo/ ディレクトリ** に UI ベースのテストページを配置し、すべての Server Actions・クライアント関数を **ブラウザ経由で手動検証** できるようにする

## 実装フロー
1. **設計**：コア原則とディレクトリ決定
2. **データ**：取得（useSWR）・更新（Server Actions＋mutate）ルール確立
3. **UI / State**：shadcn/ui と lucide-react を使い、URL 状態は nuqs
4. **パフォーマンス**：RSC・Suspense・dynamic import で最適化
5. **フォーム & バリデーション**：Zod × react-hook-form
6. **品質管理**：エラー処理 → アクセシビリティ → 専用 Server Actions → demo/ で手動テスト