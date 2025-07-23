"use client";

import type { Party, PartySummary as PartySummaryType } from "@/types/party";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { getPartyResearchAgent } from "@/lib/mastra-client";

interface PartySummaryProps {
	party: Party;
	summary?: PartySummaryType | null;
	onSummaryUpdate?: (summary: PartySummaryType) => void;
}

export function PartySummary({
	party,
	summary,
	onSummaryUpdate,
}: PartySummaryProps) {
	const [isGenerating, setIsGenerating] = useState(false);

	const [generatedHtml, setGeneratedHtml] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [showIframe, setShowIframe] = useState(false);

	const handleGenerateSummary = async () => {
		console.log("🚀 要約生成開始");
		console.log("📊 政党名:", party.name);
		console.log("🆔 政党ID:", party.id);
		
		setIsGenerating(true);
		setError(null);
		setGeneratedHtml("");
		setShowIframe(true);
		
		// 生成中のHTMLを設定
		const loadingHtml = `
			<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui, -apple-system, sans-serif;">
				<div style="text-align: center;">
					<div style="margin-bottom: 20px;">
						<svg style="animation: spin 1s linear infinite; width: 48px; height: 48px; color: #6366f1;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
						</svg>
					</div>
					<h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 8px; color: #1f2937;">政党情報を生成中...</h2>
					<p style="color: #6b7280;">${party.name}の詳細情報をAIが分析しています</p>
				</div>
				<style>
					@keyframes spin {
						from { transform: rotate(0deg); }
						to { transform: rotate(360deg); }
					}
				</style>
			</div>
		`;
		setGeneratedHtml(loadingHtml);
		
		try {
			const agent = getPartyResearchAgent();
			const response = await agent.stream({
				messages: [{
					role: "user",
					content: party.name
				}]
			});

			// ストリーミングレスポンスを処理
			let fullHtml = "";
			await response.processDataStream({
				onTextPart: (text) => {
					// 最初のテキストを受け取ったらローディングHTMLをクリア
					if (fullHtml === "") {
						setGeneratedHtml("");
					}
					fullHtml += text;
					setGeneratedHtml(fullHtml);
				},
				onErrorPart: (error) => {
					console.error("❌ エラー:", error);
					setError("要約の生成中にエラーが発生しました");
				}
			});

			console.log("✅ 要約生成完了");
			
			// 生成されたHTMLを親コンポーネントに通知
			if (onSummaryUpdate && fullHtml) {
				onSummaryUpdate({
					party_id: party.id,
					html_content: fullHtml,
					summary_data: {} as any, // AIからHTMLのみが返されるため、空のデータを設定
					updated_at: new Date().toISOString()
				});
			}
		} catch (error) {
			console.error("❌ 要約生成エラー:", error);
			setError("要約の生成に失敗しました");
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className="space-y-8 h-full flex flex-col">
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

			{/* エラー表示 */}
			{error && (
				<div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
					{error}
				</div>
			)}

			{/* コンテンツエリア */}
			{(!summary || !summary.html_content) && !showIframe ? (
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
				<div className="flex-1">
					{/* HTMLコンテンツを表示 */}
					<iframe
						srcDoc={generatedHtml || summary?.html_content || ""}
						className="w-full min-h-[800px] border-0"
						sandbox="allow-scripts allow-same-origin"
						title="政党情報サマリー"
						style={{ height: 'auto' }}
						onLoad={(e) => {
							const iframe = e.target as HTMLIFrameElement;
							const resizeIframe = () => {
								try {
									const contentHeight = iframe.contentWindow?.document.body.scrollHeight;
									if (contentHeight) {
										iframe.style.height = contentHeight + 'px';
									}
								} catch (e) {
									// Cross-origin制限により高さを取得できない場合は最小高さを維持
								}
							};
							// 初期サイズ設定
							resizeIframe();
							// コンテンツの変更を監視
							const observer = new MutationObserver(resizeIframe);
							if (iframe.contentWindow?.document.body) {
								observer.observe(iframe.contentWindow.document.body, {
									childList: true,
									subtree: true,
									attributes: true
								});
							}
						}}
					/>

					{/* メタデータ */}
					<div className="text-xs text-muted-foreground text-right mt-2">
						最終更新:{" "}
						{summary?.updated_at
							? new Date(summary.updated_at).toLocaleString()
							: generatedHtml ? new Date().toLocaleString() : "N/A"}
					</div>
				</div>
			)}

			{/* 生成中のスケルトンローディング（削除） */}
			{false && (
				<div className="space-y-4">
					<div className="border rounded-lg p-4 bg-muted/10">
						<div className="flex items-center gap-2 mb-4">
							<RefreshCw className="h-4 w-4 animate-spin" />
							<span className="text-sm text-muted-foreground">
								政党情報を生成中...
							</span>
						</div>
						
						{/* スケルトンローディング */}
						<div className="space-y-3">
							<div className="h-4 bg-muted/20 rounded animate-pulse" />
							<div className="h-4 bg-muted/20 rounded animate-pulse w-5/6" />
							<div className="h-4 bg-muted/20 rounded animate-pulse w-4/6" />
							<div className="h-32 bg-muted/20 rounded animate-pulse mt-4" />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}