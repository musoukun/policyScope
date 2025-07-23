"use client";

import { useQueryState } from "nuqs";
import type { Party } from "@/types/party";
import { PartySummary } from "./PartySummary";
import { PartyNews } from "./PartyNews";

interface PolicyWikiContentProps {
	parties: Party[];
}

export function PolicyWikiContent({ parties }: PolicyWikiContentProps) {
	const [selectedPartyId] = useQueryState("party", {
		defaultValue: parties[0]?.id || "ldp",
	});

	const selectedParty = parties.find(p => p.id === selectedPartyId);

	if (!selectedParty) {
		return <div>政党が見つかりません</div>;
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
			{/* 左側：政党要約（半分） */}
			<div>
				<PartySummary party={selectedParty} />
			</div>

			{/* 右側：最新ニュース（半分） */}
			<div>
				<PartyNews party={selectedParty} />
			</div>
		</div>
	);
}