"use client";

import type { Party, PartySummary as PartySummaryType } from "@/types/party";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { getPartyResearchAgent } from "@/lib/mastra-client";
import { getPartySummary, savePartySummary } from "@/lib/api/parties";
import { motion, useAnimate } from "framer-motion";

interface PartySummaryProps {
	party: Party;
	onSummaryUpdate?: (summary: PartySummaryType) => void;
}

export function PartySummary({ party, onSummaryUpdate }: PartySummaryProps) {
	const [isGenerating, setIsGenerating] = useState(false);
	const [generatedHtml, setGeneratedHtml] = useState<string>("");
	const [error, setError] = useState<string | null>(null);
	const [showIframe, setShowIframe] = useState(false);
	const [loading, setLoading] = useState(true);
	const [savedSummary, setSavedSummary] = useState<PartySummaryType | null>(
		null
	);
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const [scope, animate] = useAnimate();
	const [displayedText, setDisplayedText] = useState("");

	// HTMLコンテンツから高さを推定する関数
	const estimateContentHeight = (htmlContent: string): number => {
		// ベースの高さ（ヘッダー、フッター、マージンなど）
		const baseHeight = 200;

		// 各要素の推定高さ（パディング、マージン含む）
		const elementHeights = {
			h1: 60,
			h2: 50,
			h3: 40,
			h4: 35,
			p: 30,
			div: 30,
			li: 35, // パディングを考慮
			ul: 20, // マージン
			ol: 20,
			blockquote: 50,
			table: 100, // テーブルは大きめに見積もる
			tr: 40,
			section: 20,
			article: 20,
		};

		// HTMLをパースして要素をカウント
		let estimatedHeight = baseHeight;

		// タグごとのマッチング
		for (const [tag, height] of Object.entries(elementHeights)) {
			const regex = new RegExp(`<${tag}[^>]*>`, "gi");
			const matches = htmlContent.match(regex);
			if (matches) {
				estimatedHeight += matches.length * height;
			}
		}

		// テキスト量が多い場合の調整（長いコンテンツは折り返しを考慮）
		const textLength = htmlContent.replace(/<[^>]*>/g, "").length;
		if (textLength > 5000) {
			estimatedHeight += Math.floor((textLength - 5000) / 100) * 10;
		}

		// グリッドやカードレイアウトの考慮
		if (htmlContent.includes("grid") || htmlContent.includes("card")) {
			estimatedHeight += 200;
		}

		// 余裕を持たせた上で、最小高さを保証
		return Math.max(estimatedHeight * 1.2 - 1, 800);
	};

	// iframeの高さを動的に調整する関数
	const adjustIframeHeight = useCallback(() => {
		const iframe = iframeRef.current;
		if (!iframe) return;

		const content = generatedHtml || savedSummary?.html_content || "";
		if (content) {
			const estimatedHeight = estimateContentHeight(content);
			// 100px単位で切り上げ
			const roundedHeight = Math.ceil(estimatedHeight / 100) * 100;
			iframe.style.height = `${roundedHeight}px`;
		} else {
			// コンテンツがない場合はデフォルト高さ
			iframe.style.height = "800px";
		}
	}, [generatedHtml, savedSummary]);

	// タイプライターアニメーション
	useEffect(() => {
		let isActive = true;
		let currentIndex = 0;
		
		const typeText = async () => {
			setDisplayedText("");
			currentIndex = 0;
			
			// 少し遅延してから開始
			await new Promise(resolve => setTimeout(resolve, 300));
			
			while (isActive && currentIndex < party.name.length) {
				setDisplayedText(party.name.slice(0, currentIndex + 1));
				currentIndex++;
				await new Promise(resolve => setTimeout(resolve, 150)); // 遅めのタイピング速度
			}
		};
		
		typeText();
		
		return () => {
			isActive = false;
		};
	}, [party.name]);

	// Supabaseから政党要約を取得
	useEffect(() => {
		const fetchSummary = async () => {
			// 政党が変更されたら、前のデータをクリア
			setGeneratedHtml("");
			setShowIframe(false);
			setSavedSummary(null);
			setError(null);

			setLoading(true);
			try {
				const data = await getPartySummary(party.id);
				if (data) {
					setSavedSummary(data);
					setGeneratedHtml(data.html_content || "");
					setShowIframe(!!data.html_content);
				}
			} catch (error) {
				console.error("要約取得エラー:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchSummary();
	}, [party.id]);

	// HTMLコンテンツが変更されたときの処理
	useEffect(() => {
		if (
			(generatedHtml || savedSummary?.html_content) &&
			iframeRef.current
		) {
			// コンテンツが変更されたら高さを再計算
			adjustIframeHeight();
		}
	}, [generatedHtml, savedSummary, adjustIframeHeight]);

	const handleGenerateSummary = async () => {
		console.log("🚀 要約生成開始");
		console.log("📊 政党名:", party.name);
		console.log("🆔 政党ID:", party.id);

		setIsGenerating(true);
		setError(null);
		setGeneratedHtml("");
		setShowIframe(true);

		// 生成中のHTMLを設定
		const messages = [
			"要約情報を生成中です。",
			"しばらく画面遷移せずにお待ちください",
			"リアルタイムで文字が追加されます。",
		];
		
		const loadingHtml = `
			<div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui, -apple-system, sans-serif;">
				<div style="text-align: center;">
					<div style="margin-bottom: 20px;">
						<svg style="animation: spin 1s linear infinite; width: 48px; height: 48px; color: #6366f1;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
						</svg>
					</div>
					<h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 16px; color: #1f2937;">${party.name}</h2>
					<div id="message-container" style="height: 60px; overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center;">
						<p id="message-text" style="color: #6b7280; margin: 0; position: absolute; width: 100%; line-height: 1.5; padding: 0 20px; text-align: center; transition: all 0.3s ease-out;">要約情報を生成中です。</p>
					</div>
				</div>
				<style>
					@keyframes spin {
						from { transform: rotate(0deg); }
						to { transform: rotate(360deg); }
					}
					@keyframes slideUp {
						from { 
							transform: translateY(0);
							opacity: 1;
						}
						to { 
							transform: translateY(-60px);
							opacity: 0;
						}
					}
					@keyframes slideIn {
						from { 
							transform: translateY(60px);
							opacity: 0;
						}
						to { 
							transform: translateY(0);
							opacity: 1;
						}
					}
				</style>
				<script>
					(function() {
						const messages = ${JSON.stringify(messages)};
						let currentIndex = 0;
						const messageText = document.getElementById('message-text');
						
						function updateMessage() {
							// 現在のメッセージをスライドアップ
							messageText.style.animation = 'slideUp 0.3s ease-out forwards';
							
							setTimeout(() => {
								// 次のメッセージに更新
								currentIndex = (currentIndex + 1) % messages.length;
								messageText.textContent = messages[currentIndex];
								// 新しいメッセージをスライドイン
								messageText.style.animation = 'slideIn 0.3s ease-out forwards';
							}, 300);
						}
						
						// 2秒ごとにメッセージを更新
						setInterval(updateMessage, 2000);
					})();
				</script>
			</div>
		`;
		setGeneratedHtml(loadingHtml);

		try {
			const agent = getPartyResearchAgent();
			const response = await agent.stream({
				messages: [
					{
						role: "user",
						content: party.name,
					},
				],
				temperature: 0.4, // 低めのtemperatureで一貫性のある出力を生成
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
					// プレースホルダー画像URLを置き換え
					const processedHtml = fullHtml.replace(
						/https:\/\/via\.placeholder\.com\/[^"'\s]*/g,
						"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTVlN2ViIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Q2hhcnQgUGxhY2Vob2xkZXI8L3RleHQ+PC9zdmc+"
					);
					setGeneratedHtml(processedHtml);
				},
				onErrorPart: (error) => {
					console.error("❌ エラー:", error);
					setError("要約の生成中にエラーが発生しました");
				},
			});

			console.log("✅ 要約生成完了");

			// Supabaseに保存
			if (fullHtml) {
				try {
					const saved = await savePartySummary(party.id, fullHtml);
					setSavedSummary(saved);
					console.log("💾 要約をSupabaseに保存しました");

					// 親コンポーネントに通知
					if (onSummaryUpdate && saved) {
						onSummaryUpdate(saved);
					}
				} catch (error) {
					console.error("要約保存エラー:", error);
					setError("要約の保存に失敗しました");
				}
			}
		} catch (error) {
			console.error("❌ 要約生成エラー:", error);
			setError("要約の生成に失敗しました");
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<div className="space-y-2 h-full flex flex-col">
			{/* ヘッダー */}
			<div className="flex items-start gap-4">
				<div className="flex-1">
					<div className="flex items-center gap-3" ref={scope}>
						<h2 className="text-3xl font-bold relative">
							<span className="inline-block">
								{displayedText}
								<motion.span
									className="inline-block w-0.5 h-8 bg-current ml-0.5 align-middle"
									animate={{ opacity: [1, 0] }}
									transition={{
										duration: 0.8,
										repeat: Infinity,
										repeatType: "reverse",
									}}
								/>
							</span>
						</h2>
						{(showIframe || savedSummary) && (
							<div className="flex items-center gap-2">
								<button
									onClick={handleGenerateSummary}
									disabled={isGenerating}
									title="Wikiを再生成"
									className={cn(
										"relative inline-flex items-center justify-center",
										"h-8 w-8 text-sm font-medium rounded-md",
										"transition-all duration-300",
										"bg-zinc-100 dark:bg-zinc-800",
										"text-zinc-900 dark:text-white",
										"border-2 border-zinc-900 dark:border-white",
										"hover:bg-zinc-900 hover:text-white",
										"dark:hover:bg-white dark:hover:text-zinc-900",
										"shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
										"dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)]",
										"hover:translate-x-[2px] hover:translate-y-[2px]",
										"hover:shadow-none",
										"active:translate-x-[1px] active:translate-y-[1px]",
										"disabled:opacity-50 disabled:cursor-not-allowed",
										"disabled:hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]",
										"disabled:dark:hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)]",
										"disabled:hover:translate-x-0 disabled:hover:translate-y-0"
									)}
								>
									<RefreshCw
										className={cn("h-4 w-4", isGenerating && "animate-spin")}
									/>
								</button>
								<span className="text-xs text-muted-foreground">
									Wikiを再生成します。Wikiが出来上がる様子をリアルタイムで確認できます。
								</span>
							</div>
						)}
					</div>
					<p className="text-lg text-muted-foreground">
						{party.name_en}
					</p>
				</div>
			</div>

			{/* エラー表示 */}
			{error && (
				<div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
					{error}
				</div>
			)}

			{/* ローディング中 */}
			{loading ? (
				<div className="flex items-center justify-center py-16">
					<RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
				</div>
			) : /* コンテンツエリア */
			!savedSummary && !showIframe ? (
				<div className="text-center py-16">
					<p className="text-muted-foreground mb-4">
						まだ情報が取得されていません
					</p>
					<button
						onClick={handleGenerateSummary}
						disabled={isGenerating}
						className={cn(
							"relative inline-flex items-center justify-center gap-2",
							"h-11 px-6 text-base font-medium rounded-lg",
							"transition-all duration-300",
							"bg-zinc-100 dark:bg-zinc-800",
							"text-zinc-900 dark:text-white",
							"border-2 border-zinc-900 dark:border-white",
							"hover:bg-zinc-900 hover:text-white",
							"dark:hover:bg-white dark:hover:text-zinc-900",
							"shadow-[3px_3px_0_0_rgba(0,0,0,1)]",
							"dark:shadow-[3px_3px_0_0_rgba(255,255,255,1)]",
							"hover:translate-x-[3px] hover:translate-y-[3px]",
							"hover:shadow-none",
							"active:translate-x-[2px] active:translate-y-[2px]",
							"disabled:opacity-50 disabled:cursor-not-allowed",
							"disabled:hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)]",
							"disabled:dark:hover:shadow-[3px_3px_0_0_rgba(255,255,255,1)]",
							"disabled:hover:translate-x-0 disabled:hover:translate-y-0"
						)}
					>
						{isGenerating ? (
							<>
								<RefreshCw className="h-4 w-4 animate-spin" />
								生成中...
							</>
						) : (
							"要約情報を取得"
						)}
					</button>
				</div>
			) : (
				<div className="flex-1">
					{/* HTMLコンテンツを表示 */}
					<iframe
						ref={iframeRef}
						srcDoc={
							generatedHtml || savedSummary?.html_content || ""
						}
						className="w-full border-0"
						sandbox="allow-scripts"
						title="政党情報サマリー"
						style={{ minHeight: "800px", margin: 0, padding: 0 }}
						marginWidth={0}
						marginHeight={0}
						frameBorder="0"
						onLoad={() => {
							// iframeが読み込まれたら高さを再計算
							// コンテンツ内の画像などが遅れて読み込まれる場合に備えて、少し待ってから再調整
							setTimeout(adjustIframeHeight, 300);
						}}
					/>

					{/* メタデータ */}
					<div className="text-xs text-muted-foreground text-right mt-2">
						最終更新:{" "}
						{savedSummary?.updated_at
							? new Date(savedSummary.updated_at).toLocaleString()
							: generatedHtml
								? new Date().toLocaleString()
								: "N/A"}
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
