import type { Party, PartySummary, PartyNews } from "@/types/party";

// クライアントサイドとサーバーサイドで異なるベースURLを使用
const getApiBase = () => {
	if (typeof window !== "undefined") {
		// クライアントサイド
		console.log("[API Client] Running on client side");
		return "";
	}
	// サーバーサイド
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
	console.log("[API Client] Running on server side with base URL:", baseUrl);
	return baseUrl;
};

export async function getAllParties(): Promise<Party[]> {
	const baseUrl = getApiBase();
	const response = await fetch(`${baseUrl}/api/parties`);
	if (!response.ok) {
		throw new Error("Failed to fetch parties");
	}
	return response.json();
}

export async function getPartyById(id: string): Promise<Party | null> {
	const baseUrl = getApiBase();
	const response = await fetch(`${baseUrl}/api/parties/${id}`);
	if (!response.ok) {
		if (response.status === 404) {
			return null;
		}
		throw new Error("Failed to fetch party");
	}
	return response.json();
}

export async function getPartySummary(partyId: string): Promise<PartySummary | null> {
	const baseUrl = getApiBase();
	const response = await fetch(`${baseUrl}/api/parties/${partyId}/summary`);
	if (!response.ok) {
		if (response.status === 404) {
			return null;
		}
		throw new Error("Failed to fetch party summary");
	}
	return response.json();
}

export async function savePartySummary(
	partyId: string,
	htmlContent: string
): Promise<PartySummary | null> {
	const baseUrl = getApiBase();
	const response = await fetch(`${baseUrl}/api/parties/${partyId}/summary`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ htmlContent }),
	});
	if (!response.ok) {
		throw new Error("Failed to save party summary");
	}
	return response.json();
}

export async function getPartyNews(partyId: string): Promise<PartyNews | null> {
	const baseUrl = getApiBase();
	const url = `${baseUrl}/api/parties/${partyId}/news`;
	console.log("[getPartyNews] Fetching from:", url);
	const response = await fetch(url);
	if (!response.ok) {
		if (response.status === 404) {
			console.log("[getPartyNews] News not found for party:", partyId);
			return null;
		}
		console.error("[getPartyNews] Failed to fetch, status:", response.status);
		throw new Error("Failed to fetch party news");
	}
	const data = await response.json();
	console.log("[getPartyNews] Successfully fetched news for:", partyId);
	return data;
}

export async function updatePartyNews(
	partyId: string,
	partyName: string
): Promise<PartyNews | null> {
	const baseUrl = getApiBase();
	const url = `${baseUrl}/api/parties/${partyId}/news`;
	console.log("[updatePartyNews] Posting to:", url, "with partyName:", partyName);
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ partyName }),
	});
	if (!response.ok) {
		console.error("[updatePartyNews] Failed to update, status:", response.status);
		throw new Error("Failed to update party news");
	}
	const data = await response.json();
	console.log("[updatePartyNews] Successfully updated news for:", partyId);
	return data;
}