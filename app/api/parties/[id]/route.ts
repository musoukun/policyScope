import { NextResponse } from "next/server";
import { supabaseAdminAdmin } from "@/lib/supabaseAdmin-admin";
import { PARTIES } from "@/lib/parties";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	const { id } = await params;
	try {
		const { data, error } = await supabaseAdmin
			.from("parties")
			.select("*")
			.eq("id", id)
			.single();

		if (error) {
			console.error("Error fetching party:", error);
			const fallback = PARTIES.find((p) => p.id === id);
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