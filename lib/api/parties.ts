import type { Party, PartySummary, PartyNews } from "@/types/party";

// クライアントサイドとサーバーサイドで異なるベースURLを使用
const getApiBase = () => {
	if (typeof window !== "undefined") {
		// クライアントサイド
		return "";
	}
	// サーバーサイド
	return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
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
	const response = await fetch(`${baseUrl}/api/parties/${partyId}/news`);
	if (!response.ok) {
		if (response.status === 404) {
			return null;
		}
		throw new Error("Failed to fetch party news");
	}
	return response.json();
}

export async function updatePartyNews(
	partyId: string,
	partyName: string
): Promise<PartyNews | null> {
	const baseUrl = getApiBase();
	const response = await fetch(`${baseUrl}/api/parties/${partyId}/news`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ partyName }),
	});
	if (!response.ok) {
		throw new Error("Failed to update party news");
	}
	return response.json();
}