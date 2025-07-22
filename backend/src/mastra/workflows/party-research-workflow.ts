import { createWorkflow, createStep, Step } from "@mastra/core/workflows";
import { z } from "zod";
import { partyResearchAgent, googlemodel } from "../agents/party-research-agent";
import {
	stage1Schema,
	stage2Schema,
	stage3Schema,
	stage4Schema,
	stage5Schema,
	comprehensivePartyResearchReportSchema,
} from "../schemas/party-research.schema";

// Stage 1: 速報と基本情報を取得
const stage1Step = createStep({
	id: "stage1-breaking-and-basic",
	description: "速報セクションと基本情報を取得",
	inputSchema: z.object({
		partyName: z.string().describe("調査対象の政党名"),
	}),
	outputSchema: stage1Schema,
	execute: async ({ inputData }) => {
		const response = await partyResearchAgent.generate(
			[
				{
					role: "user",
					content: `日本の政党「${inputData.partyName}」について、Google検索を使用して以下の情報を取得してください。
          
          重要：「${inputData.partyName}」は常に実在する政党です。Google検索で「${inputData.partyName} 政党」「${inputData.partyName} 」などで検索し、実際の情報を確認してください。
          
          1. 速報セクション（最新選挙結果、最近の重要な展開）
          2. 基本情報（党名、略称、設立日、党首情報、本部所在地、党員数、国会議員数）
          
          注意：「チームみらい」の場合、安野貴博氏が2025年の参院選に向けて立ち上げた新しい政党です。`,
				},
			],
			{
				output: stage1Schema,
				model: googlemodel, // 明示的にモデルを指定
			}
		);

		console.log("Stage 1 completed:", response.object);
		return response.object;
	},
});

// Stage 2: 政策分析を取得
const stage2Step = createStep({
	id: "stage2-policy-analysis",
	description: "政策分析情報を取得",
	inputSchema: stage1Schema,
	outputSchema: z.object({
		...stage1Schema.shape,
		...stage2Schema.shape,
	}),
	execute: async ({ inputData }) => {
		const partyName = inputData.basicInformation.partyName;
		const response = await partyResearchAgent.generate(
			[
				{
					role: "user",
					content: `日本の政党「${partyName}」の政策分析について、以下の情報を取得してください：
          1. 基本理念とスローガン
          2. 重点政策（実現可能性スコア、予算規模、実施期間を含む）
          3. 政策カテゴリー別スタンス（経済、社会保障、外交・安保、教育、環境・エネルギー）
          4. 第三者評価`,
				},
			],
			{
				output: stage2Schema,
				model: googlemodel, // 明示的にモデルを指定
			}
		);

		console.log("Stage 2 completed:", response.object);
		// 前のステージのデータと結合して返す
		return {
			...inputData,
			...response.object,
		};
	},
});

// Stage 3: 支持基盤分析を取得
const stage3Step = createStep({
	id: "stage3-support-analysis",
	description: "支持基盤分析情報を取得",
	inputSchema: z.object({
		...stage1Schema.shape,
		...stage2Schema.shape,
	}),
	outputSchema: z.object({
		...stage1Schema.shape,
		...stage2Schema.shape,
		...stage3Schema.shape,
	}),
	execute: async ({ inputData }) => {
		const partyName = inputData.basicInformation.partyName;
		const response = await partyResearchAgent.generate(
			[
				{
					role: "user",
					content: `日本の政党「${partyName}」の支持基盤について、以下の情報を取得してください：
          1. 支持率推移（複数の調査機関のデータ）
          2. 支持層の特徴（年齢層、職業、地域別の割合）
          3. 支持理由
          4. 組織基盤と財政力`,
				},
			],
			{
				output: stage3Schema,
				model: googlemodel, // 明示的にモデルを指定
			}
		);

		console.log("Stage 3 completed:", response.object);
		// 前のステージのデータと結合して返す
		return {
			...inputData,
			...response.object,
		};
	},
});

// Stage 4: 国際比較と現状を取得
const stage4Step = createStep({
	id: "stage4-international-and-current",
	description: "国際比較と現状情報を取得",
	inputSchema: z.object({
		...stage1Schema.shape,
		...stage2Schema.shape,
		...stage3Schema.shape,
	}),
	outputSchema: z.object({
		...stage1Schema.shape,
		...stage2Schema.shape,
		...stage3Schema.shape,
		...stage4Schema.shape,
	}),
	execute: async ({ inputData }) => {
		const partyName = inputData.basicInformation.partyName;
		const response = await partyResearchAgent.generate(
			[
				{
					role: "user",
					content: `日本の政党「${partyName}」について、以下の情報を取得してください：
          1. 国際比較（類似する海外政党、国際的評価、海外メディア報道）
          2. 現状（過去3ヶ月の主な活動、メディア露出、トレンド政策、党内動向）`,
				},
			],
			{
				output: stage4Schema,
				model: googlemodel, // 明示的にモデルを指定
			}
		);

		console.log("Stage 4 completed:", response.object);
		// 前のステージのデータと結合して返す
		return {
			...inputData,
			...response.object,
		};
	},
});

// Stage 5: 評価とデータソースを取得
const stage5Step = createStep({
	id: "stage5-evaluation-and-sources",
	description: "多角的評価と総合評価を取得",
	inputSchema: z.object({
		...stage1Schema.shape,
		...stage2Schema.shape,
		...stage3Schema.shape,
		...stage4Schema.shape,
	}),
	outputSchema: comprehensivePartyResearchReportSchema,
	execute: async ({ inputData }) => {
		const partyName = inputData.basicInformation.partyName;
		const response = await partyResearchAgent.generate(
			[
				{
					role: "user",
					content: `日本の政党「${partyName}」について、以下の情報を取得してください：
          1. 多角的評価（支持的視点、批判的視点、中立的評価、専門家分析）
          2. 総合評価（実績、課題、将来展望、リスク要因、機会、全体的所見）
          3. データソース（使用した情報源一覧）`,
				},
			],
			{
				output: stage5Schema,
				model: googlemodel, // 明示的にモデルを指定
			}
		);

		console.log("Stage 5 completed:", response.object);
		// 前のステージのデータと結合して最終的な完全なレポートを返す
		return {
			...inputData,
			...response.object,
		};
	},
});

// ワークフローを作成
export const partyResearchWorkflow = createWorkflow({
	id: "partyResearchWorkflow",
	description: "政党の包括的な調査を5段階に分けて実行",
	inputSchema: z.object({
		partyName: z.string().describe("調査対象の政党名"),
	}),
	outputSchema: comprehensivePartyResearchReportSchema,
})
	.then(stage1Step)
	.then(stage2Step)
	.then(stage3Step)
	.then(stage4Step)
	.then(stage5Step)
	.commit();

export type PartyResearchWorkflow = typeof partyResearchWorkflow;
