import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { data, error } = await supabase
			.from("party_summaries")
			.select("*")
			.eq("party_id", params.id)
			.order("created_at", { ascending: false })
			.limit(1)
			.single();

		if (error) {
			console.error("Error fetching party summary:", error);
			return NextResponse.json(
				{ error: "Summary not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error("Error in GET /api/parties/[id]/summary:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}

export async function POST(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { htmlContent } = await request.json();

		const { data: existing } = await supabase
			.from("party_summaries")
			.select("id")
			.eq("party_id", params.id)
			.single();

		let result;
		if (existing) {
			const { data, error } = await supabase
				.from("party_summaries")
				.update({
					html_content: htmlContent,
					summary_data: {},
					updated_at: new Date().toISOString(),
				})
				.eq("party_id", params.id)
				.select()
				.single();

			result = { data, error };
		} else {
			const { data, error } = await supabase
				.from("party_summaries")
				.insert({
					party_id: params.id,
					html_content: htmlContent,
					summary_data: {},
				})
				.select()
				.single();

			result = { data, error };
		}

		if (result.error) {
			console.error("Supabase error saving party summary:", result.error);
			return NextResponse.json(
				{ error: "Failed to save summary" },
				{ status: 500 }
			);
		}

		return NextResponse.json(result.data);
	} catch (error) {
		console.error("Error in POST /api/parties/[id]/summary:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}