"use client";

import { ToolCallContentPart, useThread } from "@assistant-ui/react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Download, Code, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ArtifactsViewProps {
	onContentUpdate?: (content: string) => void;
}

export const ArtifactsView = ({ onContentUpdate }: ArtifactsViewProps) => {
	const [viewMode, setViewMode] = useState<"preview" | "source">("preview");
	const [isVisible, setIsVisible] = useState(false);

	// Threadから最新のartifactを取得
	const artifact = useThread((thread) => {
		const messages = thread.messages;
		if (!messages) return undefined;

		const latestArtifact = messages
			.flatMap((m) =>
				m.content.filter(
					(c): c is ToolCallContentPart =>
						c.type === "tool-call" && c.toolName === "artifacts"
				)
			)
			.at(-1);

		return latestArtifact?.args["code"] as string | undefined;
	});

	// artifactが更新されたらコールバックを呼ぶ
	useEffect(() => {
		if (artifact) {
			setIsVisible(true);
			onContentUpdate?.(artifact);
		}
	}, [artifact, onContentUpdate]);

	// ダウンロード機能
	const handleDownload = () => {
		if (!artifact) return;

		const filename = prompt("ファイル名を入力してください:", "政党情報.html");
		if (filename === null) return;

		const finalFilename = filename.trim() || "政党情報.html";
		const htmlFilename = finalFilename.endsWith(".html")
			? finalFilename
			: `${finalFilename}.html`;

		const blob = new Blob([artifact], { type: "text/html" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = htmlFilename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	if (!artifact || !isVisible) {
		return null;
	}

	return (
		<Card className="mt-4 overflow-hidden">
			{/* ヘッダー */}
			<div className="flex items-center justify-between p-4 border-b">
				<div className="flex items-center gap-4">
					<h3 className="font-semibold">生成されたコンテンツ</h3>
					<Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "preview" | "source")}>
						<TabsList>
							<TabsTrigger value="preview">
								<Eye className="h-4 w-4 mr-2" />
								プレビュー
							</TabsTrigger>
							<TabsTrigger value="source">
								<Code className="h-4 w-4 mr-2" />
								ソース
							</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm" onClick={handleDownload}>
						<Download className="h-4 w-4 mr-2" />
						ダウンロード
					</Button>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsVisible(false)}
					>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* コンテンツ */}
			<div className="h-[600px]">
				{viewMode === "preview" ? (
					<iframe
						className="w-full h-full border-0"
						srcDoc={artifact}
						sandbox="allow-scripts allow-same-origin"
						title="HTML Preview"
					/>
				) : (
					<ScrollArea className="h-full w-full">
						<pre className="p-4 text-sm bg-muted">
							<code>{artifact}</code>
						</pre>
					</ScrollArea>
				)}
			</div>
		</Card>
	);
};