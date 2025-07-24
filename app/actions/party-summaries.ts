"use server";

import { supabase } from "@/lib/supabase";

export async function getPartySummary(partyId: string) {
  const { data, error } = await supabase
    .from("party_summaries")
    .select("*")
    .eq("party_id", partyId)
    .single();

  if (error && error.code !== "PGRST116") { // PGRST116 = no rows found
    console.error("Error fetching party summary:", error);
    throw error;
  }

  return data;
}

export async function savePartySummary(partyId: string, htmlContent: string) {
  // 既存のサマリーがあるか確認
  const { data: existing } = await supabase
    .from("party_summaries")
    .select("id")
    .eq("party_id", partyId)
    .single();

  if (existing) {
    // 更新
    const { data, error } = await supabase
      .from("party_summaries")
      .update({
        html_content: htmlContent,
        summary_data: {}, // 今回はHTMLのみ保存
        updated_at: new Date().toISOString()
      })
      .eq("party_id", partyId)
      .select()
      .single();

    if (error) {
      console.error("Error updating party summary:", error);
      throw error;
    }

    return data;
  } else {
    // 新規作成
    const { data, error } = await supabase
      .from("party_summaries")
      .insert({
        party_id: partyId,
        html_content: htmlContent,
        summary_data: {} // 今回はHTMLのみ保存
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating party summary:", error);
      throw error;
    }

    return data;
  }
}