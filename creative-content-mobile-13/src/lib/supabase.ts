import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if we're in demo mode (no real Supabase configured)
export const isDemoMode = supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key';

export type UserTier = 'free' | 'pro';

export interface UserProfile {
  id: string;
  email: string;
  tier: UserTier;
  created_at: string;
  last_entry_date?: string;
  entries_today: number;
}
