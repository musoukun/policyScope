import { MastraClient } from "@mastra/client-js";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
	const body = await req.json();
	const { messages } = body;
	const threadId = body.threadId || body.body?.threadId;

	console.log("[Chat API] リクエスト受信:", {
		threadId,
		messagesCount: messages.length,
	});

	const client = new MastraClient({
		baseUrl: process.env.MASTRA_API_URL || "http://localhost:4111",
	});

	const agent = client.getAgent("partyAssistant");

	try {
		// スレッドは既に作成済みなので、そのまま使用
		const streamParams: {
			messages: typeof messages;
			threadId?: string;
			resourceId?: string;
			agentId?: string;
		} = {
			messages,
		};

		if (threadId) {
			streamParams.threadId = threadId;
			streamParams.resourceId = "partyAssistant";
			streamParams.agentId = "partyAssistant";
		}

		console.log("[Chat API] ストリーミング開始:", streamParams);
		console.log("[Chat API] エージェント:", agent);

		const response = await agent.stream(streamParams);

		// Mastraのストリームレスポンスを返す
		return new Response(response.body, {
			headers: {
				"Content-Type": "text/event-stream",
				"Cache-Control": "no-cache",
				Connection: "keep-alive",
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
