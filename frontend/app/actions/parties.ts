"use server";

import { supabase } from "@/lib/supabase";
import { PARTIES } from "@/lib/parties";
import type {
	Party,
	PartySummary,
	PartyNews,
	PartyNewsItem,
} from "@/types/party";
import { MastraClient } from "@mastra/client-js";

export async function getAllParties(): Promise<Party[]> {
	const { data, error } = await supabase.from("parties").select("*");

	if (error) {
		console.error("Error fetching parties:", error);
		return PARTIES; // フォールバック
	}

	// データベースから取得したデータを、PARTIES配列の順序に並び替え
	if (data && data.length > 0) {
		const partyOrder = PARTIES.map((p) => p.id);
		return data.sort((a, b) => {
			const indexA = partyOrder.indexOf(a.id);
			const indexB = partyOrder.indexOf(b.id);
			return indexA - indexB;
		});
	}

	return PARTIES;
}

export async function getPartyById(id: string): Promise<Party | null> {
	const { data, error } = await supabase
		.from("parties")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		console.error("Error fetching party:", error);
		return PARTIES.find((p) => p.id === id) || null;
	}

	return data;
}

export async function getPartySummary(
	partyId: string
): Promise<PartySummary | null> {
	const { data, error } = await supabase
		.from("party_summaries")
		.select("*")
		.eq("party_id", partyId)
		.order("created_at", { ascending: false })
		.limit(1)
		.single();

	if (error) {
		console.error("Error fetching party summary:", error);
		return null;
	}

	return data;
}

export async function savePartySummary(
	partyId: string,
	htmlContent: string
): Promise<PartySummary | null> {
	try {
		console.log("Attempting to save party HTML content");

		// 既存のレコードがあるか確認
		const { data: existing } = await supabase
			.from("party_summaries")
			.select("id")
			.eq("party_id", partyId)
			.single();

		let result;
		if (existing) {
			// 更新
			const { data, error } = await supabase
				.from("party_summaries")
				.update({
					html_content: htmlContent,
					summary_data: {}, // 空のオブジェクトで更新
					updated_at: new Date().toISOString(),
				})
				.eq("party_id", partyId)
				.select()
				.single();

			result = { data, error };
		} else {
			// 新規作成
			const { data, error } = await supabase
				.from("party_summaries")
				.insert({
					party_id: partyId,
					html_content: htmlContent,
					summary_data: {}, // 空のオブジェクト
				})
				.select()
				.single();

			result = { data, error };
		}

		if (result.error) {
			console.error("Supabase error saving party summary:", result.error);
			return null;
		}

		console.log("Party HTML saved successfully");
		return result.data;
	} catch (err) {
		console.error("Unexpected error in savePartySummary:", err);
		return null;
	}
}

export async function getPartyNews(partyId: string): Promise<PartyNews | null> {
	const { data, error } = await supabase
		.from("party_news")
		.select("*")
		.eq("party_id", partyId)
		.order("created_at", { ascending: false })
		.limit(1)
		.single();

	if (error) {
		console.error("Error fetching party news:", error);
		return null;
	}

	return data;
}

export async function updatePartyNews(
	partyId: string,
	partyName: string
): Promise<PartyNews | null> {
	console.log(
		"🎯 updatePartyNews開始 - partyId:",
		partyId,
		"partyName:",
		partyName
	);
	try {
		const mastraUrl =
			process.env.MASTRA_API_URL || "http://localhost:4111";
		console.log("🎯 Mastra URL:", mastraUrl);

		const client = new MastraClient({
			baseUrl: mastraUrl,
		});

		// partyNewsエージェントでニュースを取得
		console.log("🎯 partyNewsエージェント取得中...");
		const agent = client.getAgent("partyNews");
		console.log("🎯 generate呼び出し中...");
		const response = await agent.generate({
			messages: [
				{
					role: "user",
					content: partyName,
				},
			],
		});
		console.log("🎯 レスポンス:", response);
		console.log("🎯 レスポンステキスト:", response.text);

		// レスポンスをパース
		let newsData: PartyNewsItem[];
		try {
			// ```json と ``` を削除
			let cleanedText = response.text.trim();
			if (cleanedText.startsWith('```json')) {
				cleanedText = cleanedText.replace(/^```json\s*/, '');
			}
			if (cleanedText.startsWith('```')) {
				cleanedText = cleanedText.replace(/^```\s*/, '');
			}
			if (cleanedText.endsWith('```')) {
				cleanedText = cleanedText.replace(/```\s*$/, '');
			}
			
			newsData = JSON.parse(cleanedText);
			console.log("🎯 パース成功:", newsData);
		} catch (parseError) {
			console.error("Failed to parse news JSON:", parseError);
			console.error("response.text の内容:", response.text);
			return null;
		}

		// 既存のレコードがあるか確認
		const { data: existing } = await supabase
			.from("party_news")
			.select("id")
			.eq("party_id", partyId)
			.single();

		let result;
		if (existing) {
			// 更新
			const { data, error } = await supabase
				.from("party_news")
				.update({
					news_data: newsData,
					updated_at: new Date().toISOString(),
				})
				.eq("party_id", partyId)
				.select()
				.single();

			result = { data, error };
		} else {
			// 新規作成
			const { data, error } = await supabase
				.from("party_news")
				.insert({
					party_id: partyId,
					news_data: newsData,
				})
				.select()
				.single();

			result = { data, error };
		}

		if (result.error) {
			console.error("Supabase error saving party news:", result.error);
			return null;
		}

		console.log("Party news saved successfully");
		return result.data;
	} catch (err) {
		console.error("Unexpected error in updatePartyNews:", err);
		if (err instanceof Error) {
			console.error("エラー詳細:", {
				name: err.name,
				message: err.message,
				stack: err.stack,
			});
		}
		return null;
	}
}
