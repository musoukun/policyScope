// import { MastraClient } from "@mastra/client-js";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
	const body = await req.json();
	const { messages } = body;
	const threadId = body.threadId || body.body?.threadId;

	console.log("[Chat API] リクエスト受信 (Mock Mode):", {
		threadId,
		messagesCount: messages.length,
	});

	// Mock応答を返す
	const mockMessage =
		"AIの解答のサンプルです。現在はAI質問機能は非公開です。サンプルメッセージを表示しています。詳しくは製作者にお問い合わせください。";

	// Vercel AI SDKのストリーミング形式に合わせたMock応答を生成
	const encoder = new TextEncoder();
	const stream = new ReadableStream({
		async start(controller) {
			// メッセージを1文字ずつストリーミング風に送信
			for (let i = 0; i < mockMessage.length; i++) {
				const chunk = mockMessage[i];
				const data = `0:"${chunk}"\n`;
				controller.enqueue(encoder.encode(data));
				// 少し遅延を入れてストリーミング感を出す
				await new Promise((resolve) => setTimeout(resolve, 20));
			}
			controller.close();
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		},
	});

	// 元のAI呼び出しコード（無効化）
	// const client = new MastraClient({
	// 	baseUrl: process.env.MASTRA_API_URL || "http://localhost:4111",
	// });
	// const agent = client.getAgent("partyAssistant");
	// try {
	// 	const streamParams: {
	// 		messages: typeof messages;
	// 		threadId?: string;
	// 		resourceId?: string;
	// 		agentId?: string;
	// 	} = {
	// 		messages,
	// 	};
	// 	if (threadId) {
	// 		streamParams.threadId = threadId;
	// 		streamParams.resourceId = "partyAssistant";
	// 		streamParams.agentId = "partyAssistant";
	// 	}
	// 	console.log("[Chat API] ストリーミング開始:", streamParams);
	// 	console.log("[Chat API] エージェント:", agent);
	// 	const response = await agent.stream(streamParams);
	// 	return new Response(response.body, {
	// 		headers: {
	// 			"Content-Type": "text/event-stream",
	// 			"Cache-Control": "no-cache",
	// 			Connection: "keep-alive",
	// 		},
	// 	});
	// } catch (error) {
	// 	console.error("Error in chat API:", error);
	// 	return new Response(
	// 		JSON.stringify({ error: "Failed to process chat request" }),
	// 		{
	// 			status: 500,
	// 			headers: { "Content-Type": "application/json" },
	// 		}
	// 	);
	// }
}
