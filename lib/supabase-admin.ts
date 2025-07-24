import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase';

// サーバーサイド専用のSupabaseクライアント（サービスロールキー使用）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set in environment variables');
}

if (!supabaseServiceKey) {
  console.warn(
    '⚠️ SUPABASE_SERVICE_ROLE_KEY が設定されていません。\n' +
    'RLSポリシーが適用されている場合、データベース操作が失敗する可能性があります。\n' +
    'Supabase Dashboard > Settings > API > service_role から取得してください。'
  );
}

// サービスロールキーを使用したクライアント（RLSをバイパス）
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey || '', // 警告は出すが、エラーにはしない
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// クライアントサイドでは使用しないように注意
if (typeof window !== 'undefined') {
  throw new Error('supabaseAdmin はサーバーサイドでのみ使用してください');
}