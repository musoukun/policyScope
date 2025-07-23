/* eslint-disable @typescript-eslint/no-explicit-any */
import { MastraClient } from "@mastra/client-js";

export async function POST(request: Request) {
	try {
		const { partyName } = await request.json();

		if (!partyName) {
			return Response.json(
				{ error: "政党名が指定されていません" },
				{ status: 400 }
			);
		}

		console.log(`Starting comprehensive research for party: ${partyName}`);

		// Mastraクライアントを初期化
		const client = new MastraClient({
			baseUrl:
				process.env.NEXT_PUBLIC_MASTRA_API_URL ||
				"http://localhost:4111",
		});

		// partyResearchAgentを取得
		const agent = client.getAgent("partyResearchAgent");

		try {
			// エージェントからストリーミングレスポンスを生成
			const response = await agent.stream({
				messages: [
					{
						role: "user",
						content: `政党名: ${partyName}`,
					},
				],
			});

			console.log(`Starting stream for party research: ${partyName}`);

			// ReadableStreamを作成してストリーミングレスポンスを返す
			const stream = new ReadableStream({
				async start(controller) {
					const encoder = new TextEncoder();

					try {
						// processDataStreamを使用してストリーミングデータを処理
						const result = response.processDataStream({
							onTextPart: (text) => {
								const event = {
									type: "textDelta",
									textDelta: text,
								};
								controller.enqueue(
									encoder.encode(
										`data: ${JSON.stringify(event)}\n\n`
									)
								);
							},
							onToolCallPart: (toolCall) => {
								console.log("Tool call:", toolCall);
								const event = {
									type: "toolCall",
									toolName: toolCall.toolName,
									args: toolCall.args,
								};
								controller.enqueue(
									encoder.encode(
										`data: ${JSON.stringify(event)}\n\n`
									)
								);
							},
						});
						
						// ストリームが完了するまで待機
						await result;
						
						// 完了後の処理
						console.log("Stream finished");
						controller.enqueue(
							encoder.encode("data: [DONE]\n\n")
						);
						controller.close();
					} catch (error) {
						console.error("Stream processing error:", error);
						controller.close();
					}
				},
			});

			// ストリーミングレスポンスを返す
			return new Response(stream, {
				headers: {
					"Content-Type": "text/event-stream",
					"Cache-Control": "no-cache",
					Connection: "keep-alive",
				},
			});
		} catch (agentError) {
			console.error("Agent error:", agentError);
			throw agentError;
		}
	} catch (error) {
		console.error("Party research error:", error);
		return Response.json(
			{
				error: "政党調査中にエラーが発生しました",
				details:
					error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
