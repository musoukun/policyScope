# バグレポート：Workflow内でuseSearchGroundingオプションが動作しない

## タイトル
[BUG] Google Generative AIのWorkflow内でuseSearchGroundingオプションが動作しない

## バグの説明
Mastraワークフロー内でGoogle Generative AIを`useSearchGrounding: true`オプション付きで使用すると、検索グラウンディング機能が期待通りに動作しません。

- 通常のAgentチャットから検索すると最新で正確な結果が返ってくる
- Workflowから検索すると古い結果が返ってきたり、ほとんどが「該当なし」や「情報が見つかりません」となる
- オプションが有効になっているにもかかわらず、ワークフロー内で実行されるとエージェントがGoogle検索結果に制限的にしかアクセスできない、またはアクセスできていないように見えます

## 再現手順
1. Google Generative AIモデルで`useSearchGrounding: true`を設定したMastraエージェントを作成
2. `createStep`と`agent.generate()`を使用してこのエージェントを使うワークフローを作成
3. Google検索からの最新情報が必要なクエリでワークフローを実行
4. エージェントはオプションが無効であるかのように、Google検索データを使用せずに応答する

### コード例：
```typescript
// エージェント設定
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI({});
const googlemodel = google("gemini-2.0-flash-exp", {
    useSearchGrounding: true,
});

const partyResearchAgent = new Agent({
    name: "政党調査エージェント",
    model: googlemodel,
    // ... その他の設定
});

// ワークフローステップ
const stage1Step = createStep({
    id: "stage1",
    execute: async ({ inputData }) => {
        const response = await partyResearchAgent.generate(
            [{
                role: "user",
                content: "[トピック]について最新の情報を検索してください"
            }],
            { output: schema }
        );
        return response.object;
    },
});
```

## 期待される動作
`useSearchGrounding: true`が設定されている場合、エージェントはワークフロー実行内でGoogle検索結果にアクセスして使用でき、検索結果に基づいた最新かつ正確な情報を提供できるはずです。

## 環境情報
- Mastra Version: 0.1.102
- @ai-sdk/google Version: 1.0.11
- Node.js Version: v20.11.0
- OS: Windows 11 (WSL2 - Ubuntu)
- LLM Provider: Google Gemini (gemini-2.0-flash-exp)

## 追加コンテキスト
同じ設定はワークフローコンテキスト外でエージェントを使用する場合は正しく動作します。この問題は、ワークフローステップ内で`agent.generate()`を使用してエージェントが呼び出される場合にのみ発生します。

Agentクラスの実装を見ると、`generate`メソッドは`getLLM()`を呼び出してモデル設定を処理するはずですが、ワークフローコンテキスト内でエージェントが実行される際に`useSearchGrounding`オプションが適切に伝播されていないようです。

これは、ワークフロー実行コンテキスト内でLLMインスタンスが作成またはキャッシュされる方法に関連している可能性があり、その過程で検索グラウンディング設定が失われている可能性があります。

### 具体例：「チームみらい」の検索結果

**1. 通常のAgentチャットでの検索結果：**
- 非常に詳細で最新の情報（2025年7月の参議院選挙で1議席獲得など）
- 安野貴博氏の詳細なプロフィール
- 具体的な政策内容
- 支持率データ（4.1%）
- 豊富なデータソース（30以上のURL）

**2. Workflowでの検索結果：**
- ほとんどの項目が「情報なし」「該当なし」
- 基本的な情報すら取得できていない
- 「チームみらいという名称の主要な国政政党は確認できませんでした」という記述

この差が生じる理由は、やはりuseSearchGroundingオプションがWorkflow内で正しく機能していないためだと考えられます。通常のAgentチャットでは最新のGoogle検索結果にアクセスできているのに対し、Workflow内では検索機能が制限されているか、まったく機能していない可能性があります。

これは先ほど作成したバグレポートの内容を裏付ける重要な証拠です。

## 確認事項
- [x] 重複ではないことを確認するため、既存の問題を検索しました
- [x] チームが問題を再現し理解するのに十分な情報を含めました