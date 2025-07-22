"use server";

import { supabase } from "@/lib/supabase";
import { PARTIES } from "@/lib/parties";
import type { Party, PartySummary } from "@/types/party";

export async function getAllParties(): Promise<Party[]> {
  const { data, error } = await supabase
    .from("parties")
    .select("*")
    .order("id");

  if (error) {
    console.error("Error fetching parties:", error);
    return PARTIES; // フォールバック
  }

  return data || PARTIES;
}

export async function getPartyById(id: string): Promise<Party | null> {
  const { data, error } = await supabase
    .from("parties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching party:", error);
    return PARTIES.find(p => p.id === id) || null;
  }

  return data;
}

export async function getPartySummary(partyId: string): Promise<PartySummary | null> {
  const { data, error } = await supabase
    .from("party_summaries")
    .select("*")
    .eq("party_id", partyId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching party summary:", error);
    return null;
  }

  return data;
}

export async function savePartySummary(
  partyId: string,
  summaryData: PartySummary["summary_data"]
): Promise<PartySummary | null> {
  try {
    console.log("Attempting to save party summary:", {
      party_id: partyId,
      data_keys: Object.keys(summaryData),
    });

    const { data, error } = await supabase
      .from("party_summaries")
      .insert({
        party_id: partyId,
        summary_data: summaryData,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error saving party summary:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      
      // RLSエラーの場合の特別な処理
      if (error.code === '42501') {
        console.error("RLS Policy Error: Authentication required or insufficient permissions");
      }
      
      return null;
    }

    console.log("Party summary saved successfully:", data?.id);
    return data;
  } catch (err) {
    console.error("Unexpected error in savePartySummary:", err);
    return null;
  }
}