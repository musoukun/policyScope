"use client";

import type { Party, PartySummary as PartySummaryType } from "@/types/party";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { savePartySummary } from "@/app/actions/parties";
import {
	AssistantRuntimeProvider,
	makeAssistantToolUI,
	useThread,
	useThreadRuntime,
} from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { ArtifactsView } from "./ArtifactsView";

interface PartySummaryProps {
	party: Party;
	summary?: PartySummaryType | null;
	onSummaryUpdate?: (summary: PartySummaryType) => void;
}

// 内部コンポーネント：AssistantRuntimeProvider内で動作
function PartySummaryContent({
	party,
	summary,
	onSummaryUpdate,
	latestContent,
	setLatestContent,
	isGenerating,
	setIsGenerating,
}: PartySummaryProps & {
	latestContent: string;
	setLatestContent: (content: string) => void;
	isGenerating: boolean;
	setIsGenerating: (generating: boolean) => void;
}) {
	// Threadの状態を監視
	const messages = useThread((thread) => thread.messages);

	// メッセージの状態を監視して生成状態を更新
	useEffect(() => {
		if (messages && messages.length > 0) {
			const lastMessage = messages[messages.length - 1];
			if (lastMessage.role === "assistant") {
				const isComplete = lastMessage.content.some(
					(c) => c.type === "text" && c.text?.includes("完了")
				);
				if (isComplete) {
					setIsGenerating(false);
				}
			}
		}
	}, [messages, setIsGenerating]);

	// artifactsツールのUI定義 - HTMLコンテンツを検出して保存
	const ArtifactsToolUI = makeAssistantToolUI<{ code: string }, void>({
		toolName: "artifacts",
		render: ({ args, toolName, result }) => {
			console.log("ArtifactsToolUI called:", { toolName, args, result });

			// HTMLコンテンツを検出したら保存
			if (args?.code) {
				// 即座にコンテンツを設定
				setLatestContent(args.code);
				setIsGenerating(false);

				// 非同期で保存
				savePartySummary(party.id, args.code)
					.then((saved) => {
						if (saved && onSummaryUpdate) {
							onSummaryUpdate(saved);
						}
					})
					.catch((error) => {
						console.error("Failed to save party summary:", error);
					});
			}

			// デバッグ用の表示（本番環境では削除）
			return (
				<div className="hidden">
					<p>
						Artifacts tool called with {args?.code?.length || 0}{" "}
						chars
					</p>
				</div>
			);
		},
	});

	// Thread runtimeを取得
	const threadRuntime = useThreadRuntime();

	// ボタンクリックで政党名を送信
	const handleGenerateSummary = () => {
		setIsGenerating(true);
		threadRuntime.append({
			role: "user",
			content: [{ type: "text", text: `政党名: ${party.name}` }],
		});
	};

	return (
		<>
			<div className="space-y-8">
				{/* ヘッダー */}
				<div className="flex justify-between items-start">
					<div>
						<h2 className="text-3xl font-bold">{party.name}</h2>
						<p className="text-lg text-muted-foreground">
							{party.name_en}
						</p>
					</div>
					{summary && (
						<Button
							size="sm"
							variant="outline"
							onClick={handleGenerateSummary}
							disabled={isGenerating}
						>
							<RefreshCw
								className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`}
							/>
							更新
						</Button>
					)}
				</div>

				{/* コンテンツエリア */}
				{(!summary || !summary.html_content) && !latestContent ? (
					<div className="text-center py-16">
						<p className="text-muted-foreground mb-4">
							まだ情報が取得されていません
						</p>
						<Button
							onClick={handleGenerateSummary}
							size="lg"
							disabled={isGenerating}
						>
							{isGenerating ? (
								<>
									<RefreshCw className="h-4 w-4 mr-2 animate-spin" />
									生成中...
								</>
							) : (
								"要約情報を取得"
							)}
						</Button>
					</div>
				) : (
					<div className="h-full">
						{/* HTMLコンテンツを表示 */}
						<iframe
							srcDoc={latestContent || summary?.html_content}
							className="w-full h-[calc(100vh-300px)] min-h-[600px] border-0 rounded-lg shadow-sm"
							sandbox="allow-scripts allow-same-origin"
							title="政党情報サマリー"
						/>

						{/* メタデータ */}
						<div className="text-xs text-muted-foreground text-right mt-2">
							最終更新:{" "}
							{summary?.updated_at
								? new Date(summary.updated_at).toLocaleString()
								: "N/A"}
						</div>
					</div>
				)}

				{/* 生成中の進捗表示 */}
				{isGenerating && (
					<div className="border rounded-lg p-4 bg-muted/10">
						<div className="flex items-center gap-2">
							<RefreshCw className="h-4 w-4 animate-spin" />
							<span className="text-sm text-muted-foreground">
								政党情報を生成中...
							</span>
						</div>
					</div>
				)}

				{/* Artifacts Tool UI - HTMLコンテンツを自動保存 */}
				<ArtifactsToolUI />
			</div>
			
			{/* ArtifactsViewを追加 - ツールから生成されたHTMLを表示 */}
			<ArtifactsView onContentUpdate={(content) => {
				setLatestContent(content);
				// 保存処理
				savePartySummary(party.id, content).then((saved) => {
					if (saved && onSummaryUpdate) {
						onSummaryUpdate(saved);
					}
				}).catch((error) => {
					console.error("Failed to save party summary:", error);
				});
			}} />
		</>
	);
}

export function PartySummary({
	party,
	summary,
	onSummaryUpdate,
}: PartySummaryProps) {
	const [latestContent, setLatestContent] = useState<string>("");
	const [isGenerating, setIsGenerating] = useState(false);

	// MastraのAPIエンドポイントに直接接続するRuntime
	const runtime = useChatRuntime({
		api: `${process.env.NEXT_PUBLIC_MASTRA_API_URL || "http://localhost:4111"}/api/agents/partyResearchAgent/stream`,
	});

	return (
		<AssistantRuntimeProvider runtime={runtime}>
			<PartySummaryContent
				party={party}
				summary={summary}
				onSummaryUpdate={onSummaryUpdate}
				latestContent={latestContent}
				setLatestContent={setLatestContent}
				isGenerating={isGenerating}
				setIsGenerating={setIsGenerating}
			/>
		</AssistantRuntimeProvider>
	);
}
