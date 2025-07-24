import { Agent } from "@mastra/core/agent";
import { google } from "..";
import memory from "../memory";

export const googlemodel = google("gemini-2.5-flash-lite", {
	useSearchGrounding: true,
});
// このモデルはStructuredOutputが不安定で利用できないので純粋な検索結果を確認する。
// Policy Search Specialist Agent - Focused on answering specific questions about parties and policies
export const partyNews: Agent = new Agent({
	name: "partyNews",
	instructions: `
	please respond in Japanese. 
	政党ごとの最新の政策やニュースを調べてほしいです。出来れば10個最新ニュースを取得してほしいです。
	あなたはJSON形式以外の形式での出力は行ってはいけません。
	例えばこのようなメッセージは不要です
		例：では、以下にご要望に応じた最新のニュースをJSON形式で出力します。
		上記のような枕詞は不要なので、政党名を聞かれたらJSONだけを出力しなさい。

	調査したニュースは
	- タイトル
	- 概要（100文字以内）
	- URL
	のJSON形式で出力してください。	
	`,
	model: googlemodel,
	memory: memory as any,
});
