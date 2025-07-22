import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

// カスタムGoogleインスタンスを作成
const google = createGoogleGenerativeAI({
	// apiKeyは環境変数GOOGLE_GENERATIVE_AI_API_KEYから自動的に読み取られます
});

export async function GET() {
	try {
		// 環境変数の確認
		const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

		if (!apiKey) {
			return NextResponse.json(
				{
					error: "GOOGLE_GENERATIVE_AI_API_KEY is not set",
					env: Object.keys(process.env).filter((key) =>
						key.includes("GOOGLE")
					),
				},
				{ status: 500 }
			);
		}

		// シンプルなテキスト生成
		const model = google("gemini-2.5-flash");

		const { text } = await generateText({
			model,
			prompt: "こんにちは",
		});

		return NextResponse.json({
			success: true,
			response: text,
			apiKeyPrefix: apiKey.substring(0, 10) + "...",
		});
	} catch (error) {
		console.error("Test Gemini Error:", error);
		return NextResponse.json(
			{
				error: "Failed to call Gemini API",
				details:
					error instanceof Error ? error.message : "Unknown error",
				stack: error instanceof Error ? error.stack : undefined,
			},
			{ status: 500 }
		);
	}
}
