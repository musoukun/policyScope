"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";

interface PartyResearchButtonProps {
	partyName: string;
	partyNameJa: string;
	onResearch: () => void;
	isLoading?: boolean;
}

export function PartyResearchButton({
	onResearch,
	isLoading = false,
}: PartyResearchButtonProps) {
	return (
		<Button
			onClick={onResearch}
			disabled={isLoading}
			className="w-full"
			size="lg"
		>
			{isLoading ? (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					調査中...
				</>
			) : (
				<>
					<Search className="mr-2 h-4 w-4" />
					AI包括調査を実行
				</>
			)}
		</Button>
	);
}
