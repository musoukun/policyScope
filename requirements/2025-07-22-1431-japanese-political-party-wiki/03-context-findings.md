# コンテキスト収集結果

## 技術的な発見事項

### 1. 既存のプロジェクト構造
- **フレームワーク**: Next.js 15.3.2（App Router）
- **UI**: React 19、Tailwind CSS v4、shadcn/ui
- **AI統合**: @assistant-ui/react（OpenAI用に設定済み）
- **未実装**: Supabase接続、政党管理機能、Wiki機能

### 2. 必要なパッケージインストール
```bash
npm install @supabase/supabase-js @google/generative-ai react-hook-form zod nuqs framer-motion lucide-react
```

### 3. Google Gemini 2.0 Flash実装方法
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || "");

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  tools: [
    {
      googleSearch: {}  // Grounding機能
    }
  ]
});
```

### 4. Supabase JSON Storage実装
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// JSON型での保存・取得
const { data } = await supabase
  .from('party_summaries')
  .select('data')
  .eq('party_id', partyId)
  .single()
```

### 5. 実装に必要なファイル構造
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
│   ├── gemini.ts                # 新規作成
│   └── parties.ts               # 新規作成
└── types/
    └── party.ts                 # 新規作成
```

### 6. 既存UIコンポーネントの活用
- shadcn/uiコンポーネント: button, input, separator, sheet, sidebar
- BentoGridレイアウトサンプル活用可能
- AI Input Searchサンプルをチャット欄に適用可能

### 7. 実装時の技術的制約
- AI SDKをOpenAIからGoogle Geminiへ変更必要
- Supabase環境変数の設定が必要
- Server Actions未実装（API Routes使用中）
- Tailwind CSS v4の新機能活用可能

### 8. 類似機能の参考実装
- Assistant UIのチャット実装が参考になる
- ストリーミング対応の実装あり
- Edge Runtime使用（30秒タイムアウト）

### 9. デモページの作成方針
- `/app/demo/party-data-test/`に手動テストページ作成
- Server Actions/クライアント関数をブラウザ経由で検証
- 各政党データの取得・保存テスト機能

### 10. 政党情報スキーマ
提供されたJSON構造を基に、Supabaseテーブル設計：
- `parties`テーブル: 基本情報
- `party_summaries`テーブル: JSON形式で包括的調査データ保存
- `party_news`テーブル: ニュース情報（手動更新）