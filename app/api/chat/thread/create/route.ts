import { MastraClient } from "@mastra/client-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, initialQuery } = body;
    
    console.log("[Thread Create API] スレッド作成リクエスト:", { title, initialQuery });
    
    const client = new MastraClient({
      baseUrl: process.env.MASTRA_API_URL || "http://localhost:4111",
    });
    
    // フロントエンドでthread IDを指定
    const threadId = crypto.randomUUID();
    console.log("[Thread Create API] 生成されたthread ID:", threadId);
    
    // threadIdを指定してスレッドを作成
    const newThread = await client.createMemoryThread({
      threadId: threadId,  // 明示的にthreadIdを指定
      title: title || "新規チャット",
      metadata: { 
        createdAt: new Date().toISOString(),
        firstMessage: initialQuery || ""
      },
      resourceId: "partyAssistant",
      agentId: "partyAssistant",
    });
    
    console.log("[Thread Create API] Mastraスレッド作成成功:", JSON.stringify(newThread, null, 2));
    
    // 指定したthread IDを使用
    const actualThreadId = threadId;
    
    return NextResponse.json({ 
      success: true, 
      threadId: actualThreadId,
      thread: newThread 
    });
  } catch (error) {
    console.error("[Thread Create API] エラー発生:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}