import { MastraClient } from "@mastra/client-js";
import { z } from "zod";
import { comprehensivePartyResearchReportSchema } from "./schemas/party-research.schema";

// Mastra APIのベースURL（環境変数またはデフォルト値）
const MASTRA_API_URL = process.env.NEXT_PUBLIC_MASTRA_API_URL || "http://localhost:4111";

// Mastraクライアントのインスタンスを作成
export const mastraClient = new MastraClient({
  baseUrl: MASTRA_API_URL,
});

// 政党調査結果の型定義（Zodスキーマから自動生成）
export type PartyResearchResult = z.infer<typeof comprehensivePartyResearchReportSchema>;

// 政党調査を実行する関数（ワークフローを使用）
export async function researchParty(partyName: string): Promise<PartyResearchResult> {
  try {
    // ワークフローを使用して段階的にデータを取得
    const workflow = mastraClient.getWorkflow("partyResearchWorkflow");
    
    console.log("=== Starting Party Research Workflow ===");
    console.log("Party name:", partyName);
    
    // ワークフローの実行を作成
    const run = await workflow.createRun();
    
    // ワークフローの進捗を監視（オプション）
    workflow.watch({ runId: run.runId }, (record) => {
      console.log("Workflow progress:", record);
    });
    
    // ワークフローを非同期で開始し、完了を待つ
    const result = await workflow.startAsync({
      runId: run.runId,
      inputData: { partyName },
    });
    
    // レスポンス全体をログ出力
    console.log("=== Workflow Result ===");
    console.log("Result:", result);
    console.log("Payload:", result.payload);
    console.log("=== End Result ===");
    
    // ワークフローの最終結果を取得
    const finalResult = await workflow.runExecutionResult(run.runId);
    console.log("Final execution result:", finalResult);
    
    // ワークフローの結果を返す
    if (result && result.payload && result.payload.workflowState) {
      // 最後のステップ（stage5）の出力を取得
      const stage5Output = result.payload.workflowState.steps["stage5-evaluation-and-sources"]?.output;
      if (stage5Output) {
        return stage5Output as PartyResearchResult;
      }
    }
    
    throw new Error("No data returned from workflow");
  } catch (error) {
    console.error("Error researching party:", error);
    throw error;
  }
}

// ストリーミングで政党調査を実行する関数
export async function researchPartyStream(
  partyName: string,
  onUpdate: (data: Partial<PartyResearchResult>) => void
) {
  try {
    const agent = mastraClient.getAgent("partyResearchAgent");
    
    const response = await agent.stream({
      messages: [
        {
          role: "user",
          content: `日本の政党「${partyName}」について包括的な調査を実施してください。`,
        },
      ],
    });
    
    // ストリームを処理
    response.processDataStream({
      onTextPart: (text) => {
        console.log("Received text:", text);
      },
      onDataPart: (data) => {
        // 部分的なデータを受信したらコールバックを呼び出す
        onUpdate(data as Partial<PartyResearchResult>);
      },
      onErrorPart: (error) => {
        console.error("Stream error:", error);
      },
    });
  } catch (error) {
    console.error("Error streaming party research:", error);
    throw error;
  }
}