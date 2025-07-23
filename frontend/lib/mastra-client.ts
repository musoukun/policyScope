import { MastraClient } from "@mastra/client-js";

// Mastraクライアントの初期化
export const mastraClient = new MastraClient({
  // バックエンドのMastraサーバーURL
  baseUrl: process.env.NEXT_PUBLIC_MASTRA_API_URL || "http://localhost:4111"
});

// Party Research Agentを取得
export const getPartyResearchAgent = () => {
  return mastraClient.getAgent("partyResearchAgent");
};