import { supabaseAdmin } from "@/lib/supabase-admin";
import { PARTIES } from "@/lib/parties";
import type { Party } from "@/types/party";

// サーバーサイドで直接データベースアクセスする関数
export async function getAllPartiesServer(): Promise<Party[]> {
	const { data, error } = await supabaseAdmin.from("parties").select("*");

	if (error) {
		console.error("Error fetching parties:", error);
		return PARTIES; // フォールバック
	}

	// データベースから取得したデータを、PARTIES配列の順序に並び替え
	if (data && data.length > 0) {
		const partyOrder = PARTIES.map((p) => p.id);
		return data.sort((a: Party, b: Party) => {
			const indexA = partyOrder.indexOf(a.id);
			const indexB = partyOrder.indexOf(b.id);
			return indexA - indexB;
		});
	}

	return PARTIES;
}