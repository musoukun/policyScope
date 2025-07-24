import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Suspense } from "react";

export const metadata: Metadata = {
	title: "日本の政党DeepWiki - PolicyScope",
	description: "AIによる日本の政党に関する包括的な情報分析システム",
};

export default function PolicyWikiLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<NuqsAdapter>
			<div className="min-h-screen bg-background">
				<main className="container mx-auto px-4 py-6">
					<Suspense fallback={<div>Loading...</div>}>
						{children}
					</Suspense>
				</main>
			</div>
		</NuqsAdapter>
	);
}
