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
		<div className="grid grid-cols-1 lg:grid-cols-10 gap-6 h-full">
			{/* 左側：政党要約（7/10） */}
			<div className="lg:col-span-7 min-h-0">
				<PartySummary party={selectedParty} />
			</div>

			{/* 右側：最新ニュース（3/10） */}
			<div className="lg:col-span-3 min-h-0">
				<div className="sticky top-4">
					<PartyNews party={selectedParty} />
				</div>
			</div>
		</div>
	);
}