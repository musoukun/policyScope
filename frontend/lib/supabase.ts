import { createClient } from '@supabase/supabase-js';
import type { Party, PartySummary } from '@/types/party';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set in environment variables');
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      parties: {
        Row: Party;
        Insert: Omit<Party, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Party, 'id' | 'created_at' | 'updated_at'>>;
      };
      party_summaries: {
        Row: PartySummary;
        Insert: Omit<PartySummary, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PartySummary, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};