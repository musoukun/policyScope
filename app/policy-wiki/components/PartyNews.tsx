"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, ExternalLink } from "lucide-react";
import type { Party, PartyNews as PartyNewsType } from "@/types/party";
import { getPartyNews, updatePartyNews } from "@/lib/api/parties";
import { canMakeApiCall, incrementApiCallCount } from "@/app/actions/api-limits";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface PartyNewsProps {
	party: Party;
}

export function PartyNews({ party }: PartyNewsProps) {
	const [newsData, setNewsData] = useState<PartyNewsType | null>(null);
	const [loading, setLoading] = useState(false);
	const [updating, setUpdating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadNews = async () => {
			console.log("📰 loadNews開始 - party.id:", party.id);
			setLoading(true);
			setNewsData(null); // 政党が変わったらニュースデータをリセット
			try {
				const data = await getPartyNews(party.id);
				console.log("📰 getPartyNews結果:", data);
				setNewsData(data);
			} catch (error) {
				console.error("ニュースの読み込みに失敗しました:", error);
			} finally {
				setLoading(false);
			}
		};

		loadNews();
	}, [party.id]);

	const fetchNews = async () => {
		console.log(
			"🔄 fetchNews開始 - party.id:",
			party.id,
			"party.name:",
			party.name
		);

		// API呼び出し制限をチェック
		const limitCheck = await canMakeApiCall("news_fetch");
		if (!limitCheck.canCall) {
			setError(
				`本日のニュース取得回数の上限（${limitCheck.limit}回）に達しました。明日またお試しください。`
			);
			return;
		}

		setUpdating(true);
		setError(null);
		try {
			// API呼び出しカウントを増加
			const incrementSuccess = await incrementApiCallCount("news_fetch");
			if (!incrementSuccess) {
				setError("API呼び出し制限の更新に失敗しました");
				setUpdating(false);
				return;
			}

			console.log("🔄 updatePartyNews呼び出し開始");
			const updatedNews = await updatePartyNews(party.id, party.name);
			console.log("🔄 updatePartyNews結果:", updatedNews);
			if (updatedNews) {
				setNewsData(updatedNews);
			} else {
				console.log("⚠️ updatedNewsがnullまたはundefined");
			}
		} catch (error) {
			console.error("ニュースの更新に失敗しました:", error);
			setError("ニュースの更新に失敗しました");
		} finally {
			setUpdating(false);
		}
	};

	if (!newsData && !loading) {
		return (
			<div className="text-center py-8">
				<p className="text-sm text-muted-foreground mb-4">
					ニュースを取得するには更新ボタンをクリックしてください
				</p>
				<button
					onClick={fetchNews}
					disabled={updating}
					className="relative inline-flex items-center justify-center gap-2 h-11 px-6 text-base font-medium rounded-lg transition-all duration-300 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border-2 border-zinc-900 dark:border-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 shadow-[3px_3px_0_0_rgba(0,0,0,1)] dark:shadow-[3px_3px_0_0_rgba(255,255,255,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[3px_3px_0_0_rgba(0,0,0,1)] disabled:dark:hover:shadow-[3px_3px_0_0_rgba(255,255,255,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
				>
					{updating ? "取得中..." : "ニュースを取得"}
				</button>
			</div>
		);
	}

	if (loading) {
		return (
			<div className="space-y-4">
				{[1, 2, 3].map((i) => (
					<div key={i} className="space-y-2">
						<Skeleton className="h-6 w-3/4" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-3 w-1/4" />
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* エラー表示 */}
			{error && (
				<div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
					{error}
				</div>
			)}

			<div className="flex justify-between items-center mb-4">
				<h3 className="text-base font-semibold">最新ニュース</h3>
				<div className="flex items-center gap-2">
					{newsData?.updated_at && (
						<span className="text-xs text-muted-foreground">
							{formatDistanceToNow(
								new Date(newsData.updated_at),
								{
									addSuffix: true,
									locale: ja,
								}
							)}
						</span>
					)}
					<button
						onClick={fetchNews}
						disabled={updating}
						className="relative inline-flex items-center justify-center gap-2 h-8 px-4 text-sm font-medium rounded-md transition-all duration-300 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white border-2 border-zinc-900 dark:border-white hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 shadow-[2px_2px_0_0_rgba(0,0,0,1)] dark:shadow-[2px_2px_0_0_rgba(255,255,255,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] disabled:dark:hover:shadow-[2px_2px_0_0_rgba(255,255,255,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0"
					>
						<RefreshCw
							className={`h-4 w-4 ${updating ? "animate-spin" : ""}`}
						/>
						更新
					</button>
				</div>
			</div>

			<div className="space-y-4">
				{newsData?.news_data.map((item, index) => (
					<article
						key={index}
						className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
					>
						<h4 className="text-sm font-medium mb-2">
							{item.title}
						</h4>
						<p className="text-sm text-muted-foreground mb-3">
							{item.summary}
						</p>
						<a
							href={item.url}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center text-sm font-medium text-primary hover:underline"
						>
							記事を読む
							<ExternalLink className="h-3 w-3 ml-1" />
						</a>
					</article>
				))}
			</div>
		</div>
	);
}
