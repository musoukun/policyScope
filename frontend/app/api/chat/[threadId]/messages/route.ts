import { MastraClient } from "@mastra/client-js";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  const { threadId } = params;

  const client = new MastraClient({
    baseUrl: process.env.MASTRA_API_URL || "http://localhost:4111",
  });

  const agent = client.getAgent("partyAssistant");

  try {
    // Mastraのメモリから会話履歴を取得
    const memory = await agent.getMemory();
    if (!memory) {
      return NextResponse.json({ messages: [] });
    }

    const result = await memory.query({
      threadId,
      resourceId: "partyAssistant",
    });

    // AI SDK v5形式のメッセージに変換
    const messages = result?.uiMessages || [];
    
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ messages: [] });
  }
}