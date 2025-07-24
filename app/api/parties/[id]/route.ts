import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { PARTIES } from "@/lib/parties";

export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { data, error } = await supabase
			.from("parties")
			.select("*")
			.eq("id", params.id)
			.single();

		if (error) {
			console.error("Error fetching party:", error);
			const fallback = PARTIES.find((p) => p.id === params.id);
			if (fallback) {
				return NextResponse.json(fallback);
			}
			return NextResponse.json(
				{ error: "Party not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(data);
	} catch (error) {
		console.error("Error in GET /api/parties/[id]:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}