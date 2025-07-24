import { MastraClient } from "@mastra/client-js";
import { StreamingTextResponse } from "ai";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();
  const { messages } = body;
  const threadId = body.threadId || body.body?.threadId;

  const client = new MastraClient({
    baseUrl: process.env.MASTRA_API_URL || "http://localhost:4111",
  });

  const agent = client.getAgent("partyAssistant");

  try {
    // threadIdがある場合のみ渡す
    const streamParams: any = {
      messages,
    };
    
    if (threadId) {
      streamParams.threadId = threadId;
      streamParams.resourceId = "partyAssistant";
    }

    const response = await agent.stream(streamParams);

    // Mastraのストリームレスポンスを返す
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process chat request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}