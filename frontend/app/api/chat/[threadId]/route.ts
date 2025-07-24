import { MastraClient } from "@mastra/client-js";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const { threadId } = params;
    
    const client = new MastraClient({
      baseUrl: process.env.MASTRA_API_URL || "http://localhost:4111",
    });
    
    // Get the thread instance
    const thread = client.getMemoryThread(threadId, "partyAssistant");
    
    // Get messages from the thread
    const { messages } = await thread.getMessages();
    
    return NextResponse.json({ 
      success: true,
      messages: messages || [],
      debug: {
        threadId,
        messageCount: messages?.length || 0
      }
    });
  } catch (error) {
    console.error("[Chat History API] エラー:", error);
    return NextResponse.json({ 
      success: false,
      messages: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}