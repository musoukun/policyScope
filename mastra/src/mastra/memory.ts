import { Memory } from "@mastra/memory";
import { PostgresStore, PgVector } from "@mastra/pg";

// Supabaseの接続情報を環境変数から取得
const connectionString = process.env.DATABASE_URL;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// サービスロールキーが設定されている場合の処理
let finalConnectionString = connectionString;

if (supabaseServiceKey) {
	// サービスロールキーが設定されている場合はそのまま使用
	// PostgresStoreとPgVectorはPostgreSQLのロールベースの権限を使用
	console.log("📌 Mastra Memory: サービスロールキーが検出されました");
	console.log("   DATABASE_URLの接続を使用します（postgresロールでRLSをバイパス）");
} else {
	console.warn(
		"⚠️ Mastra Memory: SUPABASE_SERVICE_ROLE_KEY が設定されていません。\n" +
		"RLSポリシーによってMastraテーブルへのアクセスが制限される可能性があります。"
	);
}

if (!finalConnectionString) {
	throw new Error(
		"PostgreSQL connection string is required. Please set DATABASE_URL environment variable."
	);
}

// PostgreSQLストレージの初期化（Supabase）
export const postgresStore = new PostgresStore({
	connectionString: finalConnectionString,
});

// PgVectorの初期化（ベクトル検索用）
export const pgVector = new PgVector({
	connectionString: finalConnectionString,
});

// メモリシステムの設定
const memory = new Memory({
	storage: postgresStore,
	vector: pgVector,
	options: {
		// 最新のメッセージを何件保持するか
		lastMessages: 10,
		// // セマンティック検索の設定
		// semanticRecall: {
		// 	topK: 3, // 関連する上位3件を取得
		// 	messageRange: 2, // 前後2メッセージも含める
		// },
	},
});

// インデックスの初期化（必要に応じて）
export async function initializeVectorIndex(
	indexName: string = "party_embeddings",
	dimension: number = 1536
) {
	try {
		await pgVector.createIndex({
			indexName,
			dimension,
		});
		console.log(`Vector index '${indexName}' created successfully.`);
	} catch (error) {
		// インデックスが既に存在する場合はエラーになるが、問題ない
		console.log(
			`Vector index '${indexName}' already exists or creation failed:`,
			error
		);
	}
}
// Supabaseクライアントをエクスポート（必要に応じて使用）
export { supabaseAdmin } from './supabase';

export { memory }; // デフォルトエクスポートも追加
export default memory;
