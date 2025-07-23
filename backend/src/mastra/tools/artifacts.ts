import { createTool } from "@mastra/core/tools";
import { z } from "zod";

export const artifactsTool = createTool({
	id: "artifacts",
	description:
		"政党情報をHTMLで視覚的に表現する。このツールを使用すると、フロントエンドでHTMLプレビューが自動的に表示されます。",
	inputSchema: z.object({
		code: z
			.string()
			.describe(
				"完全なHTMLコード（DOCTYPE、html、head、bodyタグを含む）"
			),
	}),
	outputSchema: z.object({
		success: z.boolean(),
		code: z.string(),
		message: z.string(),
	}),
	execute: async ({ input }) => {
		// このツールは実際には何も実行しない
		// フロントエンドがこのツール呼び出しを検出して表示する
		console.log(
			"artifacts tool called with code length:",
			input.code.length
		);
		return {
			success: true,
			code: input.code,
			message: "HTML code ready for rendering",
		};
	},
});

export default artifactsTool;
