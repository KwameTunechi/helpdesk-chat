
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Returns null if env vars are not configured (falls back to localStorage)
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// Log connection status on startup so it's visible in DevTools console
if (supabase) {
  console.log('[Supabase] Connected to:', supabaseUrl);
} else {
  console.warn('[Supabase] NOT connected — env vars missing. Using localStorage fallback.');
}
