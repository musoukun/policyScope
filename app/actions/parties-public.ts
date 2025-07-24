"use server";

import { createClient } from "@supabase/supabase-js";
import type { PartySummary } from "@/types/party";

// Service Roleキーを使用してRLSをバイパス（テスト用）
// 注意: 本番環境では使用しないでください
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Service Roleキーがない場合は通常のクライアントを使用
const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export async function savePartySummaryPublic(
  partyId: string,
  summaryData: PartySummary["summary_data"]
): Promise<PartySummary | null> {
  try {
    // Service Roleクライアントがない場合は通常のSupabaseを使用
    if (!supabaseAdmin) {
      // 一時的な回避策: anon keyでも書き込めるようにRLSポリシーを更新
      const { createClient } = await import("@supabase/supabase-js");
      const tempClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data, error } = await tempClient
        .from("party_summaries")
        .insert({
          party_id: partyId,
          summary_data: summaryData,
        })
        .select()
        .single();

      if (error) {
        console.error("Error with anon key:", error);
        throw error;
      }

      return data;
    }

    // Service Roleキーで保存
    const { data, error } = await supabaseAdmin
      .from("party_summaries")
      .insert({
        party_id: partyId,
        summary_data: summaryData,
      })
      .select()
      .single();

    if (error) {
      console.error("Error with service role:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Failed to save party summary:", err);
    return null;
  }
}