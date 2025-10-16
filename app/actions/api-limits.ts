"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export type CallType = "wiki_generation" | "news_fetch";

export interface ApiCallLimit {
	id: string;
	call_type: CallType;
	daily_limit: number;
	current_count: number;
	last_reset_date: string;
	created_at: string;
	updated_at: string;
}

/**
 * API呼び出し制限を取得
 */
export async function getApiCallLimit(callType: CallType): Promise<ApiCallLimit | null> {
	const { data, error } = await supabaseAdmin
		.from("api_call_limits")
		.select("*")
		.eq("call_type", callType)
		.single();

	if (error) {
		console.error("API制限取得エラー:", error);
		return null;
	}

	return data;
}

/**
 * API呼び出し可能かチェック
 */
export async function canMakeApiCall(callType: CallType): Promise<{
	canCall: boolean;
	remaining: number;
	limit: number;
}> {
	const limit = await getApiCallLimit(callType);

	if (!limit) {
		// データがない場合は呼び出し不可
		return { canCall: false, remaining: 0, limit: 0 };
	}

	const remaining = limit.daily_limit - limit.current_count;
	const canCall = remaining > 0;

	return {
		canCall,
		remaining,
		limit: limit.daily_limit,
	};
}

/**
 * API呼び出しカウントを増加
 */
export async function incrementApiCallCount(callType: CallType): Promise<boolean> {
	// まず現在の制限を取得
	const limit = await getApiCallLimit(callType);

	if (!limit) {
		console.error("API制限データが見つかりません");
		return false;
	}

	// 制限を超えている場合は増加しない
	if (limit.current_count >= limit.daily_limit) {
		console.log("API呼び出し制限に達しています");
		return false;
	}

	// カウントを増加
	const { error } = await supabaseAdmin
		.from("api_call_limits")
		.update({ current_count: limit.current_count + 1 })
		.eq("call_type", callType);

	if (error) {
		console.error("API呼び出しカウント更新エラー:", error);
		return false;
	}

	return true;
}

/**
 * API呼び出しカウントをリセット（管理者用）
 */
export async function resetApiCallCount(callType: CallType): Promise<boolean> {
	const { error } = await supabaseAdmin
		.from("api_call_limits")
		.update({
			current_count: 0,
			last_reset_date: new Date().toISOString().split("T")[0],
		})
		.eq("call_type", callType);

	if (error) {
		console.error("API呼び出しカウントリセットエラー:", error);
		return false;
	}

	return true;
}

/**
 * すべてのAPI呼び出し制限を取得
 */
export async function getAllApiCallLimits(): Promise<ApiCallLimit[]> {
	const { data, error } = await supabaseAdmin
		.from("api_call_limits")
		.select("*")
		.order("call_type", { ascending: true });

	if (error) {
		console.error("API制限リスト取得エラー:", error);
		return [];
	}

	return data || [];
}
