import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { MastraClient } from "@mastra/client-js";
import type { PartyNewsItem } from "@/types/party";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	try {
		const { data, error } = await supabase
			.from("party_news")
			.select("*")
			.eq("party_id", id)
			.order("created_at", { ascending: false })
			.limit(1)
			.single();

		if (error) {
			console.error("Error fetching party news:", error);
			return NextResponse.json(
				{ error: "News not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error("Error in GET /api/parties/[id]/news:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	try {
		const { partyName } = await request.json();

		const mastraUrl = process.env.MASTRA_API_URL || "http://localhost:4111";
		console.log("[API News Route] Mastra URL:", mastraUrl);
		console.log("[API News Route] Party ID:", id);
		console.log("[API News Route] Party Name:", partyName);
		
		const client = new MastraClient({
			baseUrl: mastraUrl,
		});

		const agent = client.getAgent("partyNews");
		const response = await agent.generate({
			messages: [
				{
					role: "user",
					content: partyName,
				},
			],
		});

		let newsData: PartyNewsItem[];
		try {
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
		} catch (parseError) {
			console.error("Failed to parse news JSON:", parseError);
			return NextResponse.json(
				{ error: "Failed to parse news data" },
				{ status: 500 }
			);
		}

		const { data: existing } = await supabase
			.from("party_news")
			.select("id")
			.eq("party_id", id)
			.single();

		let result;
		if (existing) {
			const { data, error } = await supabase
				.from("party_news")
				.update({
					news_data: newsData,
					updated_at: new Date().toISOString(),
				})
				.eq("party_id", id)
				.select()
				.single();

			result = { data, error };
		} else {
			const { data, error } = await supabase
				.from("party_news")
				.insert({
					party_id: id,
					news_data: newsData,
				})
				.select()
				.single();

			result = { data, error };
		}

		if (result.error) {
			console.error("Supabase error saving party news:", result.error);
			return NextResponse.json(
				{ error: "Failed to save news" },
				{ status: 500 }
			);
		}

		return NextResponse.json(result.data);
	} catch (error) {
		console.error("Error in POST /api/parties/[id]/news:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}