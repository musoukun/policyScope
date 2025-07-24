/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAutoResizeTextarea } from "@/hooks/use-auto-resize-textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownRenderer } from "@/components/chat/markdown-renderer";

interface ChatPageProps {
	threadId: string;
	initialQuery?: string | null;
}

export function ChatPage({ threadId, initialQuery }: ChatPageProps) {
	const [isInitialized, setIsInitialized] = useState(false);
	const [hasInitialQueryProcessed, setHasInitialQueryProcessed] =
		useState(false);

	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		isLoading,
		append,
		setMessages,
	} = useChat({
		body: {
			threadId,
		},
		onError: (error) => {
			console.error("useChat error:", error);
		},
	});

	const { textareaRef, adjustHeight } = useAutoResizeTextarea({
		minHeight: 52,
		maxHeight: 200,
	});

	const scrollAreaRef = useRef<HTMLDivElement>(null);

	// 既存の会話履歴を取得
	useEffect(() => {
		const fetchMessages = async () => {
			console.log("[ChatPage] 初期化開始", { threadId, initialQuery });

			// メッセージ履歴を取得
			try {
				const url = `/api/chat/${threadId}`;
				console.log("[ChatPage] メッセージ取得:", url);

				const response = await fetch(url);
				console.log(
					"[ChatPage] レスポンスステータス:",
					response.status
				);

				const data = await response.json();
				console.log("[ChatPage] 取得したデータ:", data);
				console.log("[ChatPage] デバッグ情報:", data.debug);
				console.log(
					"[ChatPage] メッセージ数:",
					data.messages?.length || 0
				);

				if (data.messages && data.messages.length > 0) {
					// メッセージの正規化（contentがオブジェクトの場合はtextプロパティを使用）
					interface Message {
						id: string;
						role: "user" | "assistant";
						content: string | { text: string } | { text: string }[];
					}
					const normalizedMessages = data.messages.map(
						(msg: Message) => ({
							...msg,
							content: (() => {
								const content = msg.content;
								if (typeof content === "string") return content;
								if (Array.isArray(content) && content[0]?.text)
									return content[0].text;
								if (
									typeof content === "object" &&
									content !== null &&
									"text" in content &&
									typeof content.text === "string"
								)
									return content.text;
								return JSON.stringify(content);
							})(),
						})
					);

					// 既存の会話履歴がある場合は表示のみ
					setMessages(normalizedMessages);
					setHasInitialQueryProcessed(true); // 既存会話なので処理済みとする

					// URLパラメータをクリア
					if (
						typeof window !== "undefined" &&
						window.location.search.includes("q=")
					) {
						const url = new URL(window.location.href);
						url.searchParams.delete("q");
						window.history.replaceState({}, "", url.pathname);
					}
				} else if (initialQuery && !hasInitialQueryProcessed) {
					// 新規会話で初期クエリがある場合のみ送信
					console.log("初期クエリを送信:", initialQuery);
					setHasInitialQueryProcessed(true);

					// appendを使用してメッセージを追加
					append({
						role: "user",
						content: initialQuery,
					});

					// 送信後、URLパラメータをクリア
					if (typeof window !== "undefined") {
						const url = new URL(window.location.href);
						url.searchParams.delete("q");
						window.history.replaceState({}, "", url.pathname);
					}
				}
			} catch (error) {
				console.error("Error fetching messages:", error);
				if (initialQuery && !hasInitialQueryProcessed) {
					// エラー時でも初期クエリがあれば送信
					console.log("エラー時の初期クエリ送信:", initialQuery);
					setHasInitialQueryProcessed(true);
					append({
						role: "user",
						content: initialQuery,
					});

					// URLパラメータをクリア
					if (typeof window !== "undefined") {
						const url = new URL(window.location.href);
						url.searchParams.delete("q");
						window.history.replaceState({}, "", url.pathname);
					}
				}
			} finally {
				setIsInitialized(true);
			}
		};

		fetchMessages();
	}, [threadId]); // eslint-disable-line react-hooks/exhaustive-deps

	// initialQueryが変更されたときの処理は削除（上のuseEffectで処理済み）

	// メッセージが更新されたらスクロール（ストリーミング中は常にスクロール）
	useEffect(() => {
		if (scrollAreaRef.current) {
			const scrollContainer = scrollAreaRef.current.querySelector(
				"[data-radix-scroll-area-viewport]"
			);
			if (scrollContainer) {
				// スムーズスクロールで最下部へ
				scrollContainer.scrollTo({
					top: scrollContainer.scrollHeight,
					behavior: "smooth",
				});
			}
		}
	}, [messages]);

	// ストリーミング中は短い間隔でスクロールを更新
	useEffect(() => {
		if (isLoading && scrollAreaRef.current) {
			const interval = setInterval(() => {
				const scrollContainer = scrollAreaRef.current?.querySelector(
					"[data-radix-scroll-area-viewport]"
				);
				if (scrollContainer) {
					scrollContainer.scrollTo({
						top: scrollContainer.scrollHeight,
						behavior: "smooth",
					});
				}
			}, 100); // 100msごとにスクロール位置を更新

			return () => clearInterval(interval);
		}
	}, [isLoading]);

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (input.trim() && !isLoading) {
			handleSubmit(e);
			adjustHeight(true);
		}
	};

	// スケルトンコンポーネント
	const QuestionSkeleton = () => (
		<div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
			<div className="flex items-start gap-3">
				<Search className="w-5 h-5 text-orange-600 mt-0.5" />
				<div className="flex-1">
					<div className="text-sm text-orange-600 font-medium mb-1">
						質問
					</div>
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4 mt-2" />
				</div>
			</div>
		</div>
	);

	const AnswerSkeleton = () => (
		<div className="bg-white border border-gray-200 rounded-lg p-4">
			<div className="flex items-start gap-3">
				<FileText className="w-5 h-5 text-blue-600 mt-0.5" />
				<div className="flex-1">
					<div className="text-sm text-blue-600 font-medium mb-1">
						回答
					</div>
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full mt-2" />
					<Skeleton className="h-4 w-5/6 mt-2" />
					<Skeleton className="h-4 w-4/5 mt-2" />
				</div>
			</div>
		</div>
	);

	if (!isInitialized) {
		return (
			<div className="flex h-screen bg-background">
				{/* メインコンテンツエリア */}
				<div className="flex-1 flex flex-col">
					{/* ヘッダー */}
					<div className="border-b px-6 py-4">
						<h1 className="text-2xl font-bold">
							政党・政策Wiki チャット
						</h1>
					</div>

					{/* スケルトンローディング */}
					<ScrollArea className="flex-1 px-6 py-4">
						<div className="max-w-4xl space-y-8">
							<div className="space-y-4">
								<QuestionSkeleton />
								<AnswerSkeleton />
							</div>
						</div>
					</ScrollArea>
				</div>

				{/* 入力フォーム（無効化） - Wikiページと同じデザイン */}
				<div className="fixed bottom-4 left-0 right-0 pointer-events-none">
					<div className="pointer-events-auto max-w-xl mx-auto px-4">
						<div className="w-full opacity-50">
							<div className="relative w-full">
								<div className="relative flex flex-col rounded-xl transition-all duration-200 w-full text-left cursor-text ring-1 ring-black/10 dark:ring-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-sm">
									<div className="overflow-y-auto max-h-[200px]">
										<Textarea
											placeholder="政策やマニフェストについて質問..."
											className="w-full rounded-xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0 leading-[1.2]"
											disabled
										/>
									</div>
									<div className="h-12 bg-black/5 dark:bg-white/5 rounded-b-xl">
										<div className="absolute right-3 bottom-3">
											<button
												type="button"
												disabled
												className="rounded-lg p-2 bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40"
											>
												<Send className="w-4 h-4" />
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		);
	}

	// ユーザーの質問とAIの回答をペアにする
	const messagePairs = [];
	for (let i = 0; i < messages.length; i += 2) {
		if (messages[i] && messages[i].role === "user") {
			messagePairs.push({
				question: messages[i],
				answer: messages[i + 1] || null,
			});
		}
	}

	console.log("現在のメッセージ:", messages);
	console.log("メッセージペア:", messagePairs);

	return (
		<div className="flex h-screen bg-background">
			{/* メインコンテンツエリア */}
			<div className="flex-1 flex flex-col">
				{/* ヘッダー */}
				<div className="border-b px-6 py-4">
					<h1 className="text-2xl font-bold">
						政党・政策Wiki チャット
					</h1>
				</div>

				{/* Wiki形式のQ&A表示エリア */}
				<ScrollArea ref={scrollAreaRef} className="flex-1 px-6 py-4">
					<div className="max-w-4xl space-y-8 pb-24">
						{messagePairs.map((pair, index) => (
							<div key={pair.question.id} className="space-y-4">
								{/* 質問セクション */}
								<div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
									<div className="flex items-start gap-3">
										<Search className="w-5 h-5 text-orange-600 mt-0.5" />
										<div className="flex-1">
											<div className="text-sm text-orange-600 font-medium mb-1">
												質問
											</div>
											<div className="text-gray-800">
												{(() => {
													const content =
														pair.question.content;
													if (
														typeof content ===
														"string"
													)
														return content;
													if (
														Array.isArray(
															content
														) &&
														(content as any[]).length > 0
													) {
														const firstItem =
															content[0] as any;
														if (firstItem?.text)
															return firstItem.text;
													}
													if (
														typeof content ===
															"object" &&
														content !== null &&
														"text" in content
													) {
														return (content as any)
															.text;
													}
													return JSON.stringify(
														content
													);
												})()}
											</div>
										</div>
									</div>
								</div>

								{/* 回答セクション */}
								{pair.answer && (
									<div className="bg-white border border-gray-200 rounded-lg p-4">
										<div className="flex items-start gap-3">
											<FileText className="w-5 h-5 text-blue-600 mt-0.5" />
											<div className="flex-1">
												<div className="text-sm text-blue-600 font-medium mb-1">
													回答
												</div>
												<div className="text-gray-800">
													<MarkdownRenderer
														content={(() => {
															const content =
																pair.answer
																	.content;
															if (
																typeof content ===
																"string"
															)
																return content;
															if (
																Array.isArray(
																	content
																) &&
																(content as any[]).length >
																	0
															) {
																const firstItem =
																	content[0] as any;
																if (
																	firstItem?.text
																)
																	return firstItem.text;
															}
															if (
																typeof content ===
																	"object" &&
																content !==
																	null &&
																"text" in
																	content
															) {
																return (
																	content as any
																).text;
															}
															return JSON.stringify(
																content
															);
														})()}
													/>
												</div>

												{/* 参照元情報（将来的に実装） */}
												{/* <div className="mt-4 pt-4 border-t">
                          <div className="text-sm text-gray-500">
                            参照元: Google検索, 政党公式サイト
                          </div>
                        </div> */}
											</div>
										</div>
									</div>
								)}

								{/* ローディング表示 */}
								{!pair.answer &&
									isLoading &&
									index === messagePairs.length - 1 && (
										<AnswerSkeleton />
									)}

								{index < messagePairs.length - 1 && (
									<Separator className="my-6" />
								)}
							</div>
						))}
					</div>
				</ScrollArea>
			</div>

			{/* 入力フォーム - Wikiページと同じデザイン */}
			<div className="fixed bottom-4 left-0 right-0 pointer-events-none">
				<div className="pointer-events-auto max-w-xl mx-auto px-4">
					<form onSubmit={onSubmit} className="w-full">
						<div className="relative w-full">
							<div
								role="textbox"
								tabIndex={0}
								aria-label="Search input container"
								className={cn(
									"relative flex flex-col rounded-xl transition-all duration-200 w-full text-left cursor-text",
									"ring-1 ring-black/10 dark:ring-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-sm",
									isLoading &&
										"ring-black/20 dark:ring-white/20"
								)}
								onClick={() => textareaRef.current?.focus()}
							>
								<div className="overflow-y-auto max-h-[200px]">
									<Textarea
										ref={textareaRef}
										value={input}
										placeholder="政策やマニフェストについて質問..."
										className="w-full rounded-xl rounded-b-none px-4 py-3 bg-black/5 dark:bg-white/5 border-none dark:text-white placeholder:text-black/70 dark:placeholder:text-white/70 resize-none focus-visible:ring-0 leading-[1.2]"
										onFocus={() => {}}
										onBlur={() => {}}
										onKeyDown={(e) => {
											if (
												e.key === "Enter" &&
												!e.shiftKey
											) {
												e.preventDefault();
												onSubmit(e);
											}
										}}
										onChange={(e) => {
											handleInputChange(e);
											adjustHeight();
										}}
										disabled={isLoading}
									/>
								</div>

								<div className="h-12 bg-black/5 dark:bg-white/5 rounded-b-xl">
									<div className="absolute left-3 bottom-3 flex items-center gap-2">
										{/* 左側のボタンエリア（将来の拡張用） */}
									</div>
									<div className="absolute right-3 bottom-3">
										<button
											type="submit"
											onClick={onSubmit}
											disabled={
												!input.trim() || isLoading
											}
											className={cn(
												"rounded-lg p-2 transition-colors",
												input.trim() && !isLoading
													? "bg-sky-500/15 text-sky-500"
													: "bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white cursor-pointer"
											)}
										>
											<Send className="w-4 h-4" />
										</button>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>

		</div>
	);
}
