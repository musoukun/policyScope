import { NextResponse } from "next/server";
import { supabaseAdminAdmin } from "@/lib/supabaseAdmin-admin";
import { PARTIES } from "@/lib/parties";

export async function GET() {
	try {
		const { data, error } = await supabaseAdmin.from("parties").select("*");

		if (error) {
			console.error("Error fetching parties:", error);
			return NextResponse.json(PARTIES);
		}

		if (data && data.length > 0) {
			const partyOrder = PARTIES.map((p) => p.id);
			const sortedData = data.sort((a, b) => {
				const indexA = partyOrder.indexOf(a.id);
				const indexB = partyOrder.indexOf(b.id);
				return indexA - indexB;
			});
			return NextResponse.json(sortedData);
		}

		return NextResponse.json(PARTIES);
	} catch (error) {
		console.error("Error in GET /api/parties:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}