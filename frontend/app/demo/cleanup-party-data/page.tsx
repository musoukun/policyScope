"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Trash2, RefreshCw } from "lucide-react";

export default function CleanupPartyDataPage() {
	const [isDeleting, setIsDeleting] = useState(false);
	const [message, setMessage] = useState("");
	const [summaryCount, setSummaryCount] = useState<number | null>(null);

	const fetchSummaryCount = async () => {
		const { count, error } = await supabase
			.from("party_summaries")
			.select("*", { count: "exact", head: true });

		if (error) {
			console.error("Error fetching count:", error);
			setMessage(`エラー: ${error.message}`);
		} else {
			setSummaryCount(count);
		}
	};

	const deleteAllSummaries = async () => {
		setIsDeleting(true);
		setMessage("");

		try {
			const { error } = await supabase
				.from("party_summaries")
				.delete()
				.neq("id", "00000000-0000-0000-0000-000000000000"); // すべて削除（条件は常にtrue）

			if (error) {
				throw error;
			}

			setMessage("すべての政党サマリーデータを削除しました。");
			setSummaryCount(0);
		} catch (error) {
			console.error("Error deleting summaries:", error);
			setMessage(
				`エラー: ${error instanceof Error ? error.message : "不明なエラー"}`
			);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className="container mx-auto p-8 max-w-2xl">
			<Card>
				<CardHeader>
					<CardTitle>政党データクリーンアップ</CardTitle>
					<CardDescription>
						古い形式の政党サマリーデータを削除します
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							現在のサマリー数:{" "}
							{summaryCount === null
								? "未確認"
								: `${summaryCount}件`}
						</p>
						<Button
							variant="outline"
							size="sm"
							onClick={fetchSummaryCount}
						>
							<RefreshCw className="h-4 w-4 mr-2" />
							件数確認
						</Button>
					</div>

					<div className="border-t pt-4">
						<Button
							variant="destructive"
							onClick={deleteAllSummaries}
							disabled={isDeleting}
							className="w-full"
						>
							<Trash2 className="h-4 w-4 mr-2" />
							{isDeleting
								? "削除中..."
								: "すべての政党サマリーを削除"}
						</Button>
					</div>

					{message && (
						<div
							className={`p-3 rounded text-sm ${
								message.startsWith("エラー")
									? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
									: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
							}`}
						>
							{message}
						</div>
					)}

					<div className="text-xs text-muted-foreground">
						<p>
							注意:
							この操作は取り消せません。削除後は各政党ページで「情報を取得」ボタンを押して再生成してください。
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
