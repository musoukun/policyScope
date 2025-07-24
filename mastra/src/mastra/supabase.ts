/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js";

// Supabase設定を環境変数から取得
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// サービスロールキーが設定されていない場合は、従来のDATABASE_URLを使用するよう警告
if (!supabaseServiceKey) {
	console.warn(
		"⚠️ SUPABASE_SERVICE_ROLE_KEY が設定されていません。\n" +
			"RLSポリシーが適用されている場合、データベース操作が失敗する可能性があります。\n" +
			"Supabase Dashboard > Settings > API > service_role から取得してください。"
	);
}

// Supabaseクライアントの作成（サービスロールキー使用）
export const supabaseAdmin =
	supabaseUrl && supabaseServiceKey
		? createClient(supabaseUrl, supabaseServiceKey, {
				auth: {
					autoRefreshToken: false,
					persistSession: false,
				},
			})
		: null;

// データベース操作用のヘルパー関数
export async function executeQuery<T = any>(
	query: () => Promise<{ data: T | null; error: any }>
): Promise<T | null> {
	if (!supabaseAdmin) {
		console.error("Supabaseクライアントが初期化されていません");
		return null;
	}

	const { data, error } = await query();

	if (error) {
		console.error("Supabaseエラー:", error);
		return null;
	}

	return data;
}
