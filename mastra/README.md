# PolicyScope Backend (Mastra)

PolicyScopeのバックエンドサーバーです。Mastraフレームワークを使用して、政党情報の詳細な調査を行うAIエージェントとワークフローを提供します。

## セットアップ

1. 環境変数の設定
```bash
cp .env.example .env
```

`.env`ファイルを編集して、Google AI APIキーを設定してください：
```
GOOGLE_GENERATIVE_AI_API_KEY=your-actual-api-key
```

2. 開発サーバーの起動
```bash
npm run dev
```

サーバーはデフォルトで http://localhost:8000 で起動します。

## 利用可能なAPI

### エージェント
- `GET /api/agents` - 利用可能なエージェント一覧
- `POST /api/agents/policyResearchAgent/generate` - エージェントに質問

### ワークフロー
- `GET /api/workflows` - 利用可能なワークフロー一覧
- `POST /api/workflows/party-research-workflow/start-async` - 政党調査ワークフローの実行

## ワークフローの使用例

```bash
curl -X POST http://localhost:8000/api/workflows/party-research-workflow/start-async \
  -H "Content-Type: application/json" \
  -d '{
    "inputData": {
      "partyName": "自由民主党"
    }
  }'
```

## プロジェクト構造

```
backend/
├── src/
│   └── mastra/
│       ├── agents/          # AIエージェント定義
│       ├── workflows/       # ワークフロー定義
│       ├── schemas/         # データスキーマ定義
│       └── index.ts         # Mastraインスタンス
├── package.json
├── tsconfig.json
└── .env
```