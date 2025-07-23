import { createWorkflow, createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { partyResearchAgent } from "../agents/party-research-agent";
import { htmlArtifactAgent } from "../agents/html-artifact-agent";

// 政党を研究するステップ
const researchStep = createStep(partyResearchAgent);

// HTMLをArtifactツールで表示するステップ  
const displayStep = createStep(htmlArtifactAgent);

// 政党研究workflow
export const partyResearchWorkflow = createWorkflow({
	id: "party-research-workflow", 
	description: "Research a political party and display the HTML report",
	inputSchema: z.object({
		partyName: z.string().describe("日本の政党名"),
	}),
	outputSchema: z.object({
		success: z.boolean(),
		message: z.string(),
	}),
})
	// 政党名を研究エージェントに渡す
	.map(async ({ inputData }) => {
		return {
			prompt: inputData.partyName,
		};
	})
	.then(researchStep)
	// 研究結果のHTMLを表示エージェントに渡す
	.map(async ({ inputData }) => {
		// 前のステップ（researchStep）の出力はinputDataとして渡される
		// エージェントの出力はtextプロパティに含まれている
		const htmlContent = extractHtmlFromAgentOutput(inputData);
		return {
			prompt: htmlContent,
		};
	})
	.then(displayStep)
	// 最終結果
	.map(async ({ inputData }) => {
		return {
			success: true,
			message: "政党研究レポートを表示しました",
		};
	})
	.commit();

// エージェントの出力からHTMLを抽出するヘルパー関数
function extractHtmlFromAgentOutput(output: any): string {
	// エージェントの出力のtext属性を確認
	if (output?.text) {
		// textがそのままHTMLの場合
		if (output.text.includes("<!DOCTYPE") || output.text.includes("<html")) {
			return output.text;
		}
		// HTMLタグを含む部分を抽出
		const htmlMatch = output.text.match(/<!DOCTYPE[\s\S]*<\/html>/i);
		if (htmlMatch) {
			return htmlMatch[0];
		}
	}
	
	// outputが文字列の場合
	if (typeof output === "string") {
		if (output.includes("<!DOCTYPE") || output.includes("<html")) {
			return output;
		}
	}
	
	// toolCallsからartifactsツールの呼び出しを探す
	if (output?.toolCalls && Array.isArray(output.toolCalls)) {
		for (const call of output.toolCalls) {
			if (call.toolName === "artifacts" && call.args?.code) {
				return call.args.code;
			}
		}
	}
	
	// フォールバック - デバッグ情報を含む
	console.log("DEBUG: Unable to extract HTML from output:", JSON.stringify(output, null, 2));
	return `<html><body><h1>HTMLコンテンツが見つかりません</h1><pre>${JSON.stringify(output, null, 2)}</pre></body></html>`;
}