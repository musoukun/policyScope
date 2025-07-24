"use client";

import { useQueryState } from "nuqs";
import type { Party } from "@/types/party";
import { PARTY_COLORS } from "@/lib/parties";

interface PartySelectorProps {
	parties: Party[];
}

export function PartySelector({ parties }: PartySelectorProps) {
	const [selectedParty, setSelectedParty] = useQueryState("party", {
		defaultValue: parties[0]?.id || "ldp",
	});

	return (
		<div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 mb-6 p-1 bg-muted rounded-lg">
			{parties.map((party) => (
				<button
					key={party.id}
					onClick={() => setSelectedParty(party.id)}
					className="px-4 py-2 text-sm font-medium rounded-md transition-all hover:opacity-80"
					style={{
						backgroundColor: selectedParty === party.id ? PARTY_COLORS[party.id] : "transparent",
						color: selectedParty === party.id ? "white" : "inherit",
						borderWidth: "2px",
						borderColor: PARTY_COLORS[party.id],
						borderStyle: "solid",
					}}
				>
					{party.name}
				</button>
			))}
		</div>
	);
}